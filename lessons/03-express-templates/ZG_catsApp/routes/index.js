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
	res.render('list', data);
};

//create function is for the /cats/new route, creates a random cat, adds it to the fakeDatabase,
//and renders it
var create = function(req, res){
	var colorArray = ['Blue', 'Black', 'Green', 'Red', 'Yellow', 'Purple', 'Orange', 'White', 'Brown'];
	var nameArray = ['Filippos', 'Austin', 'Radmer', 'Sarah', 'Nitya', 'Anne', 'Dennis', 'Paige'];
	var color = colorArray[Math.floor(Math.random()*colorArray.length)]; 
	var name = nameArray[Math.floor(Math.random()*nameArray.length)];
	var age = Math.floor((Math.random()*101)+0.5);	//cats aged from 1 to 100, didn't want cats with age 0
	var data = {name: name, color: color, age:age};	//creates cat object
	db.add(data);
	data['context'] = 'Here is your new cat: ';
	res.render('indiv', data);
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