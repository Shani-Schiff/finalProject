const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const UserPassword = sequelize.define('UserPassword', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  hashed_password: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'user_passwords',
  underscored: true,
  timestamps: false
});

UserPassword.associate = models => {
  UserPassword.belongsTo(models.user, { foreignKey: 'user_id' });
};

module.exports = UserPassword;
