var express = require('express');
var index = require('./routes/index');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var db = require('./fakeDatabase');

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

app.listen(3000);
