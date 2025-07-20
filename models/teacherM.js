import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Add required if this field is necessary
  },
  email: {
    type: String,
    required: true,  // Add required if this field is necessary
  },
  password: {
    type: String,
    required: true,  // Add required if this field is necessary
  },
  semester: {
    type: Number,
  },
 collegeName:{
   type:String
 },
  section: {
    type: String,  // e.g., class section, should be a string
  },
  skills: { type: [String], default: [] }  // Not required, default to empty array
  ,
  price:{
    type:Number
  },
  payment:{
    type:String
  },
  secretCode:{
    type:String
  },account:{
    type:String
  },
  fileUrl:{
    type:String,
  }

});

// Export the model
export const TEAC = mongoose.model("teacher", schema);
