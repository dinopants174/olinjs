var mongoose = require('mongoose');
var Schema = mongoose.Schema

var orderSchema = mongoose.Schema({
  name: String,
  ingredients: [{type: Schema.ObjectId, ref: 'ingredients'}], //used so that populate is easily done
  isCompleted: Boolean,
  price: Number
});

module.exports = mongoose.model('orders', orderSchema);