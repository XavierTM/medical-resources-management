

const { Model } = require("sequelize");

module.exports = class BookingResource extends Model {
   static init(sequelize) {
      super.init({
      
      }, { sequelize })
   }
}