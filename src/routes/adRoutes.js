const express = require('express');
const adController = require('../controllers/adController'); // Assuming `adController` handles ad logic
const { isAgent } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').post(isAgent, adController.createAd); // Endpoint for creating ads (Agent only)
router.get('/match/:adId', adController.getMatchingRequests);
router.route('/:adId').put(isAgent, adController.updateAd); // Endpoint for creating ads (Agent only)

module.exports = router;
