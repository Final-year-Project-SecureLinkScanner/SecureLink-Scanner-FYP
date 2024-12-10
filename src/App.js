import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PreviousSearches from './Pages/previous-searches';
import Contact from './Pages/Contact';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualTestResult, setManualTestResult] = useState(null);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic URL validation
    let urlToCheck = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlToCheck = 'http://' + url;
    }
    
    try {
        const response = await axios.post('http://localhost:3001/api/check-url', { 
            url: urlToCheck 
        });
        setResult(response.data);
    } catch (error) {
        console.error("Error checking URL:", error.response?.data || error.message);
        setResult({ 
            error: error.response?.data?.details || 'Unable to check URL. Please try again.' 
        });
    } finally {
        setLoading(false);
    }
  };

  const handleManualTest = async () => {
    if (!url) {
      setManualTestResult({ error: 'Please enter a URL first' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/log-url', { 
        url: url.startsWith('http') ? url : `http://${url}` 
      });
      setManualTestResult({ response: response.data.message });
    } catch (error) {
      setManualTestResult({ 
        error: error.response?.data?.message || 'Failed to perform manual test' 
      });
    } finally {
      setLoading(false);
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
              <form onSubmit={handleSubmit} className="url-form">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL"
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Checking...' : 'Check URL Safety'}
                </button>
              </form>

              <button
                className="manual-test-button"
                onClick={handleManualTest}
                disabled={loading}
              >
                {loading ? 'Logging...' : 'Run script checker'}
              </button>

              {result && (
                <div className="result">
                  {result.error ? (
                    <p className="error">{result.error}</p>
                  ) : (
                    <div>
                      <h2>URL Analysis Results</h2>
                      <p>Status: {result.status}</p>
                      <p>Details: {result.details}</p>
                    </div>
                  )}
                </div>
              )}

              {manualTestResult && (
                <div className="manual-test-result">
                  {manualTestResult.error ? (
                    <p className="error">{manualTestResult.error}</p>
                  ) : (
                    <div>
                      <h2>Manual Test Results</h2>
                      <p>Message: {manualTestResult.response}</p>
                    </div>
                  )}
                </div>
              )}
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
