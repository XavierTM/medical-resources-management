const { compare } = require("bcrypt");
const Joi = require('@xavisoft/joi');
const Clerk = require("../db/Clerk");
const { USER_TYPES } = require("../constants");



async function getUserInfo(credentials) {

   // validate schema
   const schema = {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
   }

   const error = Joi.getError(credentials, schema);
   if (error)
      return null;

   // get user 

   let type, id, institution;
   const { password } = credentials;
   const email = credentials.email.toLowerCase();

   if (email === process.env.ADMIN_EMAIL) {

      if (password !== process.env.ADMIN_PASSWORD)
         return null;

      type = USER_TYPES.ADMIN;

   } else {

      const user = await Clerk.findOne({ where: { email } });

      if (!user)
         return null;

      // validate password
      const isValid = await compare(password, user.password);
      if (!isValid)
         return null;

      id = user.id;
      institution = user.institution;
      type = USER_TYPES.CLERK;

   }

   return {
      id,
      institution,
      type,
   }
   
}

const authenticator = {
   getUserInfo
}

module.exports = authenticator;