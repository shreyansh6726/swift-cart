export default function Cart({ items, onBack, onIncrease, onDecrease, onCheckout }) {
  const total = items.reduce((sum, item) => {
    const price = item.offer ? item.offer_price : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <main className="cart-page">
      <section className="cart-card">
        <button type="button" className="back-button" onClick={onBack}>← Back to products</button>
        <p className="eyebrow">SWIFT CART / YOUR CART</p>
        <h1>Your cart</h1>
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
    </main>
  );
}
