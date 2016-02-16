var mongoose = require('mongoose');
var Schema = mongoose.Schema

var userSchema = mongoose.Schema({
  fbID: String,
  name: String,
  twotes: [{type: Schema.ObjectId, ref: 'twotes'}] //used so that populate is easily done
});
  
module.exports = mongoose.model('users', userSchema);