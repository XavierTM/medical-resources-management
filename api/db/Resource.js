

const { Model, DataTypes } = require("sequelize");

module.exports = class Resource extends Model {
   static init(sequelize) {
      super.init({
         name: {
            type: DataTypes.STRING(100),
            allowNull: false,
         },
      }, { sequelize })
   }
}