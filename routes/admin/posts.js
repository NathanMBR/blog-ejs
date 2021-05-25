// Modules
const router = require("express").Router();
const Sequelize = require("sequelize");
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
                req.flash("errorMsg", "An internal error has occurred. Please, try again.");
                console.log("An error occurred while trying to access data from the database. Error: ");
                console.log(error);
                res.redirect("/admin/posts/all");
            }

            if (category)
                queryObject.where.categoryId = categoryId;
            else {
                req.flash("errorMsg", "Category not found.");
                res.redirect("/admin/posts/all");
            }
        } else {
            req.flash("errorMsg", "Invalid parameter.");
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
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        console.log("An error occurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/posts/all");
    });
});

router.get("/new", (req, res) => {
    Category.findAll({
        where: {
            deleted: false
        },
        order: [
            ["category", "ASC"]
        ]
    }).then(categories => {
        if (categories.length > 0)
            res.render("admin/posts/new", {categories: categories});
        else {
            req.flash("errorMsg", "There isn't any categories created. Please create a category to access the post creation page.");
            res.redirect("/admin/categories/new");
        }
    }).catch(error => {
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        console.log("An error occurred while trying to load data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/posts/all");
    });
});

router.post("/new", nullFormValidation, async (req, res) => {
    // Duplicate slug validation
    await Post.findOne({where: {
        slug: slugify(req.body.title.toLowerCase())
    }}).then(post => {
        if (post)
            req.body.errors.push("There's already a post with this title.");
    }).catch(error => {
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        console.log("An error occurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/admin/posts/all");
    });

    if (req.body.category <= 0)
        req.body.errors.push("Please, choose a category.");

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
                req.flash("successMsg", "The post was successfully created!");
                res.redirect("/admin/posts/all");
            }).catch(error => {
                req.flash("errorMsg", "An internal error has occurred. Please, try again.");
                console.log("An error occurred while trying to save data in the database. Error: ");
                console.log(error);
                res.redirect("/admin/posts/all");
            });
        } else {
            req.flash("errorMsg", "There isn't any categories created. Please create a category to access the post creation page.");
            res.redirect("/admin/categories/new");
        }
    } else {
        req.flash("errorMsg", req.body.errors);
        res.redirect("/admin/posts/new");
    }
});

router.get("/delete", (req, res) => {
    if (req.query["post"] && !isNaN(req.query["post"]) && !Array.isArray(req.query["post"])) {
        Post.findByPk(req.query["post"]).then(post => {
            if (post)
                res.render("admin/posts/delete", {post: post, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
            else {
                req.flash("errorMsg", "Post not found.");
                res.redirect("/admin/posts/all");
            }
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to get data from the database. Error: ");
            console.log(error);
            res.redirect("/admin/posts/all");
        });
    } else {
        req.flash("errorMsg", "Invalid parameter.");
        res.redirect("/admin/posts/all");
    }
});

router.post("/delete", nullFormValidation, (req, res) => {
    if (!isNaN(req.body.id)) {
        Post.update({
            deleted: true
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.flash("successMsg", "The post was successfully deleted!");
            res.redirect("/admin/posts/all");
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to update data from the database. Error: ");
            console.log(error);
            res.redirect("/admin/posts/all");
        });
    } else {
        req.flash("errorMsg", "Invalid ID.");
        res.redirect("/admin/posts/all");
    }
});

router.get("/edit", (req, res) => {
    if (req.query["post"] && !isNaN(req.query["post"]) && !Array.isArray(req.query["post"])) {
        Category.findAll({
            where: {
                deleted: false
            }
        }).then(categories => {
            if (categories.length > 0) {
                Post.findByPk(req.query["post"]).then(post => {
                    if (post)
                        res.render("admin/posts/edit", {post: post, categories: categories, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
                    else {
                        req.flash("errorMsg", "Post not found.");
                        res.redirect("/admin/posts/all");
                    }
                }).catch(error => {
                    req.flash("errorMsg", "An internal error has occurred. Please, try again.");
                    console.log("An error occurred while trying to get data from the database. Error: ");
                    console.log(error);
                    res.redirect("/admin/posts/all");
                });
            } else {
                req.flash("errorMsg", "There isn't any categories created. Please create a category to access the post edition page.");
                res.redirect("/admin/categories/new");
            }
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to get data from the database. Error: ");
            console.log(error);
            res.redirect("/admin/posts/all");
        });
    } else {
        req.flash("errorMsg", "Invalid parameter.");
        res.redirect("/admin/posts/all");
    }
});

router.post("/edit", nullFormValidation, (req, res) => {
    if (isNaN(req.body.id))
        req.body.errors.push("Invalid parameter.");

    if (req.body.category <= 0)
        req.body.errors.push("Please choose a category.");
    Post.findOne({
        where: {
            slug: slugify(req.body.title.toLowerCase()),
            id: {[Sequelize.Op.notIn]: [req.body.id]},
            deleted: false
        }
    }).then(post => {
        if (post)
            req.body.errors.push("There's already a post with this title.");

        if (req.body.errors.length === 0) {
            Post.update({
                title: req.body.title,
                description: req.body.description,
                post: req.body.post,
                slug: slugify(req.body.title.toLowerCase())
            }, {
                where: {
                    id: req.body.id
                }
            }).then(() => {
                req.flash("successMsg", "The post was successfully edited!");
                res.redirect("/admin/posts/all");
            }).catch(error => {
                req.flash("errorMsg", "An internal error has occurred. Please, try again.");
                console.log("An error occurred while trying to get data from the database. Error: ");
                console.log(error);
            });
        } else {
            req.flash("errorMsg", req.body.errors);
            res.redirect(`/admin/posts/edit?post=${req.body.id}`);
        }
    }).catch(error => {
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        console.log("An error occurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect
    });
});

router.get("/read", (req, res) => {
    if (req.query["post"] && !isNaN(req.query["post"]) && !Array.isArray(req.query["post"])) {
        Post.findOne({
            include: [{model: Category}],
            where: {
                id: req.query["post"],
                deleted: false
            }
        }).then(post => {
            if (post)
                res.render("admin/posts/read", {post: post, commentaries: [], dateFormatter: dateFormatter, hourFormatter: hourFormatter});
            else {
                req.flash("errorMsg", "Post not found.");
                res.redirect("/admin/posts/all");
            }
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to get data from the database. Error: ");
            console.log(error);
        });
    } else {
        req.flash("errorMsg", "Invalid parameter.");
        res.redirect("/admin/posts/all");
    }
});

// Export
module.exports = router;