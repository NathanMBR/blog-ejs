// Modules
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

// Internal
const config = require("./configs/config");
const connection = require("./db/connection");
const flashMsg = require("./helpers/flashMsg");
//const error404 = require("./helpers/error404");

// Configs
app.set("view engine", "ejs");

app.use(session({
    secret: "notSoSecret",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(flashMsg);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static("public"));

//app.use(error404);

connection.authenticate().then(() => {
    console.log("Successfully connected to the database.");
}).catch(error => {
    console.log("An error occurred while trying to connect to the database. Error: ");
    console.log(error);
});

// Routes
const routes = {
    main: require("./routes/main"),
    admin: require("./routes/admin")
};

app.use("/", routes.main);
app.use("/admin", routes.admin);

// Listening
app.listen(config.PORT, () => {
    console.log(`Server online in localhost:${config.PORT} at ${new Date()}`);
});