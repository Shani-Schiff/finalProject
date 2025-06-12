const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');
// const User = require('./User');

const UserPassword = sequelize.define('UserPassword', {
  userId: { type: DataTypes.INTEGER, primaryKey: true },
  hashedPassword: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
});
UserPassword.associate = (models) => {
  UserPassword.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = UserPassword;
