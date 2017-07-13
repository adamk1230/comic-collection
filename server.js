// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");

//Passport Dependencies Additions
var session = require('express-session')
var passport = require('./config/passport')


// Set-up port
var PORT = process.env.PORT || 3000;
// Set up variable to call express module
var app = express();

// Requiring our models for syncing
var db = require("./models");

// Serves the public directory for access
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
}));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


//Sessions to keep track of user's login status

app.use(
    session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    })
)
app.use(passport.initialize())
app.use(passport.session())


// Import routes and give the server access to them.
var routes = require("./controller/comic_controller.js");

app.use("/", routes);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});