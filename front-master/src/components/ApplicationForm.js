import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getJob, applyToJob, isAuthenticated, getUserRole, uploadFile } from '../api';
import './ApplicationForm.css';

function ApplicationForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    resume: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'seeker') {
      navigate('/login?role=seeker');
      return;
    }

    // Fetch job details
    const fetchJob = async () => {
      try {
        const jobData = await getJob(jobId);
        setJob(jobData);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Upload resume to Cloudinary first
      let resumeUrl = formData.resume;
      if (formData.resume instanceof File) {
        resumeUrl = await uploadFile(formData.resume);
      }

      // Submit application to backend
      await applyToJob(parseInt(jobId), resumeUrl);

      // Redirect to seeker dashboard
      navigate('/seeker-dashboard');
    } catch (err) {
  console.error('Error submitting application:', err);
  
  const errorData = err.response?.data;
  const errorMessage = errorData?.message || errorData?.error || 'Failed to submit application.';
  
  setError(errorMessage); 
} finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="application-form">Loading...</div>;
  }

  if (!job) {
    return <div className="application-form">Job not found</div>;
  }

  return (
    <div className="application-form">
      <Link to="/jobs" className="back-link">← Back to Jobs</Link>
      <h2>Apply for {job.title}</h2>
      <p><strong>Company:</strong> {job.employer?.full_name || 'Company'}</p>
      <p><strong>Location:</strong> {job.location}</p>

      {error && <div className="error-message">{error.message || error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="resume">Resume (PDF, DOC, DOCX)</label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            required
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;
