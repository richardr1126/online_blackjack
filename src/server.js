// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');
require('dotenv').config({ path: './.env' });

const isProduction = process.env.NODE_ENV === "production";

// // Heroku Postgres patch for v10
// // fixes: https://github.com/vitaly-t/pg-promise/issues/711
// if (isProduction) {
//   pgp.pg.defaults.ssl = {rejectUnauthorized: false};
// }

const { Pool } = require("pg");
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {isProduction, rejectUnauthorized: false}
});

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

app.get('/', function(req, res) {
  res.render('pages/main');
});

app.get('/reviews', function(req, res) {
  pool.query(
    `select cocktail_title, review, review_date from drink_reviews;`, (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      res.render('pages/reviews', {
        reviews: results.rows
      });
    }
  );
});

app.get('/reviews/filter', function(req, res) {
  var drinkName = req.query.name;
  console.log(drinkName);
  pool.query(
    `select cocktail_title, review, review_date from drink_reviews where lower(cocktail_title)=lower($1);`, [drinkName], (err, results) => {
      if (err) {
        throw err;
      }
      //console.log(results.rows);
      if (results.rows.length > 0) {
        res.render('pages/reviews', {
          reviews: results.rows
        });
      } else {
        res.redirect("/reviews");
      }
    }
  );
});


app.post('/search-result', function(req, res) {
  var drinkName = req.body.drinkName; //TODO: Remove null and fetch the param (e.g, req.body.param_name); Check the NYTimes_home.ejs file or console.log("request parameters: ", req) to determine the parameter names

  if (drinkName) {
    axios({
      url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`,
      method: 'GET',
      dataType: 'json',
    })
      .then(items => {
        var drink = {
          name: items.data.drinks[0].strDrink,
          picture: items.data.drinks[0].strDrinkThumb,
          alcoholic: items.data.drinks[0].strAlcoholic,
          glass: items.data.drinks[0].strGlass,
          instructions: items.data.drinks[0].strInstructions
        }
        console.log(drink);
        
        res.render('pages/main', {
          drink: drink,
        })
      })
      .catch(error => {
        console.log(error);
        res.render('pages/main')
      });
  }
});

app.post('/submit_review', function(req, res) {
  if (req.body.review != "") {
    var review = req.body.review;
    var cocktailName = req.body.cocktailName;
    var review_date = new Date().toLocaleDateString();
    pool.query(
      `INSERT INTO drink_reviews(cocktail_title, review, review_date) VALUES($1, $2, $3) RETURNING *;`, [cocktailName, review, review_date], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
      }
    );
    setTimeout(function() { res.redirect('/reviews'); }, 200);
  }
});
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
module.exports = server;
