import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userRole, loading } = useAuth();
  const [waitingForRole, setWaitingForRole] = useState(true);

  useEffect(() => {
    // If we have a user but no role, wait a bit for it to be set
    if (currentUser && !userRole) {
      const timer = setTimeout(() => {
        setWaitingForRole(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setWaitingForRole(false);
    }
  }, [currentUser, userRole]);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If userRole is not set yet, wait a bit (might be loading from Firestore)
  if (!userRole && waitingForRole) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // After waiting, if still no role, redirect to login
  if (!userRole) {
    console.warn('UserRole not set after login. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    console.warn(`Role mismatch: Expected ${role}, got ${userRole}. Current user:`, currentUser?.email);
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: Access granted for role', role, 'User:', currentUser?.email);

  return children;
};

export default ProtectedRoute;

