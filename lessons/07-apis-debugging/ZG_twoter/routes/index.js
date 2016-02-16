//routes

var User = require('../models/userModel.js');
var Twote = require('../models/twoteModel.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema

//just renders the login page
var logIn = function(req, res){
	res.render('login');
};

//when the user has logged in, we check to see if the user exists in the database by their facebook id. If they don't, the
//returned mongoose array has length 0 so we then create the user. Because each facebook id is unique, mongoose will ever only
//find or create one user. We then call a helper function to find all tweets and all users to render the home page
var home = function(req, res){
	var userObj = req.user;
	var dbUser = User.find({fbID: req.user.id}, function(err, user){
		if (err){
			res.send(err).status(500);
			console.log("Error: ", err);
		} else {
			if (user.length === 0){
				var newUser = new User({fbID: req.user.id, name: req.user.displayName, twotes: []});	//new users have no twotes
				newUser.save(function(err, data){
					if (err){
						res.send(err).status(500);
						console.log("Error: ", err);
					} else {
						findAllTwotesAndUsers(data, res);	//now we can find all twotes and users to render home page
					}
				});
			} else {
				findAllTwotesAndUsers(user[0], res);	//mongoose returns an array but there will only ever be one elemment in user
			}
		}
	});
};

//from client side we get the author id and the text of the twote. We add the data created for each twote. When a twote is posted, 
//we have to add the individual twote to the database but then we also have to find the author in the database who has an array of 
//twotes they have authored and add that twote id to that array
var postTwote = function(req, res){
	req.body['dateCreated'] = new Date();
	var newTwote = new Twote(req.body);
	newTwote.save(function(err, data){
		if (err){
			res.send(err).status(500);
			console.log("Error: ", error);
		} else {
			User.findOne({'_id': data.author}, function(err, user){
				if (err){
					res.send(err).status(500);
					console.log("Error: ", err);
				} else {
					if (user.twotes){	//if the user already has a twotes array, push to it
						user.twotes.push(data['_id']);
					} else {
						user.twotes = new Array();	//if the user's array is empty, it is undefined so create a new one before pushing
						user.twotes.push(data['_id']);
					}
					user.save(function(err, dbData){
						if (err){
							res.send(err).status(500);
							console.log("Error: ", err);
						} else {
							//I found a link that says objects returned from mongoose are immutable unless you call .toObject() on it so this was
							//my initial solution to immutable objects which was just to copy the data to a new obejct
							var newData = {text: data.text, author: dbData.name, dateCreated: data.dateCreated, authorId: dbData.id, id: data.id};
							res.send(newData).status(200);
						}
					});
				}
			});
		}
	});
};

//when a twote is deleted, we get the id of the twote to be deleted and the id of the author of the deleted twote from the client so
//we delte the twote and then we update the user's list of twotes to remove that twote
var postDelete = function(req, res){
	Twote.findByIdAndRemove(req.body.twoteId, function(err, removed){
		 if (err){
		 	res.send(err).status(500);
		 	console.log("Error: ", err);
		 } else {
		 	User.findByIdAndUpdate(req.body.authorId, {$pull: {'twotes': req.body.twoteId}},function(err, user){
		 		if (err){
		 			res.send(err).status(500);
		 			console.log("Error: ", err);
		 		} else {
		 			res.status(200).send(req.body);
		 		}
		 	});
		 }
	});
};

//logs the user out, ending the session, and redirects user back to login
var logOut = function(req, res){
	req.logout();
	res.redirect('/login');
};

module.exports.logIn = logIn;
module.exports.logOut = logOut;
module.exports.home = home;
module.exports.postTwote = postTwote;
module.exports.postDelete = postDelete;

//finds all twotes in the db, sorted by date so the most recent are on the top and uses populate to get the user object
//for the author. Next, find all the users and pass those to the handlebars template
function findAllTwotesAndUsers(dbUser, res){
	Twote.find({}, null, {sort: {dateCreated: -1}}).populate('author').exec(function(err, twotes){
		if (err){
			res.sendStatus(500);
			console.log("Error: ", err);
		} else {
			User.find({}, function(err, users){
				if (err){
					res.sendStatus(500);
					console.log("Error: ", err);
				} else {
					//I had this idea that since I already have the logged in user as dbUser and the twotes are populated,
					//I could check here to see which twotes are by the user and then set a boolean for each of them, use a simple
					//if statement in handlebars to then render the delete button for the right twotes. The problem was that objects
					//returned from mongoose are immutable unless you call .toObject() on them
					var data = {twotes: twotes, users: users, loggedIn: dbUser};
					res.render('home', data);
				}
			});
		}	
	});
};