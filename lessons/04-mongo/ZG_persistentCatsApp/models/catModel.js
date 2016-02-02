var mongoose = require('mongoose');

// Create a Schema
var catSchema = mongoose.Schema({
  name: String,
  age: Number,
  color: String
});

module.exports = mongoose.model('cats', catSchema);