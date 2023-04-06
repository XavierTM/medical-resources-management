const { waitForServer, createRequester, createInstitution, createClerk, createAuthToken, createResourceType, createResource } = require("./utils");
const chai = require('chai');
const casual = require("casual");
const { assert, expect } = chai;
const chaiSpies = require('chai-spies');
const chaiHttp = require('chai-http');
const { ACCESS_TOKEN_HEADER_NAME } = require("@xavisoft/auth/constants");
const bcrpyt = require('bcrypt');
const { USER_TYPES } = require("../constants");
const Institution = require("../db/Institution");
const Clerk = require("../db/Clerk");
const Resource = require('../db/Resource');
const ResourceType = require('../db/ResourceType');
const Booking = require('../db/Booking');
const BookingResource = require('../db/BookingResource');

chai.use(chaiSpies);
chai.use(chaiHttp);

const requester = createRequester();

const HOUR = 3600 * 1000;
const HALF_HOUR = HOUR / 2;
const MINUTE = 60 * 1000;

suite('Functional tests', function() {

   this.beforeAll(async () => {
      await waitForServer();
   });

   suite('Authentication', function() {
      test('Login', async () => {

         const institution = await createInstitution();
         const password = casual.password;
         const clerk = await createClerk({ password, institution: institution.id });
         const { email } = clerk;

         let res = await requester
            .post('/api/login')
            .send({ email, password });

         assert.equal(res.status, 200);

         res = await requester
            .post('/api/login')
            .send({ email, password: casual.password });

         assert.equal(res.status, 400);

      });
   });

   suite('Institution management', function () {

      const accessToken = createAuthToken({ type: USER_TYPES.ADMIN });
      
      test('Add institution', async () => {
         
         // request
         const payload = {
            name: casual.company_name,
         }

         const res = await requester
            .post('/api/institutions')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         const institution = await Institution.findOne({ order: [ [ 'id', 'DESC' ] ]}); // last inserted
         assert.isObject(institution);

         assert.equal(institution.name, payload.name);

      });

      test('Fetch institutions', async () => {

         // create some institutions
         const iMax = casual.integer(5, 10);

         for (let i = 0; i < iMax; i++)
            await createInstitution();

         const institutionCount = await Institution.count();

         // request
         const res = await requester
            .get('/api/institutions')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);
         assert.isArray(res.body);

         // validate count
         assert.equal(res.body.length, institutionCount);

         // validate schema
         assert.isNumber(res.body[0].id);
         assert.isString(res.body[0].name);

      });

      test('Remove institution', async () => {
         // request
         let institution = await Institution.findOne({ order: [ [ 'id', 'DESC' ] ]}); // last inserted
        
         const res = await requester
            .delete(`/api/institutions/${institution.id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);

         // confirm deletion
         institution = await Institution.findByPk(institution.id);
         assert.isNull(institution);
         
      });
   });

   suite('Clerk management', function () {
      const accessToken = createAuthToken({ type: USER_TYPES.ADMIN });

      test('Add clerk', async () => {

         const institution = await createInstitution();

         const payload = {
            name: casual.first_name,
            surname: casual.last_name,
            email: casual.email,
            password: casual.password,
            institution: institution.id,
         }

         // send request
         const res = await requester
            .post('/api/clerks')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

            assert.equal(res.status, 200);

         // check db
         const clerk = await Clerk.findOne({ order: [ [ 'id', 'DESC' ] ]}); // last inserted
         assert.isObject(clerk);

         assert.equal(clerk.name, payload.name);
         assert.equal(clerk.surname, payload.surname);
         assert.equal(clerk.email, payload.email.toLowerCase()); // the endpoint should lowercase the email
    
      });

      test('Fetch clerks', async () => {

         // create some clerks
         const institution = await createInstitution();
         const iMax = casual.integer(5, 10);

         for (let i = 0; i < iMax; i++)
            await createClerk({ institution: institution.id });

         const clerkCount = await Clerk.count();

         // request
         const res = await requester
            .get('/api/clerks')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);
         assert.isArray(res.body);

         // validate count
         assert.equal(res.body.length, clerkCount);

         // validate schema
         const clerk = res.body[0];

         assert.isNumber(clerk.id);
         assert.isString(clerk.name);
         assert.isString(clerk.surname);
         assert.isString(clerk.email);
         assert.isObject(clerk.institution);
         assert.isNumber(clerk.institution.id);
         assert.isString(clerk.institution.name);

      });

      test('Remove clerk', async () => {
         // request
         let clerk = await Clerk.findOne({ order: [ [ 'id', 'DESC' ] ]}); // last inserted
        
         const res = await requester
            .delete(`/api/clerks/${clerk.id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);

         // confirm deletion
         clerk = await Clerk.findByPk(clerk.id);
         assert.isNull(clerk);
         
      });
      
   });

   suite('Resource-type management', function () {
      const accessToken = createAuthToken({ type: USER_TYPES.ADMIN });

      test('Add resource-type', async () => {


         const payload = {
            name: casual.word
         }

         // send request
         const res = await requester
            .post('/api/resource-types')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

            assert.equal(res.status, 200);

         // check db
         const resourceType = await ResourceType.findOne({ order: [ [ 'id', 'DESC' ] ]}); // last inserted
         assert.isObject(resourceType);

         assert.equal(resourceType.name, payload.name);
        
      });

      test('Fetch resource-types', async () => {

         // create some clerks
         const iMax = casual.integer(5, 10);

         for (let i = 0; i < iMax; i++)
            await createResourceType();

         const resourceTypeCount = await ResourceType.count();

         // request
         const res = await requester
            .get('/api/resource-types')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);
         assert.isArray(res.body);

         // validate count
         assert.equal(res.body.length, resourceTypeCount);

         // validate schema
         const resourceType = res.body[0];

         assert.isNumber(resourceType.id);
         assert.isString(resourceType.name);

      });

      test('Remove resource-type', async () => {
         // request
         let resourceType = await ResourceType.findOne({ order: [ [ 'id', 'DESC' ] ]}); // last inserted
        
         const res = await requester
            .delete(`/api/resource-types/${resourceType.id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);

         // confirm deletion
         resourceType = await ResourceType.findByPk(resourceType.id);
         assert.isNull(resourceType);
         
      });
      
   });

   suite('Resource managment', function () {

      let accessToken;
      let clerk, institution;

      this.beforeAll(async() => {

         institution = await createInstitution();
         clerk = await createClerk({ institution: institution.id });

         accessToken = createAuthToken({ 
            type: USER_TYPES.CLERK, 
            id: clerk.id, 
            institution: clerk.institution,
         });

      });


      test('Add resource', async () => {

         // request
         const resourceType = await createResourceType();

         const payload = {
            name: casual.catch_phrase,
            resource_type: resourceType.id,
         }

         const res = await requester
            .post('/api/resources')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         const resource = await Resource.findOne({ order: [ [ 'id', 'DESC' ] ]});
         assert.isObject(resource);
         assert.equal(resource.name, payload.name);
         assert.equal(resource.resource_type, payload.resource_type);

      });

      test('Fetch resources', async () => {

         // create some resources
         const iMax = casual.integer(5, 10);
         const resourceType = await createResourceType();

         for (let i = 0; i < iMax; i++)
            await createResource({ institution: institution.id, resource_type: resourceType.id  });

         const resourceCount = await Resource.count({ where: { institution: institution.id } });

         // request
         const res = await requester
            .get('/api/resources')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);
         assert.isArray(res.body);

         // validate count
         assert.equal(res.body.length, resourceCount);

         // validate schema
         const resource = res.body[0];
         assert.isNumber(resource.id);
         assert.isString(resource.name);
         assert.isObject(resource.resource_type);
         assert.isNumber(resource.resource_type.id);
         assert.isString(resource.resource_type.name);

      });

      test('Remove resource', async () => {
         // request
         let resource = await Resource.findOne({ order: [ [ 'id', 'DESC' ] ]}); // last inserted
        
         const res = await requester
            .delete(`/api/resources/${resource.id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send()

         assert.equal(res.status, 200);

         // confirm deletion
         resource = await Resource.findByPk(resource.id);
         assert.isNull(resource);
         
      });

   });

   suite('Booking', function () {

      let accessToken;
      let clerk, institution;
      let xRayMachineResourceType, wardResourceType;

      this.beforeAll(async() => {

         institution = await createInstitution();
         clerk = await createClerk({ institution: institution.id });

         accessToken = createAuthToken({ 
            type: USER_TYPES.CLERK, 
            id: clerk.id, 
            institution: clerk.institution,
         });

         xRayMachineResourceType = await createResourceType();
         wardResourceType = await createResourceType();

      });


      test('Check available slots', async () => {
         // set up bookings
         /// create resources
         const theOtherInstitution = await createInstitution();
         
         await createResource({
            institution: theOtherInstitution.id,
            resource_type: xRayMachineResourceType.id,
         });

         const ward = await createResource({
            institution: theOtherInstitution.id,
            resource_type: wardResourceType.id,
         });

         /// book ward by another party
         const thirdPartyInstituition = await createInstitution();

         const booking = await Booking.create({
            booked_on: theOtherInstitution.id,
            booked_for: thirdPartyInstituition.id,
            from: Date.now() + HALF_HOUR + 60 * 1000, // 31 minutes from now
            to: Date.now() + HOUR, // an hour from now
         });

         await BookingResource.create({ 
            booking: booking.id,
            resource: ward.id,
         });

         // requests
         /// one our duration
         let res = await requester
            .get(`/api/bookings/free-slots?duration=${HOUR}&resource_types=${xRayMachineResourceType.id},${wardResourceType.id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         /// verify response
         assert.isArray(res.body);
         let availableInstitution = res.body[0];

         assert.isNumber(availableInstitution.id);
         assert.isString(availableInstitution.name);
         assert.isNumber(availableInstitution.available_at);
         assert.isArray(availableInstitution.resources);
         assert.equal(availableInstitution.resources.length, 2);

         assert.isAtLeast(availableInstitution.available_at, Date.now() - 3000); // 3 seconds margin

         /// thirty minutes duration
         res = await requester
            .get(`/api/bookings/free-slots?duration=${HALF_HOUR}&resource_types=${xRayMachineResourceType.id},${wardResourceType.id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);
         
         /// verify response
         assert.isArray(res.body);
         availableInstitution = res.body[0];

         assert.isAtMost(availableInstitution.available_at, Date.now());

         
      });

      test('Book resources', async () => {

         // create resources
         const theOtherInstitution = await createInstitution();

         const xRayMachine = await createResource({
            institution: theOtherInstitution.id,
            resource_type: xRayMachineResourceType.id,
         });

         const ward = await createResource({
            institution: theOtherInstitution.id,
            resource_type: wardResourceType.id,
         });
         
         // send request
         const from = Date.now() + MINUTE;

         const payload = {
            book_on: institution.id,
            duration: HOUR,
            from,
            resources: [ xRayMachine.id, ward.id ],
         }

         const res = await requester
            .post('/api/bookings')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         const booking = await Booking.findOne({ order: [ [ 'id', 'DESC' ] ] });
         assert.isObject(booking);

         assert.equal(booking.booked_on, payload.book_on);

         const bookingResourcesCount = await BookingResource.count({ where: { booking: booking.id } });
         assert.equal(bookingResourcesCount, payload.resources.length);

      });

      test('Retrieve bookings', async () => {
         
         // request
         const res = await requester
            .get('/api/bookings')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         // verify schema
         assert.isArray(res.body)
         const booking = res.body[0];

         assert.isNumber(booking.id);
         assert.isOk(booking.from);
         assert.isOk(booking.to);
         assert.isObject(booking.booked_on);
         assert.isNumber(booking.booked_on.id);
         assert.isString(booking.booked_on.name);
         assert.isArray(booking.resources);
         assert.isObject(booking.resources[0]);
         assert.isNumber(booking.resources[0].id);
         assert.isString(booking.resources[0].name);

      });

      test('Cancel booking', async () => {
         
         // request
         let booking = await Booking.findOne({ order: [ [ 'id', 'DESC' ] ] });

         const res = await requester
            .delete(`/api/bookings/${booking.id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         // verify deletion
         booking = await Booking.findByPk(booking.id);
         assert.isNull(booking);

      });

   });
});