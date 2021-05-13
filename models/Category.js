const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Category = connection.define("categories", {
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Category;