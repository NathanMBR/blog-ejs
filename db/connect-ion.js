const Sequelize = require("sequelize");

const connection = new Sequelize("dbName", "username", "password", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;