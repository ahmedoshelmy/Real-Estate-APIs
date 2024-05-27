const catchAsync = require('../utils/catchAsync');
const Ad = require('../models/adModel'); //
const PropertyRequest = require('../models/propertyModel'); //
exports.createAd = catchAsync(async (req, res) => {
  const { propertyType, area, price, city, district, description } = req.body;

  // Validate input data (implement robust validation using a library like Joi)
  if (!propertyType || !area || !price || !city || !district) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }

  try {
    const newAd = new Ad({
      propertyType,
      area,
      price,
      city,
      district,
      description,
      user: req.user._id // Associate ad with the authenticated user (agent)
    });
    await newAd.save();
    res.status(201).json(newAd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
exports.updateAd = catchAsync(async (req, res) => {
  const adId = req.params.adId; // Assuming adId is passed in the request parameters
  const { propertyType, area, price, city, district, description } = req.body;

  // Validate input data (implement robust validation using a library like Joi)
  if (!propertyType || !area || !price || !city || !district) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }

  try {
    // Find the ad by its id and update its properties
    const updatedAd = await Ad.findByIdAndUpdate(
      adId,
      {
        propertyType,
        area,
        price,
        city,
        district,
        description,
        userId: req.user.id
      },
      { new: true }
    ); // Set { new: true } to return the updated document

    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.status(200).json(updatedAd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
exports.getMatchingRequests = catchAsync(async (req, res) => {
  try {
    const { adId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!adId) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Find the ad by id
    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Calculate price tolerance
    const priceTolerance = ad.price * 0.1; // 10% tolerance

    // Define the aggregation pipeline to match requests with relevant ads
    const pipeline = [
      {
        $match: {
          district: ad.district, // Match by district
          price: {
            $gte: ad.price - priceTolerance, // Match within 10% tolerance
            $lte: ad.price + priceTolerance
          },
          area: ad.area // Match by area
        }
      },
      {
        $sort: { refreshedAt: -1 } // Sort by refreshedAt date descending
      },
      {
        $skip: (page - 1) * limit // Skip records for pagination
      },
      {
        $limit: limit // Limit records for pagination
      }
    ];

    // Execute the aggregation pipeline
    const matchedRequests = await PropertyRequest.aggregate(pipeline);

    res.status(200).json({
      data: matchedRequests,
      page: parseInt(page),
      limit: parseInt(limit),
      total: matchedRequests.length // Inefficient for large datasets, consider using countDocuments for total count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = exports;
