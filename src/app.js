const express = require('express');

const propertyRouter = require('./routes/propertyRoutes'); // Route for properties (requests and ads)
const userRouter = require('./routes/userRoutes'); // Route for users
const adsRouter = require('./routes/adRoutes'); // Route for ads
const authRouter = require('./routes/authRoutes'); // Route for auth
const adminRouter = require('./routes/adminRoutes'); // Route for admin

let cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// 1) MIDDLEWARES

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(cookieParser());

// 2) ROUTES

// Handle property requests and ads under the same route (`/properties`)
app.use('/requests', propertyRouter);
app.use('/ads', adsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

// Handle user routes
app.use('/users', userRouter);

app.use(globalErrorHandler);

// 4) ERROR HANDLING (404)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
