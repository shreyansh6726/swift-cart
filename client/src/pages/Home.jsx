import React, { useEffect, useState } from 'react';
import API from '../api';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New search state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader">Loading Swift-Cart...</div>;

  return (
    <div className="home-container">
      <div className="search-section">
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.images[0]} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">Rs. {product.price}</p>
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No products found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default Home;