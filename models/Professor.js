var mongoose = require('mongoose');
var ProfSchema = new mongoose.Schema({
  name: String,
  department: String,
  email: String
});
module.exports = mongoose.model('Professor', ProfSchema);
