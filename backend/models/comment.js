const { default: mongoose } = require("mongoose")

const commentSchema = new mongoose.Schema({
  comment: String,
  name:String,
  email:String,
  created_at:String,
  blogId:String,
})

// Define the comment model
const commentData = mongoose.model("comments", commentSchema)
module.exports = commentData