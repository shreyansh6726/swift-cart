import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import '../components/Navbar.css'; // Re-use some common styles if needed, or rely on global
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get('/products');
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="loader"></div>
        </div>
    );

    if (error) return (
        <div className="container section text-center text-error">
            <h3>{error}</h3>
            <button onClick={() => window.location.reload()} className="btn btn-secondary mt-4">Try Again</button>
        </div>
    );

    return (
        <div className="product-page-container container section">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="page-header"
            >
                <h1 className="page-title">Our Collection</h1>
                <p className="page-subtitle">Browse our premium selection of products.</p>

                <div className="toolbar">
                    <div className="search-group">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="search-input-field"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary btn-icon">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </motion.div>

            <motion.div
                layout
                className="product-grid"
            >
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                            key={product._id}
                            className="product-card-item"
                            onClick={() => navigate(`/products/${product._id}`)}
                        >
                            <div className="card-image-wrapper">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x250?text=No+Image'}
                                    alt={product.name}
                                    className="card-image"
                                />
                                <div className="card-overlay">
                                    <button className="btn btn-primary btn-sm">View Details</button>
                                </div>
                            </div>
                            <div className="card-details">
                                <div className="card-header-row">
                                    <h3 className="card-title">{product.name}</h3>
                                    <span className="card-price">Rs. {product.price}</span>
                                </div>
                                <p className="card-category">{product.category || 'General'}</p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="no-result-message">
                        No products found matching "{searchTerm}"
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ProductList;
