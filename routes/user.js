const router = require("express").Router();
const User = require("../models/User");

router.get("/", (req, res) => {
    res.redirect("/home");
});

module.exports = router;