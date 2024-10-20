const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

// Weather API configuration
const WEATHER_API_KEY = 'fdc33007428f499db1c101209242109';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// In-memory data store for historical weather data
let historicalData = {};

// Middleware to parse JSON bodies
app.use(express.json());

// GET /api/current - Fetch current weather data for London
app.get('/api/current', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}?key=${WEATHER_API_KEY}&q=London&aqi=no`);
        const data = response.data;
        console.log(data)
        // Format the data to send all relevant fields
        const formattedData = {
            location: {
                name: data.location.name,
                region: data.location.region,
                country: data.location.country,
                lat: data.location.lat,
                lon: data.location.lon,
                tz_id: data.location.tz_id,
                localtime_epoch: data.location.localtime_epoch,
                localtime: data.location.localtime,
            },
            current: {
                last_updated_epoch: data.current.last_updated_epoch,
                last_updated: data.current.last_updated,
                temp_c: data.current.temp_c,
                temp_f: data.current.temp_f,
                is_day: data.current.is_day,
                condition: {
                    text: data.current.condition.text,
                    icon: `https:${data.current.condition.icon}`,
                    code: data.current.condition.code,
                },
                wind_mph: data.current.wind_mph,
                wind_kph: data.current.wind_kph,
                wind_degree: data.current.wind_degree,
                wind_dir: data.current.wind_dir,
                pressure_mb: data.current.pressure_mb,
                pressure_in: data.current.pressure_in,
                precip_mm: data.current.precip_mm,
                precip_in: data.current.precip_in,
                humidity: data.current.humidity,
                cloud: data.current.cloud,
                feelslike_c: data.current.feelslike_c,
                feelslike_f: data.current.feelslike_f,
                windchill_c: data.current.windchill_c,
                windchill_f: data.current.windchill_f,
                heatindex_c: data.current.heatindex_c,
                heatindex_f: data.current.heatindex_f,
                dewpoint_c: data.current.dewpoint_c,
                dewpoint_f: data.current.dewpoint_f,
                vis_km: data.current.vis_km,
                vis_miles: data.current.vis_miles,
                uv: data.current.uv,
                gust_mph: data.current.gust_mph,
                gust_kph: data.current.gust_kph,
            },
        };

        // Store historical data for the sensor (assuming one sensor for now)
        if (!historicalData["sensor1"]) {
            historicalData["sensor1"] = [];
        }
        historicalData["sensor1"].push(formattedData.current);

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// GET /api/history?sensorId={sensorId} - Fetch historical data for a specific sensor
app.get('/api/history', (req, res) => {
    const { sensorId } = req.query;
    if (historicalData[sensorId]) {
        res.json(historicalData[sensorId]);
    } else {
        res.status(404).json({ message: 'Sensor not found' });
    }
});

// POST /api/data - Accept new weather data from sensors
app.post('/api/data', (req, res) => {
    const { sensorId, data } = req.body;

    // Ensure sensorId and data are provided
    if (!sensorId || !data) {
        return res.status(400).json({ message: 'Sensor ID and data are required' });
    }

    // Store the incoming data
    if (!historicalData[sensorId]) {
        historicalData[sensorId] = [];
    }
    historicalData[sensorId].push(data);

    res.status(201).json({ message: 'Data added successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
