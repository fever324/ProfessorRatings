var mongoose = require('mongoose');
var Schema = mongoose.Schema

var SuggestionSchema = new mongoose.Schema({
  content: String,
  course : {type: Schema.Types.ObjectId, ref: 'Course'},
  provider: {type: Schema.Types.ObjectId, ref: 'User'},
  up_votes: {type: Number, default: 0},
});
module.exports = mongoose.model('Suggestion', SuggestionSchema);