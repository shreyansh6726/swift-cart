import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function AdminLandingPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.label}>SWIFT CART</p>
        <h1>Admin Portal</h1>
        <p>Manage users, products, orders, and platform settings.</p>
        <button style={styles.button}>Open Admin Dashboard</button>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminLandingPage />
  </StrictMode>,
)

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background: '#111827',
    color: '#f9fafb',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    maxWidth: '520px',
    padding: '48px',
    borderRadius: '20px',
    background: '#1f2937',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
  },
  label: {
    color: '#93c5fd',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  button: {
    marginTop: '20px',
    padding: '12px 18px',
    border: 0,
    borderRadius: '8px',
    background: '#2563eb',
    color: '#fff',
    fontWeight: '700',
  },
}
