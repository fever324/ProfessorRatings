var mongoose = require('mongoose');
var ProfSchema = new mongoose.Schema({
  name: String,
  department: String
});
module.exports = mongoose.model('Prof', ProfSchema);
