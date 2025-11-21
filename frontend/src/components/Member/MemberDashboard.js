import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ViewReceipts from './ViewReceipts';
import ViewNotifications from './ViewNotifications';
import './MemberDashboard.css';

const MemberDashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="member-dashboard">
      <nav className="member-nav">
        <div className="nav-brand">
          <h2>GYM Management</h2>
          <span className="user-info">Member: {currentUser?.email}</span>
        </div>
        <div className="nav-links">
          <Link to="/member/receipts">Bill Receipts</Link>
          <Link to="/member/notifications">Notifications</Link>
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="member-content">
        <Routes>
          <Route path="/" element={<ViewReceipts />} />
          <Route path="/receipts" element={<ViewReceipts />} />
          <Route path="/notifications" element={<ViewNotifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default MemberDashboard;

