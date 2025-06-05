const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), unique: true }
});

module.exports = Category;