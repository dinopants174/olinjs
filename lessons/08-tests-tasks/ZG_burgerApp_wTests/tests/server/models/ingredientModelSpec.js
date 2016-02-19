require('./../../../app'); // to connect to the database
var expect = require('chai').expect;
var Ingredient = require('./../../../models/ingredientModel');
var Order = require('./../../../models/orderModel');

describe('Ingredient Model', function() {
  it('should create a new ingredient', function(done) {
    var ingredient = new Ingredient({
      name: 'tomato',
      price: 2,
      isOutOfStock: false
    });
    ingredient.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should set the isOutOfStock boolean to true', function(done) {
    Ingredient.findOneAndUpdate({'_id': "56c68f304954cb6c1b6617d2"}, {$set: {'isOutOfStock': true}}, {new: true}, function(err, ingredient){
      if (err){
        return done(err);
      }
      done();
    });
  });

  it('should change the name and price of the ingredient', function(done){
    Ingredient.findOneAndUpdate({'_id': "56c68f304954cb6c1b6617d2"}, {$set: {
    'name': 'red',
    'price': 2.5
    }}, {new: true}, function(err, ingredient){
      if (err){
        return done(err)
      }
      done()
    });
  });
});

describe('Order Model', function() {
  it('should create a new order', function(done) {
    var order = new Order({
      name: 'Austin',
      ingredients: [],
      isCompleted: false,
      price: 0
    });
    order.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should set the isCompleted boolean to true', function(done) {
    Ingredient.findOneAndUpdate({'_id': "56c690cb00779cda1b01668e"}, {$set: {'isCompleted': true}}, {new: true}, function(err, ingredient){
      if (err){
        return done(err);
      }
      done();
    });
  });

});
