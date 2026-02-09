import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div className="loading-container">Loading details...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!product) return <div className="error-container">Product not found</div>;

  return (
    <div className="product-details-container">
      <div className="details-image-section">
        <button onClick={() => navigate(-1)} className="back-btn">← Back to Products</button>
        <div className="main-image-container">
          <img
            src={product.images && product.images.length > 0 ? product.images[selectedImage] : 'https://via.placeholder.com/500x500?text=No+Image'}
            alt={product.name}
            className="main-image"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="thumbnail-grid">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="details-info-section">
        <span className="details-category">{product.category || 'General'}</span>
        <h1 className="details-title">{product.name}</h1>
        <div className="details-price">${product.price}</div>

        <h3 className="details-description-title">Description</h3>
        <p className="details-description">{product.description}</p>

        {product.soldBy && (
          <div className="retailer-card">
            <div className="retailer-header">Sold By Retailer</div>
            <div className="retailer-info">
              <div className="retailer-avatar">
                {product.soldBy.name ? product.soldBy.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="retailer-details">
                <h4>{product.soldBy.name || product.soldBy.storeName || 'Unknown Retailer'}</h4>
                <p>{product.soldBy.email}</p>
                {product.soldBy.storeName && <p>{product.soldBy.storeName}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;