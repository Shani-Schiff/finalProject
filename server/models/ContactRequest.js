const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const ContactRequest = sequelize.define('ContactRequest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userName: DataTypes.STRING,
  email: DataTypes.STRING,
  message: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = ContactRequest;
