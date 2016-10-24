var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ReviewSchema = new mongoose.Schema({
  comment: String,
  grading_difficulity: Number,
  grade_received: String,
  rating: Number,
  tags: Array,
  work_load: Number,
  show_major: Boolean,
  show_year: Boolean,
  course_id : {type: Schema.Types.ObjectId, ref: 'Course'},
  prof_id: {type: Schema.Types.ObjectId, ref: 'Professor'},
});
module.exports = mongoose.model('Review', ReviewSchema);
