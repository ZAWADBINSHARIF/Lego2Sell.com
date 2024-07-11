const { Config } = require("../config")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const UserData = require("../models/UserData")

const secret = Config.JWTSECRET.SECRET // You can set this value in your .env file

exports.isAdminUser = async(token) => {
    console.log(token)
    if (!token) return false
    const userData = jwt.verify(token, secret)
    // get all data in userdata
    if (userData?.email){
        const data = await UserData.findOne({email: userData.email})
        return data?.admin === "admin"
    }

   return false
}