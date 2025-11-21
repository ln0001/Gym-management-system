import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { notificationApi } from '../../api/gymApi';

const ViewNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationApi.list('members');
      setNotifications(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      toast.error('Error fetching notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="view-notifications">
      <div className="card">
        <div className="card-header">
          <h2>Bill Notifications</h2>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : notifications.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No notifications found</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.type} ${notification.readFlag ? 'read' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-header">
                  <h4>{notification.title}</h4>
                  <span className="notification-type">{notification.type}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-footer">
                  <span className="notification-date">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNotifications;

