const isNotLogged = (req, res, next) => {
    if (req.session.user) {
        req.flash("warningMsg", "You're already logged in!");
        res.redirect("/home")
    } else
        next();
}

module.exports = isNotLogged;