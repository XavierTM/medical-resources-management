
const { Router } = require("express");
const Booking = require("./db/Booking");
const Institution = require("./db/Institution");
const Resource = require("./db/Resource");
const BookingResource = require("./db/BookingResource");
const status_500 = require('./status_500');
const clerk_auth = require('./auth/clerk_auth');
const Joi = require('@xavisoft/joi');
const { Op } = require("sequelize");


/* =====================================================================================
   # HELPERS
===================================================================================== */

async function getResourceSchedules(id, from, to) {
   const bookingResources = await BookingResource.findAll({
      where: { resource: id }
   });

   const bookings = await Booking.findAll({
      where: {
         id: {
            [Op.in]: bookingResources.map(item => item.booking),
         },
         [Op.or]: [
            {
               from: {
                  [Op.lte]: from
               },
               to: {
                  [Op.gte]: from
               }
            },
            {
               from: {
                  [Op.lte]: to
               },
               to: {
                  [Op.gte]: to
               }
            }
         ]
      }
   });

   return bookings.map(booking => {
      const from = dateToTimeStamp(booking.from);
      const to = dateToTimeStamp(booking.to);
      return { to, from }
   });
}

function dateToTimeStamp(date) {
   return (new Date(date)).getTime();
}

/* =====================================================================================
   # ROUTES
===================================================================================== */

const bookings = Router();

bookings.use(clerk_auth);

bookings.get('/free-slots', async (req, res) => {
   try {

      // validation
      const payload = {
         duration: parseInt(req.query.duration),
         earliest: parseInt(req.query.duration) || Date.now(),
         resource_types: (req.query.resource_types || '').split(',').map(item => parseInt(item)),
      };

      const schema = {
         duration: Joi.number().integer().required(),
         earliest: Joi.number().integer().required(),
         resource_types: Joi
            .array()
            .items(Joi.number().integer())
            .min(1)
            .required(),
      };

      const error = Joi.getError(payload, schema);
      if (error)
         return res.status(400).send(error);

      // retrieve slots
      /// get all institutions
      const institutions = await Institution.findAll({ attribute: [ 'id', 'name' ] });

      /// for each institution  check the earliest all
      const preferredScheduleStart = payload.earliest;
      const preferredScheduleEnd = payload.earliest + payload.duration;

      const freeSlots = [];

      for (let i in institutions) {

         const institution = institutions[i];
         const resourcesFreeTheEarliest = [];

         for (let i in payload.resource_types) {
            // fetch resources of this resource type from this institution
            const resourceTypeId = payload.resource_types[i];

            const resources = await Resource.findAll({
               where: { 
                  institution: institution.id,
                  resource_type: resourceTypeId,
               },
            }); 

            // get a resource with an overlapping schedule with the earliest ending
            /// get resource schedules
            const resourceFreeTheEarliest = {};

            for (let i in resources) {
               
               const resource = resources[i];
               const schedules = await getResourceSchedules(resource.id);

               if (schedules.length === 0) {
                  resourceFreeTheEarliest.free_at = Date.now();
                  resourceFreeTheEarliest.resource = resource;
                  break;
               }

               for (let i = 1; i < schedules.length; i++) {

                  const schedule = schedules[i];
                  
                  if (!resourceFreeTheEarliest.resource || resourceFreeTheEarliest.free_at > schedule.to) {
                     resourceFreeTheEarliest.resource = resource;
                     resourceFreeTheEarliest.free_at = schedule.to;
                  }
                     
               }

            }

            if (!resourceFreeTheEarliest.resource) {
               break;
            }

            resourcesFreeTheEarliest.push(resourceFreeTheEarliest);
            
         }

         if (resourcesFreeTheEarliest.length === payload.resource_types.length) {

            let available_at = Date.now();
            const resources = resourcesFreeTheEarliest.map(resourceFreeTheEarliest => {
               const { free_at, resource } = resourceFreeTheEarliest;

               if (free_at > available_at)
                  available_at = free_at;

               const { id, name } = resource;
               return { id, name };

            });

            freeSlots.push({
               id: institution.id,
               name: institution.name,
               available_at,
               resources,
            })
         }
         

      }

      // responds
      res.send(freeSlots);


   } catch (err) {
      status_500(err, res);
   }
});

bookings.post('/', async (req, res) => {
   try {

      // validation
      const schema = {
         book_on: Joi.number().integer().required(),
         duration: Joi.number().integer().required(),
         from: Joi.number().integer().required(),
         resources: Joi
            .array()
            .items(Joi.number().integer())
            .min(1)
            .required(),
      };

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // check availability
      const resourceIds = req.body.resources;
      const from = req.body.from;
      const to = parseInt(from) + parseInt(req.body.duration);

      for (let i in resourceIds) {
         const resourceId = resourceIds[i];
         const schedules = await getResourceSchedules(resourceId, from, to);
         
         if (schedules.length) {
            const resource = await Resource.findByPk(resourceId);
            const message = `Resource '${resource.name}' is occupied during that time`;
            return res.status(409).send(message);
         }
      }
    
      // book
      /// create booking
      const booking = await Booking.create({
         from,
         to,
         booked_on: req.body.book_on,
         booked_for: req.auth.user.institution,
      });

      /// create booking resources
      const rawResourceBookings = resourceIds.map(resource => {
         return {
            resource,
            booking: booking.id,
         }
      });

      await BookingResource.bulkCreate(rawResourceBookings);
      
      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

bookings.get('/', async (req, res) => {
   try {
      
      // get booking
      let bookings = await Booking.findAll({
         where: {
            booked_for: req.auth.user.institution,
         },
         attributes: [ 'id', 'from', 'to' ],
         include: [
            {
               model: Institution,
               association: '__booked_on',
               attributes: [ 'id', 'name' ]
            },
            {
               model: BookingResource,
               association: '__booking_resources',
               attributes: [ 'resource' ],
               include: {
                  model: Resource,
                  association: '__resource',
                  attribute: [ 'id', 'name' ],
               }
            },
         ]
      });

      bookings = bookings.map(booking => {

         booking = booking.dataValues;

         booking.booked_on = booking.__booked_on.dataValues;
         delete booking.__booked_on;

         booking.resources = booking.__booking_resources.map(bookingResource => {
            return bookingResource.__resource.dataValues;
         });

         delete booking.__booking_resources;

         return booking;
      });

      res.send(bookings);


   } catch (err) {
      status_500(err, res);
   }
});

bookings.delete('/:id', async (req, res) => {

   try {

      await Booking.destroy({ where: { id: req.params.id } });
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

module.exports = bookings;