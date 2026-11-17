import { useEffect, useState } from 'react';
import RetailerNavbar from '../components/RetailerNavbar';

const API_BASE_URL = import.meta.env.API_BASE_URL;

const emptyItem = {
  name: '',
  description: '',
  category: '',
  stock_quantity: '',
  image_link: '',
  metadata: '',
  price: '',
  offer: false,
  offer_price: ''
};

export default function ManageProduct({ open, onToggle, onNavigate }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [item, setItem] = useState(emptyItem);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('retailerToken')}`,
          'X-Frontend-Path': window.location.pathname
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Unable to load items');
      setItems(data.items);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoadingItems(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setItem({ ...item, [name]: type === 'checkbox' ? checked : value });
  };

  const openCreateForm = () => {
    setEditingItemId(null);
    setItem(emptyItem);
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const openEditForm = (existingItem) => {
    setEditingItemId(existingItem._id);
    setItem({
      name: existingItem.name || '',
      description: existingItem.description || '',
      category: existingItem.category || '',
      stock_quantity: existingItem.stock_quantity ?? '',
      image_link: (existingItem.image_link || []).join('\n'),
      metadata: (existingItem.metadata || []).join(', '),
      price: existingItem.price ?? '',
      offer: Boolean(existingItem.offer),
      offer_price: existingItem.offer_price ?? ''
    });
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const closeForm = () => {
    if (!saving) {
      setFormOpen(false);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const payload = {
      name: item.name,
      description: item.description,
      category: item.category,
      stock_quantity: Number(item.stock_quantity),
      image_link: item.image_link.split(/[\n,]+/).map((value) => value.trim()).filter(Boolean),
      metadata: item.metadata.split(',').map((value) => value.trim()).filter(Boolean),
      price: Number(item.price),
      offer: item.offer,
      offer_price: item.offer ? Number(item.offer_price) : undefined
    };
    const endpoint = editingItemId ? `${API_BASE_URL}/api/items/${editingItemId}` : `${API_BASE_URL}/api/items`;

    try {
      const response = await fetch(endpoint, {
        method: editingItemId ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('retailerToken')}`,
          'Content-Type': 'application/json',
          'X-Frontend-Path': window.location.pathname
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Unable to save item');

      setItems((currentItems) => editingItemId
        ? currentItems.map((existingItem) => existingItem._id === editingItemId ? data.item : existingItem)
        : [data.item, ...currentItems]);
      setItem(emptyItem);
      setEditingItemId(null);
      setFormOpen(false);
      setMessage({ type: 'success', text: editingItemId ? 'Item updated successfully.' : 'Item added successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (existingItem) => {
    if (!window.confirm(`Delete "${existingItem.name}"?`)) {
      return;
    }

    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${existingItem._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('retailerToken')}`,
          'X-Frontend-Path': window.location.pathname
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Unable to delete item');

      setItems((currentItems) => currentItems.filter((itemToKeep) => itemToKeep._id !== existingItem._id));
      setMessage({ type: 'success', text: 'Item deleted successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <main className={`home-page retailer-subpage ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <RetailerNavbar open={open} activePage="manageProduct" onToggle={onToggle} onNavigate={onNavigate} />
      <section className="retailer-page-card products-card">
        <div className="products-header">
          <div>
            <p className="eyebrow">SWIFT CART RETAILER</p>
            <h1>manage products</h1>
          </div>
          <button type="button" className="primary-button" onClick={openCreateForm}>Add a product</button>
        </div>
        <p className="home-copy">Add, update, and organize everything your storefront offers.</p>
        {message.text && !formOpen && <p className={`form-message ${message.type}`}>{message.text}</p>}
        <div className="products-list">
          <div className="products-list-heading"><span>Your products</span><span>{items.length} item{items.length === 1 ? '' : 's'}</span></div>
          {loadingItems && <p className="profile-status">Loading products...</p>}
          {!loadingItems && items.length === 0 && <p className="profile-status">No products added yet.</p>}
          {items.map((existingItem) => (
            <article className="product-row" key={existingItem._id}>
              <div>
                <h2>{existingItem.name}</h2>
                <p>{existingItem.category || 'Uncategorized'} · {existingItem.stock_quantity} in stock</p>
              </div>
              <div className="product-row-price">
                <strong>₹{existingItem.offer ? existingItem.offer_price : existingItem.price}</strong>
                {existingItem.offer && <span>₹{existingItem.price}</span>}
              </div>
              <div className="product-row-actions">
                <button type="button" className="edit-item-button" onClick={() => openEditForm(existingItem)} aria-label={`Edit ${existingItem.name}`} title="Edit product">✎</button>
                <button type="button" className="delete-item-button" onClick={() => handleDelete(existingItem)} aria-label={`Delete ${existingItem.name}`} title="Delete product">🗑️</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {formOpen && (
        <div className="item-modal-backdrop" role="presentation" onMouseDown={closeForm}>
          <section className="item-modal" role="dialog" aria-modal="true" aria-labelledby="add-item-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="item-modal-header">
              <div>
                <p className="eyebrow">INVENTORY</p>
                <h2 id="add-item-title">{editingItemId ? 'Edit product' : 'Add a product'}</h2>
              </div>
              <button type="button" className="modal-close" onClick={closeForm} aria-label="Close product form">×</button>
            </div>
            <form className="item-form" onSubmit={handleSubmit}>
              <label>Product name<input name="name" value={item.name} onChange={handleChange} required className="field" placeholder="UltraHD 55-Inch 4K Smart LED TV" /></label>
              <label>Category<input name="category" value={item.category} onChange={handleChange} className="field" placeholder="Electronics" /></label>
              <label className="item-wide-field">Description<textarea name="description" value={item.description} onChange={handleChange} className="field" placeholder="Describe the product..." /></label>
              <label>Stock quantity<input name="stock_quantity" type="number" min="0" value={item.stock_quantity} onChange={handleChange} required className="field" /></label>
              <label>Price<input name="price" type="number" min="0" step="1" value={item.price} onChange={handleChange} required className="field" /></label>
              <label className="item-wide-field">Image links <span>Separate links with commas or new lines</span><textarea name="image_link" value={item.image_link} onChange={handleChange} required className="field" placeholder="https://example.com/product-front.jpg" /></label>
              <label className="item-wide-field">Metadata tags <span>Separate tags with commas</span><input name="metadata" value={item.metadata} onChange={handleChange} required className="field" placeholder="electronics, television, smart tv" /></label>
              <label className="offer-toggle item-wide-field"><input name="offer" type="checkbox" checked={item.offer} onChange={handleChange} /> This product has an offer</label>
              {item.offer && <label>Offer price<input name="offer_price" type="number" min="0" step="1" value={item.offer_price} onChange={handleChange} required className="field" /></label>}
              {message.text && <p className={`form-message ${message.type} item-wide-field`}>{message.text}</p>}
              <div className="item-form-actions item-wide-field">
                <button type="button" className="secondary-button" onClick={closeForm} disabled={saving}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : editingItemId ? 'Save changes' : 'Add product'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
