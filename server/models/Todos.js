const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../dataBase");  // חיבור למסד נתונים
const Users = require('./Users');

const Todos = sequelize.define('Todos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Todos.belongsTo(Users, { foreignKey: 'userId' });  // קשר עם טבלת User

module.exports = Todos;
