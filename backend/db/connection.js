const { Sequelize } = require("sequelize");
const { config } = require("./config");

const env = process.env.NODE_ENV || "development";
const { dialect, username, password, database, host } = config["development"];

const sequelize = new Sequelize(database, username, password, {
  host,
  port: 3306,
  dialect:"mysql",
  dialectModule:require('mysql2'),
});

module.exports = sequelize;
