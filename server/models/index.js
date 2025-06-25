const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../../dataBase/dataBase');

const models = {};

// טוען את כל המודלים בתיקייה (מלבד index.js)
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    models[model.name] = model;
  });

// מריץ associate לכל מודל (אם יש)
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

// מוסיף את החיבור ל-Sequelize למודלים
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
