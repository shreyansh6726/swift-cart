export default function Payment({ items, onBack, onComplete }) {
  const total = items.reduce((sum, item) => {
    const price = item.offer ? item.offer_price : item.price;
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <main className="payment-page">
      <section className="payment-card">
        <button type="button" className="back-button" onClick={onBack}>← Back</button>
        <p className="eyebrow">SWIFT CART / CHECKOUT</p>
        <h1>Payment</h1>
        <p className="payment-intro">Review your order before completing your purchase.</p>
        <div className="payment-items">
          {items.map((item) => (
            <div className="payment-item" key={item._id}>
              <span>{item.name} × {item.quantity || 1}</span>
              <strong>₹{(item.offer ? item.offer_price : item.price) * (item.quantity || 1)}</strong>
            </div>
          ))}
        </div>
        <div className="payment-total"><span>Total</span><strong>₹{total}</strong></div>
        <label className="payment-field">Delivery address<input className="field" placeholder="Enter your delivery address" required /></label>
        <label className="payment-field">Payment method<select className="field" defaultValue="card"><option value="card">Card</option><option value="upi">UPI</option><option value="cod">Cash on delivery</option></select></label>
        <button type="button" className="primary-button payment-button" onClick={onComplete}>Place order</button>
      </section>
    </main>
  );
}
