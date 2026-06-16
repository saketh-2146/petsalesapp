import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, MapPin, Heart, Flame, Sparkles, Clock, Compass, ArrowRight } from 'lucide-react';

export default function HomeModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    pets, 
    favorites, 
    toggleFavorite, 
    setSelectedPetId,
    currentUser
  } = useContext(AppContext);

  const handlePetClick = (petId) => {
    setSelectedPetId(petId);
    setActiveScreen('PetDetails');
  };

  const visiblePets = pets.filter(p => p.status === 'Available');

  const getCategoryCount = (category) => {
    return visiblePets.filter(p => p.category === category).length;
  };

  // Screen 9: Home Dashboard
  if (activeScreen === 'HomeDashboard') {
    const featuredPets = visiblePets.slice(0, 4);
    const nearbyPets = visiblePets.slice().sort((a, b) => a.distance - b.distance).slice(0, 3);
    
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        {/* Welcome Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Welcome back 👋</span>
            <h1 style={{ fontSize: '1.4rem', marginTop: '2px' }}>{currentUser?.name || 'Guest User'}</h1>
          </div>
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} 
            alt="Profile" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }} 
          />
        </div>

        {/* Search Bar Trigger */}
        <div 
          onClick={() => setActiveScreen('SearchScreen')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-input)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <Search size={18} />
          <span style={{ fontSize: '0.88rem' }}>Search dog breeds, cats, rabbits...</span>
        </div>

        {/* AI Recommendations Banner */}
        <div 
          onClick={() => setActiveScreen('PetPreferenceForm')}
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Sparkles size={10} /> AI Powered
            </span>
            <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: '800', lineHeight: '1.3' }}>Find Your Perfect Match</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', marginTop: '4px' }}>Take our quick quiz to see compatible pets</p>
          </div>
          <ArrowRight size={20} />
        </div>

        {/* Categories Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Categories</h3>
            <button onClick={() => setActiveScreen('PetCategories')} style={{ background: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>View All</button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
            {['Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish'].map(cat => (
              <div 
                key={cat}
                onClick={() => setActiveScreen('PetCategories')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  minWidth: '70px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
                  {cat === 'Dogs' ? '🐶' : cat === 'Cats' ? '🐱' : cat === 'Birds' ? '🦜' : cat === 'Rabbits' ? '🐰' : '🐠'}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Featured Pets</h3>
            </div>
            <button onClick={() => setActiveScreen('PopularPets')} style={{ background: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>See Popular</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {featuredPets.map(pet => (
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
                      color: favorites.includes(pet.id) ? 'red' : 'var(--text-muted)'
                    }}
                  >
                    <Heart size={14} fill={favorites.includes(pet.id) ? 'red' : 'none'} />
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
        </div>

        {/* Nearby Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Nearby Pets</h3>
            </div>
            <button onClick={() => setActiveScreen('NearbyPets')} style={{ background: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>View Map</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nearbyPets.map(pet => (
              <div 
                key={pet.id} 
                onClick={() => handlePetClick(pet.id)}
                className="card"
                style={{ display: 'flex', padding: '10px', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
              >
                <img src={pet.images[0]} alt={pet.name} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{pet.name}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                      {pet.price === 0 ? 'Adoption' : `₹${pet.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{pet.breed} • {pet.age}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '4px' }}>
                    <MapPin size={10} style={{ color: 'var(--accent)' }} />
                    <span>{pet.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Screen 10: Pet Categories
  if (activeScreen === 'PetCategories') {
    const list = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish'];
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>Pet Categories</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '-12px' }}>Select a species to view matching listings</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {list.map(cat => (
            <div 
              key={cat}
              onClick={() => {
                setSelectedPetId(cat); // Storing category in search results triggers
                setActiveScreen('SearchScreen');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>
                  {cat === 'Dogs' ? '🐶' : cat === 'Cats' ? '🐱' : cat === 'Birds' ? '🦜' : cat === 'Rabbits' ? '🐰' : '🐠'}
                </span>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{cat}</h3>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getCategoryCount(cat)} active listings</p>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Common Pet Feed UI Wrapper
  const renderFeedScreen = (title, petList, subtitle) => {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <div>
          <h1 style={{ fontSize: '1.3rem' }}>{title}</h1>
          {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {petList.map(pet => (
            <div 
              key={pet.id} 
              onClick={() => handlePetClick(pet.id)}
              className="card"
              style={{ display: 'flex', padding: '12px', gap: '12px', position: 'relative', cursor: 'pointer' }}
            >
              <img src={pet.images[0]} alt={pet.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{pet.name}</h3>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {pet.price === 0 ? 'Free' : `₹${pet.price.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{pet.breed} • {pet.age} • {pet.gender}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '6px' }}>
                  <MapPin size={10} style={{ color: 'var(--primary)' }} />
                  <span>{pet.location}</span>
                </div>

                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--bg-input)', borderRadius: '4px', fontWeight: '600' }}>{pet.vaccinationStatus}</span>
                  {pet.healthRecords.healthScore >= 95 && (
                    <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '4px', fontWeight: '600' }}>Healthy Match</span>
                  )}
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(pet.id); }}
                style={{
                  position: 'absolute',
                  top: '12px', right: '12px',
                  background: 'var(--bg-input)',
                  borderRadius: '50%',
                  width: '26px', height: '26px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: favorites.includes(pet.id) ? 'red' : 'var(--text-muted)'
                }}
              >
                <Heart size={12} fill={favorites.includes(pet.id) ? 'red' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Screen 11: Popular Pets
  if (activeScreen === 'PopularPets') {
    return renderFeedScreen(
      'Popular Pets', 
      visiblePets.filter(p => p.price >= 350).slice(0, 5),
      'Highly rated listings by local community'
    );
  }

  // Screen 12: New Arrivals
  if (activeScreen === 'NewArrivals') {
    return renderFeedScreen(
      'New Arrivals', 
      visiblePets.slice().sort((a, b) => b.id.localeCompare(a.id)),
      'Fresh listings published in the last 48 hours'
    );
  }

  // Screen 13: Recommended Pets
  if (activeScreen === 'RecommendedPets') {
    return renderFeedScreen(
      'AI Recommended', 
      visiblePets.filter(p => p.healthRecords.healthScore >= 96),
      'Matched dynamically based on your quiz profile'
    );
  }

  // Screen 14: Nearby Pets
  if (activeScreen === 'NearbyPets') {
    return renderFeedScreen(
      'Nearby Pets', 
      visiblePets.slice().sort((a, b) => a.distance - b.distance),
      'Pets within 10 miles radius of your current location'
    );
  }

  return null;
}
