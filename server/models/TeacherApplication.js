const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const TeacherApplication = sequelize.define('TeacherApplication', {
  full_name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  subjects: DataTypes.TEXT,
  description: DataTypes.TEXT,
  experience: DataTypes.TEXT,
  location: DataTypes.STRING,
  image: DataTypes.STRING,
  cv: DataTypes.STRING
});

module.exports = TeacherApplication;
