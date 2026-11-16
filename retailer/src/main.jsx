import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function RetailerLandingPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.label}>SWIFT CART</p>
        <h1>Retailer Portal</h1>
        <p>Manage your catalog, inventory, and customer orders.</p>
        <button style={styles.button}>Open Retailer Dashboard</button>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RetailerLandingPage />
  </StrictMode>,
)

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background: '#ecfdf5',
    color: '#064e3b',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    maxWidth: '520px',
    padding: '48px',
    borderRadius: '20px',
    background: '#fff',
    boxShadow: '0 20px 50px rgba(6, 78, 59, 0.15)',
  },
  label: {
    color: '#059669',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  button: {
    marginTop: '20px',
    padding: '12px 18px',
    border: 0,
    borderRadius: '8px',
    background: '#059669',
    color: '#fff',
    fontWeight: '700',
  },
}
