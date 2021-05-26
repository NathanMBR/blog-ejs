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
    let hasNextPage;
    let page = req.query["page"];
    if (!page || isNaN(page) || Array.isArray(page) || page <= 0)
        page = 1;
    else
        console.log("\n\n\n" + typeof(page));
    const limit = 5;
    const offset = page => {
        return limit * (page - 1);
    }
    
    Post.findAndCountAll({
        where: {
            deleted: false
        },
        include: [{model: Category}],
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset(page)
    }).then(posts => {
        offset(page) + limit >= posts.count ?
            hasNextPage = false :
            hasNextPage = true;
        res.render("main/home", {posts: posts.rows, page: page, hasNextPage: hasNextPage, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
    }).catch(error => {
        // Error msg: internal error, pls try again
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/404");
    });
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

router.all("/*", (req, res) => {
    res.status(404).render("main/404");
});

// Export
module.exports = router;