const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

let customerSchema = mongoose.Schema({
    name:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
    cartData:{type:Object},
    date:{type:Date,default:Date.now},
})
const saltRound = 10
customerSchema.pre("save",function(next){
    bcrypt.hash(this.password,saltRound,(err,hashedPassword)=>{
        if(err){
            console.log(err)
        }else {
            this.password = hashedPassword
            next()
        }
    })
})

let customerModel = mongoose.model("User",customerSchema)

module.exports = customerModel