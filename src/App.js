// App.js
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the backend API with the URL
      const response = await axios.post('/api/enter URL', { url });
      setResult(response.data);
    } catch (error) {
      console.error("Error checking URL:", error);
      setResult({ error: 'Unable to check URL. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar">
        <h1>SecureLink Scanner</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/previous-searches">View Previous Searches</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* Routes */}
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
                  {loading ? 'Checking...' : 'Check URL'}
                </button>
              </form>

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
