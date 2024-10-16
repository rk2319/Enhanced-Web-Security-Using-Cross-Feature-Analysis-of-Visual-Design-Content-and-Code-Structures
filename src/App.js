import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS for styling

function App() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidUrl(url)) {
      alert("Please enter a valid URL.");
      return;
    }
    setLoading(true);
    setReport(null);
    
    try {
      // new server link https://backend-pxe8.onrender.com
      const response = await axios.post('https://backend-pxe8.onrender.com/scan', { url });
      setReport(response.data);
    } catch (error) {
      console.error("Error scanning the URL:", error.response ? error.response.data : error.message);
      alert("Failed to scan the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\\.)+[a-z]{2,6}|' + // domain name
      'localhost|' + // localhost
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP address
      '(\\:\\d+)?(\\/[-a-z0-9@:%_+.~#?&//=]*)?$', 'i'); // port and path
    return !!pattern.test(url);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>URL Vulnerability Scanner</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </button>
        </form>

        {report && (
          <div>
            <h2>Scan Report for: {report.url}</h2>
            <p><strong>Scan Time:</strong> {report.scan_time} seconds</p>
            <h3>Vulnerabilities Detected:</h3>
            <ul>
              <li>XSS: {report.vulnerabilities.XSS ? "Yes" : "No"}</li>
              <li>SQL Injection: {report.vulnerabilities.SQL_Injection ? "Yes" : "No"}</li>
              <li>CSRF: {report.vulnerabilities.CSRF ? "Yes" : "No"}</li>
              <li>Other: {report.vulnerabilities.Other.join(', ')}</li>
            </ul>
            <p><strong>Risk Score:</strong> {report.risk_score}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
