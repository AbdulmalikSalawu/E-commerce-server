const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 4000
const mongoose = require("mongoose");
const bodyparser = require("body-parser")
const dotenv = require('dotenv');
dotenv.config()
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}))
app.use(bodyparser.json({limit:"100mb"}))
app.use(bodyparser.urlencoded({extended:true,limit:"50mb"}));

app.listen(PORT, ()=>{
    console.log("Server has started");
})
app.get('/',(req,res)=>{
    res.send("code is working!!")
})

const {addProduct,getAllProducts,deleteProduct,signup,loginUser,newCollections,popularInWomen,fetchUser,addToCart,removeFromCart,getCart} = require('./controllers/usersController');
const customerModel = require("./models/customer.model");

//TO CREATE A USERMODEL FOR PRODUCT UPLOAD, STORAGE, ETC
//AUTH OPERATIONS ARE TO USE abdulmalikyinka api

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'E-commerce'
})
    .then((res)=>{
        console.log("connection successful")
    }).catch((err)=>{
        console.log(err)	
})

app.post("/addProduct",addProduct)
app.get("/getAllProducts", getAllProducts)
app.post("/deleteProduct", deleteProduct)
app.post("/signup", signup)
app.post("/loginUser", loginUser)
app.get("/newCollections",newCollections)
app.get("/popularInWomen",popularInWomen)
app.post("/addToCart",fetchUser,addToCart)
app.post("/removeFromCart",fetchUser,removeFromCart)
app.post("/getCart",fetchUser,getCart)