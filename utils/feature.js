import jwt from "jsonwebtoken"

export const sendCookie = (Userr,res,message,statusCode)=>{
    const token = jwt.sign({_id:Userr._id},"tdsfadsfasfadsfasdfa")
    console.log(token+"hiiiiiiiiiiiiiiiiiiiiiiiii");
    res.status(statusCode).cookie("token",token,{
      httpOnly:true,
      maxAge:90*60*1000, // 15 min m cookie expire hogaye ga
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development", // secure:true in production (HTTPS)
   
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