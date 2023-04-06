const { Router } = require("express");
const status_500 = require('./status_500');
const Joi = require("@xavisoft/joi");
const Institution = require("./db/Institution");
const admin_auth = require("./auth/admin_auth");


const institutions = Router();

institutions.use(admin_auth);

institutions.post('/', async (req, res) => {

   try {

      // validation
      const schema = {
         name: Joi.string().required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // save to DB
      const institution = await Institution.create(req.body);

      res.send({ id: institution.id })

   } catch (err) {
      status_500(err, res);
   }
});

institutions.get('/', async (req, res) => {

   try {

      const institutions = await Institution.findAll();
      res.send(institutions);

   } catch (err) {
      status_500(err, res);
   }
});

institutions.delete('/:id', async (req, res) => {

   try {

      await Institution.destroy({ where: { id: req.params.id } });
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});



module.exports = institutions;