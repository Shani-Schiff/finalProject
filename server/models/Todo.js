const { Sequelize, DataTypes } = require('sequelize');
const sequelize= require("../dataBase");  // חיבור למסד נתונים
const User = require('./User');

const Todo = sequelize.define('Todo', {
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

Todo.belongsTo(User, { foreignKey: 'userId' });  // קשר עם טבלת User

module.exports = Todo;
