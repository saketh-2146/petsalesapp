import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Sun, Moon, Bell, Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

export default function DeviceFrame({ children }) {
  const { theme, toggleTheme, activeScreen, setActiveScreen, notifications, setNotifications, smsNotification } = useContext(AppContext);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleBack = () => {
    // Basic back navigation mapping
    if (activeScreen === 'OTP' || activeScreen === 'ForgotPassword') {
      setActiveScreen('Login');
    } else if (activeScreen === 'Register') {
      setActiveScreen('Login');
    } else if (activeScreen === 'PetCategories' || activeScreen === 'PopularPets' || activeScreen === 'NewArrivals' || activeScreen === 'RecommendedPets' || activeScreen === 'NearbyPets') {
      setActiveScreen('HomeDashboard');
    } else if (activeScreen === 'AdvancedFilters' || activeScreen === 'SearchResults' || activeScreen === 'MapView') {
      setActiveScreen('SearchScreen');
    } else if (activeScreen === 'PetDetails') {
      setActiveScreen('HomeDashboard');
    } else if (activeScreen.startsWith('PetHealth') || activeScreen.startsWith('PetVaccination') || activeScreen.startsWith('PetOwner') || activeScreen.startsWith('AdoptionRequest') || activeScreen.startsWith('PurchaseRequest')) {
      setActiveScreen('PetDetails');
    } else if (activeScreen.startsWith('Upload') || activeScreen.startsWith('EnterPet') || activeScreen.startsWith('SetPrice') || activeScreen.startsWith('ListingPreview')) {
      setActiveScreen('AddPetListing');
    } else if (activeScreen === 'VoiceMessage' || activeScreen === 'VideoCall') {
      setActiveScreen('IndividualChat');
    } else if (activeScreen === 'IndividualChat') {
      setActiveScreen('ChatList');
    } else if (activeScreen === 'AIRecommendedPets' || activeScreen === 'AICompatibilityScore') {
      setActiveScreen('PetPreferenceForm');
    } else if (activeScreen === 'AdoptionStatusTracking' || activeScreen === 'AdoptionHistory') {
      setActiveScreen('MyAdoptionRequests');
    } else if (activeScreen === 'PaymentGateway' || activeScreen === 'PaymentSuccess') {
      setActiveScreen('CheckoutScreen');
    } else if (activeScreen === 'PaymentHistory' || activeScreen === 'EditProfile' || activeScreen === 'FavoritesWishlist') {
      setActiveScreen('UserProfile');
    } else {
      setActiveScreen('HomeDashboard');
    }
  };

  // Determine if we should show a back button in the top bar
  const showBackButton = ![
    'Splash', 'Onboarding1', 'Onboarding2', 'Onboarding3', 'Login', 'Register',
    'HomeDashboard', 'SearchScreen', 'SellerDashboard', 'ChatList', 'UserProfile'
  ].includes(activeScreen);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* MOCK SMS TOAST FOR OTP */}
      {smsNotification && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '16px',
          right: '16px',
          background: 'var(--text-main)',
          color: 'var(--bg-app)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999,
          animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          borderLeft: '4px solid var(--primary)',
          fontSize: '0.85rem'
        }}>
          <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>💬 Messages (Simulated SMS)</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Just Now</span>
          </div>
          <div>OTP for verification: <strong style={{ color: 'var(--secondary)', fontSize: '1.05rem', letterSpacing: '2px', marginLeft: '4px' }}>{smsNotification.code}</strong>. Verification code sent to {smsNotification.phone}.</div>
        </div>
      )}

      {/* Main Smartphone Body Mockup */}
      <div style={{
        width: '385px',
        height: '812px',
        background: 'var(--bg-app)',
        borderRadius: '40px',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5), inset 0 0 2px 2px var(--border)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '8px solid #1a1a1a',
      }}>
        {/* Device Camera Notch / Island */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '24px',
          background: '#1a1a1a',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ width: '40px', height: '4px', background: '#333', borderRadius: '2px', marginBottom: '4px' }}></div>
        </div>

        {/* Status Bar */}
        <div style={{
          height: '44px',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-main)',
          zIndex: 980,
          background: 'transparent',
          userSelect: 'none'
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} fill="var(--text-main)" />
          </div>
        </div>

        {/* Dynamic App Header */}
        {!['Splash', 'Onboarding1', 'Onboarding2', 'Onboarding3'].includes(activeScreen) && (
          <header style={{
            height: '56px',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-card)',
            zIndex: 900,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {showBackButton && (
                <button 
                  onClick={handleBack}
                  style={{
                    background: 'none',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg-input)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {activeScreen === 'HomeDashboard' ? 'Paws & Claws' : 
                 activeScreen.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                style={{
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              {/* Notification Badge */}
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Bell size={16} />
                {unreadNotifs > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.65rem',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifDropdown && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: '44px',
                  right: '0',
                  width: '260px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '12px',
                  zIndex: 9999,
                  maxHeight: '320px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Notifications</span>
                    <button onClick={markAllAsRead} style={{ background: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '600' }}>Mark all read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '8px 4px',
                      borderBottom: '1px solid var(--border)',
                      opacity: n.read ? 0.7 : 1
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{n.title}</span>
                        {!n.read && <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></span>}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{n.body}</p>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </header>
        )}

        {/* Main Viewport Window */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }} className="no-scrollbar">
          {children}
        </div>

        {/* Device Bottom Virtual Home Bar Indicator */}
        <div style={{
          height: '20px',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 980
        }}>
          <div style={{
            width: '130px',
            height: '5px',
            background: 'var(--text-main)',
            borderRadius: '10px',
            opacity: 0.5
          }}></div>
        </div>
      </div>
    </div>
  );
}
