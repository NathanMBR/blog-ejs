// Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Models
const Category = require("./models/Category");
const Post = require("./models/Post");

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