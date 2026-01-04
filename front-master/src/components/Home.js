import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1>Job Board with Simple Applicant Tracker (JBSAT)</h1>
      <div className="auth-section">
        <div className="role-login-section">
          <h3>Login as:</h3>
          <div className="role-login-buttons">
            <div className="login-option">
              <Link to="/login?role=employer" className="role-login-btn employer">
                Employer Login
              </Link>
            </div>
            <div className="login-option">
              <Link to="/login?role=seeker" className="role-login-btn seeker">
                Job Seeker Login
              </Link>
            </div>
          </div>
        </div>

        <div className="register-section">
          <div className="register-info">
            
            <Link to="/register" className="register-link">Create an account →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
