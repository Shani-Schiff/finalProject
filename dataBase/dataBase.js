require('dotenv').config();

const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

console.log('DB_DIALECT:', process.env.DB_DIALECT);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.SERVER_HOSTNAME,
    user: process.env.DB_USER,
    password: ''
  });

  await connection.query("CREATE DATABASE IF NOT EXISTS `privateLessons`;");
  await connection.end();
})();

const sequelize = new Sequelize("privateLessons", process.env.DB_USER, '', {
  host: process.env.SERVER_HOSTNAME,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
});
sequelize
  .authenticate()
  .then(() => console.log("Successfully connected to newly created MySQL DB"))
  .catch((err) => console.error("Error connecting to MySQL:", err));

module.exports = sequelize;
