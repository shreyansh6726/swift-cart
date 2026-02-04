import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Register = () => {
  const [isRetailer, setIsRetailer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',    // Retailer specific
    retailerId: '',  // Retailer specific
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRetailer ? '/retailers/register' : '/customers/register';
    
    // Create payload (only send shop details if registering as retailer)
    const payload = isRetailer ? formData : {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    try {
      await API.post(endpoint, payload);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>{isRetailer ? 'Retailer Sign Up' : 'Customer Sign Up'}</h2>

        {/* Role Toggle */}
        <div style={styles.toggleContainer}>
          <button type="button" onClick={() => setIsRetailer(false)} style={!isRetailer ? styles.activeTab : styles.inactiveTab}>Customer</button>
          <button type="button" onClick={() => setIsRetailer(true)} style={isRetailer ? styles.activeTab : styles.inactiveTab}>Retailer</button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />

        {/* Conditional Fields for Retailer */}
        {isRetailer && (
          <>
            <input name="shopName" placeholder="Shop Name" onChange={handleChange} required style={styles.input} />
            <input name="retailerId" placeholder="Retailer ID (e.g., 12345)" onChange={handleChange} required style={styles.input} />
          </>
        )}

        <button type="submit" style={styles.submitBtn}>Create Account</button>
      </form>
    </div>
  );
};

// Use the same styles object from the Login page for consistency
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' },
  toggleContainer: { display: 'flex', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
  activeTab: { flex: 1, padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' },
  inactiveTab: { flex: 1, padding: '10px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer' },
  input: { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
};

export default Register;