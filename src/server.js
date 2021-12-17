const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { pool } = require('./dbConfig');


const initializePassport = require('./passportConfig');
initializePassport(passport);

// middle ware------------------
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
app.use(session({secret: "secret", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
//------------------------------
app.locals.color_choice = "rgb(29, 28, 36)";
app.locals.card_color = "white";
app.locals.picture_src = "../../resources/images/default_profile.png";
app.locals.bet_amount = 0;
app.locals.bet_placed = false;

app.get('/', function(req, res) {
  res.redirect('../signin');
});
// sign in page
app.get('/signin', checkAuthenticated, function(req, res) {
  res.render('pages/signin');
});

// sign up page
app.get('/signup', checkAuthenticated, function(req, res) {
  res.render('pages/signup');
});

// game page
app.get('/home', checkNotAuth, function(req, res) {
  res.render('pages/gamePage', {
    user: req.user,
    color_choice: req.app.locals.color_choice,
    card_color: req.app.locals.card_color,
    picture_src: req.app.locals.picture_src
  });
});

//shop page
app.get('/shop', checkNotAuth, function(req, res) {
  res.render('pages/shop', {
    user: req.user,
    color_choice: req.app.locals.color_choice,
    card_color: req.app.locals.card_color,
    picture_src: req.app.locals.picture_src
  });
});

// Profile Page
app.get('/profile', checkNotAuth, function(req, res) {
  var userId = req.user.id;
  pool.query(
    `select name, type, imgsrc from items where player_id=$1;`, [userId], (err, results) => {
      if (err) {
        res.render('pages/profilePage', {
          user: req.user,
          color_choice: req.app.locals.color_choice,
          card_color: req.app.locals.card_color,
          picture_src: req.app.locals.picture_src
        });
      } else {
        console.log(results.rows);
        res.render('pages/profilePage', {
          user: req.user,
          color_choice: req.app.locals.color_choice,
          card_color: req.app.locals.card_color,
          picture_src: req.app.locals.picture_src,
          items: results.rows
        });
      }
    }
  );
  
});
//logout
app.get('/signout', function(req, res) {
  req.logOut();
  res.redirect('../signin');
});

//signup post
app.post('/signup', function(req, res) {
  var username = req.body.username
  var email = req.body.email;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;

  console.log(username, email, password, confirmPassword);

  var errors = [];

  if (!username || !email || !password || !confirmPassword) {
    errors.push({message: "Please enter all fields"});
  }

  if (password.length < 6) {
    errors.push({message: "Enter a password longer than 6 characters"});
  }

  if (password != confirmPassword) {
    errors.push({message: "Passwords are different"});
  }

  if (errors.length > 0) {
    res.render('pages/signup', {errors});
  } else {
    //Validation passed
    pool.query(
      `select * from players where email = $1`, [email], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        if (results.rows.length > 0) {
          errors.push({message: "Player already exists, enter an email that has not been used"});
          res.render('pages/signup', {errors});
        } else {
          pool.query(
            `insert into players (username, email, password) values ($1, $2, $3) returning id, password`, [username, email, password], (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              res.redirect('../signin');
            }
          );
        }
      }
    );
  }
});

//sign in post
app.post('/signin', passport.authenticate('local', {
  successRedirect: '../home',
  failureRedirect: '../signin'
}));

app.post('/bet', function(req, res) {
  if (req.body.bet_amount != "") {
    if (req.app.locals.bet_placed == false) {
      var bet_amount = req.body.bet_amount;
      req.app.locals.bet_amount = bet_amount;
      var userId = req.user.id;
      pool.query(
        `select currency_owned from players where id=$1;`, [userId], (err, results) => {
          if (err) {
            throw err;
          }
          
          if (results.rows[0].currency_owned >= bet_amount) {
            pool.query(
              `update players set currency_owned = currency_owned - $1 where id = $2 returning currency_owned;`, [bet_amount, userId], (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                req.app.locals.bet_placed = true;
              }
            );
          }
        }
      );
    }
    console.log(bet_amount);
    res.redirect('../home');
  }
});

//winner post
app.post('/finishedgame', function (req, res) {
  var winner = req.body.winner;
  var userId = req.user.id;
  
  if (winner==0) {
    pool.query(
      `update players set wins = wins + 1 where id = $1 returning wins;`, [userId], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
      }
    );
    if (req.app.locals.bet_placed==true) {
      pool.query(
        `update players set currency_owned = currency_owned + $1 where id = $2 returning currency_owned;`, [(req.app.locals.bet_amount*2), userId], (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.rows);
        }
      );
    } else {
      pool.query(
        `update players set currency_owned = currency_owned + 10 where id = $1 returning currency_owned;`, [userId], (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.rows);
        }
      );
    }
    
  }
  if (winner==1) {
    pool.query(
      `update players set losses = losses + 1 where id = $1 returning losses;`, [userId], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
      }
    );
  }
  if (winner==2 || winner==1) {
    pool.query(
      `update players set currency_owned = currency_owned + 10 where id = $1 returning currency_owned;`, [userId], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
      }
    );
  }
  pool.query(
    `update players set games_played = games_played + 1 where id = $1 returning games_played;`, [userId], (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
    }
  );
  //give 10 currency if they lose or a tie
  req.app.locals.bet_placed = false;
  req.app.locals.bet_amount = 0;
  setTimeout(function() { res.redirect('../home'); }, 1400);
});



app.post('/buy_background', function(req, res) {
  var color_choice = req.body.bgCOLOR;
  var picture_src = req.body.picture_src;
  var userId = req.user.id;
  var currency = req.user.currency_owned;
  
  console.log(color_choice);

  if(currency >= 10){
    req.app.locals.color_choice = color_choice;
    pool.query(
      `select name from items where player_id = $1`, [userId], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        var duplicate = false;
        results.rows.forEach(item => {
          if (item.name == color_choice) {
            duplicate = true;
          }
        });
        if(!duplicate) {
          pool.query(
            `update players set currency_owned = currency_owned - 10 where id = $1 returning currency_owned;`, [userId], (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
            }
          );
          pool.query(
            `INSERT INTO items(player_id, name, cost, type, imgsrc) VALUES($1, $2, '10', 'background', $3) RETURNING *;`, [userId, color_choice, picture_src], (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
            }
          );
        }
      }
    );
    res.redirect('../shop');
  }
});

app.post('/buy_card', function(req, res) {
  var card_color = req.body.cardColor;
  var picture_src = req.body.picture_src;
  var userId = req.user.id;
  var currency = req.user.currency_owned;
  
  console.log(card_color);

  if(currency >= 10){
    pool.query(
      `select name from items where player_id = $1`, [userId], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        var duplicate = false;
        results.rows.forEach(item => {
          if (item.name == card_color) {
            duplicate = true;
          }
        });
        if(!duplicate) {
          req.app.locals.card_color = card_color;
          pool.query(
            `update players set currency_owned = currency_owned - 10 where id = $1 returning currency_owned;`, [userId], (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
            }
          );
          pool.query(
            `INSERT INTO items(player_id, name, cost, type, imgsrc) VALUES($1, $2, '10', 'card', $3) RETURNING *;`, [userId, card_color, picture_src], (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
            }
          );
        }
      }
    );
    res.redirect('../shop');
    
  }
});

app.post('/buy_profile', function(req, res) {
  var picture_src = req.body.picture_src;
  var userId = req.user.id;
  var currency = req.user.currency_owned;
  
  console.log(picture_src);

  if(currency >= 10){
    pool.query(
      `select name from items where player_id = $1`, [userId], (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        var duplicate = false;
        results.rows.forEach(item => {
          if (item.name == picture_src) {
            duplicate = true;
          }
        });
        if(!duplicate) {
          req.app.locals.picture_src = picture_src;
          pool.query(
            `update players set currency_owned = currency_owned - 10 where id = $1 returning currency_owned;`, [userId], (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
            }
          );
          pool.query(
            `INSERT INTO items(player_id, name, cost, type, imgsrc) VALUES($1, $2, '10', 'profile', $3) RETURNING *;`, [userId, picture_src, picture_src], (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
            }
          );
        }
      }
    );
    res.redirect('../shop');
    
  }
});

app.post('/select_background', function(req, res) {
  var color_choice = req.body.bgCOLOR;
  req.app.locals.color_choice = color_choice;
  console.log(color_choice);

  res.redirect('../profile');
});

app.post('/select_profile', function(req, res) {
  var picture_src = req.body.picture_src;
  req.app.locals.picture_src = picture_src;
  console.log(picture_src);

  res.redirect('../profile');
});

app.post('/select_card', function(req, res) {
  var card_color = req.body.cardColor;
  req.app.locals.card_color = card_color;
  console.log(card_color);

  res.redirect('../profile');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('../home');
  }
  next();
}
function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('../signin');
}

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});