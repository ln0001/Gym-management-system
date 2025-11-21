import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { notificationApi } from '../../api/gymApi';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationApi.list();
      setNotifications(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      toast.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await notificationApi.create(formData);
      toast.success('Notification created successfully');
      setShowForm(false);
      setFormData({ title: '', message: '', type: 'info', targetAudience: 'all' });
      fetchNotifications();
    } catch (error) {
      toast.error('Error creating notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-management">
      <div className="card">
        <div className="card-header">
          <h2>Notification Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Create Notification
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="modal-content">
              <h3>Create Notification</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-control"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select
                    className="form-control"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  >
                    <option value="all">All</option>
                    <option value="members">Members Only</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Notification'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && !showForm ? (
          <div className="spinner"></div>
        ) : (
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>No notifications found</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <div className="notification-meta">
                    <span>Target: {notification.targetAudience}</span>
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;

