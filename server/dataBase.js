const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "miri3292",
  });

  await connection.query("CREATE DATABASE IF NOT EXISTS `socialNetwork`;");
  await connection.end();
})();

const sequelize = new Sequelize("socialNetwork", "root", "miri3292", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

sequelize
  .authenticate()
  .then(() => console.log("Successfully connected to newly created MySQL DB"))
  .catch((err) => console.error("Error connecting to MySQL:", err));

module.exports = sequelize;
