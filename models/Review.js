var mongoose = require('mongoose');
var ReviewSchema = new mongoose.Schema({
  prof_id: Number,
  course_id: Number,
  comment: String,
  hard_grader: Boolean,
  rating: Number,
  tags: Array
});
module.exports = mongoose.model('Review', ReviewSchema);
