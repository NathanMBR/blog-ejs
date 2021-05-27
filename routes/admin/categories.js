// Modules
const router = require("express").Router();

// Models
const Category = require("../../models/Category");

// Helpers
const dateFormatter = require("../../helpers/dateFormatter");
const hourFormatter = require("../../helpers/hourFormatter");

// Middlewares
const nullFormValidation = require("../../middlewares/nullFormValidation");

// Routes
router.get("/", (req, res) => {
    res.redirect("/admin/categories/all");
});

router.get("/all", (req, res) => {
    Category.findAll({
        where: {
            deleted: false
        },
        order: [["category", "ASC"]]
    }).then(categories => {
        res.render("admin/categories/all", {categories: categories, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
    }).catch(error => {
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        console.log("An error occurred while trying to get data from the database. Error:");
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
            author: "System Admin"
        }).then(() => {
            req.flash("successMsg", "The category was successfully created!");
            res.redirect("/admin/categories/all");
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to save data in the database. Error: ");
            console.log(error);
        });
    } else {
        req.flash("errorMsg", req.body.errors);
        res.redirect("/admin/categories/new");
    }
});

router.get("/delete", (req, res) => {
    if (req.query["category"] && !isNaN(req.query["category"]) && !Array.isArray(req.query["category"])) {
        Category.findByPk(req.query["category"]).then(category => {
            if (category)
                res.render("admin/categories/delete", {category: category, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
            else {
                req.flash("errorMsg", "Category not found.");
                res.redirect("/admin/categories/all");                
            }
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to get data from the database. Error:");
            console.log(error);
        });
    } else {
        req.flash("errorMsg", "Invalid parameter.");
        res.redirect("/admin/categories/all");
    }
});

router.post("/delete", nullFormValidation, (req, res) => {
    if (!isNaN(req.body.id) && req.body.errors.length === 0) {
        Category.update({
            deleted: true
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.flash("successMsg", "The category was successfully deleted!");
            res.redirect("/admin/categories/all");
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to delete data from the database. Error:");
            console.log(error);
            res.redirect("/admin/categories/all");
        })
    } else {
        req.flash("errorMsg", "Invalid ID.");
        res.redirect("/admin/categories/all");
    }
});

router.get("/edit", (req, res) => {
    if (req.query["category"] && !isNaN(req.query["category"]) && !Array.isArray(req.query["category"])) {
        Category.findByPk(req.query["category"]).then(category => {
            if (category)
                res.render("admin/categories/edit", {category: category, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
            else {
                req.flash("errorMsg", "Category not found.");
                res.redirect("/admin/categories/all");
            }
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to get data from the database. Error:");
            console.log(error);
            res.redirect("/admin/categories/all");
        });
    } else {
        req.flash("errorMsg", "Invalid parameter.");
        res.redirect("/admin/categories/all");
    }
});

router.post("/edit", nullFormValidation, (req, res) => {
    if (!isNaN(req.body.id) && req.body.errors.length === 0) {
        Category.update({
            category: req.body.category
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.flash("successMsg", "The category was successfully edited!");
            res.redirect("/admin/categories/all");
        }).catch(error => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to update data from the database. Error: ");
            console.log(error);
            res.redirect("/admin/categories/all");
        })
    } else {
        req.flash("errorMsg", "Invalid ID.");
        res.redirect(`/admin/categories/edit?category=${req.body.id}`);
    }
});

// Export
module.exports = router;