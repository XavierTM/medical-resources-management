
const { Router } = require("express");
const status_500 = require('./status_500');
const Joi = require("@xavisoft/joi");
const Resource = require('./db/Resource');
const ResourceType = require('./db/ResourceType');
const clerk_auth = require("./auth/clerk_auth");


const resources = Router();

resources.use(clerk_auth);

resources.post('/', async (req, res) => {
   try {

      // validation
      const schema = {
         name: Joi.string().required(),
         resource_type: Joi.number().integer().required(),
      };

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);
         
      // save data to DB
      const data = req.body;
      data.institution = req.auth.user.institution;
      const clerk = await Resource.create(data);

      res.send({ id: clerk.id })

   } catch (err) {
      status_500(err, res);
   }
});

resources.get('/', async (req, res) => {

   try {

      let resources = await Resource.findAll({ 
         attributes: [ 'id', 'name' ],
         where: { institution: req.auth.user.institution },
         include: {
            model: ResourceType,
            attributes: [ 'id', 'name' ],
         }
      });


      resources = resources.map(resource => {
         resource = resource.dataValues;
         resource.resource_type = resource.ResourceType.dataValues;
         delete resource.ResourceType;
         return resource;
      })

      res.send(resources);

   } catch (err) {
      status_500(err, res);
   }
});

resources.delete('/:id', async (req, res) => {
   try {

      await Resource.destroy({ where: { id: req.params.id }});
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});




module.exports = resources;