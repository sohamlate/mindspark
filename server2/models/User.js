const mongoose = require('mongoose');

// Import the RootUser model
const RootUser = require('./rootuser'); // Update with the correct path

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breakfastTime: { type: Date, required: true },
  lunchTime: { type: Date, required: true },
  dinnerTime: { type: Date, required: true },
  sleepTime: { type: Date, required: true },  // Add sleepTime here
  rootUser: { type: mongoose.Schema.Types.ObjectId, ref: 'RootUser', required: true }, // Reference to RootUser
});

module.exports = mongoose.model('User', UserSchema);
