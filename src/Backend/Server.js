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
const port = process.env.PORT || 3001; // Required for Render

console.log("Loaded GOOGLE_API_KEY:", API_KEY);
console.log("Loaded PROJECT_ID:", PROJECT_ID);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Allow Firebase frontend to access this backend
app.use(cors({
  origin: ["http://localhost:3000", "https://link-scanner-98939.web.app"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

//  Normalise URL
function normalizeUrl(inputUrl) {
  try {
    let clean = inputUrl.trim().toLowerCase();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return inputUrl;
  }
}

// Google Safe Browsing check
app.post('/api/check-url', async (req, res) => {
  try {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const normalizedUrl = normalizeUrl(url);
    const fullUrlForAPI = `https://${normalizedUrl}`;

    const requestBody = {
      client: { clientId: PROJECT_ID, clientVersion: "1.0.0" },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: fullUrlForAPI }]
      }
    };

    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
      validateStatus: (status) => status === 200
    });

    const isUnsafe = response.data?.matches?.length > 0;

    const googleResult = {
      status: isUnsafe ? "Unsafe" : "Safe",
      details: isUnsafe
        ? "This URL has been flagged as potentially dangerous."
        : "No threats detected for this URL."
    };

    await ScanResult.findOneAndUpdate(
      { url: normalizedUrl },
      {
        url: normalizedUrl,
        googleSafeBrowsing: googleResult,
        scanDate: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(googleResult);

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

//ML Model Scan
app.post('/api/log-url', async (req, res) => {
  try {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const normalizedUrl = normalizeUrl(url);
    const fullUrlForAPI = `https://${normalizedUrl}`;

    const response = await axios.post(
      'https://mlmodel-ke7i.onrender.com/api/predict-url',
      { url: fullUrlForAPI },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data;

    await ScanResult.findOneAndUpdate(
      { url: normalizedUrl },
      {
        url: normalizedUrl,
        mlResult: {
          prediction: data.Prediction,
          warningLevel: data["Warning Level"],
          phishingConfidence: parseFloat(data["Phishing Confidence"]),
          legitimateConfidence: parseFloat(data["Legitimate Confidence"])
        },
        scanDate: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(data);

  } catch (error) {
    console.error('Error forwarding to Python API:', error.message);
    res.status(500).json({ error: 'Failed to forward URL to Python API' });
  }
});

// Return All Stored Scans
app.get('/api/urls', async (req, res) => {
  try {
    const results = await ScanResult.find().sort({ scanDate: -1 });
    res.json(results);
  } catch (error) {
    console.error("Failed to fetch scan results:", error.message);
    res.status(500).json({ error: "Failed to fetch scan results" });
  }
});

// Using Render's port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
