const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Weather API configuration
const WEATHER_API_KEY = 'fdc33007428f499db1c101209242109';
const CURRENT_BASE_URL = 'https://api.weatherapi.com/v1/current.json';
const FUTURE_BASE_URL = 'https://api.weatherapi.com/v1/future.json';
const FORECAST_BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

// In-memory data store for historical weather data
let historicalData = {};

// Middleware to parse JSON bodies and handle CORS
app.use(express.json());
app.use(cors());

// GET /api/current - Fetch current weather data for London
app.get('/api/current', async (req, res) => {
    try {
        const response = await axios.get(`${CURRENT_BASE_URL}?key=${WEATHER_API_KEY}&q=London&aqi=no`);
        const data = response.data;

        const formattedData = {
            location: data.location,
            current: data.current,
        };

        // Store the data for sensor1
        const sensorId = "sensor1";
        if (!historicalData[sensorId]) historicalData[sensorId] = [];
        historicalData[sensorId].push(formattedData.current);

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// GET /api/history - Fetch historical data for a sensor
app.get('/api/history', (req, res) => {
    const { sensorId } = req.query;
    if (historicalData[sensorId]) {
        res.json(historicalData[sensorId]);
    } else {
        res.status(404).json({ message: 'Sensor not found' });
    }
});

// Export the app for Vercel
module.exports = app;
