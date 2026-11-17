const options = [
  ['⌂', 'dashboard', 'homepage'],
  ['◈', 'account', 'account'],
  ['▣', 'manage products', 'manageProduct'],
  ['?', 'help', 'help'],
  ['◉', 'profile', 'profile']
];

export default function RetailerNavbar({ open, activePage, onToggle, onNavigate }) {
  return (
    <aside className={`retailer-sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" aria-hidden="true">✦</span>
          <span className="sidebar-brand-text">Swift Cart</span>
        </div>
        <button
          type="button"
          className="menu-toggle"
          onClick={onToggle}
          aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav className="sidebar-nav" aria-label="Retailer navigation">
        {options.map(([icon, label, page]) => (
          <button
            type="button"
            className={`sidebar-link ${activePage === page ? 'active' : ''}`}
            key={page}
            onClick={() => onNavigate(page)}
          >
            <span className="sidebar-link-icon" aria-hidden="true">{icon}</span>
            <span className="sidebar-link-label">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
