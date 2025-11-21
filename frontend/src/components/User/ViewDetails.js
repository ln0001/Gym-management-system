import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { memberApi } from '../../api/gymApi';

const ViewDetails = () => {
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const member = await memberApi.findByEmail(currentUser?.email);
      if (member) {
        setUserDetails({ ...member, type: 'member' });
      } else {
        setUserDetails({
          email: currentUser?.email,
          type: 'user'
        });
      }
    } catch (error) {
      toast.error('Error fetching user details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      fetchUserDetails();
    }
  }, [currentUser, fetchUserDetails]);

  return (
    <div className="view-details">
      <div className="card">
        <div className="card-header">
          <h2>User Details</h2>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : userDetails ? (
          <div className="details-container">
            <div className="details-section">
              <h3>Personal Information</h3>
              <div className="detail-row">
                <strong>Name:</strong>
                <span>{userDetails.name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{userDetails.email}</span>
              </div>
              <div className="detail-row">
                <strong>Phone:</strong>
                <span>{userDetails.phone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <strong>Address:</strong>
                <span>{userDetails.address || 'N/A'}</span>
              </div>
              {userDetails.joinDate && (
                <div className="detail-row">
                  <strong>Join Date:</strong>
                <span>{userDetails.joinDate}</span>
                </div>
              )}
              {userDetails.status && (
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span className={`status-badge ${userDetails.status}`}>
                    {userDetails.status}
                  </span>
                </div>
              )}
            </div>

            {userDetails.feePackageName && (
              <div className="details-section">
                <h3>Fee Package Information</h3>
                <div className="detail-row">
                  <strong>Package Name:</strong>
                  <span>{userDetails.feePackageName}</span>
                </div>
                <div className="detail-row">
                  <strong>Package Amount:</strong>
                  <span>${userDetails.feePackageAmount?.toFixed(2) || '0.00'}</span>
                </div>
                {userDetails.assignedAt && (
                  <div className="detail-row">
                    <strong>Assigned Date:</strong>
                    <span>{new Date(userDetails.assignedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>No details found</p>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;

