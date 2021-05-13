const router = require("express").Router();
const adminRoutes = {
    categories: require("./admin/categories")
};

router.get("/", (req, res) => {
    res.redirect("/admin/panel");
});

router.get("/panel", (req, res) => {
    res.render("admin/panel");
});

router.use("/categories", adminRoutes.categories);

module.exports = router;