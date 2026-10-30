// models/FoodOpiniondb.js
const mongoose = require('mongoose');

const opinionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    category: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Reference to Review model
}, { timestamps: true });

const Opinion = mongoose.model('Opinion', opinionSchema);

module.exports = Opinion;
