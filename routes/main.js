// Modules
const router = require("express").Router();
const bcrypt = require("bcryptjs");

// Models
const Category = require("../models/Category");
const Post = require("../models/Post");
const User = require("../models/User");

// Helpers
const dateFormatter = require("../helpers/dateFormatter");
const hourFormatter = require("../helpers/hourFormatter");

// Middlewares
const isNotLogged = require("../middlewares/isNotLogged");
const nullFormValidation = require("../middlewares/nullFormValidation");
const isLogged = require("../middlewares/isLogged");

// Configs
const config = require("../configs/config");

// Routes
router.get("/", (req, res) => {
    res.redirect("/home");
});

router.get("/home", (req, res) => {
    let hasNextPage;
    let page = req.query["page"];
    if (!page || isNaN(page) || Array.isArray(page) || page <= 0)
        page = 1;
    
    const limit = 5;
    const offset = page => {
        return limit * (page - 1);
    }
    
    Post.findAndCountAll({
        where: {
            deleted: false
        },
        include: [{model: Category}],
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset(page)
    }).then(posts => {
        offset(page) + limit >= posts.count ?
            hasNextPage = false :
            hasNextPage = true;
        res.render("main/home", {posts: posts.rows, page: page, hasNextPage: hasNextPage, dateFormatter: dateFormatter, hourFormatter: hourFormatter});
    }).catch(error => {
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/404");
    });
});

router.get("/read", (req, res) => {
    res.redirect("/home");
});

router.get("/read/:slug", (req, res) => {
    Post.findOne({
        include: [
            {model: Category}
        ], where: {
            slug: req.params["slug"]
        }
    }).then(post => {
        if (post)
            res.render("main/read", {post: post, commentaries: [], dateFormatter: dateFormatter, hourFormatter: hourFormatter});
        else {
            req.flash("errorMsg", "Post not found.");
            res.redirect("/home");
        }
    }).catch(error => {
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/home");
    });
});

router.get("/signup", isNotLogged, (req, res) => {
    res.render("main/signup", {minUsernameSize: config.minUsernameSize, minPasswordSize: config.minPasswordSize});
});

router.post("/signup", isNotLogged, nullFormValidation, async (req, res) => {
    const regExp = /[^a-zA-Z\d]/g;

    if (req.body.username.match(regExp))
        req.body.errors.push("Invalid username (it must contain only alphanumerical characters).");

    if (req.body.username.length < config.minUsernameSize)
        req.body.errors.push(`The username is too short (it must have at least ${config.minUsernameSize} characters).`);

    if (req.body.email !== req.body["confirm-email"])
        req.body.errors.push("The e-mails aren't equal.");

    if (req.body.password.length < config.minPasswordSize && req.body["confirm-password"].length < config.minPasswordSize)
        req.body.errors.push(`The password is too short (it must have at least ${config.minPasswordSize} characters).`);

    if (req.body.password !== req.body["confirm-password"])
        req.body.errors.push("The passwords aren't the same.");

    try {
        const usernameSearch = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        const emailSearch = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (usernameSearch)
            req.body.errors.push("This username is already registered. Please, choose a different one.");

        if (emailSearch)
            req.body.errors.push("This e-mail is already registered. Please, choose a different one.");
    } catch(error) {
        req.flash("An internal error has occurred. Please, try again.");
        console.log("An error ocurred while trying to get data from the database. Error: ");
        console.log(error);
        res.redirect("/home");
    }
    
    if (req.body.errors.length === 0) {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12))
        }).then(() => {
            req.flash("successMsg", "Account successfully created!");
            res.redirect("/home");
        }).catch((error) => {
            req.flash("errorMsg", "An internal error has occurred. Please, try again.");
            console.log("An error occurred while trying to save data into the database. Error: ");
            console.log(error);
        });
    } else {
        req.flash("errorMsg", req.body.errors);
        res.redirect("/signup");
    }
});

router.get("/login", isNotLogged, (req, res) => {
    res.render("main/login");
});

router.post("/login", isNotLogged, (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
                req.flash("successMsg", "Successfully logged in!");
                res.redirect("/home");
            } else {
                req.flash("errorMsg", "Incorrect password.");
                res.redirect("/login");
            }
        } else {
            req.flash("errorMsg", "User not found.");
            res.redirect("/login");
        }
    }).catch(error => {
        req.flash("errorMsg", "An internal error has occurred. Please, try again.");
        res.redirect("/login");
    });
});

router.get("/logout", isLogged, (req, res) => {
    req.session.user = undefined;
    req.flash("successMsg", "Successfully logged out!");
    res.redirect("/home");
});

// Export
module.exports = router;