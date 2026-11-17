import RetailerNavbar from '../components/RetailerNavbar';

export default function ManageProduct({ open, onToggle, onNavigate }) {
  return (
    <main className={`home-page retailer-subpage ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <RetailerNavbar open={open} activePage="manageProduct" onToggle={onToggle} onNavigate={onNavigate} />
      <section className="retailer-page-card">
        <p className="eyebrow">SWIFT CART RETAILER</p>
        <h1>manage products</h1>
        <p className="home-copy">Add, update, and organize everything your storefront offers.</p>
        <button type="button" className="primary-button">Add a product</button>
      </section>
    </main>
  );
}
