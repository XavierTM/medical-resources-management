

const { Model, DataTypes } = require("sequelize");

module.exports = class ResourceType extends Model {
   static init(sequelize) {
      super.init({
         name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
         },
      }, { sequelize })
   }
}