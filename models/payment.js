import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
  }

});

// Export the model
export const PAYM = mongoose.model("payment", schema);
