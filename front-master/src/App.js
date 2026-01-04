import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import EmployerDashboard from './components/EmployerDashboard';
import JobSeekerDashboard from './components/JobSeekerDashboard';
import JobPostingForm from './components/JobPostingForm';
import JobList from './components/JobList';
import ApplicationForm from './components/ApplicationForm';
import ApplicationTracker from './components/ApplicationTracker';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/seeker-dashboard" element={<JobSeekerDashboard />} />
          <Route path="/post-job" element={<JobPostingForm />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/apply/:jobId" element={<ApplicationForm />} />
          <Route path="/applications" element={<ApplicationTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
