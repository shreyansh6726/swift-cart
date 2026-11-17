export default function Navbar({ active = 'home', customerName, greeting, cartCount, onHome, onSignIn, onLogout, onOpenCart }) {
  return (
    <nav className="customer-navbar" aria-label="Customer navigation">
      <button type="button" className="customer-brand" onClick={onHome}>Swift Cart</button>
      <div className="customer-nav-links">
        <button type="button" className={active === 'home' ? 'nav-link active' : 'nav-link'} onClick={onHome}>Home</button>
        <button type="button" className="nav-link" onClick={() => alert('Options are coming soon.')}>Options</button>
        <button type="button" className="nav-link" onClick={() => alert('Account settings are coming soon.')}>Account</button>
        <button type="button" className="nav-link" onClick={() => alert('Profile settings are coming soon.')}>Profile</button>
      </div>
      <div className="customer-nav-actions">
        <button type="button" className="nav-cart-button" onClick={onOpenCart}>Cart ({cartCount})</button>
        {customerName
          ? <>
            <span className="nav-greeting">{greeting}, {customerName}</span>
            <button type="button" className="nav-auth-button" onClick={onLogout}>Log out</button>
          </>
          : <button type="button" className="nav-auth-button" onClick={onSignIn}>Login / Sign up</button>}
      </div>
    </nav>
  );
}
