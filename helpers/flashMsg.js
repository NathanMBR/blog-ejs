const flashMsg = (req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.warningMsg = req.flash("warningMsg");
    res.locals.errorMsg = req.flash("errorMsg");
    next();
};

module.exports = flashMsg;