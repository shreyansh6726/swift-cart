import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Elevate Your <br />
              <span className="text-accent">Shopping Standard</span>
            </h1>
            <p className="hero-subtitle">
              Discover a curated collection of premium products designed for the modern professional. Seamless, secure, and sophisticated.
            </p>
            <div className="hero-actions">
              <button
                onClick={() => navigate('/products')}
                className="btn btn-primary btn-lg"
              >
                Shop Collection <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-visual"
          >
            <div className="hero-shape"></div>
            {/* Placeholder for Hero Image - using a gradient/abstract shape for now */}
            <div className="hero-image-placeholder">
              <div className="floating-card card-1">
                <span>Premium Quality</span>
              </div>
              <div className="floating-card card-2">
                <span>Fast Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>

            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search catalog..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : (
            <motion.div
              layout
              className="product-grid"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={product._id}
                    className="product-card"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <div className="product-image-container">
                      <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} className="product-image" />
                      <div className="product-overlay">
                        <span className="view-text">View Details</span>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <div className="product-bottom">
                        <span className="product-price">Rs. {product.price}</span>
                        <button className="btn-icon-only">
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-results">
                  <h3>No products found</h3>
                  <p>Try adjusting your search terms.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;