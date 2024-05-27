const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middlewares/authMiddleware');
const User = require('../models/userModel');
const Ad = require('../models/adModel');
const adminController = require('../controllers/adminController'); // Assuming `adController` handles ad logic

const PropertyRequest = require('../models/propertyModel');
// Route for admin to get statistics for users
router.get('/statistics', isAdmin, adminController.getUserStats);

module.exports = router;
