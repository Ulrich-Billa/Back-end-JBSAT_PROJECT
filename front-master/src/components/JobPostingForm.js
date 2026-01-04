import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createJob, isAuthenticated, getUserRole } from '../api';
import './JobPostingForm.css';

function JobPostingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    employment_type: 'FULL_TIME',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated() || getUserRole() !== 'employer') {
      navigate('/login?role=employer');
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createJob(formData);
      navigate('/employer-dashboard');
    } catch (err) {
      console.error('Error creating job:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to create job posting. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-posting-form">
      <Link to="/employer-dashboard" className="back-link">← Back to Dashboard</Link>
      <h2>Post a New Job</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Software Engineer"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Remote, New York, etc."
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="employment_type">Employment Type</label>
          <select
            id="employment_type"
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="FREELANCE">Freelance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the job responsibilities and requirements..."
            required
            disabled={loading}
            rows="5"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}

export default JobPostingForm;
