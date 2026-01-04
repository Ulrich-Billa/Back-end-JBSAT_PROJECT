import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSeekerApplications,isAuthenticated, getUserRole } from '../api';
import './JobSeekerDashboard.css';

function JobSeekerDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSeekerApplications();
      setApplications(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const checkAuth = () => {
    if (!isAuthenticated() || getUserRole() !== 'seeker') {
      navigate('/login?role=seeker');
    } else {
      fetchData(); 
    }
  };
  checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [navigate]);

  return (
    <div className="job-seeker-dashboard">
      <header>
        <h1>Job Seeker Dashboard</h1>
        <Link to="/" className="back-link">Back to Home</Link>
      </header>
      <div className="dashboard-content">
        <div className="actions-section">
          <Link to="/jobs" className="action-btn">Browse Jobs</Link>
          <Link to="/applications" className="action-btn">My Applications</Link>
        </div>
        <div className="applications-section">
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <h2>My Applications</h2>
          <div className="applications-list">
            {loading ? (
  <p>Loading your applications...</p>
) : (
  <div className="applications-list">
    {applications && applications.length > 0 ? (
      applications.map(app => (
        <div key={app.id} className="application-card">
          <h4>{app.job_title}</h4>
          <p>Status: <span className={`status-${app.status.toLowerCase()}`}>{app.status}</span></p>
          <p>Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
        </div>
      ))
    ) : (
      <div className="no-data">
        <p>You haven't applied to any jobs yet.</p>
        <Link to="/jobs" className="browse-btn">Find a Job</Link>
      </div>
    )}
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
