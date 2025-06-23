const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: DataTypes.INTEGER,
  content: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  read_status: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_request: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Notification.associate = (models) => {
  Notification.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = Notification;
