import CustomerApp from '../customer/src/App.jsx'
import AdminApp from '../admin/src/App.jsx'
import RetailerApp from '../retailer/src/App.jsx'

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/admin' || path.startsWith('/admin/')) {
    return <AdminApp />
  }

  if (path === '/retailer' || path.startsWith('/retailer/')) {
    return <RetailerApp />
  }

  return <CustomerApp />
}

function LandingPage({ title, description }) {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.label}>SWIFT CART</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background: '#f3f4f6',
    color: '#1f2937',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    maxWidth: '520px',
    padding: '48px',
    borderRadius: '20px',
    background: '#fff',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
  },
  label: {
    color: '#6366f1',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
  },
}
