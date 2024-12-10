const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001; // different port to avoid conflict with React server

// Middleware
const corsOptions = {
    origin: "http://localhost:3000", //  React frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions)); // Allow frontend to communicate with the backend
app.use(express.json()); // Parse JSON bodies

// Google Safe Browsing API configuration
const API_KEY = "AIzaSyBmA7PMdf7uaK8nBBZbbPbu4OkoIFlx5rI";
const PROJECT_ID = "fyp-securelink-scanner";
const API_ENDPOINT = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

// API endpoints
// Endpoint to forward URL to Python API
app.post('/api/log-url', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Forward the URL to the Python API
        const response = await axios.post('http://127.0.0.1:5000/api/log-url', { url });
        res.json(response.data);
    } catch (error) {
        console.error('Error forwarding to Python API:', error.message);
        res.status(500).json({ error: 'Failed to forward URL to Python API' });
    }
});

app.post('/api/check-url', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const requestBody = {
            client: {
                clientId: PROJECT_ID,
                clientVersion: "1.0.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: url }]
            }
        };

        // Add timeout and validate SSL
        const response = await axios.post(API_ENDPOINT, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000,
            validateStatus: (status) => status === 200
        });
        
        // Process response
        if (response.data && response.data.matches && response.data.matches.length > 0) {
            res.json({
                status: "Unsafe",
                details: "This URL has been flagged as potentially dangerous."
            });
        } else {
            res.json({
                status: "Safe",
                details: "No threats detected for this URL."
            });
        }
    } catch (error) {
        // More error handling
        console.error('API Error:', {
            projectId: PROJECT_ID,
            status: error.response?.status,
            message: error.response?.data?.error?.message || error.message,
            details: error.response?.data
        });

        if (error.response?.status === 403) {
            res.status(500).json({
                error: 'API Configuration Error',
                details: 'The Safe Browsing API needs to be enabled in Google Cloud Console'
            });
        } else {
            res.status(500).json({
                error: 'Failed to check URL safety',
                details: error.message
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
