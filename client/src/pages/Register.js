import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

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
    shopName: '',    // Retailer specific
    ownerName: '',   // Retailer specific
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
    
    // Ensure numeric fields are numbers before sending
    const payload = {
      ...formData,
      age: Number(formData.age),
      retailerId: isRetailer ? Number(formData.retailerId) : undefined,
      // For Retailers, ownerName is often the same as the user's name if not specified
      ownerName: isRetailer ? (formData.ownerName || formData.name) : undefined 
    };

    try {
      const res = await API.post(endpoint, payload);
      // Log in immediately and store state as per your requirement
      login(res.data); 
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      // Show the specific validation error from the backend
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>{isRetailer ? 'Retailer Sign Up' : 'Customer Sign Up'}</h2>

        <div style={styles.toggleContainer}>
          <button type="button" onClick={() => setIsRetailer(false)} style={!isRetailer ? styles.activeTab : styles.inactiveTab}>Customer</button>
          <button type="button" onClick={() => setIsRetailer(true)} style={isRetailer ? styles.activeTab : styles.inactiveTab}>Retailer</button>
        </div>

        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

        {/* Common Fields */}
        <input name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="age" type="number" placeholder="Age" onChange={handleChange} required style={styles.input} />
          <select name="gender" onChange={handleChange} required style={styles.input}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <input name="phone" placeholder="Phone Number" onChange={handleChange} required style={styles.input} />
        <input name="address" placeholder="Residential Address" onChange={handleChange} required style={styles.input} />

        {/* Conditional Fields for Retailer */}
        {isRetailer && (
          <>
            <hr />
            <input name="shopName" placeholder="Shop Name" onChange={handleChange} required style={styles.input} />
            <input name="ownerName" placeholder="Owner Name" onChange={handleChange} required style={styles.input} />
            <input name="retailerId" placeholder="Retailer ID (Numeric)" onChange={handleChange} required style={styles.input} />
          </>
        )}

        <button type="submit" style={styles.submitBtn}>Create Account</button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '20px' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '450px' },
  toggleContainer: { display: 'flex', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' },
  activeTab: { flex: 1, padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' },
  inactiveTab: { flex: 1, padding: '10px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer' },
  input: { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
};

export default Register;