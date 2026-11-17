import { useEffect, useState } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.API_BASE_URL;

const emptyForm = { name: '', email: '', phone_number: '', password: '' };

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || '');
  const [showAuth, setShowAuth] = useState(Boolean(localStorage.getItem('adminToken')));
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

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
    const payload = isLogin ? { email: formData.email, password: formData.password } : { ...formData, phone_number: Number(normalizedPhone) };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Frontend-Path': window.location.pathname },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.user.name);
        setAdminName(data.user.name);
        setShowAuth(true);
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    setAdminName('');
    setShowAuth(false);
  };

  if (!showAuth && !adminName) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (adminName) {
    return (
      <main className="admin-home">
        <div className="home-grid" />
        <div className="home-glow" />
        <section className="home-card">
          <div className="home-icon" aria-hidden="true">◆</div>
          <p className="eyebrow">SWIFT CART / ADMIN</p>
          <h1>{greeting}, {adminName}.</h1>
          <p className="home-copy">Your command centre is ready. Keep the marketplace moving.</p>
          <button type="button" className="primary-button" onClick={handleLogout}>Log out</button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-auth">
      <section className="auth-card">
        <button type="button" className="back-button" onClick={() => setShowAuth(false)}>← Back to welcome</button>
        <p className="eyebrow">SWIFT CART / ADMIN</p>
        <h1>{isLogin ? 'Welcome back' : 'Create admin access'}</h1>
        <p className="intro">{isLogin ? 'Sign in to your command centre.' : 'Set up a secure administrator account.'}</p>
        <div className="tabs">
          <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && <>
            <input name="name" placeholder="Admin Name" value={formData.name} onChange={handleChange} required className="field" />
            <input name="phone_number" type="tel" inputMode="tel" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required className="field" />
          </>}
          <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="field" />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="field" />
          {message.text && <p className={`form-message ${message.type}`}>{message.text}</p>}
          <button type="submit" disabled={loading} className="primary-button">{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Admin'}</button>
        </form>
      </section>
    </main>
  );
}

function LandingPage({ onGetStarted }) {
  return (
    <main className="admin-landing">
      <div className="admin-grid" />
      <div className="gold-orb orb-one" />
      <div className="gold-orb orb-two" />
      <section className="landing-content">
        <div className="brand-mark" aria-hidden="true">◆</div>
        <p className="eyebrow">SWIFT CART / ADMIN</p>
        <h1>Lead with <span>clarity.</span></h1>
        <p className="landing-copy">One intelligent space to keep your marketplace secure, healthy, and moving forward.</p>
        <button type="button" className="primary-button landing-button" onClick={onGetStarted}>Get started <span aria-hidden="true">↗</span></button>
        <p className="landing-note">Control, without the clutter.</p>
      </section>
      <div className="floating-chip chip-one">SYSTEM ONLINE</div>
      <div className="floating-chip chip-two">SECURE ACCESS</div>
    </main>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 16) return 'Good afternoon';
  if (hour >= 16 && hour < 20) return 'Good evening';
  return 'Hello';
}
