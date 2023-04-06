

const { Model, DataTypes } = require("sequelize");

module.exports = class Institution extends Model {
   static init(sequelize) {
      super.init({
         name: {
            type: DataTypes.STRING(100),
            allowNull: false,
         },
         location: {
            type: DataTypes.STRING,
         },
      }, { sequelize })
   }
}