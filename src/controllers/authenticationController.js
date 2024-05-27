const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
// Assuming you have a User model set up with Mongoose
const User = require('../models/userModel');

exports.login = catchAsync(async (req, res, _next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ message: 'Enter phone number and password' });
  }
  let user = null;
  user = await User.findOne({
    phone: phoneNumber
  });
  if (!user) {
    res.status(400).send({ message: 'User not found' });
    return;
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    res.status(400).send({ message: 'wrong password or email' });
    return;
  }
  const token = sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  sendToken(
    token,
    200,
    {
      token: token,
      user: { ...user.toObject() }
    },
    res
  );
});
const isValidPhoneNumber = phoneNumber => {
  const phoneRegex = /^[+\d]?(?:[\d-.\s()]*)$/;
  return phoneRegex.test(phoneNumber);
};
exports.signup = catchAsync(async (req, res, _next) => {
  const { userName, email, phoneNumber, password, role } = req.body;

  if (!userName || !phoneNumber || !isValidPhoneNumber(phoneNumber)) {
    return res
      .status(400)
      .send({ message: 'Error creating user. Enter valid phone and password' });
  }
  const hashedPassword = await bcrypt.hash(password, 1);
  let user = new User({
    name: userName,
    email,
    phone: phoneNumber,
    role,
    password: hashedPassword,
    deletedAt: null
  });

  try {
    user = await user.save();
    const token = signJWT(user._id);

    sendToken(
      token,
      201,
      {
        token: token,
        user: { ...user.toObject() }
      },
      res
    );
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Error creating user' });
    return;
  }
});
const signJWT = id => {
  return sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendToken = (token, statusCode, responseBody, res) => {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const days = Number(expiresIn?.substring(0, expiresIn.length - 1)); // To remove the 'd' in the end
  res.cookie('jwt', 'Bearer ' + token, {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false // Will be true when we deploy https
  });
  res.status(statusCode).json(responseBody);
};
module.exports = exports;
