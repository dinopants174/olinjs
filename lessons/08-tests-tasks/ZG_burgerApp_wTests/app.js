var express = require('express');
var index = require('./routes/index');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/burgerApp'); //name of db

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // ensures that server is connected to db
  console.log("We're connected to database!");
});


var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes for ingredients page, gets and displays ingredients, adds ingredients,
//marks ingredients out of stock, and edits ingredients
app.get('/ingredients', index.ingredients);
app.post('/postIngredient', index.postIngredient);
app.post('/postStock', index.postStock);
app.post('/postEdit', index.postEdit);
//routes for orders page, gets and displays ingredients for user to order,
//posts order to database and alerts user order successfully placed
app.get('/order', index.order);
app.post('/postOrder', index.postOrder);
//routes for kitchen page, gets and displays orders, marks orders when completed
app.get('/kitchen', index.kitchen);
app.post('/postCompleted', index.postCompleted);

app.listen(3000);

module.exports = app;