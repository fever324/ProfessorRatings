var mongoose = require('mongoose');
var Schema = mongoose.Schema

var CourseSchema = new mongoose.Schema({
  name: String,
  number: String,
  description: String,
  quality: {type: Number, default: 0},
  workload: {type: Number, default: 0},
  grading: {type: Number, default: 0},
  workload_count: {type: [Number], default: [0,0,0,0,0]},
  quality_count: {type: [Number], default: [0,0,0,0,0]},
  grading_count: {type: [Number], default: [0,0,0,0,0]},
  number_of_reviews: {type: Number, default: 0},
  average_review: {type: Number, default: 0},
  professor : {type: Schema.Types.ObjectId, ref: 'Professor'}
});
module.exports = mongoose.model('Course', CourseSchema);
