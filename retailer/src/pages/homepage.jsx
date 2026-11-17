import RetailerNavbar from '../components/RetailerNavbar';

export default function Homepage({ open, onToggle, onNavigate, greeting, retailerName, onLogout }) {
  return (
    <main className={`home-page ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <RetailerNavbar open={open} activePage="homepage" onToggle={onToggle} onNavigate={onNavigate} />
      <div className="home-glow home-glow-one" />
      <div className="home-glow home-glow-two" />
      <section className="home-card">
        <p className="eyebrow">SWIFT CART RETAILER</p>
        <div className="home-icon" aria-hidden="true">✦</div>
        <p className="home-kicker">Your storefront is ready</p>
        <h1>{greeting}, {retailerName}.</h1>
        <p className="home-copy">Manage your retail journey from one simple, focused space.</p>
        <button type="button" className="primary-button" onClick={onLogout}>Log out</button>
      </section>
    </main>
  );
}
