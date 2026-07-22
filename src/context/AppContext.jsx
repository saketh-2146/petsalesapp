import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { petService } from '../services/petService';
import { chatService } from '../services/chatService';
import { favoriteService } from '../services/favoriteService';
import { adoptionService } from '../services/adoptionService';
import { paymentService } from '../services/paymentService';
import { notificationService } from '../services/notificationService';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // Navigation screen states
  const [activeScreen, setActiveScreen] = useState('Splash');
  
  // Simulated SMS Toast State
  const [smsNotification, setSmsNotification] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  // All data states
  const [pets, setPets] = useState([]);
  const [chats, setChats] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [selectedPetId, setSelectedPetId] = useState('pet-1');
  const [activeChatId, setActiveChatId] = useState(null);

  // AI Preference Quiz Form Cache
  const [aiPreferences, setAiPreferences] = useState({
    housing: 'Apartment',
    activityLevel: 'Moderate',
    workHours: '4-8 hours',
    hasChildren: false,
    hasOtherPets: false,
    preferredCategory: 'Dogs'
  });

  // ─── Theme sync ──────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ─── Load user-specific data from database ───────────
  const loadUserData = useCallback(async (userId) => {
    const [
      favResult,
      chatResult,
      adoptionResult,
      txResult,
      walletResult,
      notifResult
    ] = await Promise.all([
      favoriteService.getFavorites(userId),
      chatService.getChats(userId),
      adoptionService.getAdoptionRequests(userId),
      paymentService.getTransactions(userId),
      paymentService.getWalletBalance(userId),
      notificationService.getNotifications(userId)
    ]);

    if (favResult.data) setFavorites(favResult.data);
    if (chatResult.data) setChats(chatResult.data);
    if (adoptionResult.data) setAdoptions(adoptionResult.data);
    if (txResult.data) setPaymentHistory(txResult.data);
    setWalletBalance(walletResult.balance || 0);
    if (notifResult.data) setNotifications(notifResult.data);
  }, []);

  // ─── App initialization ──────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const { data: userProfile, error } = await authService.getUserProfile('me');
        if (userProfile && !error) {
          const user = {
            id: userProfile.id,
            name: userProfile.full_name || userProfile.email?.split('@')[0] || 'User',
            email: userProfile.email,
            phone: userProfile.phone || '',
            role: userProfile.role || 'Buyer',
            avatar: userProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
          };
          setCurrentUser(user);
          await loadUserData(userProfile.id);
        } else {
          setCurrentUser(null);
          resetUserData();
        }
      } else {
        setCurrentUser(null);
        resetUserData();
      }
    };

    initAuth();

    // Initial pets fetch
    const fetchInitialPets = async () => {
      const { data } = await petService.getPets();
      setPets(data || []);
    };
    fetchInitialPets();
  }, [loadUserData]);

  const resetUserData = () => {
    setChats([]);
    setFavorites([]);
    setAdoptions([]);
    setPaymentHistory([]);
    setWalletBalance(0);
    setNotifications([]);
  };

  // ─── Subscriptions for user-specific data (Polled or Init fetch for now)
  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubscribeNotif = notificationService.subscribeToNotifications(currentUser.id, (data) => {
      setNotifications(data);
    });

    const unsubscribeChat = chatService.subscribeToChats(currentUser.id, (data) => {
      setChats(data);
    });

    return () => {
      unsubscribeNotif();
      unsubscribeChat();
    };
  }, [currentUser?.id]);

  // ─── Helper actions ──────────────────────────────────
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    resetUserData();
    setActiveScreen('Login');
  };

  const triggerSmsOtp = (phone) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSmsNotification({ phone, code });
    setTimeout(() => {
      setSmsNotification(null);
    }, 12000);
    return code;
  };

  // ─── Favorites ────────────────────────────
  const toggleFavorite = async (petId) => {
    setFavorites(prev =>
      prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
    );

    if (currentUser?.id) {
      await favoriteService.toggleFavorite(currentUser.id, petId, favorites);
    }
  };

  // ─── Add Pet Listing ──────────────────────
  const addPetListing = async (newPet) => {
    const initialStatus = currentUser?.role === 'Admin' ? 'Available' : 'Pending';

    const petData = {
      ...newPet,
      status: initialStatus,
      createdDate: new Date().toISOString().split('T')[0],
      owner_id: currentUser?.id,
      owner: {
        id: currentUser?.id,
        name: currentUser?.name || 'Seller',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
        rating: 5.0,
        reviewsCount: 0,
        verified: false,
        phone: currentUser?.phone || '',
        email: currentUser?.email || ''
      }
    };

    const { data, error } = await petService.addPet(petData);
    if (error) {
      alert(`Error adding pet: ${error}`);
      return null;
    }

    setPets(prev => [data, ...prev]);
    return data;
  };

  const updatePetStatus = async (petId, newStatus) => {
    const { error } = await petService.updatePet(petId, { status: newStatus });
    if (error) {
      console.error(`Error updating pet status: ${error}`);
      return false;
    }
    setPets(prev => prev.map(p => p.id === petId ? { ...p, status: newStatus } : p));
    return true;
  };

  // ─── Chat & Messages ──────────────────────
  const sendMessage = async (chatId, text, type = 'text') => {
    if (!currentUser?.id) return;

    const { error } = await chatService.sendMessage(chatId, currentUser.id, text, type);
    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    const { data: updatedChats } = await chatService.getChats(currentUser.id);
    if (updatedChats) setChats(updatedChats);
  };

  const startChat = async (sellerId, petId) => {
    if (!currentUser?.id) return null;

    const { data, error } = await chatService.getOrCreateChat(currentUser.id, sellerId, petId);
    if (error) {
      console.error('Error starting chat:', error);
      return null;
    }

    const { data: updatedChats } = await chatService.getChats(currentUser.id);
    if (updatedChats) setChats(updatedChats);

    setActiveChatId(data.id);
    return data;
  };

  // ─── Adoption Requests ────────────────────
  const submitAdoptionRequest = async (petId, formDetails) => {
    if (!currentUser?.id) return null;

    // Need to determine ownerId from pets list
    const pet = pets.find(p => p.id === petId);
    const ownerId = pet ? pet.owner_id : '';

    const { data, error } = await adoptionService.submitRequest(currentUser.id, petId, ownerId, formDetails);
    if (error) {
      alert(`Error submitting adoption request: ${error}`);
      return null;
    }

    const { data: updated } = await adoptionService.getAdoptionRequests(currentUser.id);
    if (updated) setAdoptions(updated);

    return data;
  };

  // ─── Payments & Wallet ────────────────────
  const processPayment = async (checkoutDetails) => {
    if (!currentUser?.id) return null;

    const { data, error } = await paymentService.processPayment(currentUser.id, checkoutDetails);
    if (error) {
      alert(`Payment error: ${error}`);
      return null;
    }

    const [txResult, walletResult] = await Promise.all([
      paymentService.getTransactions(currentUser.id),
      paymentService.getWalletBalance(currentUser.id)
    ]);
    if (txResult.data) setPaymentHistory(txResult.data);
    setWalletBalance(walletResult.balance || 0);

    return data;
  };

  const addMoneyToWallet = async (amount) => {
    if (!currentUser?.id) return null;

    const { data, error } = await paymentService.addMoneyToWallet(currentUser.id, amount);
    if (error) {
      alert(`Wallet error: ${error}`);
      return null;
    }

    const [txResult, walletResult] = await Promise.all([
      paymentService.getTransactions(currentUser.id),
      paymentService.getWalletBalance(currentUser.id)
    ]);
    if (txResult.data) setPaymentHistory(txResult.data);
    setWalletBalance(walletResult.balance || 0);

    return data;
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      activeScreen,
      setActiveScreen,
      smsNotification,
      setSmsNotification,
      currentUser,
      setCurrentUser,
      pets,
      setPets,
      chats,
      setChats,
      adoptions,
      setAdoptions,
      paymentHistory,
      setPaymentHistory,
      walletBalance,
      setWalletBalance,
      addMoneyToWallet,
      favorites,
      toggleFavorite,
      selectedPetId,
      setSelectedPetId,
      activeChatId,
      setActiveChatId,
      notifications,
      setNotifications,
      aiPreferences,
      setAiPreferences,
      triggerSmsOtp,
      logout,
      addPetListing,
      updatePetStatus,
      sendMessage,
      startChat,
      submitAdoptionRequest,
      processPayment
    }}>
      {children}
    </AppContext.Provider>
  );
};
