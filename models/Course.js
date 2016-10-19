var mongoose = require('mongoose');
var Schema = mongoose.Schema

var CourseSchema = new mongoose.Schema({
  name: String,
  number: Number,
  description: String,
  professor : {type: Schema.Types.ObjectId, ref: 'Professor'}
});
module.exports = mongoose.model('Course', CourseSchema);
