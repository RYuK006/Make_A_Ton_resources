
const mongoose = require('mongoose');
const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    breed:{
        type:String,
        required:true,
    },
    dob:{
        type:Date,
        required:true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image:{
        type:String,
    },
    bio:{
        type:String
    },
    createdAt:{
        type:Date,
        required:true,
        immutable:true,
        default: new Date()
    }
})

const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;
