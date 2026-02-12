import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', paddingTop: '4rem', paddingBottom: '2rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand Column */}
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            SwiftCart<span style={{ color: 'var(--color-accent)' }}>.</span>
                        </h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                            Elevating your shopping experience with premium products and seamless service. Trusted by professionals worldwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Home</Link></li>
                            <li><Link to="/products" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Products</Link></li>
                            <li><Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Login</Link></li>
                            <li><Link to="/register" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Register</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Contact Us</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
                                <MapPin size={18} />
                                <span>Gurgaon, Haryana</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
                                <Phone size={18} />
                                <span>+91 9958639220</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
                                <Mail size={18} />
                                <span>shreyansh.official.6726@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button aria-label="Facebook" style={{ color: '#cbd5e1', transition: 'color 0.2s', cursor: 'pointer' }}><Facebook size={20} /></button>
                            <button aria-label="Twitter" style={{ color: '#cbd5e1', transition: 'color 0.2s', cursor: 'pointer' }}><Twitter size={20} /></button>
                            <button aria-label="Instagram" style={{ color: '#cbd5e1', transition: 'color 0.2s', cursor: 'pointer' }}><Instagram size={20} /></button>
                            <button aria-label="LinkedIn" style={{ color: '#cbd5e1', transition: 'color 0.2s', cursor: 'pointer' }}><Linkedin size={20} /></button>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} SwiftCart Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
