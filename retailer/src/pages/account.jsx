import RetailerNavbar from '../components/RetailerNavbar';

export default function Account({ open, onToggle, onNavigate }) {
  return (
    <RetailerPage title="account" description="Keep your store account details organized in one place." open={open} activePage="account" onToggle={onToggle} onNavigate={onNavigate}>
      <div className="retailer-placeholder-grid">
        <div className="retailer-info-card"><span>Account status</span><strong>Active</strong></div>
        <div className="retailer-info-card"><span>Store access</span><strong>Verified</strong></div>
      </div>
    </RetailerPage>
  );
}

function RetailerPage({ title, description, open, activePage, onToggle, onNavigate, children }) {
  return (
    <main className={`home-page retailer-subpage ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <RetailerNavbar open={open} activePage={activePage} onToggle={onToggle} onNavigate={onNavigate} />
      <section className="retailer-page-card">
        <p className="eyebrow">SWIFT CART RETAILER</p>
        <h1>{title}</h1>
        <p className="home-copy">{description}</p>
        {children}
      </section>
    </main>
  );
}
