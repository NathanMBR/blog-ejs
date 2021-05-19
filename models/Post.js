const Sequelize = require("sequelize");
const connection = require("../db/connection");
const Category = require("./Category");

const Post = connection.define("posts", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    post: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Post.belongsTo(Category);   // 1 to 1
Category.hasMany(Post);     // 1 to N

module.exports = Post;