var User = require('../models/userModel.js');
var Twote = require('../models/twoteModel.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema

var logIn = function(req, res){
	res.render('login');
};

var home = function(req, res){
	var userObj = req.session.passport.user;
	console.log(userObj);
	var dbUser = User.find({fbID: userObj.id}, function(err, user){
		if (err){
			res.send(err).status(500);
			console.log("Error: ", err);
		} else {
			if (user.length === 0){
				console.log("I have never seen this user before so better create them");
				var newUser = new User({fbID: userObj.id, name: userObj.displayName, twotes: []});
				newUser.save(function(err, data){
					if (err){
						res.send(err).status(500);
						console.log("Error: ", err);
					} else {
						console.log("Your new user has been created. HERE YOU GO: ", data);
						findAllTwotesAndUsers(data, res);
					}
				});
			} else {
				console.log("I have seen this user before. Good to see you again.");
				console.log("Here is the user I found", user[0]);
				findAllTwotesAndUsers(user[0], res);
			}
		}
	});
};

var postTwote = function(req, res){
	req.body['dateCreated'] = new Date();
	var newTwote = new Twote(req.body);
	newTwote.save(function(err, data){
		if (err){
			res.send(err).status(500);
			console.log("Error: ", error);
		} else {
			console.log(data);
			User.findOne({'_id': data.author}, function(err, user){
				if (err){
					res.send(err).status(500);
					console.log("Error: ", err);
				} else {
					if (user.twotes){
						user.twotes.push(data['_id']);
					} else {
						user.twotes = new Array();
						user.twotes.push(data['_id']);
					}
					user.save(function(err, dbData){
						if (err){
							res.send(err).status(500);
							console.log("Error: ", err);
						} else {
							var newData = {text: data.text, author: dbData.name, dateCreated: data.dateCreated};
							res.send(newData).status(200);
						}
					});
				}
			});
		}
	});
};

module.exports.logIn = logIn;
module.exports.home = home;
module.exports.postTwote = postTwote;

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
					//populate the user object here so that you can find which twotes the user wrote and that should let you hook up the buttons 
					//using the twotes array for the specific twotes that the user provided
					var data = {twotes: twotes, users: users, loggedIn: dbUser};
					res.render('home', data);
				}
			});
		}	
	});
};