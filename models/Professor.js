var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ProfSchema = new mongoose.Schema({
  name: String,
  department: String,
  email: String,
  courses : [{type: Schema.Types.ObjectId, ref: 'Course'}]
});

module.exports = mongoose.model('Professor', ProfSchema);
