import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Edit2, Heart, Clipboard, LogOut, ChevronRight, Settings, Shield, MapPin, Wallet } from 'lucide-react';

export default function ProfileModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    currentUser, 
    setCurrentUser, 
    favorites, 
    toggleFavorite, 
    pets, 
    setSelectedPetId,
    logout,
    walletBalance
  } = useContext(AppContext);

  // Edit states
  const [editName, setEditName] = useState(currentUser?.name || 'Alex Rivera');
  const [editEmail, setEditEmail] = useState(currentUser?.email || 'alex.rivera@gmail.com');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+1 (555) 998-3829');

  const [editSuccess, setEditSuccess] = useState(false);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: editName,
      email: editEmail,
      phone: editPhone
    }));
    setEditSuccess(true);
    setTimeout(() => {
      setEditSuccess(false);
      setActiveScreen('UserProfile');
    }, 2000);
  };

  const handlePetClick = (petId) => {
    setSelectedPetId(petId);
    setActiveScreen('PetDetails');
  };

  // Screen 47: User Profile
  if (activeScreen === 'UserProfile') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'} 
            alt="Profile Avatar" 
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>{currentUser?.name || 'Alex Rivera'}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser?.email || 'alex.rivera@gmail.com'}</span>
            
            <span style={{
              display: 'inline-block',
              fontSize: '0.62rem',
              fontWeight: 'bold',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '1px 6px',
              borderRadius: '4px',
              marginTop: '4px'
            }}>
              Role: {currentUser?.role || 'Adopter/Buyer'}
            </span>
          </div>
        </div>

        {/* Action Directories list */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div 
            onClick={() => setActiveScreen('EditProfile')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Edit2 size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.85rem' }}>Edit Personal Profile</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div 
            onClick={() => setActiveScreen('FavoritesWishlist')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.85rem' }}>Favorites / Bookmarks</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div 
            onClick={() => setActiveScreen('MyAdoptionRequests')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clipboard size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.85rem' }}>My Adoption Applications</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div 
            onClick={() => setActiveScreen('SellerDashboard')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.85rem' }}>Seller Control Dashboard</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div 
            onClick={() => setActiveScreen('WalletScreen')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wallet size={16} style={{ color: '#7c3aed' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>My Wallet</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 'bold' }}>₹{walletBalance.toLocaleString('en-IN')}</span>
              <ChevronRight size={16} style={{ color: '#7c3aed' }} />
            </div>
          </div>

          {/* Admin shortcut if admin role or simulated admin */}
          {(currentUser?.role === 'Admin' || currentUser?.email?.includes('admin')) && (
            <div 
              onClick={() => setActiveScreen('AdminDashboard')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)' }}>System Admin Dashboard</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--accent)' }} />
            </div>
          )}
        </div>

        {/* Log Out button */}
        <button 
          onClick={logout}
          className="btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '46px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={16} />
          <span>Log Out Account</span>
        </button>
      </div>
    );
  }

  // Screen 48: Edit Profile
  if (activeScreen === 'EditProfile') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Edit Profile</h1>

        {editSuccess ? (
          <div style={{ padding: '20px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Changes Saved Successfully!</span>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Updating profile records...</p>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</span>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</span>
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</span>
              <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary" style={{ height: '48px', marginTop: '10px' }}>Save Profile Changes</button>
          </form>
        )}
      </div>
    );
  }

  // Screen 49: Favorites/Wishlist
  if (activeScreen === 'FavoritesWishlist') {
    const favoritePets = pets.filter(p => favorites.includes(p.id));

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Wishlist / Favorites</h1>

        {favoritePets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Heart size={40} style={{ opacity: 0.3, margin: '0 auto 10px' }} />
            <p style={{ fontWeight: 'bold' }}>Your wishlist is empty</p>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Explore pets on the Home dashboard and tap the heart icon to save bookmarks here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {favoritePets.map(pet => (
              <div 
                key={pet.id} 
                className="card"
                onClick={() => handlePetClick(pet.id)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ position: 'relative', height: '110px' }}>
                  <img src={pet.images[0]} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(pet.id); }}
                    style={{
                      position: 'absolute',
                      top: '8px', right: '8px',
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      width: '28px', height: '28px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'red'
                    }}
                  >
                    <Heart size={14} fill="red" />
                  </button>
                </div>
                <div style={{ padding: '10px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{pet.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '2px' }}>
                    <MapPin size={10} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{pet.location.split('(')[0]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>
                      {pet.price === 0 ? 'Adoption' : `₹${pet.price.toLocaleString('en-IN')}`}
                    </span>
                    <span style={{ fontSize: '0.65rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>{pet.breed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
