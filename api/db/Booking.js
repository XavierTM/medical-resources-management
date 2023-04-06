

const { Model, DataTypes } = require("sequelize");

module.exports = class Booking extends Model {
   static init(sequelize) {
      super.init({
         from: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         to: {
            type: DataTypes.DATE,
            allowNull: false,
         },
      }, { sequelize })
   }
}