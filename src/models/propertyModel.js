const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const propertySchema = new mongoose.Schema({
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

const PropertyRequest = mongoose.model('PropertyRequest', propertySchema);

module.exports = PropertyRequest;
