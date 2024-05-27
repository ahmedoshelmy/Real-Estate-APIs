// Connect to MongoDB using Mongoose
const mongoose = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { verify } = require('jsonwebtoken');
const AppError = require('../utils/appError');

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
