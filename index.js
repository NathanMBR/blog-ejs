// Modules
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

// Internal
const config = require("./configs/config");
const connection = require("./db/connection");
const flashMsg = require("./helpers/flashMsg");
const isLogged = require("./middlewares/isLogged");
const isAdmin = require("./middlewares/isAdmin");

// Configs
app.set("view engine", "ejs");

app.use(session({
    secret: "notSoSecret",
    cookie: {
        maxAge: 2592000000
    },
    resave: true,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});
app.use(flash());
app.use(flashMsg);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static("public"));

connection.authenticate().then(() => {
    console.log("Successfully connected to the database.");
}).catch(error => {
    console.log("An error occurred while trying to connect to the database. Error: ");
    console.log(error);
});

// Routes
const routes = {
    main: require("./routes/main"),
    admin: require("./routes/admin"),
    user: require("./routes/user")
};

app.use("/", routes.main);
app.use("/admin", isLogged, isAdmin, routes.admin);
app.use("/user", routes.user);

app.all("/*", (req, res) => {
    res.status(404).render("main/404");
});

// Listening
app.listen(config.PORT, () => {
    console.log(`Server online in localhost:${config.PORT} at ${new Date()}`);
});