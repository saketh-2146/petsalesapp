import React, { useContext } from 'react';
import { AppContextProvider, AppContext } from './context/AppContext';
import DeviceFrame from './components/DeviceFrame';
import SidebarNavigator from './components/SidebarNavigator';
import BottomNav from './components/BottomNav';

// Screen Modules
import AuthModule from './components/screens/AuthModule';
import HomeModule from './components/screens/HomeModule';
import SearchModule from './components/screens/SearchModule';
import DetailsModule from './components/screens/DetailsModule';
import SellingModule from './components/screens/SellingModule';
import ChatModule from './components/screens/ChatModule';
import AIRecommendationModule from './components/screens/AIRecommendationModule';
import AdoptionModule from './components/screens/AdoptionModule';
import PaymentModule from './components/screens/PaymentModule';
import ProfileModule from './components/screens/ProfileModule';
import AdminModule from './components/screens/AdminModule';

function MainApp() {
  const { activeScreen } = useContext(AppContext);

  // Simple view router mapping activeScreen to corresponding Module
  const renderScreenContent = () => {
    switch (activeScreen) {
      // Auth
      case 'Splash':
      case 'Onboarding1':
      case 'Onboarding2':
      case 'Onboarding3':
      case 'Login':
      case 'Register':
      case 'ForgotPassword':
      case 'OTP':
        return <AuthModule />;

      // Home
      case 'HomeDashboard':
      case 'PetCategories':
      case 'PopularPets':
      case 'NewArrivals':
      case 'RecommendedPets':
      case 'NearbyPets':
        return <HomeModule />;

      // Search
      case 'SearchScreen':
      case 'AdvancedFilters':
      case 'SearchResults':
      case 'MapView':
        return <SearchModule />;

      // Details
      case 'PetDetails':
      case 'PetHealthDetails':
      case 'PetVaccinationDetails':
      case 'PetOwnerProfile':
      case 'AdoptionRequestForm':
      case 'PurchaseRequestForm':
        return <DetailsModule />;

      // Sell
      case 'SellerDashboard':
      case 'AddPetListing':
      case 'UploadPetImages':
      case 'UploadPetVideos':
      case 'EnterPetInfo':
      case 'SetPriceLocation':
      case 'ListingPreview':
      case 'ManageListings':
        return <SellingModule />;

      // Chat
      case 'ChatList':
      case 'IndividualChat':
      case 'VoiceMessage':
      case 'VideoCall':
        return <ChatModule />;

      // AI Recommendations
      case 'PetPreferenceForm':
      case 'AIRecommendedPets':
      case 'AICompatibilityScore':
        return <AIRecommendationModule />;

      // Adoptions
      case 'MyAdoptionRequests':
      case 'AdoptionStatusTracking':
      case 'AdoptionHistory':
        return <AdoptionModule />;

      // Payments
      case 'CheckoutScreen':
      case 'PaymentGateway':
      case 'PaymentSuccess':
      case 'PaymentHistory':
      case 'WalletScreen':
      case 'AddMoneyScreen':
        return <PaymentModule />;

      // User Profile
      case 'UserProfile':
      case 'EditProfile':
      case 'FavoritesWishlist':
        return <ProfileModule />;

      // Admin Controls
      case 'AdminDashboard':
        return <AdminModule />;

      default:
        return <HomeModule />;
    }
  };

  // Check if we should render bottom navigation menu
  const showBottomNav = [
    'HomeDashboard', 'SearchScreen', 'SellerDashboard', 'ChatList', 'UserProfile',
    'PetCategories', 'PopularPets', 'NewArrivals', 'RecommendedPets', 'NearbyPets',
    'SearchResults', 'MapView', 'ManageListings', 'AdoptionHistory', 'MyAdoptionRequests',
    'FavoritesWishlist', 'PaymentHistory', 'WalletScreen'
  ].includes(activeScreen);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-app)',
      paddingLeft: '320px', // Offset for the fixed SidebarNavigator
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background-color var(--transition-normal)'
    }}>
      {/* Sidebar catalog shortcuts */}
      <SidebarNavigator />

      {/* Main device viewport mockup container */}
      <DeviceFrame>
        {renderScreenContent()}
        {showBottomNav && <BottomNav />}
      </DeviceFrame>

      {/* Help panel on desktop side */}
      <div style={{
        width: '300px',
        padding: '24px',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginLeft: '40px',
        fontFamily: 'var(--font-body)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ color: 'var(--primary)', fontWeight: '800' }}>Review Instructions</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Welcome to the <strong>Paws & Claws Sandbox</strong>!
        </p>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
        <ul style={{ paddingLeft: '16px', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Use the left <strong>50 Screens Navigator</strong> to instantly load any screen state.</li>
          <li>To test the <strong>OTP flow</strong>: go to Screen 5 or 6, choose Phone Login/Register, type a number, and click send. A mock SMS notification banner will show the verification code.</li>
          <li>In chat threads, sending a message triggers automatic seller/AI care assistant replies after 1.5s.</li>
          <li>Creating listings updates arrivals, management feeds, and transaction records in real time.</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <MainApp />
    </AppContextProvider>
  );
}
