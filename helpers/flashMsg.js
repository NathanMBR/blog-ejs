const flashMsg = (req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.warningMsg = req.flash("warningMsg");
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.teste = req.flash("teste");
    next();
};

module.exports = flashMsg;