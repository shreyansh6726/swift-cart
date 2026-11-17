import { useEffect, useState } from 'react';
import RetailerNavbar from '../components/RetailerNavbar';

const API_BASE_URL = import.meta.env.API_BASE_URL;

const emptyProfile = {
  name: '',
  email: '',
  phone_number: '',
  gender: 'male',
  dob: '',
  shop_name: '',
  shop_address: '',
  password: ''
};

export default function Profile({ open, onToggle, onNavigate, onProfileUpdated, onDeleted }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('retailerToken')}`,
          'X-Frontend-Path': window.location.pathname
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Unable to load profile');
      }

      setProfile({
        ...emptyProfile,
        ...data.user,
        phone_number: String(data.user.phone_number || ''),
        dob: data.user.dob ? data.user.dob.slice(0, 10) : ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const updates = {
      name: profile.name,
      gender: profile.gender,
      dob: profile.dob,
      shop_name: profile.shop_name,
      shop_address: profile.shop_address
    };

    if (profile.password) {
      updates.password = profile.password;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('retailerToken')}`,
          'Content-Type': 'application/json',
          'X-Frontend-Path': window.location.pathname
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Unable to update profile');
      }

      setProfile({
        ...profile,
        ...data.user,
        phone_number: String(data.user.phone_number || ''),
        dob: data.user.dob ? data.user.dob.slice(0, 10) : '',
        password: ''
      });
      onProfileUpdated(data.user.name);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your retailer profile? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('retailerToken')}`,
          'X-Frontend-Path': window.location.pathname
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Unable to delete profile');
      }

      onDeleted();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setSaving(false);
    }
  };

  return (
    <main className={`home-page retailer-subpage ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <RetailerNavbar open={open} activePage="profile" onToggle={onToggle} onNavigate={onNavigate} />
      <section className="retailer-page-card profile-card">
        <p className="eyebrow">SWIFT CART RETAILER</p>
        <h1>profile</h1>
        <p className="home-copy">Update your retailer details. Email and phone number are permanently tied to your account.</p>

        {loading ? <p className="profile-status">Loading profile...</p> : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" value={profile.name} onChange={handleChange} required className="field" />
            </label>
            <label>
              Email <span>Cannot be changed</span>
              <input name="email" type="email" value={profile.email} readOnly className="field immutable-field" />
            </label>
            <label>
              Phone <span>Cannot be changed</span>
              <input name="phone_number" value={profile.phone_number} readOnly className="field immutable-field" />
            </label>
            <label>
              Gender
              <select name="gender" value={profile.gender} onChange={handleChange} className="field">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </label>
            <label>
              Date of birth
              <input name="dob" type="date" value={profile.dob} onChange={handleChange} required className="field" />
            </label>
            <label>
              Shop name
              <input name="shop_name" value={profile.shop_name} onChange={handleChange} required className="field" />
            </label>
            <label className="profile-wide-field">
              Shop address
              <textarea name="shop_address" value={profile.shop_address} onChange={handleChange} required className="field" />
            </label>
            <label className="profile-wide-field">
              New password <span>Leave blank to keep current password</span>
              <input name="password" type="password" value={profile.password} onChange={handleChange} className="field" />
            </label>
            {message.text && <p className={`form-message ${message.type} profile-wide-field`}>{message.text}</p>}
            <div className="profile-actions profile-wide-field">
              <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
              <button type="button" className="delete-button" onClick={handleDelete} disabled={saving}>Delete profile</button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
