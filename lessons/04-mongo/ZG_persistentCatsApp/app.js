var express = require('express');
var index = require('./routes/index');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var app =  express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//below are my routes and the respective functions they call in ./routes/index.js
app.get('/', index.home)
app.get('/cats', index.cats);
app.get('/cats/new', index.create);
app.get('/cats/delete/old', index.del);
app.get('/cats/bycolor/:color', index.sortColor);
app.get('/cats/byname/:name', index.sortName);
app.get('/cats/byage/:age', index.sortAge);

app.listen(3000);
