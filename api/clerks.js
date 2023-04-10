
const { Router } = require("express");
const status_500 = require('./status_500');
const Joi = require("@xavisoft/joi");
const admin_auth = require("./auth/admin_auth");
const Clerk = require('./db/Clerk');
const Institution = require("./db/Institution");
const { hash } = require("bcrypt");


const clerks = Router();

clerks.use(admin_auth);

clerks.post('/', async (req, res) => {
   try {

      // validation
      const schema = {
         name: Joi.string().required(),
         surname: Joi.string().required(),
         email: Joi.string().email().required(),
         password: Joi.string().required(),
         institution: Joi.number().integer().required(),
      };

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);
         
      // save data to DB
      const data = req.body;
      data.email = data.email.toLowerCase();
      const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
      data.password = await hash(data.password, saltRounds);
      const clerk = await Clerk.create(data);

      res.send({ id: clerk.id })

   } catch (err) {
      status_500(err, res);
   }
});

clerks.get('/', async (req, res) => {
   try {
      let clerks = await Clerk.findAll({
         include: {
            model: Institution,
            attributes: [ 'id', 'name' ]
         }
      });

      clerks = clerks.map(clerk => {
         clerk = clerk.dataValues;
         clerk.institution = clerk.Institution.dataValues;
         delete clerk.Institution;
         return clerk;
      })

      res.send(clerks);

   } catch (err) {
      status_500(err, res);
   }
});

clerks.delete('/:id', async (req, res) => {
   try {

      await Clerk.destroy({ where: { id: req.params.id }});
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});




module.exports = clerks;