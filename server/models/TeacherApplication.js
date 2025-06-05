const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');
// const User = require('./User');

const TeacherApplication = sequelize.define('TeacherApplication', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  cv_file: DataTypes.STRING,
  bio: DataTypes.TEXT,
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  date_submitted: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});
TeacherApplication.associate = (models) => {
TeacherApplication.belongsTo(User, { foreignKey: 'user_id' });
}
module.exports = TeacherApplication;
