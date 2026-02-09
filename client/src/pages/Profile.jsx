import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import './Profile.css';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        shopName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        age: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                shopName: user.shopName || '',
                ownerName: user.ownerName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                age: user.age || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const endpoint = user.role === 'retailer' ? '/retailers/profile' : '/customers/profile';
            const { data } = await API.put(endpoint, formData);
            login(data, localStorage.getItem('token')); // Update context with new data
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (!user) return <div>Access Denied</div>;

    return (
        <div className="profile-container">
            <h1>My Profile</h1>
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Email (Cannot change)</label>
                    <input type="email" value={formData.email} disabled />
                </div>

                {user.role === 'customer' && (
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                {user.role === 'retailer' && (
                    <>
                        <div className="form-group">
                            <label>Shop Name</label>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Owner Name</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="update-btn">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
