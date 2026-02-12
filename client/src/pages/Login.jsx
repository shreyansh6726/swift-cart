import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';

const Login = () => {
  const [isRetailer, setIsRetailer] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRetailer ? '/retailers/login' : '/customers/login';

    try {
      const { data } = await API.post(endpoint, { email, password });
      // Simulate a small delay for the loading animation to show "Verifying credentials"
      const userData = { ...data, role: isRetailer ? 'retailer' : 'customer' };
      login(userData, data.token, keepLoggedIn);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="auth-title">Welcome Back</h2>

        <div className="auth-toggle">
          <button
            type="button"
            onClick={() => setIsRetailer(false)}
            className={`toggle-btn ${!isRetailer ? 'active' : ''}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setIsRetailer(true)}
            className={`toggle-btn ${isRetailer ? 'active' : ''}`}
          >
            Retailer
          </button>
        </div>

        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-msg">{error}</motion.div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
            />
            Keep me logged in
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : `Login as ${isRetailer ? 'Retailer' : 'Customer'}`}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;