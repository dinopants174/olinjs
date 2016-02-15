var express = require('express');
var index = require('./routes/index');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var User = require('./models/userModel.js');
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

passport.use(new FacebookStrategy({
    clientID: auth.facebook.clientID,
    clientSecret: auth.facebook.clientSecret,
    callbackURL: auth.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  	done(null, profile);
  }
));


var app = express();

app.use(session({ 
  secret: 'superS3CRE7',
  resave: false,
  saveUninitialized: false ,
  cookie: {}
}));

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

app.get('/', ensureAuthenticated, index.home);
app.post('/postTwote', index.postTwote);
app.get('/login', index.logIn);
// app.get('/feed', index.logIn);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' })
);

app.get('/user', ensureAuthenticated, function(req, res) {
  res.send(req.user);
})

app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  } else {
  	res.redirect("/login")
  }
    // res.send(401);
}




