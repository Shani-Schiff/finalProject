const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'student' },
  active_status: { type: DataTypes.BOOLEAN, defaultValue: true },
  date_created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: true
});

User.associate = models => {
  User.hasMany(models.Lesson, { foreignKey: 'teacher_id', as: 'teachingLessons' });
};

module.exports = User;
