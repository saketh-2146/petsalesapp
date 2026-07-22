import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, Settings, LogOut, Shield } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { authService } from '../../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser } = useContext(AppContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await authService.logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">Paws & Claws</span>
        </Link>
        
        <div className="navbar-search">
          <input type="text" placeholder="Search for pets..." className="search-input" />
          <button className="search-btn"><Search size={18} /></button>
        </div>

        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Adopt & Buy</Link>
          <Link to="/sell" className="nav-link">Sell</Link>
          <Link to="/chat" className="nav-link">Messages</Link>
        </div>

        <div className="navbar-actions desktop-only">
          <button onClick={() => navigate('/favorites')} className="icon-btn"><Heart size={20} /></button>
          <button onClick={() => navigate('/checkout')} className="icon-btn"><ShoppingBag size={20} /></button>
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="icon-btn primary-btn"><User size={20} /> Profile</button>
              {isProfileMenuOpen && (
                <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <button onClick={() => { setIsProfileMenuOpen(false); navigate('/profile'); }} style={{ textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <Settings size={16} /> Dashboard
                  </button>
                  {currentUser.role === 'Admin' && (
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate('/admin'); }} style={{ textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }}>
                      <Shield size={16} /> Admin Controls
                    </button>
                  )}
                  <button onClick={handleLogout} style={{ textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#ef4444', cursor: 'pointer' }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} className="icon-btn primary-btn"><User size={20} /> Sign In</button>
          )}
        </div>

        <div className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-dropdown">
          <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/search" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Adopt & Buy</Link>
          <Link to="/sell" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Sell</Link>
          <Link to="/chat" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Messages</Link>
          {currentUser ? (
            <>
              <Link to="/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Profile Dashboard</Link>
              {currentUser.role === 'Admin' && (
                <Link to="/admin" className="mobile-link" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--accent)' }}>Admin Controls</Link>
              )}
              <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="mobile-link" style={{ textAlign: 'left', color: '#ef4444', background: 'none', border: 'none', width: '100%' }}>Sign Out</button>
            </>
          ) : (
            <Link to="/auth" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
