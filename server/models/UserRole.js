const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const UserRole = sequelize.define('UserRole', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  role_id: { type: DataTypes.INTEGER, primaryKey: true },
  assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'user_roles',
  underscored: true,
  timestamps: false
});

UserRole.associate = models => {
  UserRole.belongsTo(models.user);
  UserRole.belongsTo(models.role);
};

module.exports = UserRole;
