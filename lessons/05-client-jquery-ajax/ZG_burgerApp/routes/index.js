//you probably want to separate this into multiple files. 

var Ingredient = require('../models/ingredientModel.js');
var Order = require('../models/orderModel.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema

//functions below are are all for the ingredients page
var ingredients = function(req, res){
	//finds all of the ingredients in the database and renders the ingredients template
	//with all of the ingredients
	Ingredient.find({}, function(err, ingredients){
		if (err){
			res.status(500).send(err);	//sends status to browser if error
			console.log("Error: ", err);
		} else {
			var data = {ingredients: ingredients};
			res.render('ingredients', data);
		}
	});
};

var postIngredient = function(req, res){
	//when user adds ingredient using #addIngredientForm, pass the data to server, add isOutOfStock
	//boolean as false to request body, create a new ingredient from req.body and save it in db, before
	//displaying new ingredient on page
	req.body['isOutOfStock'] = false;
	var ingredient = new Ingredient(req.body);
	ingredient.save(function(err, data){
		if (err){
			res.status(500).send(err);	//sends status to browser if error
			console.log("Error: ", err);
		} else {
			res.status(200).send(data);	
		}
	});
};

var postStock = function(req, res){
	//when user marks an ingredient out of stock, we send a boolean to determine if the out of stock button
	//was already clicked, so the ingredient is already disabled. If it is disabled then we need to enable it again.
	//If it wasn't already disabled, we need to disable the ingredient.
	if (req.body.isDisabled === 'true'){
		//change this ingredient's outOfStock boolean from true to false
		var bool = false;
	} else {
		//change this ingredient's outOfStock boolean from false to true
		var bool = true;
	}
	//client side sends the server the id of the ingredient to update which goes in our query, options means we get the
	//new updated document back
	Ingredient.findOneAndUpdate({'_id': req.body['ingredientId']}, {$set: {'isOutOfStock': bool}}, {new: true}, function(err, ingredient){
		if (err){
			res.status(500).send(err);	//sends status to browser if error
			console.log("Error: ", err);
		} else {
			res.status(200).send();	//send no data back to client because we already handled rendering it as out of stock, I don't know
			//if this is best practice
		}
	});
};

var postEdit = function(req, res){
	//client side sends the server the id of the ingredient to update, with the newName and newPrice for the ingredient
	Ingredient.findOneAndUpdate({'_id': req.body['ingredientId']}, {$set: {
		'name': req.body['newName'],
		'price': req.body['newPrice']
	}}, {new: true}, function(err, ingredient){
			if (err){
				res.status(500).send(err);	//sends status to browser if error
				console.log("Error: ", err);
			} else {
				res.status(200).send(ingredient); //send the ingredient back to client to show the new changes
			}
	});
};

//functions below are all for the orders page
var order  = function(req, res){
	//finds all ingredients, even if they aren't in stock, and renders them in template. Template has an if statement
	//that catches out of stock ingredients and disables them from being clicked
	Ingredient.find({}, function(err, ingredients){
		if (err){
			res.sendStatus(500);	//sends status to browser if error
			console.log("Error: ", err);
		} else {
			var data = {ingredients: ingredients};
			res.render('order', data);
		}
	});
};

var postOrder = function(req, res){
	//client side passes to server an array of ids in the ingredients collection for the order, the name, and 
	//the price so we create a new order from req.body and save it in db
	var newOrder = new Order({name: req.body['name'], 
		ingredients: req.body['order[]'], 
		price: parseFloat(req.body['price']), 
		isCompleted: false});
	newOrder.save(function(err, data){
		if (err){
			res.status(500).send(err);	//sends status to browser if error
			console.log("Error: ", err);
		} else {
			res.status(200).send(data);	
		}
	});
};

//functions below are all for the kitchen page
var kitchen = function(req, res){
	//gets all orders that have not been completed, populates the ingredients field (which was an array of strings where
	//each string was an id in ingredients collection) with the actual ingredient objects, and renders the orders
	Order.find({isCompleted:false}).populate('ingredients').exec(function(err, orders){
		var data = {orders: orders};
		res.render('kitchen', data);
	});
};

var postCompleted = function(req, res){
	//client side sends server the id of the order which has a boolean isCompleted which is set to true in the db
	Order.findOneAndUpdate({'_id': req.body['orderId']}, {$set: {'isCompleted': true}}, {new: true}, function(err, order){
		if (err){
			res.status(500).send(err);	//sends status to browser if error
			console.log("Error: ", err);
		} else {
			res.status(200).send(order);  //sends order back to client make it disappear from the page
		}
	});
};

module.exports.ingredients = ingredients;
module.exports.postIngredient = postIngredient;
module.exports.order = order;
module.exports.postOrder = postOrder;
module.exports.postStock = postStock;
module.exports.postEdit = postEdit;
module.exports.kitchen = kitchen;
module.exports.postCompleted = postCompleted;