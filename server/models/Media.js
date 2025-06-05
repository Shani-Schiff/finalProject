const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');
// const Lesson = require('./Lesson');

const Media = sequelize.define('Media', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  lesson_id: DataTypes.INTEGER,
  file_url: DataTypes.TEXT,
  file_type: { type: DataTypes.ENUM('pdf', 'video', 'audio') },
  description: DataTypes.TEXT
});
Media.associate = (models) => {
Media.belongsTo(Lesson, { foreignKey: 'lesson_id' });
};
module.exports = Media;