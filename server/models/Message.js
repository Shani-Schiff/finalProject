const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sender_id: DataTypes.INTEGER,
  receiver_id: DataTypes.INTEGER,
  content: DataTypes.TEXT,
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true
});

Message.associate = (models) => {
  Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
  Message.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
};

module.exports = Message;
