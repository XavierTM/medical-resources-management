
const { Router } = require("express");
const status_500 = require('./status_500');
const Joi = require("@xavisoft/joi");
const admin_auth = require("./auth/admin_auth");
const ResourceType = require('./db/ResourceType');


const resource_types = Router();

resource_types.use(admin_auth);

resource_types.post('/', async (req, res) => {
   try {

      // validation
      const schema = {
         name: Joi.string().required(),
      };

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);
         
      // save data to DB
      const data = req.body;
      const resourceType = await ResourceType.create(data);

      res.send({ id: resourceType.id })

   } catch (err) {
      status_500(err, res);
   }
});

resource_types.get('/', async (req, res) => {
   try {

      const resourceTypes = await ResourceType.findAll({
         attributes: [ 'id', 'name' ]
      });

      res.send(resourceTypes);

   } catch (err) {
      status_500(err, res);
   }
});

resource_types.delete('/:id', async (req, res) => {
   try {

      await ResourceType.destroy({ where: { id: req.params.id }});
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});




module.exports = resource_types;