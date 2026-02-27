import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(AuthContext);

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <ShoppingBag size={64} className="empty-icon" />
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="/" className="btn btn-primary mt-4">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="cart-grid">
          <div className="cart-items-list">
            {cart.map((item, index) => {
              const product = item.product || {};
              const productName = product.name || 'Unknown Item';
              const productPrice = product.price || 0;
              const productImage = (product.images && product.images.length > 0)
                ? product.images[0]
                : 'https://via.placeholder.com/150';

              return (
                <div key={item._id || index} className="cart-page-item">
                  <img src={productImage} alt={productName} className="item-img" />
                  <div className="item-info">
                    <h3>{productName}</h3>
                    <p className="item-price">Rs. {productPrice}</p>

                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="qty-btn"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="qty-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="item-remove-link"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="item-total">
                    Rs. {productPrice * item.quantity}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({cart.length} items)</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {cartTotal}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-block checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;