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
  semester: {
    type: Number,
  },
  subject:{
    type:String
  },
  chapter:{
    type:String
  },
  doubt:{
    type:String
  },
  reesponse:{
    type:String
  },
  Temail:{
    type:String
  },
  global:{
    type:String
  }

});

// Export the model
export const DOU = mongoose.model("doubts", schema);
