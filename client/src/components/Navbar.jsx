import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Menu, X, PlusCircle, Home, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ toggleCart }) => {
  const { user, logout, cart } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-content container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">SwiftCart</span>
          <span className="logo-dot">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div className="active-indicator" layoutId="underline" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="desktop-actions">
          {user ? (
            <>
              {user.role === 'retailer' && (
                <Link to="/add-product" className="action-btn" title="Add Product">
                  <PlusCircle size={20} />
                  <span>Add Product</span>
                </Link>
              )}

              {user.role === 'customer' && (
                <button onClick={toggleCart} className="icon-btn relative" title="View Cart">
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="cart-badge"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </button>
              )}

              <div className="user-menu">
                <Link to="/profile" className="icon-btn" title="Profile">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="icon-btn logout" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-text">Login</Link>
              <Link to="/register" className="btn-primary-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="mobile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon size={18} />
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  {user.role === 'retailer' && (
                    <Link to="/add-product" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <PlusCircle size={18} /> Add Product
                    </Link>
                  )}
                  {user.role === 'customer' && (
                    <button onClick={() => { toggleCart(); setIsMobileMenuOpen(false); }} className="mobile-link">
                      <ShoppingCart size={18} /> Cart ({cart.length})
                    </button>
                  )}
                  <Link to="/profile" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={18} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="mobile-link text-error">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="mobile-auth">
                  <Link to="/login" className="btn-secondary w-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;