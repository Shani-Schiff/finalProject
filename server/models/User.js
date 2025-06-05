const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');
// const UserPassword = require('./UserPassword');
// const Lesson = require('./Lesson');
// const LessonStudent = require('./LessonStudent');
// const LessonTeacher = require('./LessonTeacher');

const User = sequelize.define('User', {
  userId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.STRING(50), allowNull: false },
  active_status: { type: DataTypes.BOOLEAN, defaultValue: true },
  date_created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});


User.associate = (models) => {
  User.hasOne(models.UserPassword, { foreignKey: 'userId' });
  User.hasMany(models.Lesson, { foreignKey: 'teacher_id', as: 'teachingLessons' });
  User.belongsToMany(models.Lesson, { through: models.LessonStudent, foreignKey: 'user_id', as: 'studentLessons' });
  User.belongsToMany(models.Lesson, { through: models.LessonTeacher, foreignKey: 'user_id', as: 'teacherLessons' });
};
module.exports = User;
