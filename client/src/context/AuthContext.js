import { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch Cart Helper
  const fetchCart = async () => {
    try {
      const { data } = await API.get('/customers/cart');
      setCart(data.cart);
      setCartTotal(data.cartTotal);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const savedUser = localStorage.getItem('userInfo');
      const token = localStorage.getItem('token'); // Assuming token is stored separately or part of userInfo

      if (savedUser && token) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Fetch cart if user is customer
        if (parsedUser.role === 'customer') {
          try {
            const { data } = await API.get('/customers/cart');
            setCart(data.cart);
            setCartTotal(data.cartTotal);
          } catch (err) {
            console.error("Error syncing cart", err);
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    if (token) localStorage.setItem('token', token); // Store token if passed

    if (userData.role === 'customer') {
      fetchCart();
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCartTotal(0);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await API.post('/customers/cart/add', { productId, quantity });
      setCart(data.cart);
      setCartTotal(data.cartTotal);
      // alert("Cart updated!"); // Optional: Remove alert for better UX with quantity controls
    } catch (error) {
      console.error("Add to cart error", error);
      alert("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.post('/customers/cart/remove', { productId });
      setCart(data.cart);
      setCartTotal(data.cartTotal);
    } catch (error) {
      console.error("Remove from cart error", error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await API.post('/customers/cart/update-quantity', { productId, quantity });
      setCart(data.cart);
      setCartTotal(data.cartTotal);
    } catch (error) {
      console.error("Update quantity error", error);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      cart,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};