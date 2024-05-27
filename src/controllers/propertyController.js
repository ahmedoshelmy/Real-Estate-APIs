const PropertyRequest = require('../models/propertyModel');

exports.createPropertyRequest = async (req, res) => {
  const { propertyType, area, price, city, district, description } = req.body;

  //TODO: Validation Libraries can be used like JOI
  if (!propertyType || !area || !price || !city || !district) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }
  try {
    const newRequest = new PropertyRequest({
      propertyType,
      area,
      price,
      city,
      district,
      description,
      user: req.user._id
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePropertyRequest = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'area', 'price'];
  const isValidUpdate = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).json({ message: 'Invalid updates!' });
  }

  try {
    const updatedRequest = await PropertyRequest.findByIdAndUpdate(
      req.params.requestId,
      req.body,
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = exports; // Assuming this is the preferred export pattern
