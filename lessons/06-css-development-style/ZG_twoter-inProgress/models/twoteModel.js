var mongoose = require('mongoose');
var Schema = mongoose.Schema

var twoteSchema = mongoose.Schema({
  author: {type: Schema.ObjectId, ref: 'users'},
  text: String,
  dateCreated: Date
});

module.exports = mongoose.model('twotes', twoteSchema);