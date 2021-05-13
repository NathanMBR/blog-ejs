const router = require("express").Router();

router.get("/", (req, res) => {
    res.redirect("/home");
});

router.get("/home", (req, res) => {
    res.render("main/home");
});

module.exports = router;