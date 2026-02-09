import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile'; // Import Profile

import ProductList from './pages/ProductList';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  if (loading) {
    return <div className="loading-screen">Syncing your session...</div>;
  }

  return (
    <>
      <Navbar toggleCart={toggleCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Routes>
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
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;