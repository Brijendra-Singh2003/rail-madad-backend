import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    // required: true,
    enum: ["USER", "ADMIN"],
  },
  department: {
    type: String,
    enum: [
      "medical Assisance",
      "Security",
      "Handicapped Facilities",
      "Facilities for Women with Special needs",
      "Electrical Equipment",
      "coach-cleanliness",
      "Punctuality",
      "Water Availability",
      "coach-maintenance",
      "Catering & Vending Services",
      "staff behavior",
      "Corruption/Bribery",
      "Bed Roll"
    ],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
