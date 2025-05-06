const { Sequelize, DataTypes } = require('sequelize');
const sequelize= require("../dataBase");  // חיבור למסד נתונים
const Post = require('./Post');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Comment.belongsTo(Post, { foreignKey: 'postId' });  // קשר עם טבלת Post

module.exports = Comment;
