var mongoose = require('mongoose');
var Schema = mongoose.Schema

var SuggestionSchema = new mongoose.Schema({
  content: String,
  course : {type: Schema.Types.ObjectId, ref: 'Course'},
  provider: {type: Schema.Types.ObjectId, ref: 'User'},
  up_votes: {type: Number, default: 0},
  date: {type: Date, default: Date.now},
});
module.exports = mongoose.model('Suggestion', SuggestionSchema);