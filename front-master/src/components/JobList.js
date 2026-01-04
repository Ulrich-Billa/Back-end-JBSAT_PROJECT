import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../api';
import './JobList.css';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === '' ||
                           job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="job-list">
        <header>
          <h1>Available Jobs</h1>
          <Link to="/" className="back-link">Back to Home</Link>
        </header>
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="job-list">
      <header>
        <h1>Available Jobs</h1>
        <Link to="/" className="back-link">Back to Home</Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="location-filter">
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="jobs-container">
        {filteredJobs.length === 0 ? (
          <p className="no-jobs">No jobs found matching your criteria.</p>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h2>{job.title}</h2>
                <p className="company">{job.employer?.full_name || 'Company'}</p>
              </div>
              <div className="job-details">
                <p className="location">📍 {job.location}</p>
                <p className="employment-type">💼 {job.employment_type}</p>
                <p className="posted-date">📅 Posted: {new Date(job.created_at).toLocaleDateString()}</p>
              </div>
              <p className="description">{job.description}</p>
              <Link to={`/apply/${job.id}`} className="apply-btn">Apply Now</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobList;
