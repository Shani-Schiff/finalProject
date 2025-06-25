const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  subject_name: { type: DataTypes.STRING(100), unique: true, allowNull: false }
}, {
  tableName: 'subjects',
  underscored: true,
  timestamps: false
});

Subject.associate = (models) => {
  Subject.hasMany(models.Lesson, { foreignKey: 'subject_id' });
};

module.exports = Subject;
