const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

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
  price: DataTypes.DECIMAL(10, 2),
  location: DataTypes.STRING,
  status: DataTypes.STRING(50)
});

Lesson.associate = (models) => {
  Lesson.belongsTo(models.User, { foreignKey: 'teacher_id' });
  Lesson.belongsToMany(models.User, { through: models.LessonStudent, foreignKey: 'lesson_id', as: 'students' });
  Lesson.belongsToMany(models.User, { through: models.LessonTeacher, foreignKey: 'lesson_id', as: 'teachers' });
  Lesson.hasMany(models.Media, { foreignKey: 'lesson_id' });
  Lesson.hasMany(models.Review, { foreignKey: 'lesson_id' });
};

module.exports = Lesson;
