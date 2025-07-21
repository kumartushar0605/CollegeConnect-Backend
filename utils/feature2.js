import jwt from "jsonwebtoken"
//////Teacherrrrrrr
export const sendCookiee = (Userr,res,message,statusCode)=>{
    const tokenn = jwt.sign({_id:Userr._id},"tdsfadsfasfadsfasdfb")
    console.log(tokenn+"hiiiiiiiiiiiiiiiiiiiiiiiii");
    res.status(statusCode).cookie("tokenn",tokenn,{
      httpOnly:true,
      maxAge:90*60*1000, // 15 min m cookie expire hogaye ga
   sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development", // secure:true in production (HTTPS)
    }).json({
      success:true,
      message,
      tokenn,
      Userr
      // user: {
      //   name: Userr.name,
      //   email: Userr.email,
      // },
    
    })
}