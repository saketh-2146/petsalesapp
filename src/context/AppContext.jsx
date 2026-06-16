import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { petService } from '../services/petService';
import { chatService } from '../services/chatService';
import { favoriteService } from '../services/favoriteService';
import { adoptionService } from '../services/adoptionService';
import { paymentService } from '../services/paymentService';
import { notificationService } from '../services/notificationService';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const AppContext = createContext();

// Pre-seeded high quality pet database (fallback when database has no data)
const INITIAL_PETS = [
  {
    id: 'pet-1',
    name: 'Milo',
    category: 'Dogs',
    breed: 'Golden Retriever',
    age: '2 years',
    ageMonths: 24,
    gender: 'Male',
    color: 'Golden',
    price: 800,
    type: 'Sale',
    status: 'Available',
    vaccinationStatus: 'Fully Vaccinated',
    vaccines: [
      { name: 'Rabies', date: '2025-10-12', batch: 'RB-9021', status: 'Completed' },
      { name: 'DHPP', date: '2025-11-05', batch: 'DH-1182', status: 'Completed' },
      { name: 'Bordetella', date: '2026-02-15', batch: 'BD-7731', status: 'Completed' }
    ],
    healthRecords: {
      weight: '65 lbs',
      allergies: 'None',
      diet: 'Premium Dry Kibble + Salmon Oil',
      healthScore: 98,
      lastCheckup: '2026-04-10',
      vetNotes: 'Extremely active, excellent coat condition, heart rates normal.'
    },
    location: 'Seattle, WA (1.2 miles away)',
    distance: 1.2,
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-playful-golden-retriever-dog-43340-large.mp4',
    owner: {
      id: 'owner-1',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      rating: 4.9,
      reviewsCount: 38,
      verified: true,
      phone: '+1 (555) 019-2834',
      email: 'sarah.j@petmail.com'
    },
    description: 'Milo is a friendly, high-energy Golden Retriever who loves swimming and playing fetch. He is fantastic with kids and other dogs. Fully house-trained and knows basic commands like sit, stay, and paw.',
    createdDate: '2026-06-01'
  },
  {
    id: 'pet-2',
    name: 'Luna',
    category: 'Cats',
    breed: 'Siamese',
    age: '1 year',
    ageMonths: 12,
    gender: 'Female',
    color: 'Cream & Dark Brown',
    price: 350,
    type: 'Sale',
    status: 'Available',
    vaccinationStatus: 'Fully Vaccinated',
    vaccines: [
      { name: 'FVRCP', date: '2025-08-20', batch: 'FV-4482', status: 'Completed' },
      { name: 'Rabies', date: '2025-09-15', batch: 'RB-1109', status: 'Completed' }
    ],
    healthRecords: {
      weight: '9.5 lbs',
      allergies: 'Grain-sensitive',
      diet: 'Wet grain-free venison diet',
      healthScore: 95,
      lastCheckup: '2026-03-22',
      vetNotes: 'Clean ears, healthy weight, slightly sensitive digestion.'
    },
    location: 'Seattle, WA (3.4 miles away)',
    distance: 3.4,
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=600&auto=format&fit=crop'
    ],
    video: '',
    owner: {
      id: 'owner-2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      rating: 4.7,
      reviewsCount: 14,
      verified: true,
      phone: '+1 (555) 283-9912',
      email: 'm.chen@petmail.com'
    },
    description: 'Luna is a gorgeous Siamese with striking blue eyes. She is initially shy but warms up quickly to form strong bonds. She loves curling up in warm sunspots and has a sweet vocal meow.',
    createdDate: '2026-06-03'
  },
  {
    id: 'pet-3',
    name: 'Bella',
    category: 'Dogs',
    breed: 'French Bulldog',
    age: '3 months',
    ageMonths: 3,
    gender: 'Female',
    color: 'Fawn & Black Mask',
    price: 1200,
    type: 'Sale',
    status: 'Available',
    vaccinationStatus: 'Partially Vaccinated',
    vaccines: [
      { name: 'DHPP (Dose 1)', date: '2026-04-20', batch: 'DH-0021', status: 'Completed' },
      { name: 'DHPP (Dose 2)', date: '2026-05-18', batch: 'DH-0022', status: 'Completed' },
      { name: 'Rabies', date: '', batch: '', status: 'Scheduled' }
    ],
    healthRecords: {
      weight: '8 lbs',
      allergies: 'None',
      diet: 'Puppy Starter Wet Mix',
      healthScore: 92,
      lastCheckup: '2026-05-15',
      vetNotes: 'Puppy growth checks out normal. Playful, alert, breathing passages clear.'
    },
    location: 'Bellevue, WA (0.8 miles away)',
    distance: 0.8,
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop'
    ],
    video: '',
    owner: {
      id: 'owner-1',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      rating: 4.9,
      reviewsCount: 38,
      verified: true,
      phone: '+1 (555) 019-2834',
      email: 'sarah.j@petmail.com'
    },
    description: 'Bella is an adorable, playful French Bulldog puppy. She is playful, curiosity-driven, and loves chewing on toys. Great starter pet for apartments.',
    createdDate: '2026-06-08'
  },
  {
    id: 'pet-4',
    name: 'Charlie',
    category: 'Birds',
    breed: 'Cockatiel',
    age: '6 months',
    ageMonths: 6,
    gender: 'Male',
    color: 'Grey & Yellow',
    price: 150,
    type: 'Sale',
    status: 'Available',
    vaccinationStatus: 'Not Required',
    vaccines: [],
    healthRecords: {
      weight: '90g',
      allergies: 'None',
      diet: 'Pellets, Fresh Veggies & Seed Treats',
      healthScore: 96,
      lastCheckup: '2026-02-10',
      vetNotes: 'Active flyer, clear beak, strong talons.'
    },
    location: 'Renton, WA (5.1 miles away)',
    distance: 5.1,
    images: [
      'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=600&auto=format&fit=crop'
    ],
    video: '',
    owner: {
      id: 'owner-3',
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      rating: 4.5,
      reviewsCount: 8,
      verified: false,
      phone: '+1 (555) 881-0199',
      email: 'david.m@petmail.com'
    },
    description: 'Charlie is a whistling Cockatiel who can whistle a couple of popular movie theme tunes. He is comfortable sitting on shoulders and taking treats from hands.',
    createdDate: '2026-06-05'
  },
  {
    id: 'pet-5',
    name: 'Daisy',
    category: 'Rabbits',
    breed: 'Angora Rabbit',
    age: '8 months',
    ageMonths: 8,
    gender: 'Female',
    color: 'Fluffy White',
    price: 0,
    type: 'Adoption',
    status: 'Available',
    vaccinationStatus: 'Fully Vaccinated',
    vaccines: [
      { name: 'RHDV2', date: '2026-01-20', batch: 'RH-2991', status: 'Completed' }
    ],
    healthRecords: {
      weight: '4.8 lbs',
      allergies: 'Alfalfa-allergy (use Timothy hay only)',
      diet: 'Unlimited Timothy Hay + Fresh Greens',
      healthScore: 97,
      lastCheckup: '2026-05-02',
      vetNotes: 'Fluffy coat in ideal condition, teeth look clean and well aligned.'
    },
    location: 'Seattle, WA (2.5 miles away)',
    distance: 2.5,
    images: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop'
    ],
    video: '',
    owner: {
      id: 'owner-4',
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      rating: 4.8,
      reviewsCount: 20,
      verified: true,
      phone: '+1 (555) 198-3344',
      email: 'emma.w@petmail.com'
    },
    description: 'Daisy is a sweet Angora bunny with highly fluffy white fur. She requires regular brushing to prevent matting. She is fully litterbox trained and loves dried apple bites!',
    createdDate: '2026-06-06'
  },
  {
    id: 'pet-6',
    name: 'Bubbles',
    category: 'Fish',
    breed: 'Clownfish',
    age: '2 months',
    ageMonths: 2,
    gender: 'Male',
    color: 'Orange, White & Black',
    price: 25,
    type: 'Sale',
    status: 'Available',
    vaccinationStatus: 'Not Required',
    vaccines: [],
    healthRecords: {
      weight: '15g',
      allergies: 'None',
      diet: 'Brine Shrimp & Marine Flakes',
      healthScore: 100,
      lastCheckup: '2026-05-30',
      vetNotes: 'Active swimming patterns, bright scaling, healthy gill action.'
    },
    location: 'Lynnwood, WA (6.8 miles away)',
    distance: 6.8,
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=600&auto=format&fit=crop'
    ],
    video: '',
    owner: {
      id: 'owner-3',
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      rating: 4.5,
      reviewsCount: 8,
      verified: false,
      phone: '+1 (555) 881-0199',
      email: 'david.m@petmail.com'
    },
    description: 'Bubbles is a hardy marine Clownfish, bred in captivity and already adjusted to standard aquarium conditions. Ideal for saltwater tank beginners.',
    createdDate: '2026-06-09'
  },
  {
    id: 'pet-7',
    name: 'Rocky',
    category: 'Dogs',
    breed: 'German Shepherd',
    age: '3 years',
    ageMonths: 36,
    gender: 'Male',
    color: 'Black & Tan',
    price: 0,
    type: 'Adoption',
    status: 'Available',
    vaccinationStatus: 'Fully Vaccinated',
    vaccines: [
      { name: 'Rabies', date: '2025-07-11', batch: 'RB-0082', status: 'Completed' },
      { name: 'DHPP', date: '2025-08-01', batch: 'DH-9912', status: 'Completed' }
    ],
    healthRecords: {
      weight: '82 lbs',
      allergies: 'Beef allergies',
      diet: 'Venison/Sweet Potato dry mix',
      healthScore: 99,
      lastCheckup: '2026-05-10',
      vetNotes: 'Strong skeletal structure, hip scores look excellent.'
    },
    location: 'Seattle, WA (1.9 miles away)',
    distance: 1.9,
    images: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=600&auto=format&fit=crop'
    ],
    video: '',
    owner: {
      id: 'owner-2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      rating: 4.7,
      reviewsCount: 14,
      verified: true,
      phone: '+1 (555) 283-9912',
      email: 'm.chen@petmail.com'
    },
    description: 'Rocky is a well-trained German Shepherd who excels in guard duty and obedience. Protective yet highly affectionate toward family members. Highly active.',
    createdDate: '2026-05-28'
  },
  {
    id: 'pet-8',
    name: 'Cleo',
    category: 'Cats',
    breed: 'Persian Cat',
    age: '1.5 years',
    ageMonths: 18,
    gender: 'Female',
    color: 'Silver Grey',
    price: 0,
    type: 'Adoption',
    status: 'Available',
    vaccinationStatus: 'Fully Vaccinated',
    vaccines: [
      { name: 'FVRCP', date: '2025-06-15', batch: 'FV-8822', status: 'Completed' },
      { name: 'Rabies', date: '2025-07-01', batch: 'RB-4411', status: 'Completed' }
    ],
    healthRecords: {
      weight: '8.8 lbs',
      allergies: 'None',
      diet: 'Salmon pate wet cans',
      healthScore: 96,
      lastCheckup: '2026-03-01',
      vetNotes: 'Eyes require daily wiping due to brachycephalic tearducts, overall excellent.'
    },
    location: 'Kirkland, WA (4.0 miles away)',
    distance: 4.0,
    images: [
      'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574158622643-69d34d72650f?q=80&w=600&auto=format&fit=crop'
    ],
    video: '',
    owner: {
      id: 'owner-4',
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      rating: 4.8,
      reviewsCount: 20,
      verified: true,
      phone: '+1 (555) 198-3344',
      email: 'emma.w@petmail.com'
    },
    description: 'Cleo is a quiet, silver-grey Persian who values quiet spaces. She loves soft pets and brushing sessions, but is not suitable for homes with loud energetic dogs.',
    createdDate: '2026-06-02'
  }
];

export const AppContextProvider = ({ children }) => {
  // Theme state (only thing kept in localStorage — user preference)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // Navigation screen states
  const [activeScreen, setActiveScreen] = useState('Splash');
  
  // Simulated SMS Toast State
  const [smsNotification, setSmsNotification] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  // All data states — loaded from database
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
    // Load all user data in parallel from database
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
    // Listen for auth changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const { data: profile } = await authService.getUserProfile(firebaseUser.uid);
        const user = {
          id: firebaseUser.uid,
          name: profile?.full_name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          phone: profile?.phone || '',
          role: profile?.role || 'Buyer',
          avatar: profile?.avatar_url || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
        };
        setCurrentUser(user);
        await loadUserData(firebaseUser.uid);
      } else {
        setCurrentUser(null);
        // Reset all user data
        setChats([]);
        setFavorites([]);
        setAdoptions([]);
        setPaymentHistory([]);
        setWalletBalance(0);
        setNotifications([]);
      }
    });

    // Realtime pets subscription
    const unsubscribePets = petService.subscribeToPets(async (data) => {
      // Also try fetching from our new custom backend
      const { data: backendPets } = await petService.getPetsFromBackend();
      
      let allPets = [];
      if (data && data.length > 0) {
        allPets = [...data];
      } else {
        allPets = [...INITIAL_PETS];
      }

      // If we successfully fetched from the custom backend, add them to the list
      if (backendPets && backendPets.length > 0) {
        // Tag them so we know they are from the custom backend
        const customPets = backendPets.map(p => ({...p, description: 'Fetched from custom Express Backend!'}));
        allPets = [...customPets, ...allPets];
      }

      setPets(allPets);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePets();
    };
  }, [loadUserData]);

  // ─── Realtime subscriptions for user-specific data ───
  useEffect(() => {
    if (!currentUser?.id) return;

    // Realtime notifications
    const unsubscribeNotif = notificationService.subscribeToNotifications(currentUser.id, (data) => {
      setNotifications(data);
    });

    // Realtime chat updates
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
    setChats([]);
    setFavorites([]);
    setAdoptions([]);
    setPaymentHistory([]);
    setWalletBalance(0);
    setNotifications([]);
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

  // ─── Favorites (Database) ────────────────────────────
  const toggleFavorite = async (petId) => {
    // Optimistic UI update
    setFavorites(prev =>
      prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
    );

    if (currentUser?.id) {
      await favoriteService.toggleFavorite(currentUser.id, petId, favorites);
    }
  };

  // ─── Add Pet Listing (Database) ──────────────────────
  const addPetListing = async (newPet) => {
    const petData = {
      ...newPet,
      status: 'Pending',
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
    // Optimistic UI update. Real-time subscription will also catch it.
    setPets(prev => prev.map(p => p.id === petId ? { ...p, status: newStatus } : p));
    return true;
  };

  // ─── Chat & Messages (Database) ──────────────────────
  const sendMessage = async (chatId, text, type = 'text') => {
    if (!currentUser?.id) return;

    const { data, error } = await chatService.sendMessage(chatId, currentUser.id, text, type);
    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    // Refresh chat list
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

    // Refresh chat list
    const { data: updatedChats } = await chatService.getChats(currentUser.id);
    if (updatedChats) setChats(updatedChats);

    setActiveChatId(data.id);
    return data;
  };

  // ─── Adoption Requests (Database) ────────────────────
  const submitAdoptionRequest = async (petId, formDetails) => {
    if (!currentUser?.id) return null;

    const { data, error } = await adoptionService.submitRequest(currentUser.id, petId, formDetails);
    if (error) {
      alert(`Error submitting adoption request: ${error}`);
      return null;
    }

    // Refresh adoptions
    const { data: updated } = await adoptionService.getAdoptionRequests(currentUser.id);
    if (updated) setAdoptions(updated);

    return data;
  };

  // ─── Payments & Wallet (Database) ────────────────────
  const processPayment = async (checkoutDetails) => {
    if (!currentUser?.id) return null;

    const { data, error } = await paymentService.processPayment(currentUser.id, checkoutDetails);
    if (error) {
      alert(`Payment error: ${error}`);
      return null;
    }

    // Refresh payment history and wallet
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

    // Refresh payment history and wallet
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
