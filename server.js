"use strict";

// enable dotenv package
require('dotenv').config();

// process.env.PORT in case Heroku
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";

// load npm packages
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const methodOverride = require('method-override');

// enable express app
const app = express();

// knex configurations
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);

// logging helper
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// ROUTES
// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// use ejs as a view engine
app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes,
//         yellow for client error codes, cyan for redirection codes,
//         and uncolored for all other codes.
app.use(morgan('dev'));

// MIDDLEWARES
// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// METHOD OVERRIDE for POST request
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));
// override with POST having ?_method=DELETE or UPDATE
app.use(methodOverride('_method'));

// ROUTES
// Mount routes
app.use('/', usersRoutes(knex));

// listen to port
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
