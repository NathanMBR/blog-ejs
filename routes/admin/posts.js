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
    const categoryId = req.query["category"];
    let category = null;
    let order = "DESC";
    const queryObject = {
        include: [{model: Category}],
        where: {
            deleted: false
        }
    };

    // Filtering by category
    if (categoryId) {
        if (!isNaN(categoryId) && !Array.isArray(categoryId)) {
            try {
                category = await Category.findByPk(categoryId);
            } catch(error) {
                // Error msg: internal error, pls try again
                console.log("An error ocurred while trying to access data from the database. Error: ");
                console.log(error);
                res.redirect("/admin/posts/all");
            }

            if (category)
                queryObject.where.categoryId = categoryId;
            else {
                // Error msg: category not found
                res.redirect("/admin/posts/all");
            }
        } else {
            // Error msg: invalid parameter
            res.redirect("/admin/posts/all");
        }
    }

    // Sorting by Date
    if (req.query["sortBy"] === "oldest")
        order = "ASC";
    queryObject.order = [["createdAt", order]];

    // Database search and render
    Post.findAll(queryObject).then(posts => {
        res.render("admin/posts/all", {posts: posts, category: category, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
    }).catch(error => {
        // Error msg: internal error, pls try again
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/posts/all");
    });
});

router.get("/new", (req, res) => {
    Category.findAll({order: [["category", "ASC"]]}).then(categories => {
        if (categories.length > 0)
            res.render("admin/posts/new", {categories: categories});
        else {
            // Error msg: no categories created
            res.redirect("/admin/categories/new");
        }
    }).catch(error => {
        console.log("An error ocurred while trying to load data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/posts/all");
    });
});

router.post("/new", nullFormValidation, (req, res) => {
    // Duplicate slug validation
    Post.findOne({where: {
        slug: slugify(req.body.title.toLowerCase())
    }}).then(post => {
        if (post)
            req.body.errors.push({errorMsg: `There's already a post with this name.`});
    }).catch(error => {
        // Error msg: internal error, pls try again
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/posts/all");
    });

    if (req.body.errors.length === 0) {
        if (req.body.category !== 0) {
            Post.create({
                title: req.body.title,
                description: req.body.description,
                categoryId: req.body.category,
                post: req.body.post,
                author: "System Admin",
                slug: slugify(req.body.title.toLowerCase())
            }).then(() => {
                // Success msg: successfully created
                res.redirect("/admin/posts/all");
            }).catch(error => {
                // Error msg: internal error, pls try again
                console.log("An error ocurred while trying to save data in the database. Error: ");
                console.log(error);
                res.redirect("/admin/posts/all");
            });
        } else {
            // Error msg: no categories created
            res.redirect("/admin/categories/new");
        }
    } else {
        // Error msgs: [each error]
        res.redirect("/admin/posts/new");
    }
});

router.get("/delete", (req, res) => {
    if (req.query["post"] && !isNaN(req.query["post"]) && !Array.isArray(req.query["post"])) {
        Post.findByPk(re).then(post => {
            if (post)
                console.log("");
                // do something
            else
                console.log("");
                // Error msg: post not found
                // do other something
        }).catch(error => {
            // Error msg: internal error, pls try again
            console.log("An error ocurred while trying to get data from the database. Error: ");
            console.log(error);
        });
    } else {
        // Error msg: invalid parameter
        res.redirect("/admin/posts/all");
    }
});

router.post("/delete", nullFormValidation, (req, res) => {
    //
});

router.get("/edit", (req, res) => {
    //
});

router.post("/edit", nullFormValidation, (req, res) => {
    //
});

// Export
module.exports = router;