
const { Sequelize } = require("sequelize");
const Booking = require("./Booking");
const BookingResource = require("./BookingResource");
const Clerk = require("./Clerk");
const Institution = require("./Institution");
const Resource = require("./Resource");
const ResourceType = require("./ResourceType");

let storage;

if (process.env.NODE_ENV === 'test')
   storage = ':memory:';
else
   storage = `${__dirname}/db.sqlite`;

const sequelize = new Sequelize('', '', '', { 
   dialect: 'sqlite',
   storage,
   logging: false
});


async function init() {
   // initialize models
   Booking.init(sequelize);
   BookingResource.init(sequelize);
   Clerk.init(sequelize);
   Institution.init(sequelize);
   Resource.init(sequelize);
   ResourceType.init(sequelize);

   // relationships
   /// Booking
   Booking.belongsTo(Institution, {
      foreignKey: {
         name: 'booked_for',
         allowNull: false,
      },
      onDelete: 'CASCADE',
   });

   Booking.belongsTo(Institution, {
      foreignKey: {
         name: 'booked_on',
         allowNull: false,
      },
      as: '__booked_on',
      onDelete: 'CASCADE',
   });

   Booking.hasMany(BookingResource, {
      foreignKey: {
         name: 'booking',
         allowNull: false,
      },
      as: '__booking_resources'
   });

   /// BookingResource
   BookingResource.belongsTo(Resource, {
      foreignKey: {
         name: 'resource',
         allowNull: false,
      },
      as: '__resource',
      onDelete: 'CASCADE',
   });

   BookingResource.belongsTo(Booking, {
      foreignKey: {
         name: 'booking',
         allowNull: false,
      },
      onDelete: 'CASCADE',
   });

   /// Clerk
   Clerk.belongsTo(Institution, {
      foreignKey: {
         name: 'institution',
         allowNull: false,
      },
      onDelete: 'CASCADE',
   });

   /// Isntutution
   /// Resource
   Resource.belongsTo(Institution, {
      foreignKey: {
         name: 'institution',
         allowNull: false,
      },
      onDelete: 'CASCADE',
   });

   Resource.belongsTo(ResourceType, {
      foreignKey: {
         name: 'resource_type',
         allowNull: false,
      },
      onDelete: 'RESTRICT',
   });

   /// ResourceType

   // initialize DB
   await sequelize.sync({ force: false });

}


module.exports = {
   init,
   sequelize,
}