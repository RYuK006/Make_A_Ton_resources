const mongoose = require('mongoose')

const token = new mongoose.Schema({
    token: String
})

module.exports = mongoose.model('Token', token)