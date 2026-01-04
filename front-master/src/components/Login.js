import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import { login, } from '../api'; //  isAuthenticated

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL query parameter
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const defaultRole = urlParams.get('role') || 'seeker';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: defaultRole
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already authenticated
//   // Login.js
// useEffect(() => {
//   if (isAuthenticated()) {
//     const savedRole = localStorage.getItem('userRole'); 
//     if (savedRole === 'employer') {
//       navigate('/employer-dashboard');
//     } else if (savedRole === 'seeker') {
//       navigate('/seeker-dashboard');
//     }
//   }
// }, [navigate]); 

  useEffect(() => {
    // Update role if URL parameter changes
    const roleParam = urlParams.get('role');
    if (roleParam && roleParam !== formData.role) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [urlParams, formData.role]);

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
      // Call backend API for JWT authentication
      const response = await login(formData.email, formData.password);

      // Store tokens in localStorage
      localStorage.clear();
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('isAuthenticated', 'true');

      // Redirect based on role
      if (formData.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.detail ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to JBSAT</h2>
        <p>Job Board with Simple Applicant Tracker</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="register-link">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>

        <div className="demo-note">
          <small><em>Note: Use credentials registered via the Register page</em></small>
        </div>
      </div>
    </div>
  );
}

export default Login;
