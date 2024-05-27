const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'CLIENT', 'AGENT']
  },
  status: {
    type: String,
    required: true,
    default: 'ACTIVE',
    enum: ['ACTIVE', 'DELETED']
  },
  password: { type: String, required: true } // Password field excluded during data retrieval
});

User = mongoose.model('User', userSchema); // Model for the tour
module.exports = User;
