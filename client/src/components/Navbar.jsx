import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">SwiftCart</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {user ? (
          <>
            { }
            {user.role === 'retailer' && (
              <Link to="/add-product" className="special-link">Add Product</Link>
            )}

            { }
            {user.role === 'customer' && (
              <Link to="/cart">Cart</Link>
            )}

            <span className="user-name">Hi, {user.shopName || user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;