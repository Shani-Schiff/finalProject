const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../../dataBase/dataBase'); // נתיב לקובץ שלך

const models = {};

// טוען את כל המודלים בתיקייה זו (למעט index.js עצמו)
fs.readdirSync(__dirname)
  .filter(file =>
    file.endsWith('.js') &&
    file !== 'index.js'
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    const modelName = model.name || path.basename(file, '.js');
    models[modelName] = model;
  });

// להריץ associate לכל מודל אם קיים
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

// מוסיף את החיבור לכל מקרה שצריך
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
