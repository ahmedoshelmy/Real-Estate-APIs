const express = require('express');
const adController = require('../controllers/adController'); // Assuming `adController` handles ad logic

const router = express.Router();

router.route('/').post(adController.createAd); // Endpoint for creating ads (Agent only)

router.route('/:adId/requests').get(adController.getMatchingRequests); // Endpoint for matching requests with ads

module.exports = router;
