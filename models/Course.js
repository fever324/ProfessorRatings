var mongoose = require('mongoose');
var CourseSchema = new mongoose.Schema({
  name: String,
  number: Number,
  description: String
});
module.exports = mongoose.model('Course', CourseSchema);
