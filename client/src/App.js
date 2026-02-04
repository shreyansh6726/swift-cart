import React, { useState, useEffect } from 'react';

// --- STYLING (JS Objects) ---
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
    padding: '20px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  retailerBadge: {
    backgroundColor: '#ff9800',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
  }
};

export default function App() {
  // PERSISTENCE LOGIC: Load login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [role, setRole] = useState(localStorage.getItem('userRole') || 'customer');

  // Sync login state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userRole', role);
  }, [isLoggedIn, role]);

  const handleLogin = (selectedRole) => {
    setIsLoggedIn(true);
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  // --- VIEW: LANDING / LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={{ ...styles.container, textAlign: 'center', paddingTop: '100px' }}>
        <h1>Welcome to ByteDesk Market</h1>
        <p>Please select your portal to continue:</p>
        <button style={styles.button} onClick={() => handleLogin('customer')}>
          Enter as Customer
        </button>
        <button style={{ ...styles.button, backgroundColor: '#28a745', marginLeft: '10px' }} onClick={() => handleLogin('retailer')}>
          Enter as Retailer
        </button>
      </div>
    );
  }

  // --- VIEW: DASHBOARD (CUSTOMER OR RETAILER) ---
  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h2>ByteDesk {role === 'retailer' ? 'Retailer Portal' : 'Shop'}</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Role: <strong>{role}</strong></span>
          <button style={{ ...styles.button, backgroundColor: '#dc3545' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {role === 'customer' ? (
        <CustomerView />
      ) : (
        <RetailerView />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function CustomerView() {
  const products = [
    { id: 1, name: 'Wireless Mouse', price: '$25' },
    { id: 2, name: 'Mechanical Keyboard', price: '$80' },
    { id: 3, name: 'Gaming Monitor', price: '$200' },
  ];

  return (
    <div>
      <h3>Available Products</h3>
      <div style={styles.cardGrid}>
        {products.map(p => (
          <div key={p.id} style={styles.card}>
            <h4>{p.name}</h4>
            <p>{p.price}</p>
            <button style={styles.button}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetailerView() {
  return (
    <div style={{ ...styles.card, textAlign: 'left' }}>
      <h3>Retailer Inventory Management</h3>
      <p>Total Sales: <strong>$1,240</strong></p>
      <hr />
      <h4>Add New Product</h4>
      <input type="text" placeholder="Product Name" style={{ padding: '8px', marginBottom: '10px', width: '100%' }} />
      <input type="number" placeholder="Price" style={{ padding: '8px', marginBottom: '10px', width: '100%' }} />
      <button style={{ ...styles.button, backgroundColor: '#28a745' }}>Upload Product</button>
    </div>
  );
}