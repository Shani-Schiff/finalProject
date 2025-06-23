const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'user_id' },
  user_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'student' },
  active_status: { type: DataTypes.BOOLEAN, defaultValue: true },
  date_created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: true
});


User.associate = (models) => {
  User.hasOne(models.UserPassword, { foreignKey: 'user_id' });
  User.hasMany(models.Lesson, { foreignKey: 'teacher_id', as: 'teachingLessons' });
  User.belongsToMany(models.Lesson, { through: models.LessonStudent, foreignKey: 'user_id', as: 'studentLessons' });
  User.belongsToMany(models.Lesson, { through: models.LessonTeacher, foreignKey: 'user_id', as: 'teacherLessons' });
};

module.exports = User;
