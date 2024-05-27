const User = require('../models/userModel');
const Ad = require('../models/adModel');
const PropertyRequest = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');

exports.getUserStats = catchAsync(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch users along with their ads and requests statistics
    const users = await User.aggregate([
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'ads',
          localField: '_id',
          foreignField: 'user',
          as: 'ads'
        }
      },
      {
        $lookup: {
          from: 'propertyrequests',
          localField: '_id',
          foreignField: 'user',
          as: 'requests'
        }
      },
      {
        $project: {
          name: 1,
          role: 1,
          adsCount: { $size: '$ads' },
          totalAdsAmount: { $sum: '$ads.price' },
          requestsCount: { $size: '$requests' },
          totalRequestsAmount: { $sum: '$requests.price' }
        }
      }
    ]);

    // Get total count of users
    const totalUsers = await User.countDocuments();

    const hasNextPage = page * limit < totalUsers;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      data: users,
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalUsers,
      hasNextPage,
      hasPreviousPage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
