import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './URLDatabase.css'; 

function URLDatabase() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="url-database">
      <h1>Scanned URLs Database</h1>

      {loading && <p>Loading scan results...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && urls.length === 0 && <p>No scan results yet.</p>}

      {!loading && urls.length > 0 && (
        <table className="scan-table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Google Status</th>
              <th>Details</th>
              <th>Scanned At</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((item) => (
              <tr key={item._id}>
                <td>{item.url}</td>
                <td>{item.googleSafeBrowsing?.status || 'N/A'}</td>
                <td>{item.googleSafeBrowsing?.details || 'N/A'}</td>
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
