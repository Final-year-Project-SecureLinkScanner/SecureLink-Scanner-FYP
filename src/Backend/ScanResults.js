const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
  url: { type: String, required: true },
  scanDate: { type: Date, default: Date.now },
  googleSafeBrowsing: {
    status: String,
    details: String
  },
  mlResult: {
    prediction: String,
    warningLevel: String,
    phishingConfidence: Number,
    legitimateConfidence: Number
  }
});

module.exports = mongoose.model('ScanResult', scanResultSchema);
