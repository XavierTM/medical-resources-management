

const { Model, DataTypes } = require("sequelize");

module.exports = class Clerk extends Model {
   static init(sequelize) {
      super.init({
         name: {
            type: DataTypes.STRING(100),
            allowNull: false,
         },
         surname: {
            type: DataTypes.STRING(100),
            allowNull: false,
         },
         email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
         },
         password: {
            type: DataTypes.STRING(100),
            allowNull: false,
         },
      }, { sequelize })
   }
}