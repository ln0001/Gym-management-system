import React, { createContext, useState, useEffect, useContext } from 'react';
import httpClient from '../api/httpClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('gym_email');
    const role = localStorage.getItem('gym_role');
    if (email && role) {
      setCurrentUser({ email });
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const { data } = await httpClient.post('/auth/login', { email, password, role });
      if (data.token) {
        localStorage.setItem('gym_token', data.token);
      }
      localStorage.setItem('gym_email', data.email);
      localStorage.setItem('gym_role', data.role);
      setCurrentUser({ email: data.email });
      setUserRole(data.role);
      const warning =
        data.message && data.message.toLowerCase() !== 'login successful'
          ? data.message
          : undefined;
      return { success: true, warning };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Invalid credentials';
      return { success: false, error: message };
    }
  };

  const signup = async (email, password, role, name = '') => {
    try {
      const { data } = await httpClient.post('/auth/signup', {
        email,
        password,
        role,
        name
      });
      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to create account';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('gym_token');
    try {
      if (token) {
        await httpClient.post(
          '/auth/logout',
          {},
          {
            headers: {
              Authorization: token,
              'X-User-Email': localStorage.getItem('gym_email') || undefined
            }
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('gym_token');
      localStorage.removeItem('gym_email');
      localStorage.removeItem('gym_role');
      setCurrentUser(null);
      setUserRole(null);
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
