var mongoose = require('mongoose');

var ingredientSchema = mongoose.Schema({
  name: String,
  price: Number,
  isOutOfStock: Boolean
});

module.exports = mongoose.model('ingredients', ingredientSchema);