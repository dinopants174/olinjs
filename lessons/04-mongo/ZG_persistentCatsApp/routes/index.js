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
	// Nice use of Mongoose sort!
	Cat.findOneAndRemove({}, {sort: {age: -1}}, function(err, cat){	//sorts in descending order by age so that the first one is the oldest
		if (err){
			console.log("Error: ", err);
		} else {
			var data;
			if (cat){
				data = {
					cat: cat,
					context: 'Say goodbye to your oldest cat!'
				};
				// I wouldn't define one property in your literal object definition and 
				// another with bracket notation -- inconsistent. Just go ahead and put
				// both in the literal object definition, like this
			} else {
				data = {
					context: 'You do not have any cats to send to the farm right now. Go and get some!'
				};
			}
			/*
			Usually if you're defining the same variable one way in an if and another way in an else,
			it's best practice to put the "var data" outside the if/else instead of inside both the if and the else.

			This would also be a great place to use the ternary logic I mentioned in your HW3 feedback:
			
			var data = cat ? {
				cat: cat,
				context: 'Say goodbye to your oldest cat!'
			} : {
				context: 'You do not have any cats to send...'
			};

			Just a little more compact.
			*/
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
	var filteredName = req.params.name.toString(); // pretty sure req.params.name is already a string

	var regexp = new RegExp("^"+ req.params.name);
	// You don't need a regexp for the Mongoose find method -- can just use 
	// {name: req.params.name} as your query

	Cat.find({name: regexp}, function(err, cats){
		if (err){
			console.log("Error: ", err);
		} else {
			var data = {
				cats: cats,
				context: 'Here are all of your cats whose names start with ' + filteredName
			};
			// Again, don't mix two ways to put properties on an object -- inconsistent
			res.render('list', data);
		}
	}).sort({age: 1});
	// Usually you see .find(query).sort(params).exec(function() {...}),
	// instead of the .sort at the end like this. See the answers here:
	// http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
};

//sortAge function for the /cats/byage/:age route, gets age range user inputs and displays and sorts by age all cats
//in that range. Based on how this function is written, user can input a single age and will see all cats above that age,
//they can input the age range with a hyphen between the numbers, or they can input "-MaxAge" which will show all cats
//below that age or, put another way, between the ages of 0 and the max age.
var sortAge = function(req, res){
	var filteredAge = req.params.age.toString(); // are you sure it isn't already a string?
	var ageArr = filteredAge.split("-");
	// would need more complex logic here to handle the case where req.params.age is something like "-42", yes?
	// You mentioned you're handling all one-number cases as "all cats older than ___" -- I bet you could have figured out how to handle the two cases


	// Your query is complicated enough that I might pull it out and construct it separately. More readable this way.
	// Also, I restructured to be less repetitive -- this is one way you could do things
	var query;
	var context;
	if (ageArr.length === 2) {
		context = 'Here are all of your cats between ages ' + ageArr[0] + ' and ' + ageArr[1];
		query = {
			$and: [
				{age: {$gte: Number(ageArr[0])}}, 
				{age: {$lte: Number(ageArr[1])}}
			]
		};
	} else if (ageArr.length === 1) {
		context = 'Here are all of your cats above age ' + ageArr[0];
		query = {
			age: {$gte: Number(ageArr[0])}
		};
	}

	// again -- .find, .sort, .exec is the usual pattern
	Cat.find(query).sort({age:1}).exec(function(err, cats) {
		res.render('list', {
			cats: cats,
			context: context
		});
	});
};

//all these export statements are annoying but the only other thing I've seen is exporting an object whose keys correspond 
//to values that are functions
// Much better to export an object whose keys correspond to values that are functions! See HW3 feedback.
// Really, that's what you're doing here, just in more lines of code. The object is module.exports,
// the keys are cats, create, del, sortColor... etc
module.exports.cats = cats;
module.exports.create = create;
module.exports.del = del;
module.exports.sortColor = sortColor;
module.exports.sortName = sortName;
module.exports.sortAge = sortAge;
module.exports.home = home;

