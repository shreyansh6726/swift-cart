import { useState } from 'react';

const API_BASE_URL = import.meta.env.API_BASE_URL;

const emptyForm = {
  name: '', email: '', phone_number: '', gender: 'male', dob: '',
  shop_name: '', shop_address: '', password: ''
};

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('retailerToken')));

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const phone = formData.phone_number.replace(/\D/g, '');
    const normalizedPhone = phone.startsWith('91') && phone.length === 12 ? phone.slice(2) : phone;
    if (!isLogin && normalizedPhone.length !== 10) {
      setMessage({ type: 'error', text: 'Enter a valid 10-digit phone number.' });
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/login' : '/register';
    const payload = isLogin ? { email: formData.email, password: formData.password } : { ...formData, phone_number: Number(normalizedPhone), dob: new Date(formData.dob) };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frontend-Path': window.location.pathname
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('retailerToken', data.token);
        setLoggedIn(true);
        setMessage({ type: 'success', text: 'Login successful.' });
      } else {
        setIsLogin(true);
        setMessage({ type: 'success', text: 'Retailer registered. Please log in.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <Shell><h1>Retailer Dashboard</h1><p>You are logged in.</p><button onClick={() => { localStorage.removeItem('retailerToken'); setLoggedIn(false); }} style={styles.button}>Logout</button></Shell>;
  }

  return (
    <Shell>
      <div style={styles.tabs}>
        <button onClick={() => setIsLogin(true)} style={styles.tab}>{isLogin ? '• ' : ''}Login</button>
        <button onClick={() => setIsLogin(false)} style={styles.tab}>{!isLogin ? '• ' : ''}Register</button>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && <>
          <input name="name" placeholder="Owner Name" value={formData.name} onChange={handleChange} required style={styles.input} />
          <input name="phone_number" type="tel" inputMode="tel" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required style={styles.input} />
          <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}><option value="male">Male</option><option value="female">Female</option><option value="others">Others</option></select>
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required style={styles.input} />
          <input name="shop_name" placeholder="Shop Name" value={formData.shop_name} onChange={handleChange} required style={styles.input} />
          <textarea name="shop_address" placeholder="Shop Address" value={formData.shop_address} onChange={handleChange} required style={styles.input} />
        </>}
        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
        {message.text && <p style={{ color: message.type === 'error' ? '#dc2626' : '#059669' }}>{message.text}</p>}
        <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Retailer Account'}</button>
      </form>
    </Shell>
  );
}

function Shell({ children }) {
  return <main style={styles.page}><section style={styles.card}><p style={styles.label}>SWIFT CART RETAILER</p>{children}</section></main>;
}

const styles = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#ecfdf5', fontFamily: 'Arial, sans-serif' },
  card: { width: '400px', padding: '32px', borderRadius: '16px', background: '#fff', color: '#064e3b', boxShadow: '0 20px 50px rgba(6,78,59,.15)' },
  label: { color: '#059669', fontSize: '12px', fontWeight: '700', letterSpacing: '2px' },
  tabs: { display: 'flex', gap: '12px', margin: '24px 0' },
  tab: { padding: '10px 0', background: 'none', border: 0, color: '#047857', cursor: 'pointer', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '7px', border: '1px solid #a7f3d0', fontSize: '14px' },
  button: { padding: '12px', border: 0, borderRadius: '7px', background: '#059669', color: '#fff', fontWeight: '700', cursor: 'pointer' }
};
