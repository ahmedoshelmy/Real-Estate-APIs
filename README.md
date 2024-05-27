# Real-Estate-APIs

## Folder Structure

project-root
│
├── controllers
│ ├── adController.js
│ ├── authController.js
│ ├── propertyController.js
│ └── userController.js
│
├── routes
│ ├── adRoutes.js
│ ├── authRoutes.js
│ ├── propertyRoutes.js
│ └── userRoutes.js
│
├── middlewares
│ ├── authMiddleware.js
│ ├── errorHandler.js
│ └── validationMiddleware.js
│
└── models
├── Ad.js
├── Request.js
├── User.js
└── otherModels.js

## Instructions to Run the Backend

- Install Node.js and npm.
- Clone this repository to your local machine.
- Navigate to the project directory in your terminal.
- Install dependencies using the command:
  ```bash
  npm install
  ```
- Run using the command:
  ```bash
  npm start
  ```

## Api Routes

### Ad Routes

- `POST /ads`: Create Ad (Agent only)

  - Endpoint for creating ads. Only accessible to agents.
  - Request Body: JSON object containing ad details.
  - Middleware: `isAgent` to ensure only agents can access this endpoint.
  - Controller: `adController.createAd`.

- `GET /ads/match/:adId`: Get Matching Requests

  - Endpoint to match property requests with relevant ads based on district, price, and area.
  - Request Parameter: `adId` - The ID of the ad to match requests against.
  - Controller: `adController.getMatchingRequests`.

- `PUT /ads/:adId`: Update Ad (Agent only)

  - Endpoint for updating existing ads. Only accessible to agents.
  - Request Parameter: `adId` - The ID of the ad to update.
  - Request Body: JSON object containing updated ad details.
  - Middleware: `isAgent` to ensure only agents can access this endpoint.
  - Controller: `adController.updateAd`.

### Admin Routes

- `GET /admin/statistics`: Get User Statistics
  - Endpoint to get statistics about users, including ad and request counts.
  - Middleware: `isAdmin` to ensure only admin users can access this endpoint.
  - Controller: `adminController.getUserStats`.

### Authentication Routes

- `POST /auth/login`: User Login

  - Endpoint for user login.
  - Request Body: JSON object containing user credentials (email/username and password).
  - Controller: `authController.login`.

- `POST /auth/signup`: User Signup

  - Endpoint for user signup.
  - Request Body: JSON object containing user details for signup.
  - Controller: `authController.signup`.

### Property Routes

- `POST /property`: Create Property Request (Client only)

  - Endpoint for creating property requests.
  - Request Body: JSON object containing property request details.
  - Middleware: `isClient` to ensure only clients can access this endpoint.
  - Controller: `propertyController.createPropertyRequest`.

- `PATCH /property/:requestId`: Update Property Request (Client only)

  - Endpoint for updating existing property requests.
  - Request Parameter: `requestId` - The ID of the property request to update.
  - Request Body: JSON object containing updated property request details.
  - Middleware: `isClient` to ensure only clients can access this endpoint.
  - Controller: `propertyController.updatePropertyRequest`.
