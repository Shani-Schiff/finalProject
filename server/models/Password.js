const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require("../dataBase");  // חיבור למסד נתונים
const User = require('./User'); // קשר עם טבלת משתמשים

// מודל Password
const Password = sequelize.define('Password', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  hooks: {
    // טריק: לפני יצירת סיסמה, אנחנו מאפיינים אותה כ־hash
    beforeCreate: async (passwordRecord) => {
      if (passwordRecord.hashedPassword) {
        passwordRecord.hashedPassword = await bcrypt.hash(passwordRecord.hashedPassword, 10);
      }
    },
    beforeUpdate: async (passwordRecord) => {
      if (passwordRecord.hashedPassword) {
        passwordRecord.hashedPassword = await bcrypt.hash(passwordRecord.hashedPassword, 10);
      }
    },
  },
});

// // פונקציה לבדוק אם הסיסמה שהוזנה נכונה
// Password.prototype.validPassword = async function(password) {
//   return bcrypt.compare(password, this.hashedPassword);
// };

Password.belongsTo(User, { foreignKey: 'userId' });

module.exports = Password;
