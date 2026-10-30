const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    base: {
        type: Number,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    },
});

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

module.exports = CompanyProfile;