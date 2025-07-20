import { DOU } from "../models/doubts.js";
import { READ } from "../models/ready.js";
import { STU } from "../models/studentM.js";
import { TEAC } from "../models/teacherM.js";
// import { TEAC } from "../models/teacherM";
import { Update } from "../models/update.js";
import { sendCookie } from "../utils/feature.js";


export  const register = async(req,res)=>{
    const {name,email,password}= req.body;
    const user = await STU.findOne({email});
    

  if(user){
    return res.status(404).json({
      success:false,
      message:"User already exists"
    })
  } 
    try {
     
      const newUser = new STU({ name, email,password});
      await newUser.save();
      // res.status(201).json(newUser); // Optional: respond with the created user object
      sendCookie(newUser,res,"Registerd succesfully",201);


    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Registration failed' });
    }

}

export const stuForm = async (req, res) => {
    const { email } = req.params;
    console.log(email);
    try {
        const userr = await STU.findOne({ email });
        
        if (!userr) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { semester, collegeName, section, skills } = req.body;

        // Update user data
        userr.semester = semester;
        userr.section = section;
        userr.collegeName=collegeName;
        userr.skills = Array.isArray(skills) ? skills : []; // Ensure skills is an array
        
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
 export const update = async(req,res)=>{
    const { semester, subjects } = req.body;
    try {
        // Create a new student document
        const newStudent = new Update({
          semester,
          subjects,
        });
    
        // Save the document to MongoDB
        await newStudent.save();
    
        // Send a success response
        res.status(200).json({ message: 'Data stored successfully' });
      } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'Failed to store data' });
      }
}

export const students = async (req, res) => {
    const { semester } = req.params; // Get the semester from query parameters
  console.log("hii")
    if (!semester) {
      return res.status(400).json({ error: 'Semester is required' });
    }
  
    try {
      // Find students with the specific semester
      const students = await Update.find({ semester });
  
      // Extract subjects and chapters
      const subjects = students.flatMap(student =>
        student.subjects.map(subject => ({
          subjectName: subject.subjectName,
          chapters: subject.chapters.map(chap => chap.chapterName)
        }))
      );
  
      // Remove duplicates
      const uniqueSubjects = subjects.reduce((acc, current) => {
        const existing = acc.find(sub => sub.subjectName === current.subjectName);
        if (existing) {
          existing.chapters = [...new Set([...existing.chapters, ...current.chapters])];
        } else {
          acc.push(current);
        }
        return acc;
      }, []);
      console.log(uniqueSubjects)
  
      res.json({ subjects: uniqueSubjects });
    } catch (error) {
      console.error('Error fetching subjects and chapters:', error);
      res.status(500).json({ error: 'Failed to fetch subjects and chapters' });
    }
  }

export  const doubts = async(req,res)=>{
     const {sem,name,subject,chapter,email,doubt,global}=req.body;
     console.log("hiiiimm")
     try{
      const doubts = new DOU({name,email,semester:sem,subject,chapter,doubt,reesponse:"",Temail:"",global});
      await doubts.save();
      res.status(201).json({message:"doubt submitted"})
     }catch(error){
      console.log(error)
      res.json({message:"error while submitting the doubt"})
     }
}

export const login = async(req,res)=>{
  const {name,email,semester,password}= req.body;
  console.log(password)
  try{
       const user = await STU.findOne({email});
       console.log(user)
       if(!user){
        return res.json({message:"register first"})
       }

       if(user.email===email && user.password===password){
        sendCookie(user,res,"Registerd succesfully",201);

       }

  }catch(error){
    console.log(error)
  }
}

export const data = async(req,res)=>{
   try{
      const user = await READ.find({});
     
      res.json(user)
      
   }catch(error){
console.log(error)
   }
} 

export const status = async(req,res)=>{
  const {email}= req.params
  console.log(email+"hiiiiiiiiiiiMMMMMMMMMMMMMMMMM")
  const Temail = req.body.email;
  const _id = req.body._id;
  
  try{
    const user = await DOU.findOne({_id,email});
    console.log(user)
    if(!user){
     return res.json({message:"not found"})
    }
    user.reesponse="accepted";
    user.Temail=Temail;
    await user.save();
    res.status(201)
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


export const address = async(req,res)=>{
  console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
  const {email}= req.params;
  try{
     const user = await TEAC.findOne({email});
    console.log(user)
     res.json(user)
     
  }catch(error){
console.log(error)
  }
} 

export const payment = async(req,res)=>{
  const {email}= req.params;
  try{
     const user = await TEAC.findOne({email});
      user.payment="YES";
      await user.save();
      res.status(201).json({message:"payment Done"})
     
  }catch(error){
console.log(error)
  }
} 
export const sec = async(req,res)=>{
  const {email}= req.params;
  const {secretCode} = req.body;
  try{
     const user = await TEAC.findOne({email});
      user.secretCode=secretCode
      user.payment="NO";
      await user.save();
      res.status(201).json({message:"secret code submiited"})
     
  }catch(error){
console.log(error)
  }
} 

export const deletee = async(req,res)=>{
  const {email,_id,readyId} = req.body;
  try{
    console.log(_id);
    console.log(readyId);
     const doubt = await DOU.deleteOne({_id});
     const ready = await READ.deleteOne({_id:readyId});
     const user = await TEAC.findOne({email});
     user.secretCode="L";
     await user.save();
     res.status(201).json({message:"data deleted succesfully"})
  }catch(error){
    console.log(error)
  }
}
export const logout = async(req,res)=>{
  res.cookie('token', '', {
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
    const updatedStudent = await STU.findOneAndUpdate(
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

