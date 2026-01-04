import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJobs, getEmployerApplications, updateApplicationStatus, isAuthenticated, getUserRole } from '../api';
import './EmployerDashboard.css';

function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'employer') {
      navigate('/login?role=employer');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, applicationsData] = await Promise.all([
        getJobs(),
        getEmployerApplications()
      ]);
      
      console.log("Job data from Django:", jobsData[0]);

      setJobs(jobsData);
      setApplications(applicationsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
      if (err.response?.status === 401) {
        navigate('/login?role=employer');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update application status');
    }
  };

  if (loading) {
    return <div className="employer-dashboard">Loading...</div>;
  }

  return (
    <div className="employer-dashboard">
      <header>
        <h1>Employer Dashboard</h1>
        <Link to="/" className="back-link">Back to Home</Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="jobs-section">
          <Link to="/post-job" className="post-job-btn">Post New Job</Link>
          <h2>Your Job Postings ({jobs.length})</h2>
          <div className="jobs-list">
            {jobs.length === 0 ? (
              <p>No job postings yet. Create your first job posting!</p>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>📍 {job.location}</p>
                  <p>💼 {job.employment_type}</p>
                  <p>📅 Posted: {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US') : "Not specified"}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="applications-section">
          <h2>Applications ({applications.length})</h2>
          <div className="applications-list">
            {applications.length === 0 ? (
              <p>No applications received yet.</p>
            ) : (
              applications.map(app => (
                <div key={app.id} className="application-card">
                  <h3>Job: {app.job_title}</h3>
                  <p>Applicant: {app.seeker_name}</p>
                  <p>Email: {app.seeker?.email || 'N/A'}</p>
                  <p>Resume: <a href={app.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                  <p>Applied: {app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-US') : "Not specified"}</p>
                  <div className="status-select">
                    <label>Status: </label>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="NEW">New</option>
                      <option value="REVIEWING">Reviewing</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
