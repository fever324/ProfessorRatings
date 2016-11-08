var mongoose = require('mongoose');
var Schema = mongoose.Schema

var UpvoteSchema = new mongoose.Schema({
  suggestion_id: {type: Schema.Types.ObjectId, ref: 'Suggetion'},
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
});
UpvoteSchema.index({ suggestion_id: 1, user_id: 1 }, { unique: true });
module.exports = mongoose.model('Upvote', UpvoteSchema);