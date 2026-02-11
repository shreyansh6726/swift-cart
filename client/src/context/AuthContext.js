import { createContext, useState, useEffect, useRef } from 'react';
import API from '../api';

export const AuthContext = createContext();

// Helper: get auth from whichever storage has it (persistent first, then session)
const CART_API_FLAG = 'cartApiAvailable';

const getStoredAuth = () => {
  const fromLocal = localStorage.getItem('userInfo') && localStorage.getItem('token');
  if (fromLocal) {
    try {
      return {
        user: JSON.parse(localStorage.getItem('userInfo')),
        token: localStorage.getItem('token'),
        storage: localStorage,
      };
    } catch (e) {
      return null;
    }
  }
  const fromSession = sessionStorage.getItem('userInfo') && sessionStorage.getItem('token');
  if (fromSession) {
    try {
      return {
        user: JSON.parse(sessionStorage.getItem('userInfo')),
        token: sessionStorage.getItem('token'),
        storage: sessionStorage,
      };
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const storageRef = useRef(null); // current storage (localStorage or sessionStorage)

  // Fetch Cart Helper - tolerates 404 when backend cart API is not available
  const fetchCart = async () => {
    if (sessionStorage.getItem(CART_API_FLAG) === 'false') {
      setCart([]);
      setCartTotal(0);
      return;
    }
    try {
      const { data } = await API.get('/customers/cart');
      sessionStorage.setItem(CART_API_FLAG, 'true');
      setCart(data.cart ?? []);
      setCartTotal(data.cartTotal ?? 0);
    } catch (error) {
      if (error.response?.status === 404) {
        sessionStorage.setItem(CART_API_FLAG, 'false');
      } else {
        console.error("Failed to fetch cart", error);
      }
      setCart([]);
      setCartTotal(0);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const stored = getStoredAuth();
      if (stored) {
        storageRef.current = stored.storage;
        setUser(stored.user);
        if (stored.user.role === 'customer') {
          if (sessionStorage.getItem(CART_API_FLAG) === 'false') {
            setCart([]);
            setCartTotal(0);
          } else {
            try {
              const { data } = await API.get('/customers/cart');
              sessionStorage.setItem(CART_API_FLAG, 'true');
              setCart(data.cart ?? []);
              setCartTotal(data.cartTotal ?? 0);
            } catch (err) {
              if (err.response?.status === 404) {
                sessionStorage.setItem(CART_API_FLAG, 'false');
              } else {
                console.error("Error syncing cart", err);
              }
              setCart([]);
              setCartTotal(0);
            }
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // keepLoggedIn: true = localStorage (persistent), false = sessionStorage (session only). undefined = keep current storage (e.g. profile update).
  const login = (userData, token, keepLoggedIn = true) => {
    setUser(userData);
    const storage =
      keepLoggedIn === undefined
        ? (storageRef.current || localStorage)
        : keepLoggedIn
          ? localStorage
          : sessionStorage;
    storageRef.current = storage;
    storage.setItem('userInfo', JSON.stringify(userData));
    if (token) storage.setItem('token', token);

    if (userData.role === 'customer') {
      sessionStorage.removeItem(CART_API_FLAG); // retry cart API after fresh login
      fetchCart();
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCartTotal(0);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('token');
    storageRef.current = null;
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await API.post('/customers/cart/add', { productId, quantity });
      setCart(data.cart);
      setCartTotal(data.cartTotal);
    } catch (error) {
      if (error.response?.status === 404) {
        // Check if it's a specific "Not Found" message from the backend
        const errorMessage = error.response.data?.message;
        if (errorMessage === 'Customer not found') {
          alert("Session invalid. Please log in again.");
          logout();
        } else if (errorMessage === 'Product not found') {
          alert("This product is no longer available.");
        } else {
          // If it's a 404 but not a known JSON error, likely the service/route is missing
          alert("Cart service is unavailable. Check that the backend is deployed and reachable.");
        }
      } else {
        console.error("Add to cart error", error);
        alert("Failed to add to cart");
      }
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.post('/customers/cart/remove', { productId });
      setCart(data.cart);
      setCartTotal(data.cartTotal);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Remove from cart error", error);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await API.post('/customers/cart/update-quantity', { productId, quantity });
      setCart(data.cart);
      setCartTotal(data.cartTotal);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Update quantity error", error);
      }
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