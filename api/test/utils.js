
const { default: axios } = require("axios");
const chai = require('chai');
const chaiHttp = require("chai-http");
const { generateAccessToken } = require('@xavisoft/auth/backend/utils');
const Institution = require("../db/Institution");
const casual = require("casual");
const { hashSync } = require("bcrypt");
const ResourceType = require("../db/ResourceType");
const Resource = require("../db/Resource");
const Clerk = require("../db/Clerk");

chai.use(chaiHttp);

async function waitForServer(url = `http://localhost:${process.env.PORT}`) {

   let success = false;

   while (!success) {
      try {
         await axios.get(url);
         success = true;
      } catch (err) {
         if (err.code !== 'ECONNREFUSED')
            success = true;
      }
   }
}

function createRequester() {
   return chai.request(`http://localhost:${process.env.PORT}`).keepOpen();
}

function createAuthToken(userInfo) {
   const secretKey = process.env.JWT_SECRET;
   const tokenValidityPeriod = 3600 * 1000;
   return generateAccessToken({ userInfo, secretKey, tokenValidityPeriod });
}

function createInstitution() {
   return Institution.create({
      name: casual.company_name,
   });
}

function createResourceType() {
   return ResourceType.create({
      name: casual.sentence,
   });
}

function createResource(attributes={}) {
   return Resource.create({
      name: casual.word,
      ...attributes,
   });
}

function createClerk(attributes={}) {

   const password = hashSync(attributes.password || casual.password, 2);
   delete attributes.password;

   return Clerk.create({
      name: casual.first_name,
      surname: casual.last_name,
      email: casual.email.toLowerCase(),
      password,
      ...attributes
   });

}

module.exports = {
   createAuthToken,
   createClerk,
   createInstitution,
   createRequester,
   createResource,
   createResourceType,
   waitForServer
}