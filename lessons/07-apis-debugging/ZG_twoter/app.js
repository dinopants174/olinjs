var express = require('express');
var index = require('./routes/index');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var auth = require('./oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;

mongoose.connect('mongodb://localhost/twoterDb'); //name of db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // ensures that server is connected to db
  console.log("We're connected to database!");
});
//setting up the facebook strategy
passport.use(new FacebookStrategy({
    clientID: auth.facebook.clientID,
    clientSecret: auth.facebook.clientSecret,
    callbackURL: auth.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  	done(null, profile);	//I tried to serialize my own user object found in my db, not the profile, found that doing so broke persistence
  }
));


var app = express();
//if passport handles sessions, I'm not entirely sure why we still set up express-sessions
app.use(session({ 
  secret: 'superS3CRE7',
  resave: false,
  saveUninitialized: false ,
  cookie: {}
}));
//passport serializes and deserializes the user when creating and destroying a session (ie when the user logs in or out)
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.get('/', ensureAuthenticated, index.home);
app.post('/postTwote', index.postTwote);
app.post('/postDelete', index.postDelete);
app.get('/login', index.logIn);
app.get("/logout", index.logOut);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' })
);

app.listen(3000);

//if the user is authenticated, then we can direct them to the home page, else we can go back to log in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  } else {
  	res.redirect("/login")
  }
}




