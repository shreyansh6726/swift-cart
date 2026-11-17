import { useEffect, useRef } from 'react';

export default function Cart({ items, open, onOpen, onClose, onIncrease, onDecrease, onCheckout }) {
  const drawerRef = useRef(null);
  const total = items.reduce((sum, item) => {
    const price = item.offer ? item.offer_price : item.price;
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) onClose();
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open, onClose]);

  return (
    <aside ref={drawerRef} className={`cart-drawer ${open ? 'open' : ''}`} aria-label="Shopping cart">
      {!open ? (
        <button type="button" className="cart-drawer-tab" onClick={onOpen} aria-label="Open shopping cart">
          <span>Cart</span>
          <strong>{items.length}</strong>
        </button>
      ) : (
        <section className="cart-drawer-content">
          <div className="cart-drawer-header">
            <div>
              <p className="eyebrow">SWIFT CART</p>
              <h2>Your cart</h2>
            </div>
            <button type="button" className="cart-close-button" onClick={onClose} aria-label="Close shopping cart">×</button>
          </div>
          {items.length === 0 ? <p className="cart-empty">Your cart is empty.</p> : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <article className="cart-item" key={item._id}>
                    <div className="cart-item-image">{item.image_link?.[0] ? <img src={item.image_link[0]} alt="" /> : '✦'}</div>
                    <div className="cart-item-details"><h2>{item.name}</h2><p>₹{item.offer ? item.offer_price : item.price} each</p></div>
                    <div className="quantity-control">
                      <button type="button" onClick={() => onDecrease(item._id)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onIncrease(item._id)} aria-label={`Increase ${item.name} quantity`}>+</button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="cart-total"><span>Total</span><strong>₹{total}</strong></div>
              <button type="button" className="primary-button payment-button" onClick={() => onCheckout(items)}>Proceed to payment</button>
            </>
          )}
        </section>
      )}
    </aside>
  );
}
