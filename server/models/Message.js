const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');
// const User = require('./User');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sender_id: DataTypes.INTEGER,
  receiver_id: DataTypes.INTEGER,
  content: DataTypes.TEXT,
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
});
Message.associate = (models) => {
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
};
module.exports = Message;

