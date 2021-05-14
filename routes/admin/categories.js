// Modules
const router = require("express").Router();

// Models
const Category = require("../../models/Category");

// Helper to write the paths
const pathBuilder = (category, path) => {
    const basePath = "admin/categories/";
    let prefix = "";

    if (category === "url")
        prefix = "/";

    return prefix + basePath + path;
}

// Routes
router.get("/", (req, res) => {
    res.redirect(pathBuilder("url", "all"));
});

router.get("/all", (req, res) => {
    Category.findAll().then(categories => {
        res.render(pathBuilder("render", "all"), {categories: categories});
    }).catch(error => {
        console.log("An error ocurred while trying to get data from the database. Error:");
        console.log(error);
        res.redirect("/admin/panel");
    });
});

router.get("/new", (req, res) => {
    res.render(pathBuilder("render", "new"));
});

router.post("/new", (req, res) => {
    const errors = [];

    // Anti undefined/null/0 validation
    Object.keys(req.body).forEach(key => {
        if (!req.body[key])
            errors.push({errorMsg: `The category ${key} can't be empty.`})
    });

    if (errors.length === 0) {
        Category.create({
            category: req.body.category,
            author: req.body.author
        }).then(() => {
            res.redirect(pathBuilder("url", "all"));
        }).catch(error => {
            console.log("An error ocurred while trying to save data in the database. Error: ");
            console.log(error);
        });
    } else {
        res.redirect(pathBuilder("url", "new"));
    }
});

router.get("/delete", (req, res) => {
    if (req.query["category"] && !isNaN(req.query["category"]) && !Array.isArray(req.query["category"])) {
        Category.findByPk(req.query["category"]).then(category => {
            res.render(pathBuilder("render", "delete"), {category: category});
        }).catch(error => {
            console.log("An error ocurred while trying to get data from the database. Error:");
            console.log(error);
        });
    } else {
        // Error msg
        res.redirect(pathBuilder("url", "all"));
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
            res.redirect(pathBuilder("url", "all"));
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to delete data from the database. Error:");
            console.log(error);
            res.redirect(pathBuilder("url", "all"));
        })
    } else {
        // Error msg
        res.redirect(pathBuilder("url", "all"));
    }
});

router.get("/edit", (req, res) => {
    if (req.query["category"] && !isNaN(req.query["category"]) && !Array.isArray(req.query["category"])) {
        Category.findByPk(req.query["category"]).then(category => {
            res.render(pathBuilder("render", "edit"), {category: category});
        }).catch(error => {
            // Error msg
            console.log("An error ocurred while trying to get data from the database. Error:");
            console.log(error);
        });
    } else {
        // Error msg
        res.redirect(pathBuilder("url", "all"));
    }
});

router.post("/edit", (req, res) => {
    if (req.body.id && !isNaN(req.body.id)) {
        Category.update({
            category: req.body.category
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            res.redirect(pathBuilder("url", "all"));
        }).catch(error => {})
    } else {
        // Error msg
        res.redirect(pathBuilder("url", "all"));
    }
});

module.exports = router;