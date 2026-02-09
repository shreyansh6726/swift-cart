import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get('/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="loading-container">Loading products...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="product-list-container">
            <h1 className="product-list-title">Our Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => navigate(`/products/${product._id}`)}
                    >
                        <div className="product-image-container">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x250?text=No+Image'}
                                alt={product.name}
                                className="product-image"
                            />
                        </div>
                        <div className="product-info">
                            <div>
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-category">{product.category || 'General'}</p>
                            </div>
                            <div className="product-price-row">
                                <span className="product-price">${product.price}</span>
                                <button className="view-details-btn">View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
