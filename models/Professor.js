var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ProfSchema = new mongoose.Schema({
  name: String,
  department: String,
  email: String,
  average_review: Number,
  number_of_reviews: Number,
  courses : [{type: Schema.Types.ObjectId, ref: 'Course'}]
});

module.exports = mongoose.model('Professor', ProfSchema);
