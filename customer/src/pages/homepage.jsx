import { useMemo, useState } from 'react';
import Cart from '../components/cart';
import Navbar from '../components/navbar';
import Searchbar from '../components/searchbar';

export default function Homepage({
  items,
  loading,
  error,
  cartCount,
  greeting,
  customerName,
  onProductClick,
  onSignIn,
  onLogout,
  onOpenCart,
  cartItems,
  cartOpen,
  onCloseCart,
  onIncreaseCartItem,
  onDecreaseCartItem,
  onCheckoutCart
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => [item.name, item.description, item.category, ...(item.metadata || [])]
      .some((value) => value?.toLowerCase().includes(query)));
  }, [items, searchTerm]);

  return (
    <main className="customer-catalog">
      <Navbar
        customerName={customerName}
        greeting={greeting}
        cartCount={cartCount}
        onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSignIn={onSignIn}
        onLogout={onLogout}
        onOpenCart={onOpenCart}
      />
      <header className="catalog-header">
        <div>
          <p className="eyebrow">SWIFT CART / CUSTOMER</p>
          <h1>Find your next <span>favourite.</span></h1>
          <p>Fresh picks from our retailer community.</p>
        </div>
        <Searchbar value={searchTerm} onChange={setSearchTerm} />
      </header>
      <section className="catalog-content">
        {loading && <p className="catalog-status">Loading products...</p>}
        {!loading && error && <p className="catalog-status catalog-error">{error}</p>}
        {!loading && !error && filteredItems.length === 0 && <p className="catalog-status">No products match your search.</p>}
        <div className="catalog-grid">
          {filteredItems.map((item) => (
            <article className="catalog-item" key={item._id} onClick={() => onProductClick(item)} role="button" tabIndex="0" onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onProductClick(item);
            }}>
              <div className="catalog-item-image">
                {item.image_link?.[0] ? <img src={item.image_link[0]} alt={item.name} /> : <span>✦</span>}
              </div>
              <div className="catalog-item-body">
                <p className="catalog-category">{item.category || 'Product'}</p>
                <h2>{item.name}</h2>
                <p className="catalog-description">{item.description || 'A new addition to your shopping list.'}</p>
                <div className="catalog-item-footer">
                  <strong>₹{item.offer ? item.offer_price : item.price}</strong>
                  {item.offer && <span>₹{item.price}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Cart
        items={cartItems}
        open={cartOpen}
        onOpen={onOpenCart}
        onClose={onCloseCart}
        onIncrease={onIncreaseCartItem}
        onDecrease={onDecreaseCartItem}
        onCheckout={onCheckoutCart}
      />
    </main>
  );
}
