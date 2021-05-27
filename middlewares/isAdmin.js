const isAdmin = (req, res, next) => {
    if (req.session.user.role > 0)
        next();
    else {
        req.flash("errorMsg", "You don't have permission to access this page.");
    }
}

module.exports = isAdmin;