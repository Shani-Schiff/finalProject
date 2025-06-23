const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  subject_name: { type: DataTypes.STRING(100), unique: true, allowNull: false }
});

Subject.associate = (models) => {
  Subject.hasMany(models.Lesson, { foreignKey: 'subject_id' });
};

module.exports = Subject;
