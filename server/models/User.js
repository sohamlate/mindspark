const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breakfastTime: { type: String, required: true },
  lunchTime: { type: String, required: true },
  dinnerTime: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);