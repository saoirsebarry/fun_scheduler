// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Simple ID for now
  interests: [String], // e.g., ['Hiking', 'Live Jazz']
});

module.exports = mongoose.model('User', UserSchema);

