const Sequelize = require("sequelize");
const connection = require("../db/connection");

const User = connection.define("users", {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    photo: {
        type: Sequelize.STRING,
        defaultValue: "default.png"
    },

    role: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },

    isEmailPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    banned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ["username", "email"]
    }]
});

module.exports = User;