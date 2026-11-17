import { useEffect, useState } from 'react';
import './App.css';
import Cart from './components/cart';
import Homepage from './pages/homepage';
import Payment from './pages/Payment';
import Navbar from './components/navbar';

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
  const [showAuth, setShowAuth] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartItems, setCartItems] = useState(readCart);
  const [cartMessage, setCartMessage] = useState('');
  const [customerView, setCustomerView] = useState('home');
  const [pendingAction, setPendingAction] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/catalog/items`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || 'Unable to load products');
        setCatalogItems(data.items);
      } catch (error) {
        setCatalogError(error.message);
      } finally {
        setCatalogLoading(false);
      }
    };

    loadCatalog();
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
        setShowAuth(false);
        if (pendingAction === 'buy' && selectedItem) {
          setCustomerView('payment');
        } else if (pendingAction === 'cart' && selectedItem) {
          addItemToCart(selectedItem);
          setCustomerView('product');
          setCartOpen(true);
        } else if (selectedItem && customerView === 'product') {
          setCustomerView('product');
        } else {
          setCustomerView('home');
        }
        setPendingAction(null);
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
    setCustomerView('home');
    setSelectedItem(null);
    setPendingAction(null);
    setCartOpen(false);
  };

  const handleAuthBack = () => {
    setShowAuth(false);
    setCustomerView('home');
    setSelectedItem(null);
    setPendingAction(null);
    setCartOpen(false);
  };

  if (showAuth) {
    return (
      <main className="customer-auth">
        <section className="auth-card">
          <button type="button" className="back-button" onClick={handleAuthBack}>← Back to products</button>
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

  if (customerView === 'payment') {
    return <Payment items={selectedItem ? [{ ...selectedItem, quantity: 1 }] : cartItems} onBack={() => setCustomerView(selectedItem ? 'product' : 'home')} onComplete={() => setCustomerView('home')} />;
  }

  if (customerView === 'product' && selectedItem) {
    return (
      <ProductDetails
        item={selectedItem}
        cartCount={cartItems.length}
        cartMessage={cartMessage}
        onBack={() => setCustomerView('home')}
        onAddToCart={() => handleProductAction('cart', selectedItem)}
        onBuyNow={() => handleProductAction('buy', selectedItem)}
        onOpenCart={() => setCartOpen(true)}
        onSignIn={() => setShowAuth(true)}
        customerName={customerName}
        greeting={greeting}
        onLogout={handleLogout}
        cartItems={cartItems}
        cartOpen={cartOpen}
        onCloseCart={() => setCartOpen(false)}
        onIncreaseCartItem={increaseCartItem}
        onDecreaseCartItem={decreaseCartItem}
        onCheckoutCart={(items) => {
          setSelectedItem(null);
          setCartItems(items);
          setCartOpen(false);
          setCustomerView('payment');
        }}
      />
    );
  }

  return (
    <Homepage
      items={catalogItems}
      loading={catalogLoading}
      error={catalogError}
      cartCount={cartItems.length}
      greeting={greeting}
      customerName={customerName}
      onProductClick={(item) => {
        setSelectedItem(item);
        setCustomerView('product');
      }}
      onSignIn={() => setShowAuth(true)}
      onLogout={handleLogout}
      onOpenCart={() => setCartOpen(true)}
      cartItems={cartItems}
      cartOpen={cartOpen}
      onCloseCart={() => setCartOpen(false)}
      onIncreaseCartItem={increaseCartItem}
      onDecreaseCartItem={decreaseCartItem}
      onCheckoutCart={(items) => {
        setSelectedItem(null);
        setCartItems(items);
        setCartOpen(false);
        setCustomerView('payment');
      }}
    />
  );

  function handleProductAction(action, item) {
    if (!customerName) {
      setPendingAction(action);
      setSelectedItem(item);
      setCustomerView('product');
      setShowAuth(true);
      return;
    }

    if (action === 'buy') {
      setSelectedItem(item);
      setCustomerView('payment');
      return;
    }

    addItemToCart(item);
    setCartOpen(true);
  }

  function addItemToCart(item) {
    const currentCart = readCart();
    const existingItem = currentCart.find((cartItem) => cartItem._id === item._id);
    const nextCart = existingItem
      ? currentCart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
      : [...currentCart, { ...item, quantity: 1 }];
    localStorage.setItem('customerCart', JSON.stringify(nextCart));
    setCartItems(nextCart);
    setCartMessage(existingItem ? 'Another item added to your cart.' : 'Item added to your cart.');
  }

  function increaseCartItem(itemId) {
    const nextCart = cartItems.map((item) => item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item);
    localStorage.setItem('customerCart', JSON.stringify(nextCart));
    setCartItems(nextCart);
  }

  function decreaseCartItem(itemId) {
    const nextCart = cartItems
      .map((item) => item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0);
    localStorage.setItem('customerCart', JSON.stringify(nextCart));
    setCartItems(nextCart);
  }

}

function ProductDetails({ item, cartCount, cartMessage, onBack, onAddToCart, onBuyNow, onOpenCart, onSignIn, customerName, greeting, onLogout, cartItems, cartOpen, onCloseCart, onIncreaseCartItem, onDecreaseCartItem, onCheckoutCart }) {
  const retailer = item.sold_by || {};
  const currentPrice = item.offer ? item.offer_price : item.price;

  return (
    <main className="product-page">
      <Navbar
        customerName={customerName}
        greeting={greeting}
        cartCount={cartCount}
        onHome={onBack}
        onSignIn={onSignIn}
        onLogout={onLogout}
        onOpenCart={onOpenCart}
      />
      <header className="product-header">
        <button type="button" className="back-button" onClick={onBack}>← Back to products</button>
        <button type="button" className="cart-button" onClick={onOpenCart || onSignIn}>Cart ({cartCount})</button>
      </header>
      <section className="product-details">
        <div className="product-gallery">
          {item.image_link?.length ? item.image_link.map((image, index) => <img src={image} alt={`${item.name} view ${index + 1}`} key={image} />) : <div className="product-image-placeholder">✦</div>}
        </div>
        <div className="product-information">
          <p className="catalog-category">{item.category || 'Product'}</p>
          <h1>{item.name}</h1>
          <div className="product-price"><strong>₹{currentPrice}</strong>{item.offer && <span>₹{item.price}</span>}</div>
          <p className="product-description">{item.description || 'A quality product from the Swift Cart retailer community.'}</p>
          <p className="product-stock">{item.stock_quantity > 0 ? `${item.stock_quantity} available` : 'Currently out of stock'}</p>
          <div className="product-actions">
            <button type="button" className="secondary-button" onClick={onAddToCart} disabled={item.stock_quantity < 1}>Add to cart</button>
            <button type="button" className="primary-button" onClick={onBuyNow} disabled={item.stock_quantity < 1}>Buy now</button>
          </div>
          {cartMessage && <p className="product-action-message">{cartMessage}</p>}
          <div className="retailer-details">
            <p className="eyebrow">SOLD BY</p>
            <h2>{retailer.shop_name || retailer.name || 'Swift Cart retailer'}</h2>
            <p>{retailer.name ? `Managed by ${retailer.name}` : 'Independent Swift Cart retailer'}</p>
            {retailer.email && <p>{retailer.email}</p>}
            {retailer.phone_number && <p>{retailer.phone_number}</p>}
            {retailer.shop_address && <p>{retailer.shop_address}</p>}
          </div>
          {item.metadata?.length > 0 && <div className="product-tags">{item.metadata.map((tag) => <span key={tag}>{tag}</span>)}</div>}
        </div>
      </section>
      <Cart
        items={cartItems}
        open={cartOpen}
        onOpen={onOpenCart}
        onClose={onCloseCart}
        onIncrease={onIncreaseCartItem}
        onDecrease={onDecreaseCartItem}
        onCheckout={onCheckoutCart}
      />
    </main>
  );
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('customerCart') || '[]');
  } catch {
    return [];
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 16) return 'Good afternoon';
  if (hour >= 16 && hour < 20) return 'Good evening';
  return 'Hello';
}
