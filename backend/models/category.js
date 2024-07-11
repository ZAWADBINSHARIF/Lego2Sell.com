const { default: mongoose } = require("mongoose")

const categorySchema = new mongoose.Schema({
  name:String,
  color:{
    type:String,
    required:true
  
  },
  created_at:String,
  updated_at:String,
})

// Define the category model
const categoryData = mongoose.model("categories", categorySchema)
module.exports = categoryData