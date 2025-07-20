import { DOU } from "../models/doubts.js";
import { READ } from "../models/ready.js";
import { TEAC } from "../models/teacherM.js";
import { sendCookiee } from "../utils/feature2.js";


export  const register = async(req,res)=>{
    const {name,email,password}= req.body;
    const user = await TEAC.findOne({email});

  if(user){
    return res.status(404).json({
      success:false,
      message:"User already exists"
    })
  } 
    try {
     
      const newUser = new TEAC({ name, email,password});
      await newUser.save();
      // res.status(201).json(newUser); // Optional: respond with the created user object

      sendCookiee(newUser,res,"Registerd succesfully",201);


    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Registration failed' });
    }

}

export const teaForm = async (req, res) => {
    const { email } = req.params;
    console.log(email);
    try {
        const userr = await TEAC.findOne({ email });
        
        if (!userr) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { semester,collegeName, section, skills } = req.body;
       

        // Update user data
        userr.semester = semester;
        userr.collegeName=collegeName;
        userr.section = section;
        userr.skills = Array.isArray(skills) ? skills : []; // Ensure skills is an array
        userr.payment="NO";
        userr.secretCode="L"
        await userr.save();
        
        res.status(201).json({
            success: true,
            message: "Student details updated"
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};


export const students = async (req, res) => {
    console.log("hiii")
      try{
         const stu = await DOU.find({});
         res.json(stu);
      } catch(error){
        console.log(error)
      }
  }

export const rate = async(req,res)=>{
  const {email} =req.params;
  const {price,account} = req.body;
  console.log(rate)
  try{
      const user = await TEAC.findOne({email});
     
      user.price=price;
      
      user.account=account;
      await user.save();
      res.status(201).json({message:"rate uploded"})
  }catch(error){
        console.log(error)
  }
}
export const get = async(req,res)=>{
  const{email} = req.params;
  console.log(email+"hiiiiiiiiiiiiiiiiiiii")
  try{
   const user = await TEAC.findOne({email});
   res.json(user)
  }catch(error){
    console.log(error);
  }
}

export const send = async(req,res)=>{
  const {name,email,rate,semester,Semail,ether,price,doubt,_id} = req.body;
  console.log(name+"hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  console.log(_id+"hi,,")
  try{
      const user = new READ({name,email,semester,price,Semail,doubt,_idS:_id})
      await user.save();
      const userr = await DOU.findOne({_id,email:Semail});
      console.log(userr)
      userr.reesponse="pending"
      await userr.save();
      res.status(201).json({message:"done"})
  }catch(error){
    console.log(error)
  }
}


export const login = async(req,res)=>{
  const {name,email,semester,password}= req.body;
  console.log(password)
  try{
       const user = await TEAC.findOne({email});
       console.log(user)
       if(!user){
        return res.json({message:"register first"})
       }
       user.payment="NO";
       await user.save();

       if(user.email===email && user.password===password){
        sendCookiee(user,res,"login succesfully",201);
       }

  }catch(error){
    console.log(error)
  }
}

export const getMyProfile = async(req,res) =>{
  res.status(200).json({
    success:true,
    user:req.user
  })
}

export const up = async(req,res)=>{
  const {email}= req.params;
  console.log(email+"hiimm")
  try{
     const user = await DOU.findOne({email});
     console.log(user)
     user.reesponse="pending"
     await user.save();
  }catch(error){
    console.log(error)
  }
}

export const logout = async(req,res)=>{
  res.cookie('tokenn', '', {
    httpOnly: true,
    expires: new Date(0), // expire it immediately
    sameSite: 'Lax',
    secure: false, // set to true in production (HTTPS)
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}


export const edit = async(req,res)=>{
  const email = req.params.email;
  const updateData = req.body;

  try {
    const updatedStudent = await TEAC.findOneAndUpdate(
      { email },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedStudent
    });
  } catch (err) {
    console.error('Error updating student:', err.message);
    res.status(500).json({ message: 'Server error updating student' });
  }
}