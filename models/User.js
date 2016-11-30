var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  major: String,
  year: Number,
  email: {type: String, index: { unique: true }},
  password: String,
  status: String,
});
module.exports = mongoose.model('User', UserSchema);
