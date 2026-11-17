import { useEffect, useState } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.API_BASE_URL;

const emptyForm = {
  name: '', email: '', phone_number: '', gender: 'male', dob: '', password: ''
};

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState(localStorage.getItem('userName') || '');
  const [showAuth, setShowAuth] = useState(Boolean(localStorage.getItem('token')));
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

    const endpoint = isLogin ? '/login' : '/register';
    const normalizedPhone = formData.phone_number.replace(/\D/g, '');
    const phoneNumber = normalizedPhone.startsWith('91') && normalizedPhone.length === 12
      ? normalizedPhone.slice(2)
      : normalizedPhone;

    if (!isLogin && phoneNumber.length !== 10) {
      setMessage({ type: 'error', text: 'Enter a valid 10-digit phone number.' });
      setLoading(false);
      return;
    }

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, phone_number: Number(phoneNumber), dob: new Date(formData.dob) };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Frontend-Path': window.location.pathname },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        setCustomerName(data.user.name);
        setShowAuth(true);
        setMessage({ type: 'success', text: 'Login successful.' });
      } else {
        setIsLogin(true);
        setMessage({ type: 'success', text: 'Registration successful. Please log in.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setCustomerName('');
    setShowAuth(false);
  };

  if (!showAuth && !customerName) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (customerName) {
    return (
      <main className="customer-home">
        <div className="home-shape shape-one" />
        <div className="home-shape shape-two" />
        <section className="home-card">
          <div className="home-icon" aria-hidden="true">✦</div>
          <p className="eyebrow">SWIFT CART / CUSTOMER</p>
          <h1>{greeting}, {customerName}.</h1>
          <p className="home-copy">Everything you love, now ready for your next shopping moment.</p>
          <button type="button" className="primary-button" onClick={handleLogout}>Log out</button>
        </section>
      </main>
    );
  }

  return (
    <main className="customer-auth">
      <section className="auth-card">
        <button type="button" className="back-button" onClick={() => setShowAuth(false)}>← Back to welcome</button>
        <p className="eyebrow">SWIFT CART / CUSTOMER</p>
        <h1>{isLogin ? 'Welcome back' : 'Join the community'}</h1>
        <p className="intro">{isLogin ? 'Sign in to pick up where you left off.' : 'Create an account and make every order count.'}</p>
        <div className="tabs">
          <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && <>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="field" />
            <input type="tel" inputMode="tel" name="phone_number" placeholder="10-Digit Phone Number" value={formData.phone_number} onChange={handleChange} required className="field" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="field"><option value="male">Male</option><option value="female">Female</option><option value="others">Others</option></select>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="field" />
          </>}
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="field" />
          <input type="password" name="password" placeholder="Password (e.g. Password@123)" value={formData.password} onChange={handleChange} required className="field" />
          {message.text && <p className={`form-message ${message.type}`}>{message.text}</p>}
          <button type="submit" disabled={loading} className="primary-button">{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</button>
        </form>
      </section>
    </main>
  );
}

function LandingPage({ onGetStarted }) {
  return (
    <main className="customer-landing">
      <div className="star-field" />
      <div className="planet planet-one" />
      <div className="planet planet-two" />
      <section className="landing-content">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <p className="eyebrow">SWIFT CART / CUSTOMER</p>
        <h1>Find your next <span>favourite.</span></h1>
        <p className="landing-copy">Discover products you will love, from stores made for the way you shop.</p>
        <button type="button" className="primary-button landing-button" onClick={onGetStarted}>Get started <span aria-hidden="true">↗</span></button>
        <p className="landing-note">A little more joy in every cart.</p>
      </section>
      <div className="floating-chip chip-one">New favourites ✦</div>
      <div className="floating-chip chip-two">Curated for you</div>
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
