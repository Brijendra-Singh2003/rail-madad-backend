import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  pnr: {
    type: String,
    required: true,
  },
});

// Export the model
const Complain = mongoose.model("Complain", ComplaintSchema);

export default Complain;
