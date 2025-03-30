import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './URLDatabase.css';

function URLDatabase() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchURLs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/urls');
        setUrls(response.data);
      } catch (err) {
        console.error('Failed to fetch URLs:', err.message);
        setError('Failed to load URL scan data.');
      } finally {
        setLoading(false);
      }
    };

    fetchURLs();
  }, []);

  const filteredUrls = urls.filter((item) => {
    const prediction = item.mlResult?.prediction?.toLowerCase();
  
    if (filter === 'phishing') return prediction === 'phishing' || prediction === 'suspicious';
    if (filter === 'legit') return prediction === 'legitimate';
    return true;
  });
  

  return (
    <div className="url-database">
      <h1>Scanned URLs Database</h1>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('phishing')} className={filter === 'phishing' ? 'active' : ''}>Phishing</button>
        <button onClick={() => setFilter('legit')} className={filter === 'legit' ? 'active' : ''}>Legitimate</button>
      </div>

      {loading && <p>Loading scan results...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && filteredUrls.length === 0 && <p>No matching results found.</p>}

      {!loading && filteredUrls.length > 0 && (
        <table className="scan-table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Google Status</th>
              <th>Google Details</th>
              <th>ML Prediction</th>
              <th>Warning Level</th>
              <th>Phishing %</th>
              <th>Legitimate %</th>
              <th>Scanned At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUrls.map((item) => (
              <tr key={item._id}>
                <td>{item.url}</td>
                <td>{item.googleSafeBrowsing?.status || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${item.googleSafeBrowsing?.status?.toLowerCase()}`}>
                    {item.googleSafeBrowsing?.status || 'N/A'}
                  </span>
                </td>

                <td>
                  <span className={`ml-badge ${item.mlResult?.prediction?.toLowerCase()}`}>
                    {item.mlResult?.prediction || 'N/A'}
                  </span>
                </td>
                <td>{item.mlResult?.warningLevel || 'N/A'}</td>
                <td>{item.mlResult?.phishingConfidence ?? 'N/A'}%</td>
                <td>{item.mlResult?.legitimateConfidence ?? 'N/A'}%</td>
                <td>{new Date(item.scanDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default URLDatabase;
