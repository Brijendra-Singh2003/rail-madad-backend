"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const userSchema = new Schema({
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    // },
    // password: {
    //   type: String,
    //   required: true,
    //   select: false,
    // },
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
        required: true,
    },
    PNR: {
        type: String,
        required: true,
    },
    // gender: {
    //   type: String,
    //   enum: ["Male", "Female"],
    //   required: true,
    // },
    // isDeteted: {
    //   type: boolean,
    //   enum: [true, false],
    // },
    // confirmPassword: {
    //   type: String,
    //   required: true,
    //   validate: {
    //     validator: function(value) {
    //       return value === this.password;
    //     },
    //     message: 'Passwords do not match.'
    //   }
    // },
});
// userSchema.pre('save', function(next) {
//   this.confirmPassword = undefined;
// });
// userSchema.pre("save", async function (next) {
//   this.confirmPassword = undefined;
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });
// function arrayLimit(val) {
//   return val.length >= 1 && val.length <= 2;
// }
// userSchema.methods.comparePassword = async function (password) {
//   console.log(password, this.password);
//   return await bcrypt.compare(password, this.password);
// };
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000,
//   });
// };
const User = mongoose.model("User", userSchema);
exports.default = User;
