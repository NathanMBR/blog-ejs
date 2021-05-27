const isLogged = (req, res, next) => {
    if (!req.session.user) {
        req.flash("warningMsg", "You must be logged in to access this page.");
        res.redirect("/login");
    } else
        next();
}

module.exports = isLogged;