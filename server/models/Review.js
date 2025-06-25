const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Review = sequelize.define('Review', {
  student_id: { type: DataTypes.INTEGER, primaryKey: true },
  teacher_id: { type: DataTypes.INTEGER, primaryKey: true },
  lesson_id: { type: DataTypes.INTEGER, primaryKey: true },
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Review.associate = (models) => {
  Review.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
  Review.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });
  Review.belongsTo(models.Lesson, { foreignKey: 'lesson_id' });
};

module.exports = Review;
