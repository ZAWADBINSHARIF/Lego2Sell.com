const { default: mongoose } = require("mongoose")

const blogSchema = new mongoose.Schema({
  userId: String,
  userName:String,
  title: String,
  categoryId:String,
  categoryName:{
    name:String,
    color:String,

  },
  description: String,
  image:String,
  created_at:String,
  updated_at:String,
  subTitle:String
})

// Define the blog model
const blogData = mongoose.model("blog", blogSchema)
module.exports = blogData