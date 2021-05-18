const error404 = (req, res, next) => {
    res.status(404).render("main/404");
}

module.exports = error404;