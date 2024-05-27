const express = require('express');
const propertyController = require('../controllers/propertyController'); // Assuming `propertyController` handles property logic
const { isClient } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(isClient, propertyController.createPropertyRequest); // Endpoint for creating property requests (Client only)

router.route('/:requestId').put(isClient, propertyController.updateRequest); // Endpoint for updating property requests (Client only)

module.exports = router;
