const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./clogin.js");


const studentProfileSchema = new Schema({
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course: String,
  year: String,  
  cgpa: Number,
  backlog: Number,
  resume: String,
});
const studentProfile = new mongoose.model("StudentProfile", studentProfileSchema);
module.exports = studentProfile;