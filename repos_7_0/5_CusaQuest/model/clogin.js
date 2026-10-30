const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: Number,
  designation: String,
  department: String,

});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
module.exports = User;