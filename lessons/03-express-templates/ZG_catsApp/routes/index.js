var db = require('../fakeDatabase');

//home function is for the / route, displays the number of cats the user has
var home = function(req, res){
	numCats = db.getAll().length;
	if (numCats === 1){
		var data = {context: numCats.toString() + ' cat'};
	} else {
		var data = {context: numCats.toString() + ' cats'};
	}
	res.render('home', data);
};

//cats function is for the /cat route, displays the cats the user has created in order by age
var cats = function(req, res){
	db.sortData();	//function I added to fakeDatabase.js to sort the data before getting all of it
	var catsArray = db.getAll();
	var data = {cats: catsArray};

	if (catsArray.length){	//checks if user has cats or not
		data['context'] = 'Your cats are below: ';
	} else {
		data['context'] = 'Unfortunately you do not have any cats. Go and get some!';
	}
	/*
	This accomplishes the same thing as the if/else statement above:
		data.context = catsArray.length ? 'Your cats are below: ' : 'Unfortunately you do not...';
	
	1) Dot notation is fine (and conventional) here -- data.context, not data['context']
	2) The following pattern:
		var whatever = booleanExpression ? valueIfTrue : valueIfFalse;
	...is called "ternary logic" -- you might have seen it in other languages.

	I think either's fine -- just pointing it out because sometimes one pattern is much
	easier to think about or less complex than the other.
	*/
	res.render('list', data);
};

//create function is for the /cats/new route, creates a random cat, adds it to the fakeDatabase,
//and renders it
var create = function(req, res){
	var colorArray = ['Blue', 'Black', 'Green', 'Red', 'Yellow', 'Purple', 'Orange', 'White', 'Brown'];
	var nameArray = ['Filippos', 'Austin', 'Radmer', 'Sarah', 'Nitya', 'Anne', 'Dennis', 'Paige']; // :)
	var color = colorArray[Math.floor(Math.random()*colorArray.length)]; 
	var name = nameArray[Math.floor(Math.random()*nameArray.length)];
	var age = Math.floor((Math.random()*101)+0.5);	//cats aged from 1 to 100, didn't want cats with age 0
	var data = {name: name, color: color, age:age};	//creates cat object
	// Hypothetical question -- how could you have modularized your random cat generation?

	db.add(data);
	data['context'] = 'Here is your new cat: ';
	res.render('indiv', data); 
	/*
	I would give templates longer/more descriptive names -- not really a problem in this case
	because there are so few templates, but if there were a hundred templates and I were a coworker
	trying to add something to your app, I'd have to guess at what 'indiv' means.
	*/
};

//del function is for the /cats/delete/old route, sorts the cats, gets the oldest cat (last in the array),
//and deletes it
var del = function(req, res){
	db.sortData();
	var catsArray = db.getAll();

	if (catsArray.length){	//check if there are cats to delete
		var oldestIndex = catsArray.length - 1;
		var data = catsArray[oldestIndex];	//stored in data to display to the user the cat being sent to the farm
		db.remove(oldestIndex);
		data['context'] = 'Say goodbye to your oldest cat!';
	} else {	//no cats to delete
		data = {name: null, color: null, age: null};
		data['context'] = 'You do not have any cats to send to the farm right now. Go and get some!';
	}
	res.render('indiv', data);
};

//sortColor function is for the /cats/bycolor/:color route, gets all the cats, not necessarily sorted by age,
//filters to the color and displays them as a list
var sortColor = function(req, res){
	var catsArray = db.getAll();
	var filteredColor = req.params.color.toString();
	var resArray = catsArray.filter(function (cat) {
		return cat.color === filteredColor;
	});
	var data = {cats: resArray};
	data['context'] = 'Here are all of your cats that are color ' + filteredColor;
	res.render('list', data);
};

module.exports.cats = cats;
module.exports.create = create;
module.exports.del = del;
module.exports.sortColor = sortColor;
module.exports.home = home;
/*
This works fine when you have five routes, but imagine if there were twenty in this file... repetitive.
Usually I create a var routes = {}; at the beginning of the file, then each of the methods is
routes.sortColor = ... instead of var sortColor = ..., then at the end all you have to do is
module.exports = routes;

It's also completely okay just to do module.exports.sortColor = ... right when you define the function.
*/
