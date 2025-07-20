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
  
  price:{
    type:Number
  },
  Semail:{
    type:String
  }
  ,doubt:{
    type:String
  },
  _idS:{
    type:String
  }

});

// Export the model
export const READ = mongoose.model("ready", schema);
