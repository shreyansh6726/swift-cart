import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRetailer, setIsRetailer] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Determine which endpoint to hit based on the toggle
    const endpoint = isRetailer ? 'api/retailers/login' : 'api/customers/login';

    try {
      const { data } = await API.post(endpoint, { email, password });
      
      // Save to Context & LocalStorage (handles your persistent login requirement)
      login({ ...data, role: isRetailer ? 'retailer' : 'customer' });
      
      // Redirect to homepage
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>{isRetailer ? 'Retailer Login' : 'Customer Login'}</h2>
        
        {/* Role Toggle */}
        <div style={styles.toggleContainer}>
          <button 
            type="button" 
            onClick={() => setIsRetailer(false)}
            style={!isRetailer ? styles.activeTab : styles.inactiveTab}
          >
            Customer
          </button>
          <button 
            type="button" 
            onClick={() => setIsRetailer(true)}
            style={isRetailer ? styles.activeTab : styles.inactiveTab}
          >
            Retailer
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={styles.input}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={styles.input}
        />

        <button type="submit" style={styles.submitBtn}>Login</button>
      </form>
    </div>
  );
};

// Basic Styling
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' },
  toggleContainer: { display: 'flex', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
  activeTab: { flex: 1, padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' },
  inactiveTab: { flex: 1, padding: '10px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer' },
  input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
};

export default Login;