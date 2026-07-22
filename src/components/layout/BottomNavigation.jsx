import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={24} /> },
    { label: 'Market', path: '/market', icon: <Search size={24} /> },
    { label: 'Sell', path: '/sell', icon: <PlusSquare size={24} /> },
    { label: 'Care', path: '/care', icon: <Heart size={24} /> },
    { label: 'Profile', path: '/profile', icon: <User size={24} /> }
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <div 
            key={item.label} 
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
