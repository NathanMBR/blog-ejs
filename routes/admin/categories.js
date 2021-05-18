// Modules
const router = require("express").Router();

// Models
const Category = require("../../models/Category");

// Helpers
const nullFormValidation = require("../../helpers/nullFormValidation");
const dateFormatter = require("../../helpers/dateFormatter");
const hourFormatter = require("../../helpers/hourFormatter");

// Routes
router.get("/", (req, res) => {
    res.redirect("/admin/categories/all");
});

router.get("/all", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/all", {categories: categories, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
    }).catch(error => {
        // Error msg
        console.log("An error ocurred while trying to get data from the database. Error:");
        console.log(error);
        res.redirect("/admin/panel");
    });
});

router.get("/new", (req, res) => {
    res.render("admin/categories/new");
});

router.post("/new", nullFormValidation, (req, res) => {
    if (req.body.errors.length === 0) {
        Category.create({
            category: req.body.category,
            author: req.body.author
        }).then(() => {
            res.redirect("/admin/categories/all");
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to save data in the database. Error: ");
            console.log(error);
        });
    } else {
        // Error msg
        res.redirect("/admin/categories/new");
    }
});

router.get("/delete", (req, res) => {
    if (req.query["category"] && !isNaN(req.query["category"]) && !Array.isArray(req.query["category"])) {
        Category.findByPk(req.query["category"]).then(category => {
            if (category)
                res.render("admin/categories/delete", {category: category, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
            else
                res.redirect("/404");
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to get data from the database. Error:");
            console.log(error);
        });
    } else {
        // Error msg
        res.redirect("/admin/categories/all");
    }
});

router.post("/delete", (req, res) => {
    if (req.body.id && !isNaN(req.body.id)) {
        Category.destroy({
            where: {
                id: req.body.id
            }
        }).then(() => {
            // Success msg
            res.redirect("/admin/categories/all");
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to delete data from the database. Error:");
            console.log(error);
            res.redirect("/admin/categories/all");
        })
    } else {
        // Error msg
        res.redirect("/admin/categories/all");
    }
});

router.get("/edit", (req, res) => {
    if (req.query["category"] && !isNaN(req.query["category"]) && !Array.isArray(req.query["category"])) {
        Category.findByPk(req.query["category"]).then(category => {
            if (category)
                res.render("admin/categories/edit", {category: category, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
            else
                res.redirect("/404");
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to get data from the database. Error:");
            console.log(error);
            res.redirect("/admin/categories/all");
        });
    } else {
        // Error msg
        res.redirect("/admin/categories/all");
    }
});

router.post("/edit", nullFormValidation, (req, res) => {
    if (req.body.id && !isNaN(req.body.id) && req.body.errors.length === 0) {
        Category.update({
            category: req.body.category
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            // Success msg
            res.redirect("/admin/categories/all");
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to update data from the database. Error: ");
            console.log(error);
            res.redirect("/admin/categories/all");
        })
    } else {
        // Error msg
        res.redirect(`/admin/categories/edit?category=${req.body.id}`);
    }
});

module.exports = router;