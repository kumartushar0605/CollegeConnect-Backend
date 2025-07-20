import jwt from "jsonwebtoken"

export const sendCookie = (Userr,res,message,statusCode)=>{
    const token = jwt.sign({_id:Userr._id},"tdsfadsfasfadsfasdfa")
    console.log(token+"hiiiiiiiiiiiiiiiiiiiiiiiii");
    res.status(statusCode).cookie("token",token,{
      httpOnly:true,
      maxAge:190*60*1000, // 15 min m cookie expire hogaye ga
    //   sameSite:process.env.NODE_ENV==="DEVELOPMENT"?"lax":"none", //backend kisi or url pr rhe ga or fronend kisi or url pr 
    //   secure:process.env.NODE_ENV==="DEVELOPMENT"?false:true
    }).json({
      success:true,
      message,
      token,
      Userr
      // user: {
      //   name: Userr.name,
      //   email: Userr.email,
      // },
    
    })
}