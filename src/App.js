import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import URLDatabase from './Pages/URLDatabase';
import Contact from './Pages/Contact';

function App() {
  const [url, setUrl] = useState('');
  const [googleResult, setGoogleResult] = useState(null);
  const [mlResult, setMlResult] = useState(null);
  const [loadingSafeBrowsing, setLoadingSafeBrowsing] = useState(false);
  const [loadingManualTest, setLoadingManualTest] = useState(false);
  const [error, setError] = useState(null);

  const handleSafeBrowsingCheck = async (e) => {
    e.preventDefault();
    setLoadingSafeBrowsing(true);
    setError(null);
    setGoogleResult(null);

    let urlToCheck = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToCheck = 'http://' + url;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/check-url', { url: urlToCheck });
      setGoogleResult(response.data);
    } catch (error) {
      setError(error.response?.data?.details || 'Unable to check URL. Please try again.');
    } finally {
      setLoadingSafeBrowsing(false);
    }
  };

  const handleManualTest = async () => {
    if (!url) {
      setMlResult({ error: 'Please enter a URL first' });
      return;
    }

    setLoadingManualTest(true);
    setMlResult(null);
    setError(null);

    try {
      const cleanedUrl = url.trim();
      const response = await axios.post(
        'http://localhost:3001/api/log-url',
        { url: cleanedUrl },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMlResult(response.data);
    } catch (error) {
      setMlResult({
        error: error.response?.data?.message || 'Failed to perform manual test'
      });
    } finally {
      setLoadingManualTest(false);
    }
  };

  const buildKasmURL = (inputUrl) => {
    const formatted = inputUrl.startsWith('http') ? inputUrl : 'https://' + inputUrl;
    return `https://172-237-116-195.ip.linodeusercontent.com/#/client?workspace_id=36fc10c0f6024c4c95de499baa297fc6&launch_url=${encodeURIComponent(formatted)}`;
  };

  return (
    <Router>
      <nav className="navbar">
        <h1>SecureLink Scanner</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/URLDatabase">View URLDatabase</Link></li>
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

              {googleResult && (
                <div className="google-result">
                  <h2>Google Safe Browsing Result</h2>
                  <p>Status: {googleResult.status}</p>
                  <p>Details: {googleResult.details}</p>
                </div>
              )}

              <button
                className="manual-test-button"
                onClick={handleManualTest}
                disabled={loadingManualTest}
              >
                {loadingManualTest ? 'Logging...' : 'Run script checker'}
              </button>

              {loadingManualTest && <div className="loading-spinner"></div>}

              {mlResult && (
                <div className="manual-test-result">
                  {mlResult.error ? (
                    <p className="error">{mlResult.error}</p>
                  ) : (
                    <div>
                      <h2>ML Model Result</h2>
                      <p>Status: {mlResult.Prediction}</p>
                      <p>Warning Level: {mlResult['Warning Level']}</p>
                      <div className="progress-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <div className="progress-item" style={{ width: '150px' }}>
                          <p>Legitimate Confidence</p>
                          <CircularProgressbar
                            value={parseFloat(mlResult['Legitimate Confidence'])}
                            text={`${mlResult['Legitimate Confidence']}`}
                            styles={buildStyles({ pathColor: 'green', textColor: 'black' })}
                          />
                        </div>
                        <div className="progress-item" style={{ width: '150px' }}>
                          <p>Phishing Confidence</p>
                          <CircularProgressbar
                            value={parseFloat(mlResult['Phishing Confidence'])}
                            text={`${mlResult['Phishing Confidence']}`}
                            styles={buildStyles({ pathColor: 'red', textColor: 'black' })}
                          />
                        </div>
                      </div>

                      {(mlResult.Prediction === 'PHISHING' || mlResult.Prediction === 'SUSPICIOUS') && (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                          <a
                            className="kasm-button"
                            href={buildKasmURL(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            🛡️ Open URL in Kasm Secure Browser
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {error && <p className="error">{error}</p>}
            </div>
          }
        />
        <Route path="/URLDatabase" element={<URLDatabase />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
