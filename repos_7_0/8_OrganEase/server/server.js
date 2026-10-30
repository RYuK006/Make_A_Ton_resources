const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongodb');
const merchentrouter = require('./router/merchentrouter');
const event = require('./router/eventrouter');
const Opinion = require('./model/FoodOpiniondb');
const Review = require('./model/Review');
const http = require('http');
const initializeSocket = require('./socket'); // Import the socket.js file

dotenv.config();

const app = express();
const server = http.createServer(app); // Create server for both express and socket.io

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Connect to MongoDB
connectDB();

// Existing Routes
app.use('/api/merchants', merchentrouter);
app.use('/api/events', event);

// Initialize Socket.io
initializeSocket(server); // Pass server to the socket.js function

// Start server
const PORT = process.env.PORT || 5000;




app.use('/api',merchentrouter);
app.use('/api',event);
// const Opinion = require('./model/FoodOpiniondb'); // Adjust the path as necessary
// const Review = require('./model/Review'); // Adjust this according to your Review model file




// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
