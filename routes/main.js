// Modules
const router = require("express").Router();

// Models
const Category = require("../models/Category");
const Post = require("../models/Post");

// Helpers
const dateFormatter = require("../helpers/dateFormatter");
const hourFormatter = require("../helpers/hourFormatter");

// Routes
router.get("/", (req, res) => {
    res.redirect("/home");
});

router.get("/home", (req, res) => {
    Post.findAll({
        include: [{model: Category}],
        order: [["createdAt", "DESC"]]
    }).then(posts => {
        res.render("main/home", {posts: posts, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
    }).catch(error => {
        // Error msg: internal error, pls try again
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/404");
    });
});

router.get("/404", (req, res) => {
    res.render("main/404");
});

router.get("/read", (req, res) => {
    res.redirect("/home");
});

router.get("/read/:slug", (req, res) => {
    Post.findOne({
        include: [
            {model: Category}
        ], where: {
            slug: req.params["slug"]
        }
    }).then(post => {
        if (post)
            res.render("main/read", {post: post, commentaries: [], dateFormatter: dateFormatter, hourFormatter: hourFormatter});
        else {
            // Error msg: post not found
            res.redirect("/home");
        }
    }).catch(error => {
        // Error msg: internal error, pls try again
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/home");
    });
});

// Export
module.exports = router;