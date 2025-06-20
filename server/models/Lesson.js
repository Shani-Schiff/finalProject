const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');
const User = require('./User');
const Media = require('./Media');
const Review = require('./Review');
const LessonStudent = require('./LessonStudent');
// const LessonTeacher = require('./LessonTeacher');

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING,
  subject: DataTypes.STRING,
  level: DataTypes.STRING(50),
  teacher_id: DataTypes.INTEGER,
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  schedule: DataTypes.TEXT,
  max_participants: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10,2),
  location: DataTypes.STRING,
  status: DataTypes.STRING(50)
});
Lesson.associate = (models) => {
Lesson.belongsTo(User, { foreignKey: 'teacher_id' });
Lesson.belongsToMany(User, { through: LessonStudent, foreignKey: 'lesson_id', as: 'students' });
Lesson.belongsToMany(User, { through: LessonTeacher, foreignKey: 'lesson_id', as: 'teachers' });
Lesson.hasMany(Media, { foreignKey: 'lesson_id' });
Lesson.hasMany(Review, { foreignKey: 'lesson_id' });
};
module.exports = Lesson;
