var mongoose = require('mongoose');
var ReviewSchema = new mongoose.Schema({
  prof_id: Number,
  course_id: Number,
  comment: String,
  grading_difficulity: Number,
  grade_received: String,
  rating: Number,
  tags: Array,
  work_load: Number,
  show_major: Boolean,
  show_year: Boolean
});
module.exports = mongoose.model('Review', ReviewSchema);
