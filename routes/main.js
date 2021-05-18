const router = require("express").Router();

router.get("/", (req, res) => {
    res.redirect("/home");
});

router.get("/home", (req, res) => {
    res.render("main/home");
});

router.get("/404", (req, res) => {
    res.render("main/404");
});

module.exports = router;