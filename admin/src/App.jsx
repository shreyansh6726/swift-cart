import { useState } from 'react';

const API_BASE_URL = import.meta.env.API_BASE_URL;

const emptyForm = {
  name: '',
  email: '',
  phone_number: '',
  password: ''
};

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('adminToken')));

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

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
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, phone_number: Number(normalizedPhone) };

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
        localStorage.setItem('adminToken', data.token);
        setLoggedIn(true);
        setMessage({ type: 'success', text: 'Login successful.' });
      } else {
        setIsLogin(true);
        setMessage({ type: 'success', text: 'Admin registered. Please log in.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <Shell><h1>Admin Dashboard</h1><p>You are logged in.</p><button onClick={() => { localStorage.removeItem('adminToken'); setLoggedIn(false); }} style={styles.button}>Logout</button></Shell>;
  }

  return (
    <Shell>
      <div style={styles.tabs}>
        <button onClick={() => setIsLogin(true)} style={styles.tab}>{isLogin ? '• ' : ''}Login</button>
        <button onClick={() => setIsLogin(false)} style={styles.tab}>{!isLogin ? '• ' : ''}Register</button>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && <>
          <input name="name" placeholder="Admin Name" value={formData.name} onChange={handleChange} required style={styles.input} />
          <input name="phone_number" type="tel" inputMode="tel" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required style={styles.input} />
        </>}
        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
        {message.text && <p style={{ color: message.type === 'error' ? '#ef4444' : '#22c55e' }}>{message.text}</p>}
        <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Admin'}</button>
      </form>
    </Shell>
  );
}

function Shell({ children }) {
  return <main style={styles.page}><section style={styles.card}><p style={styles.label}>SWIFT CART ADMIN</p>{children}</section></main>;
}

const styles = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#111827', fontFamily: 'Arial, sans-serif' },
  card: { width: '380px', padding: '32px', borderRadius: '16px', background: '#1f2937', color: '#f9fafb', boxShadow: '0 20px 50px rgba(0,0,0,.3)' },
  label: { color: '#93c5fd', fontSize: '12px', fontWeight: '700', letterSpacing: '2px' },
  tabs: { display: 'flex', gap: '12px', margin: '24px 0' },
  tab: { padding: '10px 0', background: 'none', border: 0, color: '#bfdbfe', cursor: 'pointer', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  input: { padding: '12px', borderRadius: '7px', border: '1px solid #4b5563', fontSize: '14px' },
  button: { padding: '12px', border: 0, borderRadius: '7px', background: '#2563eb', color: '#fff', fontWeight: '700', cursor: 'pointer' }
};
