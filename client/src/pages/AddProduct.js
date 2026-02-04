import React, { useState } from 'react';
import API from '../api';

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [productData, setProductData] = useState({
    name: '', 
    price: '', 
    category: '', 
    description: '', 
    productId: ''
  });

  // Handle text input changes (This uses setProductData)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('description', productData.description);
    formData.append('productId', productData.productId);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      await API.post('/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product Added Successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="text" 
            name="productId" 
            placeholder="Product ID" 
            value={productData.productId} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <input 
            type="text" 
            name="name" 
            placeholder="Product Name" 
            value={productData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <input 
            type="number" 
            name="price" 
            placeholder="Price" 
            value={productData.price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <input 
            type="text" 
            name="category" 
            placeholder="Category" 
            value={productData.category} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <textarea 
            name="description" 
            placeholder="Description" 
            value={productData.description} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Upload Images: </label>
          <input type="file" multiple onChange={handleFileChange} required />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Upload Product</button>
      </form>
    </div>
  );
};

export default AddProduct;