import { useEffect, useState } from 'react';
import './App.css';
import Account from './pages/account';
import Help from './pages/help';
import Homepage from './pages/homepage';
import ManageProduct from './pages/manageProduct';
import Profile from './pages/profile';

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
  const [showAuth, setShowAuth] = useState(Boolean(localStorage.getItem('retailerToken')));
  const [retailerName, setRetailerName] = useState(localStorage.getItem('retailerName') || 'Retailer');
  const [greeting, setGreeting] = useState(getGreeting());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('homepage');

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting());
    const interval = setInterval(updateGreeting, 60000);

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
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, phone_number: Number(normalizedPhone), dob: new Date(formData.dob) };

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
        localStorage.setItem('retailerName', data.user.name);
        setRetailerName(data.user.name);
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

  if (!showAuth && !loggedIn) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (loggedIn) {
    const handleLogout = () => {
      localStorage.removeItem('retailerToken');
      localStorage.removeItem('retailerName');
      setLoggedIn(false);
      setShowAuth(false);
    };
    const pageProps = {
      open: sidebarOpen,
      onToggle: () => setSidebarOpen((isOpen) => !isOpen),
      onNavigate: setActivePage,
      onProfileUpdated: setRetailerName,
      onDeleted: handleLogout
    };

    if (activePage === 'account') return <Account {...pageProps} />;
    if (activePage === 'manageProduct') return <ManageProduct {...pageProps} />;
    if (activePage === 'help') return <Help {...pageProps} />;
    if (activePage === 'profile') return <Profile {...pageProps} retailerName={retailerName} />;

    return (
      <Homepage
        {...pageProps}
        greeting={greeting}
        retailerName={retailerName}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Shell>
      <button type="button" className="back-button" onClick={() => setShowAuth(false)}>← Back to welcome</button>
      <div className="auth-heading">
        <p className="eyebrow">SWIFT CART RETAILER</p>
        <h1>{isLogin ? 'Welcome back' : 'Build your storefront'}</h1>
        <p>{isLogin ? 'Sign in to continue to your retailer home.' : 'Create your retailer account in a few steps.'}</p>
      </div>
      <div className="tabs">
        <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>{isLogin ? '• ' : ''}Login</button>
        <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>{!isLogin ? '• ' : ''}Register</button>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && <>
          <input name="name" placeholder="Owner Name" value={formData.name} onChange={handleChange} required className="field" />
          <input name="phone_number" type="tel" inputMode="tel" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required className="field" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="field"><option value="male">Male</option><option value="female">Female</option><option value="others">Others</option></select>
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required className="field" />
          <input name="shop_name" placeholder="Shop Name" value={formData.shop_name} onChange={handleChange} required className="field" />
          <textarea name="shop_address" placeholder="Shop Address" value={formData.shop_address} onChange={handleChange} required className="field" />
        </>}
        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="field" />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="field" />
        {message.text && <p className={`form-message ${message.type}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="primary-button">{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Retailer Account'}</button>
      </form>
    </Shell>
  );
}

function LandingPage({ onGetStarted }) {
  return (
    <main className="landing-page">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />
      <div className="grid-lines" />
      <section className="landing-content">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <p className="eyebrow">SWIFT CART / RETAIL</p>
        <h1>Make your store <span>stand out.</span></h1>
        <p className="landing-copy">A calmer, smarter way to grow your retail business and reach more customers.</p>
        <button type="button" className="primary-button landing-button" onClick={onGetStarted}>
          Get started <span aria-hidden="true">↗</span>
        </button>
        <div className="landing-note"><span className="status-dot" /> Built for ambitious retailers</div>
      </section>
      <div className="floating-card floating-card-one"><span>↗</span> Grow with ease</div>
      <div className="floating-card floating-card-two">✦ <span>your store, elevated</span></div>
    </main>
  );
}

function Shell({ children }) {
  return <main className="auth-page"><section className="auth-card">{children}</section></main>;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 3 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 16) return 'Good afternoon';
  if (hour >= 16 && hour < 20) return 'Good evening';
  return 'Hello';
}
