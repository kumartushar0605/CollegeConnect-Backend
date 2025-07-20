// import {  } from "../models/user.js"
import  jwt  from "jsonwebtoken"
import { STU } from "../models/studentM.js"
import { TEAC } from "../models/teacherM.js"

//// TEACHER
export const isAuthenticated = async(req,res,next)=>{
    const {tokenn} = req.cookies
console.log(tokenn+"hiiiiiiiiiiimmmmmmmmm")
    if(!tokenn){
      return res.status(404).json({
        success:false,
        message:"Login first"
      })
    }
    
    const decoded = jwt.verify(tokenn,"tdsfadsfasfadsfasdfb")// token ko decode kr ke id access kr lenge
    req.user = await TEAC.findById(decoded._id)

    next();
}

/////student


export const isAuthenticatedd = async(req,res,next)=>{
    const {token} = req.cookies
    console.log(token+"tokeeeen")

    if(!token){
      return res.status(404).json({
        success:false,
        message:"Login first"
      })
    }
    
    const decoded = jwt.verify(token,"tdsfadsfasfadsfasdfa")// token ko decode kr ke id access kr lenge
    req.user = await STU.findById(decoded._id)

    next();
}