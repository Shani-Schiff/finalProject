const { DataTypes } = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const Media = sequelize.define('Media', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  lesson_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: 'lessons', // השם המדויק של הטבלה של שיעורים במסד הנתונים שלך
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  file_url: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  file_type: { 
    type: DataTypes.ENUM('image','pdf','video','audio'), 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  }
}, {
  tableName: 'media',
  underscored: true,
  timestamps: false
});

Media.associate = (models) => {
  Media.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
};

module.exports = Media;
