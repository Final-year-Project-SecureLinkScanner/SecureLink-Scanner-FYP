const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const ScanResult = require('./ScanResults');
require('dotenv').config({ path: '../../.env' });

const API_KEY = process.env.GOOGLE_API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const MONGO_URI = process.env.MONGO_URI;

const API_ENDPOINT = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;
const app = express();
const port = 3001;
//debugging
console.log("Loaded GOOGLE_API_KEY:", API_KEY);
console.log("Loaded PROJECT_ID:", PROJECT_ID);

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("*** MongoDB connected ***"))
  .catch(err => console.error(" MongoDB connection error:", err));

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

//  GOOGLE SAFE BROWSING SCAN + SAVE TO MONGO
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
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }]
      }
    };

    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
      validateStatus: (status) => status === 200
    });

    const isUnsafe = response.data && response.data.matches && response.data.matches.length > 0;

    const result = {
      url,
      googleSafeBrowsing: {
        status: isUnsafe ? "Unsafe" : "Safe",
        details: isUnsafe
          ? "This URL has been flagged as potentially dangerous."
          : "No threats detected for this URL."
      }
    };

    //  Save to MongoDB
    await new ScanResult(result).save();

    //  Return the Google scan part to frontend
    res.json(result.googleSafeBrowsing);

  } catch (error) {
    console.error('API Error:', {
      projectId: PROJECT_ID,
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      details: error.response?.data
    });

    res.status(500).json({
      error: 'Failed to check URL safety',
      details: error.message
    });
  }
});

// Existing ML Endpoint 
app.post('/api/log-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const cleanedUrl = url.trim();

    const response = await axios.post(
      'http://127.0.0.1:5000/api/predict-url',
      { url: cleanedUrl },
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding to Python API:', error.message);
    res.status(500).json({ error: 'Failed to forward URL to Python API' });
  }
});

// GET all stored scan results
app.get('/api/urls', async (req, res) => {
    try {
      const results = await ScanResult.find().sort({ scanDate: -1 });
      res.json(results);
    } catch (error) {
      console.error(" Failed to fetch URL scan results:", error.message);
      res.status(500).json({ error: "Failed to fetch scan results" });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
