const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String,
  email: String,
  password: String,
  UserId: String,
  data: Array,
  Mydetails: Array,
  Order: Array,
  Search: String,
  verifytoken: String,
  admin: String,
  blocked: Boolean,
});

// Define the User model
const UserData = mongoose.model("UserData", userSchema);
module.exports = UserData;
