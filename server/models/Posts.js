const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../../dataBase/dataBase");  // חיבור למסד נתונים
const Users = require('./Users');

const Posts = sequelize.define('Posts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Posts.belongsTo(Users, { foreignKey: 'userId' });  // קשר עם טבלת User

module.exports = Posts;
