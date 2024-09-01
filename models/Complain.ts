import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  conversations: {
    type: [{
      role: {
        type: String,
        enum: ["user", "model"],
        required: true
      },
      message: {
        type: String,
        required: true,
      },
    }],
  },
  // image_delete_hash:{
  //   type: String,
  //   required: true,
  // },
  pnr: {
    type: String,
    required: true,
  },
});

// Export the model
const Complain = mongoose.model("Complain", ComplaintSchema);

export default Complain;
