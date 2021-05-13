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
    res.render(pathBuilder("render", "all"));
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

module.exports = router;