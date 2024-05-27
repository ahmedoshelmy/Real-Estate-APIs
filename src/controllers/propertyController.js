const PropertyRequest = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');

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

exports.updateRequest = catchAsync(async (req, res) => {
  const requestId = req.params.requestId; // Assuming adId is passed in the request parameters
  const { propertyType, area, price, city, district, description } = req.body;

  // Validate input data (implement robust validation using a library like Joi)
  if (!propertyType || !area || !price || !city || !district) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }

  try {
    // Find the ad by its id and update its properties
    const updatedRequest = await PropertyRequest.findByIdAndUpdate(
      requestId,
      {
        propertyType,
        area,
        price,
        city,
        district,
        description,
        user: req.user.id,
        refreshedAt: new Date()
      },
      { new: true }
    ); // Set { new: true } to return the updated document
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = exports; // Assuming this is the preferred export pattern
