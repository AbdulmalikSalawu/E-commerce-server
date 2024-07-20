const express = require("express");
const app = express();
const userModel = require("../models/user.model");
const customerModel = require("../models/customer.model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt")
const dotenv = require('dotenv');
dotenv.config()
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "drxn6gv3x",
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const addProduct = async (req, response) => {

    const myProducts = await userModel.find();
    const id = myProducts.length+1

    const {name,newImage,newPrice,oldPrice,category}= req.body
    if (typeof name === 'undefined' || typeof newPrice === 'undefined' || typeof oldPrice === 'undefined') {
        console.log("missing required fields")
      } 
    try{
        const submitData = await userModel.findOne({name})
        if(submitData){
            console.log("product don dey")
            response.send({message:"product already exists"})
        }else{
                try{
                    const done = await userModel.create({name,newImage,newPrice,oldPrice,category,id})
                        if(done){
                            response.send({message:"Product Added",status:true})
                        } else {
                            console.log(err)
                            }
                }catch(error){
                    console.log(error)
                    console.log("data could not be saved")
                    response.send({message:"an error occured",status:false})
                }
            }
        }
    catch(error){
        console.log(error)
    }
}

    const getAllProducts = async (req,res) => {
            try {
                const myProducts = await userModel.find()
                res.send({status: "ok", data:myProducts})
            } catch (error) {
                console.log(error)
            }
    }

    const newCollections = async (req,res) => {
        try {
            let products = await userModel.find();
            let newCollections = products.slice(1).slice(-4);
            res.send(newCollections)
        } catch (error) {
            console.log(error)
        }
    }

    const popularInWomen = async (req,res) => {
        try {
            let products = await userModel.find();
            let popular_in_women = products.filter((product, index) => [2, 4, 6, 8].includes(index))
            res.send(popular_in_women)
        } catch (error) {
            console.log(error)
        }
    }

    //middleware to fetch user
    const fetchUser = async (req,res,next)=>{
        const token = req.header('token');
        if(!token) {
            res.status(401).send({errors:"please use a valid token"})
        }
        else {
            try {
                const data = jwt.verify(token,process.env.JWT_SECRET)
                req.user = data.user;
                next();
            } catch (error) {
                console.log(error)
                res.status(401).send({errors:"use a valid token"})
            }
        }
    }    

    const addToCart = async (req,res) => {
        // console.log(req.user.id)
        let userData = await customerModel.findOne({_id:req.user.id})
        userData.cartData[req.body.itemId] +=1
        await customerModel.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
        // res.send("Added")
    }

    const removeFromCart = async (req,res) => {
        let userData = await customerModel.findOne({_id:req.user.id})
        userData.cartData[req.body.itemId] -=1
        if(userData.cartData[req.body.itemId]>0)
        await customerModel.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
        res.send("removed")
    }

    const getCart = async (req,res) => {
        let userData = await customerModel.findOne({_id:req.user.id});
        res.json(userData.cartData);
    }

    const deleteProduct = async (req,res)=>{
        const {uniqueid} = req.body
        try {
            await userModel.deleteOne({_id:uniqueid})
            res.send({status: "ok",data: "deleted"})
        } catch (error) {
            console.log(error)
        }
    }

    const signup = async (req, response) => {
        const {name,email,password,Date}= req.body
        try{
            const submitData = await customerModel.findOne({email})
            if(submitData){
                console.log("user already exists")
                response.send({message:"user already exists"})
            }else{
                let cart = {}
                for (let i = 0; i < 300; i++) {
                    cart[i]=0;
                } 
                    try{
                        const done = await customerModel.create({name,email,password,cartData:cart,Date})
                            if(done){
                                response.send({message:"Signup successful",status:true})
                                const data = {
                                    user:{id:done.id}
                                }
                                const token = jwt.sign(data,'secret_ecom')
                                console.log(token)
                            } else {
                                console.log(err)
                                }
                    }catch(error){
                        console.log(error)
                        console.log("data could not be saved")
                        response.send({message:"an error occured",status:false})
                    }
                }
            }
        catch(error){
            console.log(error)
        }}

        const loginUser = async (req,res)=>{
            const {email,password} = req.body
            const user = await customerModel.findOne({email})
            if(!user){
                console.log("user not found")
                return res.json({error:"user not found oooo"})
            }
            if(await bcrypt.compare(password,user.password)){
                const data={
                    user:{
                        id:user.id
                    }
                }
                const token = jwt.sign(data,process.env.JWT_SECRET,{
                    expiresIn:1200,
                });
                if(res.status(201)) {
                    return res.json({status: "ok", data: token});
                } else {
                    console.log(error)
                    return res.json({error: "error"})
                }
            }
            else res.json({status: "error",error: "invalid password"})
            console.log("invalid password")
        }

        const userData = async (req,res)=>{
            const { token } = req.body;
            try {
                const uniqueUser = jwt.verify(token, process.env.JWT_SECRET,(err,res) => {
                    if(err){
                        return "token expired";
                    }
                    return res;
                });
                if(uniqueUser=="token expired"){
                    return res.json({status: "error", data: "token expired oo"})
                }
    
                const useremail = uniqueUser.email;
                await customerModel.findOne({email:useremail})
                .then((data)=>{
                    return res.json({status:"ok",data:data})
                })
                .catch((error)=>{
                    console.log(error)
                    return res.json({status:"error",data:error})
                });}
                catch(error){
                    console.log(error)
                }
            } 

    module.exports = {addProduct,getAllProducts,deleteProduct,signup,loginUser,newCollections,popularInWomen,fetchUser,addToCart,removeFromCart,getCart,userData}