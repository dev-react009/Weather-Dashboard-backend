require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Access environment variables
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
console.log(WEATHER_API_KEY)
// Weather API URLs
const CURRENT_BASE_URL = 'https://api.weatherapi.com/v1/current.json';
const FUTURE_BASE_URL = 'https://api.weatherapi.com/v1/future.json';
const FORECAST_BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

// In-memory data store for historical weather data
let historicalData = {};

// Middleware to parse JSON bodies and handle CORS
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

// GET /api/current - Fetch current weather data
app.get('/api/current', async (req, res) => {
    try {
        const response = await axios.get(`${CURRENT_BASE_URL}?key=${WEATHER_API_KEY}&q=London&aqi=no`);
        const data = response.data;
        const formattedData = { location: data.location, current: data.current };

        const sensorId = "sensor1";
        if (!historicalData[sensorId]) historicalData[sensorId] = [];
        historicalData[sensorId].push(formattedData.current);

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// GET /api/history - Fetch historical data
app.get('/api/history', (req, res) => {
    const { sensorId } = req.query;
    if (historicalData[sensorId]) {
        res.json(historicalData[sensorId]);
    } else {
        res.status(404).json({ message: 'Sensor not found' });
    }
});

// Start the server only in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// Export app for Vercel
module.exports = app;
