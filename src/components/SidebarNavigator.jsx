import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Menu, ChevronDown, ChevronRight, Layers, Eye } from 'lucide-react';

const MODULES = [
  {
    name: 'Authentication Module',
    screens: [
      { id: 'Splash', label: 'Screen 1: Splash Screen' },
      { id: 'Onboarding1', label: 'Screen 2: Onboarding 1' },
      { id: 'Onboarding2', label: 'Screen 3: Onboarding 2' },
      { id: 'Onboarding3', label: 'Screen 4: Onboarding 3' },
      { id: 'Login', label: 'Screen 5: Login Screen' },
      { id: 'Register', label: 'Screen 6: Registration' },
      { id: 'ForgotPassword', label: 'Screen 7: Forgot Password' },
      { id: 'OTP', label: 'Screen 8: OTP Verification' }
    ]
  },
  {
    name: 'Home Module',
    screens: [
      { id: 'HomeDashboard', label: 'Screen 9: Home Dashboard' },
      { id: 'PetCategories', label: 'Screen 10: Pet Categories' },
      { id: 'PopularPets', label: 'Screen 11: Popular Pets' },
      { id: 'NewArrivals', label: 'Screen 12: New Arrivals' },
      { id: 'RecommendedPets', label: 'Screen 13: Recommended Pets' },
      { id: 'NearbyPets', label: 'Screen 14: Nearby Pets' }
    ]
  },
  {
    name: 'Pet Search Module',
    screens: [
      { id: 'SearchScreen', label: 'Screen 15: Search Screen' },
      { id: 'AdvancedFilters', label: 'Screen 16: Advanced Filters' },
      { id: 'SearchResults', label: 'Screen 17: Search Results' },
      { id: 'MapView', label: 'Screen 18: Map View' }
    ]
  },
  {
    name: 'Pet Details Module',
    screens: [
      { id: 'PetDetails', label: 'Screen 19: Pet Details' },
      { id: 'PetHealthDetails', label: 'Screen 20: Health Details' },
      { id: 'PetVaccinationDetails', label: 'Screen 21: Vaccination Details' },
      { id: 'PetOwnerProfile', label: 'Screen 22: Pet Owner Profile' },
      { id: 'AdoptionRequestForm', label: 'Screen 23: Adoption Form' },
      { id: 'PurchaseRequestForm', label: 'Screen 24: Purchase Form' }
    ]
  },
  {
    name: 'Pet Selling Module',
    screens: [
      { id: 'SellerDashboard', label: 'Screen 25: Seller Dashboard' },
      { id: 'AddPetListing', label: 'Screen 26: Add Pet Listing' },
      { id: 'UploadPetImages', label: 'Screen 27: Upload Images' },
      { id: 'UploadPetVideos', label: 'Screen 28: Upload Videos' },
      { id: 'EnterPetInfo', label: 'Screen 29: Enter Pet Info' },
      { id: 'SetPriceLocation', label: 'Screen 30: Set Price & Location' },
      { id: 'ListingPreview', label: 'Screen 31: Listing Preview' },
      { id: 'ManageListings', label: 'Screen 32: Manage Listings' }
    ]
  },
  {
    name: 'Chat Module',
    screens: [
      { id: 'ChatList', label: 'Screen 33: Chat List' },
      { id: 'IndividualChat', label: 'Screen 34: Individual Chat' },
      { id: 'VoiceMessage', label: 'Screen 35: Voice Message' },
      { id: 'VideoCall', label: 'Screen 36: Video Call' }
    ]
  },
  {
    name: 'AI Recommendation Module',
    screens: [
      { id: 'PetPreferenceForm', label: 'Screen 37: Preference Quiz' },
      { id: 'AIRecommendedPets', label: 'Screen 38: AI Recommended' },
      { id: 'AICompatibilityScore', label: 'Screen 39: Compatibility Score' }
    ]
  },
  {
    name: 'Adoption Management',
    screens: [
      { id: 'MyAdoptionRequests', label: 'Screen 40: My Requests' },
      { id: 'AdoptionStatusTracking', label: 'Screen 41: Status Tracking' },
      { id: 'AdoptionHistory', label: 'Screen 42: Adoption History' }
    ]
  },
  {
    name: 'Payment Module',
    screens: [
      { id: 'CheckoutScreen', label: 'Screen 43: Checkout Screen' },
      { id: 'PaymentGateway', label: 'Screen 44: Payment Gateway' },
      { id: 'PaymentSuccess', label: 'Screen 45: Payment Success' },
      { id: 'PaymentHistory', label: 'Screen 46: Payment History' }
    ]
  },
  {
    name: 'User Profile Module',
    screens: [
      { id: 'UserProfile', label: 'Screen 47: User Profile' },
      { id: 'EditProfile', label: 'Screen 48: Edit Profile' },
      { id: 'FavoritesWishlist', label: 'Screen 49: Favorites/Wishlist' }
    ]
  },
  {
    name: 'Admin Module',
    screens: [
      { id: 'AdminDashboard', label: 'Screen 50: Admin Dashboard' }
    ]
  }
];

export default function SidebarNavigator() {
  const { activeScreen, setActiveScreen } = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState(() => {
    // Expand authentication and home by default
    return {
      'Authentication Module': true,
      'Home Module': true
    };
  });

  const toggleModule = (moduleName) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  if (collapsed) {
    return (
      <button 
        onClick={() => setCollapsed(false)}
        style={{
          position: 'fixed',
          left: '16px',
          top: '16px',
          background: 'var(--primary)',
          color: 'var(--text-on-primary)',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999
        }}
      >
        <Menu size={20} />
      </button>
    );
  }

  return (
    <div style={{
      width: '320px',
      height: '100vh',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 9999,
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-body)',
      transition: 'transform var(--transition-normal)'
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--primary-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers style={{ color: 'var(--primary)' }} size={20} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>50 Screens Navigator</h3>
        </div>
        <button 
          onClick={() => setCollapsed(true)}
          style={{
            background: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}
        >
          Collapse
        </button>
      </div>

      {/* Screen List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px'
      }} className="no-scrollbar">
        {MODULES.map(mod => {
          const isExpanded = expandedModules[mod.name];
          return (
            <div key={mod.name} style={{ marginBottom: '12px' }}>
              {/* Module Title Dropdown */}
              <button 
                onClick={() => toggleModule(mod.name)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'none',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)'
                }}
              >
                <span>{mod.name}</span>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {/* Screens under Module */}
              {isExpanded && (
                <div style={{ paddingLeft: '8px', borderLeft: '1px dashed var(--border)', marginLeft: '12px', marginTop: '4px' }}>
                  {mod.screens.map(scr => {
                    const isActive = activeScreen === scr.id;
                    return (
                      <button
                        key={scr.id}
                        onClick={() => setActiveScreen(scr.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: isActive ? 'var(--primary-light)' : 'none',
                          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: isActive ? '700' : '400',
                          textAlign: 'left',
                          marginBottom: '2px'
                        }}
                      >
                        <Eye size={12} style={{ opacity: isActive ? 1 : 0.5 }} />
                        <span>{scr.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
