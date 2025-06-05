const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
});

module.exports = Role;