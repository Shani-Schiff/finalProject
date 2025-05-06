const { Sequelize, DataTypes } = require('sequelize');
const sequelize= require("../dataBase");  // חיבור למסד נתונים
const User = require('./User');

const Post = sequelize.define('Post', {
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

Post.belongsTo(User, { foreignKey: 'userId' });  // קשר עם טבלת User

module.exports = Post;
