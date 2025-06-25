const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const LessonStudent = sequelize.define('LessonStudent', {
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'enrolled'
  }
}, {
  tableName: 'lesson_students',
  underscored: true,
  timestamps: false
});

LessonStudent.associate = (models) => {
  LessonStudent.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
  LessonStudent.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
};

module.exports = LessonStudent;
