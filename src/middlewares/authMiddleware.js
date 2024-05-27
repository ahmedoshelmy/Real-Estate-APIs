// Connect to MongoDB using Mongoose
const mongoose = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { verify } = require('jsonwebtoken');
const AppError = require('../utils/appError');

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // Checking if the token is verified.
  const authHeader = req.cookies.qwitter_jwt || req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new AppError('Unauthorized access', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payloadData = await verify(token, process.env.JWT_SECRET);
    const { id } = payloadData; // Destructuring for concise payload access

    if (!id) {
      return next(new AppError('Invalid access credentials', 409));
    }

    if (payloadData.exp <= parseInt(Date.now() / 1000)) {
      return next(new AppError('Token Expired', 409));
    }

    const user = await User.findOne({ _id: id, deletedAt: null }); // Use _id for MongoDB

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle verification or database errors here
    next(error);
  } finally {
    // Close the Mongoose connection if needed (consider connection pooling for efficiency)
    mongoose.connection.close(); // Optional, depending on your connection strategy
  }
});

exports.isAgent = catchAsync(async (req, res, next) => {
  const authHeader = req.cookies.jwt || req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new AppError('Unauthorized access', 401));
  }

  const token = authHeader.split(' ')[1];
  const payloadData = await verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: payloadData.id,
    role: 'AGENT'
  }); // Check for role

  if (!user) {
    return next(new AppError('User not found or unauthorized access', 404));
  }

  req.user = user;
  next();
});

exports.isClient = catchAsync(async (req, res, next) => {
  const authHeader = req.cookies.jwt || req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new AppError('Unauthorized access', 401));
  }

  const token = authHeader.split(' ')[1];
  const payloadData = await verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: payloadData.id,
    role: 'CLIENT'
  }); // Check for role

  if (!user) {
    return next(new AppError('User not found or unauthorized access', 404));
  }

  req.user = user;
  next();
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  const authHeader = req.cookies.jwt || req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new AppError('Unauthorized access', 401));
  }

  const token = authHeader.split(' ')[1];
  const payloadData = await verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: payloadData.id,
    role: 'ADMIN'
  }); // Check for role

  if (!user) {
    return next(new AppError('User not found or unauthorized access', 404));
  }

  req.user = user;
  next();
});

module.exports = exports;
