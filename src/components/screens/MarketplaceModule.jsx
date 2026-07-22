import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Sliders, Map, MapPin, Grid, X, Mic, Heart } from 'lucide-react';

export default function MarketplaceModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    pets, 
    favorites, 
    toggleFavorite, 
    setSelectedPetId 
  } = useContext(AppContext);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBreed, setSelectedBreed] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [maxDistance, setMaxDistance] = useState(10);
  
  const [activeMapPet, setActiveMapPet] = useState(null);

  // Recent searches cache
  const [recentSearches, setRecentSearches] = useState(['Golden Retriever', 'Siamese cat', 'Frenchie', 'Adoption']);

  // Filter lists
  const breeds = ['All', 'Golden Retriever', 'Siamese', 'French Bulldog', 'Cockatiel', 'Angora Rabbit', 'Clownfish', 'German Shepherd', 'Persian Cat'];

  // Search filter logic
  const visiblePets = pets.filter(p => p.status === 'Available');

  const filteredPets = visiblePets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || pet.category === selectedCategory;
    const matchesBreed = selectedBreed === 'All' || pet.breed === selectedBreed;
    const matchesGender = selectedGender === 'All' || pet.gender === selectedGender;
    const matchesPrice = pet.price <= maxPrice;
    const matchesDistance = pet.distance <= maxDistance;

    return matchesSearch && matchesCategory && matchesBreed && matchesGender && matchesPrice && matchesDistance;
  });

  const handleRecentClick = (query) => {
    setSearchQuery(query);
    setActiveScreen('SearchResults');
  };

  const handleApplyFilters = () => {
    setActiveScreen('SearchResults');
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBreed('All');
    setSelectedGender('All');
    setMaxPrice(100000);
    setMaxDistance(10);
    setSearchQuery('');
  };

  const handlePetClick = (petId) => {
    setSelectedPetId(petId);
    setActiveScreen('PetDetails');
  };

  // Screen 15: Search Screen
  if (activeScreen === 'SearchScreen') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        {/* Header Bar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search pets, breeds, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveScreen('SearchResults')}
              style={{ paddingLeft: '44px', paddingRight: '40px' }}
            />
            <Mic size={18} style={{ position: 'absolute', right: '16px', top: '14px', color: 'var(--text-muted)' }} />
          </div>
          <button 
            onClick={() => setActiveScreen('AdvancedFilters')}
            style={{
              background: 'var(--primary)',
              color: 'white',
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sliders size={20} />
          </button>
        </div>

        {/* Categories Selector */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Species</h3>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
            {['All', 'Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                  color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                  border: '1px solid var(--border)',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Recent Searches</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentSearches.map((term, i) => (
              <button 
                key={i} 
                onClick={() => handleRecentClick(term)}
                style={{
                  padding: '6px 12px',
                  background: 'var(--bg-input)',
                  borderRadius: '99px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: '500'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Map View Shortcut */}
        <div 
          onClick={() => setActiveScreen('MapView')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            width: '40px', height: '40px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Map size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Interactive Map View</h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Locate matching pets nearby on a localized map</p>
          </div>
        </div>
      </div>
    );
  }

  // Screen 16: Advanced Filters
  if (activeScreen === 'AdvancedFilters') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem' }}>Filters</h1>
          <button onClick={resetFilters} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '600' }}>Reset All</button>
        </div>

        {/* Filter inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pet Species</span>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Species</option>
              <option value="Dogs">Dogs</option>
              <option value="Cats">Cats</option>
              <option value="Birds">Birds</option>
              <option value="Rabbits">Rabbits</option>
              <option value="Fish">Fish</option>
            </select>
          </div>

          {/* Breed Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pet Breed</span>
            <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
              {breeds.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Gender */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Gender</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['All', 'Male', 'Female'].map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem', fontWeight: '600',
                    border: '1px solid',
                    borderColor: selectedGender === g ? 'var(--primary)' : 'var(--border)',
                    background: selectedGender === g ? 'var(--primary-light)' : 'var(--bg-card)',
                    color: selectedGender === g ? 'var(--primary)' : 'var(--text-main)'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--text-muted)' }}>Max Price</span>
              <span style={{ color: 'var(--primary)' }}>{maxPrice === 0 ? 'Free Adoption' : `₹${maxPrice.toLocaleString('en-IN')}`}</span>
            </div>
            <input 
              type="range" 
              min="0" max="100000" step="1000"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ padding: 0 }}
            />
          </div>

          {/* Distance Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--text-muted)' }}>Max Distance</span>
              <span style={{ color: 'var(--primary)' }}>{maxDistance} miles</span>
            </div>
            <input 
              type="range" 
              min="1" max="25" step="1"
              value={maxDistance} 
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              style={{ padding: 0 }}
            />
          </div>
        </div>

        <button 
          onClick={handleApplyFilters}
          className="btn-primary" 
          style={{ height: '48px', marginTop: 'auto' }}
        >
          Apply Filters ({filteredPets.length} Results)
        </button>
      </div>
    );
  }

  // Screen 17: Search Results
  if (activeScreen === 'SearchResults') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        {/* Results Info Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem' }}>Search Results</h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Found {filteredPets.length} matching pets</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setActiveScreen('AdvancedFilters')} style={{ background: 'var(--bg-input)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
              <Sliders size={14} />
            </button>
            <button onClick={() => setActiveScreen('MapView')} style={{ background: 'var(--bg-input)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
              <Map size={14} />
            </button>
          </div>
        </div>

        {/* Chips for Active Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {selectedCategory !== 'All' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: '700' }}>
              {selectedCategory} <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('All')} />
            </span>
          )}
          {selectedBreed !== 'All' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: '700' }}>
              {selectedBreed} <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedBreed('All')} />
            </span>
          )}
          {selectedGender !== 'All' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: '700' }}>
              {selectedGender} <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedGender('All')} />
            </span>
          )}
          {maxPrice < 100000 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: '700' }}>
              Under ₹{maxPrice.toLocaleString('en-IN')} <X size={10} style={{ cursor: 'pointer' }} onClick={() => setMaxPrice(100000)} />
            </span>
          )}
        </div>

        {/* Grid list of Results */}
        {filteredPets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Search size={40} style={{ opacity: 0.3, margin: '0 auto 10px' }} />
            <p style={{ fontWeight: 'bold' }}>No Pets Found</p>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Try broadening your search keywords or resetting active filters.</p>
          </div>
        ) : (
          <div className="responsive-grid">
            {filteredPets.map(pet => (
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
                    <span style={{ fontSize: '0.62rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 5px', borderRadius: '4px', fontWeight: '700' }}>{pet.breed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Screen 18: Map View (Visual interactive SVG map representation)
  if (activeScreen === 'MapView') {
    // Map markers representing pets (coordinates scale inside SVG 0-100)
    const mapPins = [
      { id: 'pet-1', x: 28, y: 35, name: 'Milo', category: 'Dogs' },
      { id: 'pet-3', x: 55, y: 22, name: 'Bella', category: 'Dogs' },
      { id: 'pet-2', x: 42, y: 68, name: 'Luna', category: 'Cats' },
      { id: 'pet-5', x: 70, y: 50, name: 'Daisy', category: 'Rabbits' }
    ];

    const currentMapPet = activeMapPet || visiblePets[0];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }} className="animate-fade-in">
        {/* Toggle Button layout */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveScreen('SearchResults')}
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              fontSize: '0.78rem'
            }}
          >
            <Grid size={14} />
            <span>List View</span>
          </button>
        </div>

        {/* Custom Premium Styled SVG Vector map */}
        <div style={{ flex: 1, background: '#cbd5e1', position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
            {/* Water features (Lake Washington / Puget Sound simulation) */}
            <path d="M 0 0 Q 20 20, 10 100 L 0 100 Z" fill="#93c5fd" opacity="0.6" />
            <path d="M 80 0 Q 75 40, 95 100 L 100 100 L 100 0 Z" fill="#93c5fd" opacity="0.6" />
            
            {/* Main roads layout */}
            <path d="M 10 40 L 90 40 M 50 0 L 50 100 M 20 10 L 80 90" stroke="#f8fafc" strokeWidth="2.5" fill="none" />
            
            {/* Park regions */}
            <rect x="25" y="15" width="15" height="15" rx="2" fill="#86efac" opacity="0.5" />
            <rect x="60" y="70" width="18" height="12" rx="2" fill="#86efac" opacity="0.5" />

            {/* Custom styled markers */}
            {mapPins.map(pin => {
              const isSelected = currentMapPet?.id === pin.id;
              const petRecord = visiblePets.find(p => p.id === pin.id);
              
              return (
                <g 
                  key={pin.id} 
                  onClick={() => setActiveMapPet(petRecord)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle 
                    cx={pin.x} 
                    cy={pin.y} 
                    r={isSelected ? '6' : '4'} 
                    fill={isSelected ? 'var(--primary)' : 'var(--text-muted)'} 
                    stroke="white" 
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.25s' }}
                  />
                  {isSelected && (
                    <circle 
                      cx={pin.x} 
                      cy={pin.y} 
                      r="12" 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="1" 
                      opacity="0.5"
                      style={{ animation: 'pulseLoading 1.5s infinite' }}
                    />
                  )}
                  <text 
                    x={pin.x} 
                    y={pin.y - 8} 
                    fontSize="3" 
                    fontWeight="bold" 
                    textAnchor="middle" 
                    fill="var(--text-main)"
                    style={{ background: 'white', padding: '1px' }}
                  >
                    {pin.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected map pet preview popup at bottom */}
        {currentMapPet && (
          <div className="glass" style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            borderRadius: 'var(--radius-lg)',
            padding: '12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 99
          }}
          onClick={() => handlePetClick(currentMapPet.id)}
          >
            <img src={currentMapPet.images[0]} alt={currentMapPet.name} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{currentMapPet.name}</h4>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {currentMapPet.price === 0 ? 'Adoption' : `₹${currentMapPet.price.toLocaleString('en-IN')}`}
                </span>
              </div>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{currentMapPet.breed} • {currentMapPet.age}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--text-muted)', fontSize: '0.6rem', marginTop: '4px' }}>
                <MapPin size={8} style={{ color: 'var(--accent)' }} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{currentMapPet.location}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
