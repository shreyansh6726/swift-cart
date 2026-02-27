import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(AuthContext); // Use cartTotal from context if available

    console.log("DEBUG FRONTEND: Cart state is:", JSON.stringify(cart, null, 2));

    // Fallback calculation if context doesn't provide total (though it seems it does)
    // Ensure we safely access product properties
    const calculateTotal = () => {
        if (cartTotal !== undefined && cartTotal !== null) return cartTotal;
        return cart.reduce((sum, item) => {
            const price = item.product?.price || 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    const displayTotal = calculateTotal();

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
                                cart.map((item, index) => {
                                    // Safely access product properties. 
                                    // If 'product' is missing (e.g. deleted product), handle gracefully.
                                    const product = item.product || {};
                                    const productName = product.name || 'Unknown Item';
                                    const productPrice = product.price || 0;
                                    const productImage = (product.images && product.images.length > 0)
                                        ? product.images[0]
                                        : 'https://via.placeholder.com/60';

                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            key={`${item._id || index}`}
                                            className="cart-item"
                                        >
                                            <img src={productImage} alt={productName} className="cart-item-img" />
                                            <div className="cart-item-details">
                                                <h4>{productName}</h4>
                                                <div className="quantity-controls">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="qty-btn"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="qty-val">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="qty-btn"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="cart-item-price">Rs. {productPrice * item.quantity}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.productId)} // Ensure we pass the productId correctly
                                                className="remove-btn"
                                                title="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Total</span>
                                    <span>Rs. {displayTotal}</span>
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
