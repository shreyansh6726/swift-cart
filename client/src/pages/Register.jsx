import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Auth.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [isRetailer, setIsRetailer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    shopName: '',
    ownerName: '',
    retailerId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRetailer ? 'retailers/register' : 'customers/register';

    const payload = {
      ...formData,
      age: Number(formData.age),
      retailerId: isRetailer ? Number(formData.retailerId) : undefined,
      ownerName: isRetailer ? (formData.ownerName || formData.name) : undefined
    };

    try {
      const res = await API.post(endpoint, payload);
      login(res.data);
      // alert('Registration successful!'); // Removed for cleaner UX
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        style={{ maxWidth: '600px' }} // Slightly wider for register form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us today for a premium shopping experience.</p>

        <div className="auth-toggle">
          <button type="button" onClick={() => setIsRetailer(false)} className={`toggle-btn ${!isRetailer ? 'active' : ''}`}>Customer</button>
          <button type="button" onClick={() => setIsRetailer(true)} className={`toggle-btn ${isRetailer ? 'active' : ''}`}>Retailer</button>
        </div>

        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-msg">{error}</motion.div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-input" placeholder="John Doe" onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" placeholder="name@company.com" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" placeholder="••••••••" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input name="age" type="number" className="form-input" placeholder="25" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-input" onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input name="phone" className="form-input" placeholder="+1 (555) 000-0000" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input name="address" className="form-input" placeholder="123 Corporate Blvd, Suite 100" onChange={handleChange} required />
          </div>

          {isRetailer && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="auth-form" style={{ marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input name="shopName" className="form-input" placeholder="My Shop" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input name="ownerName" className="form-input" placeholder="Owner Name" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Retailer ID</label>
                <input name="retailerId" className="form-input" placeholder="Numeric ID" onChange={handleChange} required />
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;