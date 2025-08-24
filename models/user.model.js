const mongoose = require("mongoose")
// const bcrypt = require("bcryptjs")
let userSchema = mongoose.Schema({
    id: {type:String, unique:true},
    name: {type:String, unique:true},
    newImage: String,
    newPrice: {type:String,required:true},
    oldPrice: {type:String,required:true},
    category: {type:String,required:true},
    description: {type:String,required:true}
})

// let customerSchema = mongoose.Schema({
//     name:{type:String},
//     email:{type:String,unique:true},
//     password:{type:String},
//     cartData:{type:Object},
//     date:{type:Date,default:Date.now},
// })

let userModel = mongoose.model("E-commerce",userSchema)
// let customerModel = mongoose.model("User",customerSchema)

module.exports = userModel