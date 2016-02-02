var Cat = require('../models/catModel.js');

//home function is for the / route, displays the number of cats the user has
var home = function(req, res){
	Cat.find({}, function(err, cats){
		numCats = cats.length;
		if (numCats == 1){
			var data = {context: numCats.toString() + ' cat'};
		} else {
			var data = {context: numCats.toString() + ' cats'};
		}
		res.render('home', data);
	});
};

//cats function is for the /cat route, displays the cats the user has created in order by age
var cats = function(req, res){
	Cat.find({}, function(err, cats){
		// cats.sort(function(a,b){
		// 	return a.age - b.age;
		// });
		var data = {cats: cats};
		if (cats.length){
			data['context'] = 'Your cats are below: ';
		} else {
			data['context'] = 'Unfortunately you do not have any cats. Go and get some!';
		}
		res.render('list', data);
	}).sort({age: 1});	//sorts in ascending order
};

//create function is for the /cats/new route, creates a random cat, adds it to MongoDB,
//and renders it
var create = function(req, res){
	var colorArray = ['Blue', 'Black', 'Green', 'Red', 'Yellow', 'Purple', 'Orange', 'White', 'Brown'];
	var nameArray = ['Filippos', 'Austin', 'Radmer', 'Sarah', 'Nitya', 'Anne', 'Dennis', 'Paige'];
	var color = colorArray[Math.floor(Math.random()*colorArray.length)]; 
	var name = nameArray[Math.floor(Math.random()*nameArray.length)];
	var age = Math.floor((Math.random()*101)+1);	//cats aged from 1 to 100, didn't want cats with age 0
	var cat = new Cat({name: name, color: color, age:age});
	cat.save(function(err, cat){
		if (err){
			res.sendStatus(500);	//sends status to browser if error
			console.log("Error: ", err);
		} else {
			var data = {cat: cat};
			data['context'] = 'Here is your new cat: ';
			res.render('indiv', data);
		}
	});
};

//del function is for the /cats/delete/old route, sorts the cats so the oldest is the first one,
//and deletes it
var del = function(req, res){
	Cat.findOneAndRemove({}, {sort: {age: -1}}, function(err, cat){	//sorts in descending order by age so that the first one is the oldest
		if (err){
			console.log("Error: ", err);
		} else {
			console.log("cat", cat);
			if (cat){
				var data = {cat: cat};
				data['context'] = 'Say goodbye to your oldest cat!';
			} else {
				var data = {context: 'You do not have any cats to send to the farm right now. Go and get some!'}
			}
			res.render('indiv', data);
		}
	});
};

//sortColor function is for the /cats/bycolor/:color route, gets the color from the request, finds all cats of
//that color in the database, sorts by age, and displays them
var sortColor = function(req, res){
	var filteredColor = req.params.color.toString();
	Cat.find({color: filteredColor}, function(err, cats){
		var data = {cats: cats};
		data['context'] = 'Here are all of your cats that are color ' + filteredColor;
		res.render('list', data); 
	}).sort({age: 1});	//sorted in ascending order
};

//sortName function for the /cats/byname/:name route, gets whatever letters the user has inputted and displays
//all the cats whose names start with those letters and sorts them by age
var sortName = function(req, res){
	var filteredName = req.params.name.toString();

	var regexp = new RegExp("^"+ req.params.name);

	console.log(filteredName);
	Cat.find({name: regexp}, function(err, cats){
		if (err){
			console.log("Error: ", err);
		} else {
			var data = {cats: cats};
			data['context'] = 'Here are all of your cats whose names start with ' + filteredName;
			res.render('list', data);
		}
	}).sort({age: 1});
};

//sortAge function for the /cats/byage/:age route, gets age range user inputs and displays and sorts by age all cats
//in that range. Based on how this function is written, user can input a single age and will see all cats above that age,
//they can input the age range with a hyphen between the numbers, or they can input "-MaxAge" which will show all cats
//below that age or, put another way, between the ages of 0 and the max age.
var sortAge = function(req, res){
	var filteredAge = req.params.age.toString();
	var ageArr = filteredAge.split("-");
	console.log(ageArr);

	if (ageArr.length === 2){
		Cat.find({$and: [{age: {$gte: Number(ageArr[0])}}, {age: {$lte: Number(ageArr[1])}}]}, function(err, cats){
			var data = {cats: cats};
			data['context'] = 'Here are all of your cats between ages ' + ageArr[0] + ' and ' + ageArr[1];
			res.render('list', data);
		}).sort({age:1});
	} else if (ageArr.length === 1){
		Cat.find({age: {$gte: Number(ageArr[0])}}, function(err, cats){
			var data = {cats: cats};
			data['context'] = 'Here are all of your cats above age ' + ageArr[0];
			res.render('list', data);
		}).sort({age:1});
	}
	console.log(ageArr);
};

//all these export statements are annoying but the only other thing I've seen is exporting an object whose keys correspond 
//to values that are functions
module.exports.cats = cats;
module.exports.create = create;
module.exports.del = del;
module.exports.sortColor = sortColor;
module.exports.sortName = sortName;
module.exports.sortAge = sortAge;
module.exports.home = home;

