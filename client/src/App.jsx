import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';

// Separate component to use useLocation hook
const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute allowedRole="retailer">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            user ? <Profile /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

import Footer from './components/Footer';

const AppContent = () => {
  const { loading } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleCart={toggleCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;