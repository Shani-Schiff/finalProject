const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING, allowNull: true },
  active_status: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  underscored: true,
  timestamps: false
});

User.associate = models => {
  User.hasOne(models.user_password, { foreignKey: 'user_id' });
  User.belongsToMany(models.role, { through: models.user_role, foreignKey: 'user_id' });
  User.hasMany(models.lesson, { foreignKey: 'teacher_id', as: 'teaching_lessons' });
  User.belongsToMany(models.lesson, { through: models.lesson_student, foreignKey: 'user_id', as: 'student_lessons' });
};

module.exports = User;
