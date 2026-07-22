import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppContextProvider, AppContext } from './context/AppContext';

// Web Layout Components
import Navbar from './components/web/Navbar';
import Footer from './components/web/Footer';
import BottomNavigation from './components/layout/BottomNavigation';

// Screen Modules
import AuthModule from './components/screens/AuthModule';
import HomeModule from './components/screens/HomeModule';
import MarketplaceModule from './components/screens/MarketplaceModule';
import DetailsModule from './components/screens/DetailsModule';
import SellingModule from './components/screens/SellingModule';
import ChatModule from './components/screens/ChatModule';
import AdoptionModule from './components/screens/AdoptionModule';
import PaymentModule from './components/screens/PaymentModule';
import ProfileModule from './components/screens/ProfileModule';
import AdminModule from './components/screens/AdminModule';
import CareModule from './components/screens/CareModule';

function MainApp() {
  const location = useLocation();
  const { setActiveScreen } = useContext(AppContext);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveScreen('HomeDashboard');
    else if (path.startsWith('/auth')) setActiveScreen('Login');
    else if (path.startsWith('/market')) setActiveScreen('Marketplace');
    else if (path.startsWith('/pet/')) setActiveScreen('PetDetails');
    else if (path.startsWith('/sell')) setActiveScreen('SellingDashboard');
    else if (path.startsWith('/chat')) setActiveScreen('ChatList');
    else if (path.startsWith('/care')) setActiveScreen('CareDashboard');
    else if (path.startsWith('/adoption')) setActiveScreen('MyAdoptionRequests');
    else if (path.startsWith('/checkout')) setActiveScreen('CheckoutScreen');
    else if (path.startsWith('/profile')) setActiveScreen('ProfileDashboard');
    else if (path.startsWith('/admin')) setActiveScreen('AdminDashboard');
  }, [location.pathname, setActiveScreen]);

  return (
    <div className="web-app-container">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomeModule />} />
          
          {/* Auth Routes */}
          <Route path="/auth/*" element={<AuthModule />} />
          <Route path="/login" element={<Navigate to="/auth" />} />
          
          {/* Marketplace & Listing */}
          <Route path="/market" element={<MarketplaceModule />} />
          
          {/* Details */}
          <Route path="/pet/:id" element={<DetailsModule />} />
          
          {/* Selling */}
          <Route path="/sell/*" element={<SellingModule />} />
          
          {/* Care */}
          <Route path="/care/*" element={<CareModule />} />
          
          {/* Messaging / Chat */}
          <Route path="/chat/*" element={<ChatModule />} />
          
          {/* Adoption tracking */}
          <Route path="/adoption" element={<AdoptionModule />} />
          
          {/* Payments & Checkout */}
          <Route path="/checkout" element={<PaymentModule />} />
          
          {/* User Profile */}
          <Route path="/profile/*" element={<ProfileModule />} />
          
          {/* Admin */}
          <Route path="/admin" element={<AdminModule />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <BottomNavigation />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </AppContextProvider>
  );
}
