// Modules
const router = require("express").Router();

// Routes
const adminRoutes = {
    categories: require("./admin/categories"),
    posts: require("./admin/posts")
};

router.get("/", (req, res) => {
    res.redirect("/admin/panel");
});

router.get("/panel", (req, res) => {
    res.render("admin/panel");
});

router.get("/panel/configurations", (req, res) => {
    res.send('<span>Não era pra tu ter clicado aqui D: <a href="/admin/panel">Por favor volta</a></span>');
});

router.use("/categories", adminRoutes.categories);
router.use("/posts", adminRoutes.posts);

// Export
module.exports = router;