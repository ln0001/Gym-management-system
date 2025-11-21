import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';
import MemberManagement from './MemberManagement';
import BillManagement from './BillManagement';
import FeePackageManagement from './FeePackageManagement';
import NotificationManagement from './NotificationManagement';
import ReportExport from './ReportExport';
import SupplementStore from './SupplementStore';
import DietDetails from './DietDetails';

const AdminDashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('members');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-brand">
          <h2>GYM Management</h2>
          <span className="user-info">Admin: {currentUser?.email}</span>
        </div>
        <div className="nav-links">
          <Link
            to="/admin/members"
            className={activeTab === 'members' ? 'active' : ''}
            onClick={() => setActiveTab('members')}
          >
            Members
          </Link>
          <Link
            to="/admin/bills"
            className={activeTab === 'bills' ? 'active' : ''}
            onClick={() => setActiveTab('bills')}
          >
            Bills
          </Link>
          <Link
            to="/admin/fee-packages"
            className={activeTab === 'fee-packages' ? 'active' : ''}
            onClick={() => setActiveTab('fee-packages')}
          >
            Fee Packages
          </Link>
          <Link
            to="/admin/notifications"
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </Link>
          <Link
            to="/admin/reports"
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </Link>
          <Link
            to="/admin/supplements"
            className={activeTab === 'supplements' ? 'active' : ''}
            onClick={() => setActiveTab('supplements')}
          >
            Supplements
          </Link>
          <Link
            to="/admin/diet"
            className={activeTab === 'diet' ? 'active' : ''}
            onClick={() => setActiveTab('diet')}
          >
            Diet Details
          </Link>
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<MemberManagement />} />
          <Route path="/members" element={<MemberManagement />} />
          <Route path="/bills" element={<BillManagement />} />
          <Route path="/fee-packages" element={<FeePackageManagement />} />
          <Route path="/notifications" element={<NotificationManagement />} />
          <Route path="/reports" element={<ReportExport />} />
          <Route path="/supplements" element={<SupplementStore />} />
          <Route path="/diet" element={<DietDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

