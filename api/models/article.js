const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  title: String,
  article_no: Number,
  content: String,
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Article", articleSchema);
