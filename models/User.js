var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  passward: String
});
module.exports = mongoose.model('User', UserSchema);
