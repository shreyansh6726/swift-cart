import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Restore User Session
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Restore Cart Items
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setCart([]); // Clear cart on logout for security
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cart');
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const updatedCart = [...prev, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
    alert("Added to cart!");
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updatedCart = prev.filter(item => item._id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      cart, 
      addToCart, 
      removeFromCart 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};