const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    require: true,
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  },
  postId: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true,
  },
  likedBy: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
