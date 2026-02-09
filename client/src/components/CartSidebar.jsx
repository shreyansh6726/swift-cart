import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cart, cartTotal, updateQuantity, removeFromCart } = useContext(AuthContext);

    if (!isOpen) return null;

    return (
        <>
            <div className={`cart-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} ></div>
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items-container">
                    {cart.length === 0 ? (
                        <p className="empty-cart-msg">Your cart is empty.</p>
                    ) : (
                        cart.map((item, index) => {
                            const product = item.product || {}; // Handle populated product
                            const displayName = product.name || "Unknown Product";
                            const price = product.price || 0;

                            return (
                                <div key={index} className="cart-item-row">
                                    <div className="item-left">
                                        <span className="item-name">
                                            {displayName} {item.quantity > 1 ? `x ${item.quantity}` : ''}
                                        </span>
                                        <div className="controls">
                                            <button className="control-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button className="control-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="item-right">
                                        <span>${(price * item.quantity).toFixed(2)}</span>
                                        <button style={{ fontSize: '0.8rem', color: 'red', border: 'none', background: 'none', marginTop: '5px', cursor: 'pointer' }} onClick={() => removeFromCart(item.productId)}>Remove</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn">Checkout</button>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
