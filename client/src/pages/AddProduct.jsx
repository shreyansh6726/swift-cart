import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '', 
    price: '', 
    category: '', 
    description: '', 
    productId: '' // Must match Mongoose schema key exactly
  });

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    // Convert FileList to Array for easier handling if needed
    setImages(e.target.files); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Using FormData is required for file uploads
    const formData = new FormData();
    formData.append('productId', productData.productId);
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('description', productData.description);

    // Append multiple images
    // Ensure 'images' matches the field name in your upload.array('images') middleware
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      // The 'protect' middleware on the server will use the token 
      // attached by our Axios interceptor to identify the retailer (soldBy).
      await API.post('/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Product Added Successfully!');
      navigate('/my-products'); 
    } catch (err) {
      console.error("Upload error:", err.response?.data);
      alert(err.response?.data?.message || 'Upload failed. Please check the server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Product</h2>
        
        <input style={styles.input} name="productId" placeholder="Product ID (e.g., SKU-101)" onChange={handleChange} required />
        <input style={styles.input} name="name" placeholder="Product Name" onChange={handleChange} required />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input style={styles.input} type="number" name="price" placeholder="Price" onChange={handleChange} required />
          <input style={styles.input} type="number" name="countInStock" placeholder="Stock Quantity" onChange={handleChange} required />
        </div>

        <input style={styles.input} name="category" placeholder="Category (e.g., Electronics)" onChange={handleChange} required />
        <textarea style={{...styles.input, height: '100px'}} name="description" placeholder="Product Description" onChange={handleChange} required />
        
        <div style={{ margin: '15px 0' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '5px' }}>
            Product Images (Max 10)
          </label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            required 
          />
          {images.length > 0 && (
            <p style={{ fontSize: '12px', color: '#28a745' }}>{images.length} files selected</p>
          )}
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Uploading to Cloudinary...' : 'Upload Product'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' },
  input: { width: '100%', padding: '12px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '14px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }
};

export default AddProduct;