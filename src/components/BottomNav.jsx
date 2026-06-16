import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Home, Search, PlusCircle, Sparkles, User } from 'lucide-react';

export default function BottomNav() {
  const { activeScreen, setActiveScreen } = useContext(AppContext);

  // Define tab map
  const TABS = [
    { id: 'HomeDashboard', label: 'Home', icon: Home, match: ['HomeDashboard', 'PetCategories', 'PopularPets', 'NewArrivals', 'RecommendedPets', 'NearbyPets'] },
    { id: 'SearchScreen', label: 'Search', icon: Search, match: ['SearchScreen', 'AdvancedFilters', 'SearchResults', 'MapView'] },
    { id: 'SellerDashboard', label: 'Sell', icon: PlusCircle, match: ['SellerDashboard', 'AddPetListing', 'UploadPetImages', 'UploadPetVideos', 'EnterPetInfo', 'SetPriceLocation', 'ListingPreview', 'ManageListings'] },
    { id: 'ChatList', label: 'Grok', icon: Sparkles, match: ['ChatList', 'IndividualChat', 'VoiceMessage', 'VideoCall'] },
    { id: 'UserProfile', label: 'Profile', icon: User, match: ['UserProfile', 'EditProfile', 'FavoritesWishlist'] }
  ];

  return (
    <nav className="glass" style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      borderTop: '1px solid var(--border)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 900,
      paddingBottom: '2px'
    }}>
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = tab.match.includes(activeScreen);
        return (
          <button
            key={tab.id}
            onClick={() => setActiveScreen(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: isActive ? '700' : '500',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Icon size={20} style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'all var(--transition-fast)' }} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
