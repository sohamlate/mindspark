const mongoose = require('mongoose');

const rootUserSchema = new mongoose.Schema({
    gmail: {
        type: String,
        required: true,    
    },
    phone: {
        type: String,
        required: true, 
    },
    password: {
        type: String,
        required: true,
    },
    otp: { type: String },
    otpExpires: { type: Date }
}); 

const RootUser = mongoose.model('RootUser', rootUserSchema);

module.exports = RootUser;
