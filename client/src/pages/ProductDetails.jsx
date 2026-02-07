import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        setMainImage(data.images[0]); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loader">Loading Product...</div>;
  if (!product) return <div className="error">Product not found.</div>;

  return (
    <div className="details-container">
      <div className="details-grid">
        {}
        <div className="image-section">
          <img src={mainImage} alt={product.name} className="main-view" />
          <div className="thumbnail-list">
            {product.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt="thumbnail" 
                className={mainImage === img ? "thumb active" : "thumb"}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {}
        <div className="info-section">
          <span className="category-tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-id">Product ID: {product.productId}</p>
          <p className="description">{product.description}</p>
          <h2 className="price">Rs. {product.price}</h2>
          
          <div className="actions">
            <button className="add-to-cart-btn">Add to Cart</button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;