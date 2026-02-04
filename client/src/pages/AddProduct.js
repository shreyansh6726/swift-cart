import React, { useState } from 'react';
import API from '../api';

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [productData, setProductData] = useState({
    name: '', price: '', category: '', description: '', productId: ''
  });

  const handleFileChange = (e) => {
    setImages(e.target.files); // Store the actual file objects
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for Multi-part upload
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('description', productData.description);
    formData.append('productId', productData.productId);

    // Append multiple files
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... text inputs ... */}
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Upload Product</button>
    </form>
  );
};

// ... all your component logic ...

// MAKE SURE THIS LINE IS AT THE VERY BOTTOM
export default AddProduct;