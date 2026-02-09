import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, cart, user } = useContext(AuthContext);

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

  // Check if item is in cart
  const cartItem = cart.find(item => item.productId === product.productId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      alert("Retailers cannot add items to cart.");
      return;
    }
    addToCart(product.productId, 1);
  };

  const handleUpdateQuantity = (newQty) => {
    updateQuantity(product.productId, newQty);
  };

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

        <div className="action-section">
          {quantity > 0 ? (
            <div className="quantity-controls">
              <button onClick={() => handleUpdateQuantity(quantity - 1)} className="qty-btn">-</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={() => handleUpdateQuantity(quantity + 1)} className="qty-btn">+</button>
            </div>
          ) : (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
        </div>

        {product.soldBy && (
          <div className="retailer-card">
            <div className="retailer-header">Sold By Retailer</div>
            <div className="retailer-info">
              <div className="retailer-avatar">
                {product.soldBy.shopName ? product.soldBy.shopName.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="retailer-details">
                <h4>{product.soldBy.shopName || product.soldBy.ownerName || 'Unknown Retailer'}</h4>
                <p>{product.soldBy.email}</p>
                {product.soldBy.ownerName && <p>Owner: {product.soldBy.ownerName}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;