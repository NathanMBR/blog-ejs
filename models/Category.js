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
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Category;