import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cart, removeFromCart } = useContext(AuthContext);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="cart-backdrop"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="cart-sidebar"
                    >
                        <div className="cart-header">
                            <h2 className="cart-title">Your Cart</h2>
                            <button onClick={onClose} className="close-btn">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <div className="empty-cart">
                                    <ShoppingBag size={48} className="empty-icon" />
                                    <p>Your cart is empty.</p>
                                    <button onClick={onClose} className="btn btn-secondary btn-sm mt-4">
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        key={`${item._id}-${index}`}
                                        className="cart-item"
                                    >
                                        <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                                        <div className="cart-item-details">
                                            <h4>{item.name}</h4>
                                            <p className="cart-item-price">Rs. {item.price}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="remove-btn"
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Total</span>
                                    <span>Rs. {total}</span>
                                </div>
                                <button className="btn btn-primary btn-block">
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
