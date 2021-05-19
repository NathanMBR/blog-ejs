// Modules
const router = require("express").Router();
const slugify = require("slugify");

// Models
const Post = require("../../models/Post");
const Category = require("../../models/Category");

// Helpers
const nullFormValidation = require("../../helpers/nullFormValidation");
const dateFormatter = require("../../helpers/dateFormatter");
const hourFormatter = require("../../helpers/hourFormatter");

// Routes
router.get("/", (req, res) => {
    res.redirect("/admin/posts/all");
});

router.get("/all", async (req, res) => {
    const queryObject = {};
    let category = null;
    if (req.query["category"]) {
        queryObject.where = {
            categoryId: req.query["category"]
        };
        category = await Category.findByPk(req.query["category"]);
    }
    Post.findAll(queryObject).then(posts => {
        res.render("admin/posts/all", {posts: posts, category: category});
    }).catch(error => {
        // Error msg
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/panel");
    });
});

router.get("/new", (req, res) => {
    Category.findAll({order: [["category", "ASC"]]}).then(categories => {
        res.render("admin/posts/new", {categories: categories});
    }).catch(error => {
        console.log("An error ocurred while trying to load data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/posts/all");
    });
});

router.post("/new", nullFormValidation, (req, res) => {
    console.log(req.body);
    if (req.body.errors.length === 0) {
        Post.create({
            title: req.body.title,
            description: req.body.description,
            categoryId: req.body.category,
            post: req.body.post,
            author: "System Admin",
            slug: slugify(req.body.title.toLowerCase())
        }).then(() => {
            // Success msg
            res.redirect("/admin/posts/all");
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to save data in the database. Error: ");
            console.log(error);
            res.redirect("/admin/posts/all");
        });
    } else {
        // Error msg
        res.redirect("/admin/posts/new");
    }
});

router.get("/delete", (req, res) => {

});

router.post("/delete", (req, res) => {

});

router.get("/edit", (req, res) => {

});

router.post("/edit", (req, res) => {

});

module.exports = router;