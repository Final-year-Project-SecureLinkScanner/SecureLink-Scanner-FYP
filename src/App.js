import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PreviousSearches from './Pages/previous-searches';
import Contact from './Pages/Contact';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loadingSafeBrowsing, setLoadingSafeBrowsing] = useState(false);
  const [loadingManualTest, setLoadingManualTest] = useState(false);
  const [manualTestResult, setManualTestResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSafeBrowsingCheck = async (e) => {
    e.preventDefault();
    setLoadingSafeBrowsing(true);
    setError(null);
    
    let urlToCheck = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlToCheck = 'http://' + url;
    }
    
    try {
        const response = await axios.post('http://localhost:3001/api/check-url', { url: urlToCheck });
        setResult(response.data);
    } catch (error) {
        setError(error.response?.data?.details || 'Unable to check URL. Please try again.');
    } finally {
        setLoadingSafeBrowsing(false);
    }
  };

  const handleManualTest = async () => {
    if (!url) {
        setManualTestResult({ error: 'Please enter a URL first' });
        return;
    }

    setLoadingManualTest(true);
    try {
        const cleanedUrl = url.trim();
        const response = await axios.post(
            'http://localhost:3001/api/log-url',
            { url: cleanedUrl },
            { headers: { 'Content-Type': 'application/json' } }
        );
        setManualTestResult(response.data);
    } catch (error) {
        setManualTestResult({
            error: error.response?.data?.message || 'Failed to perform manual test'
        });
    } finally {
        setLoadingManualTest(false);
    }
  };

  return (
    <Router>
      <nav className="navbar">
        <h1>SecureLink Scanner</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/previous-searches">View Previous Searches</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="homepage">
              <h1>SecureLink Scanner</h1>
              <p>Enter a URL to check its legitimacy:</p>
              <form onSubmit={handleSafeBrowsingCheck} className="url-form">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL"
                  required
                />
                <button type="submit" disabled={loadingSafeBrowsing}>
                  {loadingSafeBrowsing ? 'Checking...' : 'Check Google Safe Browsing'}
                </button>
              </form>

              <button
                className="manual-test-button"
                onClick={handleManualTest}
                disabled={loadingManualTest}
              >
                {loadingManualTest ? 'Logging...' : 'Run script checker'}
              </button>

              {loadingManualTest && <div className="loading-spinner"></div>}

              {manualTestResult && (
                <div className="manual-test-result">
                  {manualTestResult.error ? (
                    <p className="error">{manualTestResult.error}</p>
                  ) : (
                    <div>
                      <h2>Manual Test Results</h2>
                      <p>Status: {manualTestResult.Prediction}</p>
                      <p>Warning Level: {manualTestResult['Warning Level']}</p>
                      <div className="progress-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <div className="progress-item" style={{ width: '150px' }}>
                          <p>Legitimate Confidence</p>
                          <CircularProgressbar 
                            value={parseFloat(manualTestResult['Legitimate Confidence'])} 
                            text={`${manualTestResult['Legitimate Confidence']}`} 
                            styles={buildStyles({ pathColor: 'green', textColor: 'black' })} 
                          />
                        </div>
                        <div className="progress-item" style={{ width: '150px' }}>
                          <p>Phishing Confidence</p>
                          <CircularProgressbar 
                            value={parseFloat(manualTestResult['Phishing Confidence'])} 
                            text={`${manualTestResult['Phishing Confidence']}`} 
                            styles={buildStyles({ pathColor: 'red', textColor: 'black' })} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && <p className="error">{error}</p>}
            </div>
          }
        />
        <Route path="/previous-searches" element={<PreviousSearches />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;