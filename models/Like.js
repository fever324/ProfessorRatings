var mongoose = require('mongoose');
var Schema = mongoose.Schema

var LikeSchema = new mongoose.Schema({
  review_id: {type: Schema.Types.ObjectId, ref: 'Review'},
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  like: Number,
});
LikeSchema.index({ review_id: 1, user_id: 1 }, { unique: true });
module.exports = mongoose.model('Like', LikeSchema);