import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.API_BASE_URL;

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    gender: 'male',
    dob: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('userName') || null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const endpoint = isLogin ? '/login' : '/register';

    // Accept numbers entered as either `9958639220` or `+91 99586 39220`,
    // but send the API the 10-digit value expected by the User model.
    const normalizedPhone = formData.phone_number.replace(/\D/g, '');
    const phoneNumber = normalizedPhone.startsWith('91') && normalizedPhone.length === 12
      ? normalizedPhone.slice(2)
      : normalizedPhone;

    if (!isLogin && phoneNumber.length !== 10) {
      setMessage({ type: 'error', text: 'Enter a valid 10-digit phone number.' });
      setLoading(false);
      return;
    }
    
    // Prepare payload (exclude extra registration fields during login)
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          ...formData, 
          phone_number: Number(phoneNumber),
          dob: new Date(formData.dob) 
        };

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        setLoggedInUser(data.user.name);
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      } else {
        setMessage({ type: 'success', text: 'Registration successful! Please log in.' });
        setIsLogin(true); // Switch to login tab
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Welcome back, {loggedInUser}! 🎉</h2>
          <p style={{ color: '#666', margin: '15px 0' }}>You are successfully logged into your account.</p>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.tabContainer}>
          <button 
            style={{ ...styles.tab, borderBottom: isLogin ? '3px solid #6366f1' : 'none', color: isLogin ? '#6366f1' : '#888' }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            style={{ ...styles.tab, borderBottom: !isLogin ? '3px solid #6366f1' : 'none', color: !isLogin ? '#6366f1' : '#888' }}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
              <input 
                type="tel"
                inputMode="tel"
                name="phone_number" 
                placeholder="10-Digit Phone Number" 
                value={formData.phone_number} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
              <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
              <input 
                type="date" 
                name="dob" 
                value={formData.dob} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </>
          )}

          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password (e.g. Password@123)" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />

          {message.text && (
            <p style={{ color: message.type === 'error' ? '#ef4444' : '#10b981', fontSize: '14px', textAlign: 'center' }}>
              {message.text}
            </p>
          )}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}

// Simple inline styling for clean out-of-the-box presentation
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' },
  card: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '380px' },
  tabContainer: { display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' },
  tab: { flex: 1, padding: '10px', background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' },
  button: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};
