// Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Internal
const config = require("./configs/config");
const connection = require("./db/connection");

// Configs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

connection.authenticate().then(() => {
    console.log("Successfully connected to the database.");
}).catch(error => {
    console.log("An error ocurred while trying to connect to the database. Error: ");
    console.log(error);
});
// Routes

app.get("/", (req, res) => {
    res.redirect("/home");
});
// Separe this in new file
app.get("/home", (req, res) => {
    res.render("main/home");
});

// Listening
app.listen(config.PORT, () => {
    console.log(`Server online at localhost:${config.PORT}`);
});