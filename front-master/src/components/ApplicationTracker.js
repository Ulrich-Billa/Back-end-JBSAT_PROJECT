import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../api';
import './ApplicationTracker.css';

function ApplicationTracker() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'seeker') {
      navigate('/login?role=seeker');
      return;
    }

    const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token'); // Vérifie le nom de ta clé
      
      const response = await fetch('http://localhost:8000/api/seeker/applications/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les candidatures. Vérifiez que le backend est lancé.");
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
}, [navigate]);

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'NEW': return 'new';
      case 'REVIEWING': return 'reviewing';
      case 'ACCEPTED': return 'accepted';
      case 'REJECTED': return 'rejected';
      default: return '';
    }
  };

  return (
    <div className="application-tracker">
      <header>
        <h1>Application Tracker</h1>
        <Link to="/seeker-dashboard" className="back-link">Back to Dashboard</Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="applications-section">
        <h2>My Applications</h2>

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <div className="applications-list">
            
            {applications.length === 0 ? (
              <p className="empty-state">You haven't applied to any jobs yet.</p>
            ) : (
              applications.map(app => (
                <div key={app.id} className="application-card">
                  <h3>Application for: {app.job_title}</h3>
                  <p>Status: <span className={`status ${getStatusClass(app.status)}`}>{app.status}</span></p>
                  <p>Applied: {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationTracker;
