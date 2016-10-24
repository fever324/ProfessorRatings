var mongoose = require('mongoose');
var Schema = mongoose.Schema

var CourseSchema = new mongoose.Schema({
  name: String,
  number: String,
  description: String,
  quality: Number,
  workload: Number,
  grading: Number,
  workload_count: Array,
  quality_count: Array,
  grading_count: Array,
  number_of_reviews: Number,
  professor : {type: Schema.Types.ObjectId, ref: 'Professor'}
});
module.exports = mongoose.model('Course', CourseSchema);
