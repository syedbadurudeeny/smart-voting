const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
const bodyParser = require('body-parser');
const ConnectDb = require('./dbConnection/connectDb');
const path = require('path');


ConnectDb(); // Make sure your DB connection is set up

// Middleware for handling CORS, JSON and URL encoded data
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import and use routes
app.use('/api/user', require('./Routers/userRouter')); // Correct route import

// Start the server
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
