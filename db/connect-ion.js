const Sequelize = require("sequelize");

const connection = new Sequelize("dbName", "username", "password", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-05:00",
	logging: false
});

module.exports = connection;