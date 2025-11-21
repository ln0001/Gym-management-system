import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ViewDetails from './ViewDetails';
import SearchRecords from './SearchRecords';
import './UserDashboard.css';

const UserDashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="user-dashboard">
      <nav className="user-nav">
        <div className="nav-brand">
          <h2>GYM Management</h2>
          <span className="user-info">User: {currentUser?.email}</span>
        </div>
        <div className="nav-links">
          <Link to="/user/details">View Details</Link>
          <Link to="/user/search">Search Records</Link>
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="user-content">
        <Routes>
          <Route path="/" element={<ViewDetails />} />
          <Route path="/details" element={<ViewDetails />} />
          <Route path="/search" element={<SearchRecords />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;

