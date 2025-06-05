const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');
// const User = require('./User');
// const Lesson = require('./Lesson');

const LessonStudent = sequelize.define('LessonStudent', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  lesson_id: { type: DataTypes.INTEGER, primaryKey: true },
  registration_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: DataTypes.STRING(50)
});
LessonStudent.associate = (models) => {
  LessonStudent.belongsTo(User, { foreignKey: 'user_id' });
  LessonStudent.belongsTo(Lesson, { foreignKey: 'lesson_id' });
};

module.exports = LessonStudent;
