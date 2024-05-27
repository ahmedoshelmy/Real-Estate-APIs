const mongoose = require('mongoose');
const adSchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: true,
    enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT']
  },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  description: { type: String },
  refreshedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

Ad = mongoose.model('Ad', adSchema); // Model for the tour
module.exports = Ad;
