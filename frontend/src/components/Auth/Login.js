import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up logic
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const result = await signup(email, password, role, name);
        if (result.success) {
          toast.success('Account created successfully!');
          // Small delay to ensure user is set
          await new Promise(resolve => setTimeout(resolve, 500));
          // Auto login after signup
          const loginResult = await login(email, password, role);
          if (loginResult.success) {
            if (loginResult.warning) {
              toast.warning(loginResult.warning, { autoClose: 8000 });
            }
            // Small delay to ensure state is updated before navigation
            await new Promise(resolve => setTimeout(resolve, 100));
            // Redirect based on role
            if (role === 'admin') {
              navigate('/admin', { replace: true });
            } else if (role === 'member') {
              navigate('/member', { replace: true });
            } else if (role === 'user') {
              navigate('/user', { replace: true });
            }
          } else {
            toast.error(loginResult.error || 'Account created but login failed. Please try logging in manually.');
          }
        } else {
          const errorMsg = result.error || 'Sign up failed';
          toast.error(errorMsg, { autoClose: 5000 });
          console.error('Signup error details:', result);
        }
      } else {
        // Login logic
        const result = await login(email, password, role);
        if (result.success) {
          if (result.warning) {
            toast.warning(result.warning, { autoClose: 8000 });
          } else {
            toast.success('Login successful!');
          }
          // Small delay to ensure state is updated before navigation
          await new Promise(resolve => setTimeout(resolve, 300));
          console.log('Navigating to dashboard for role:', role);
          // Redirect based on role
          if (role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (role === 'member') {
            navigate('/member', { replace: true });
          } else if (role === 'user') {
            navigate('/user', { replace: true });
          }
        } else {
          toast.error(result.error || 'Login failed');
        }
      }
    } catch (error) {
      toast.error(`An error occurred during ${isSignUp ? 'sign up' : 'login'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>GYM Management System</h1>
          <p>{isSignUp ? 'Create a new account' : 'Sign in to your account'}</p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={`toggle-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => {
              setIsSignUp(false);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setName('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`toggle-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => {
              setIsSignUp(true);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setName('');
              setRole('user'); // Default to user for new signups
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Name (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
              required
              minLength={isSignUp ? 6 : undefined}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading 
              ? (isSignUp ? 'Creating account...' : 'Signing in...') 
              : (isSignUp ? 'Sign Up' : 'Sign In')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

