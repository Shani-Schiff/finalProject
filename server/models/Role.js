const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: 'roles',
  underscored: true,
  timestamps: false
});

module.exports = Role;
