var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: {type: String, index: { unique: true }},
  password: String
});
module.exports = mongoose.model('User', UserSchema);
