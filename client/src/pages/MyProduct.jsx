import React, { useState, useEffect } from 'react';
import API from '../api';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?._id) return;

        const response = await API.get(`/products/retailer/${storedUser._id}`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  // Filter logic whenever search term or category changes
  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Catalog</h1>

      {/* Search and Filter UI */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '250px' }}
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">All Categories</option>
          {[...new Set(products.map(p => p.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {filteredProducts.map(product => (
          <div key={product._id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>Rs. {product.price} | {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;