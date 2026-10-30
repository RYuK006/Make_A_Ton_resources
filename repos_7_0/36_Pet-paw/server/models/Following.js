const mongoose = require('mongoose');
const followingSchema= new mongoose.Schema({
    selfId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    }   
})
followingSchema.index({ selfId: 1, userId: 1}, { unique: true })

module.exports = mongoose.model("Following", followingSchema)
