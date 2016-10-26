var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ReviewSchema = new mongoose.Schema({
  comment: String,
  grading_difficulity: Number,
  grade_received: String,
  rating: Number,
  tags: Array,
  quality: Number,
  workload: Number,
  grading: Number,
  show_major: Boolean,
  show_year: Boolean,
  date: {type: Date, default: Date.now},
  like_count: {type: Number, default: 0},
  dislike_count: {type: Number, default: 0},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  course : {type: Schema.Types.ObjectId, ref: 'Course'},
});
module.exports = mongoose.model('Review', ReviewSchema);
