const nullFormValidation = (req, res, next) => {
    const errors = [];

    // Anti undefined/null/0 validation
    Object.keys(req.body).forEach(key => {
        if (!req.body[key])
            errors.push(`The category ${key} can't be empty.`);
    });

    req.body.errors = errors;
    next();
}

module.exports = nullFormValidation;