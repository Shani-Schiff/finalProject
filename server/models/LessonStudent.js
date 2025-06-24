const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const LessonStudent = sequelize.define('LessonStudent', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  lesson_id: { type: DataTypes.INTEGER, primaryKey: true },
  registration_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING(50), allowNull: false }
}, {
  tableName: 'lesson_students',
  underscored: true,
  timestamps: false
});

LessonStudent.associate = models => {
  LessonStudent.belongsTo(models.user);
  LessonStudent.belongsTo(models.lesson);
};

module.exports = LessonStudent;
