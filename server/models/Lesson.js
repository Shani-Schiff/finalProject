const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subject_id: { type: DataTypes.INTEGER, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false },
  teacher_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
  max_participants: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'lessons',
  underscored: true,
  timestamps: false
});

Lesson.associate = models => {
  Lesson.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });
  Lesson.belongsTo(models.Subject, { foreignKey: 'subject_id' });

  Lesson.belongsToMany(models.User, {
    through: models.LessonStudent,
    foreignKey: 'lesson_id',
    as: 'students'
  });

  Lesson.hasMany(models.Media, {
    foreignKey: 'lesson_id',
    as: 'media',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
};

module.exports = Lesson;
