
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const app = express();

// // Access environment variables
// const PORT = process.env.PORT || 3000;
// const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// // Weather API URLs
// const CURRENT_BASE_URL = 'https://api.weatherapi.com/v1/current.json';
// const FUTURE_BASE_URL = 'https://api.weatherapi.com/v1/future.json';
// const FORECAST_BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

// // In-memory data store for historical weather data
// let historicalData = {};

// // CORS options
// const corsOptions = {
//     origin: 'http://localhost:5173', // Allow requests from this origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
// };
// // Middleware to parse JSON bodies and handle CORS
// app.use(express.json());
// app.use(cors(corsOptions));

// // Test route
// app.get('/', (req, res) => {
//     res.status(200).json({ message: "Server is running" });
// });

// // GET /api/current - Fetch current weather data
// app.get('/api/current', async (req, res) => {
    //     try {
        //         const response = await axios.get(`${CURRENT_BASE_URL}?key=${WEATHER_API_KEY}&q=London&aqi=no`);
        //         const data = response.data;
        //         const formattedData = { location: data.location, current: data.current };

//         const sensorId = "sensor1";
//         if (!historicalData[sensorId]) historicalData[sensorId] = [];
//         historicalData[sensorId].push(formattedData.current);

//         res.json(formattedData);
//     } catch (error) {
    //         console.error('Error fetching weather data:', error.message);
    //         res.status(500).json({ message: 'Error fetching weather data' });
    //     }
    // });

// // GET /api/history - Fetch historical data
// app.get('/api/history', (req, res) => {
    //     const { sensorId } = req.query;
    //     if (historicalData[sensorId]) {
//         res.json(historicalData[sensorId]);
//     } else {
//         res.status(404).json({ message: 'Sensor not found' });
//     }
// });

// // Start the server only in development

//     app.listen(PORT, () => {
//         console.log(`Server running at http://localhost:${PORT}`);
//     });


// // Export app for Vercel
// module.exports = app;




require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors')
const axios = require('axios');
const app = express();

// // Access environment variables
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;


// Weather API configuration
// const WEATHER_API_KEY ='c6ba2a3d4975440abcf25859242110';
const CURRENT_BASE_URL = 'https://api.weatherapi.com/v1/current.json';
const FUTURE_BASE_URL = 'https://api.weatherapi.com/v1/future.json';
const FORECAST_BASE_URL = 'https://api.weatherapi.com/v1/Forecast.json';


// In-memory data store for historical weather data
let historicalData = {};


// // CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors(corsOptions))
// GET /api/current - Fetch current weather data for London
app.get('/api/current', async (req, res) => {
    try {
        const response = await axios.get(`${CURRENT_BASE_URL}?key=${WEATHER_API_KEY}&q=London&aqi=no`);
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
        const sensorId = "sensor1"
        if (!historicalData[sensorId]) {
            historicalData["sensor1"] = [];
        }
        historicalData["sensor1"].push(formattedData.current);

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

//GET /forecast
app.get('/api/forecast', async (req, res) => {
    try {
        const response = await axios.get(`${FORECAST_BASE_URL}?key=${WEATHER_API_KEY}&q=London&aqi=no`);
        const data = response.data;
        console.log("forecast", data);
    }
    catch (error) {
        console.error('Error fetching weather data:', error.message);

    }
});

//GET /future

app.get('/api/future', async (req, res) => {
    try {
        const response = await axios.get(`${FUTURE_BASE_URL}?key=${WEATHER_API_KEY}&q=London&aqi=no`);
        const data = response.data;
        console.log("future", data);
    }
    catch (error) {
        console.error('Error fetching weather data:', error.message);

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


// // Export app for Vercel
module.exports = app;

