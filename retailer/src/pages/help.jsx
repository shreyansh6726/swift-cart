import RetailerNavbar from '../components/RetailerNavbar';

export default function Help({ open, onToggle, onNavigate }) {
  return (
    <main className={`home-page retailer-subpage ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <RetailerNavbar open={open} activePage="help" onToggle={onToggle} onNavigate={onNavigate} />
      <section className="retailer-page-card">
        <p className="eyebrow">SWIFT CART RETAILER</p>
        <h1>help</h1>
        <p className="home-copy">Find guidance for running your store or reach out to the Swift Cart team.</p>
        <button type="button" className="primary-button">Contact support</button>
      </section>
    </main>
  );
}
