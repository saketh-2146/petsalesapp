import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">Paws & Claws</span>
          </div>
          <p className="footer-description">
            Your premium destination to adopt, buy, and sell pets with ease and safety.
          </p>
        </div>
        
        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/search">Find a Pet</Link>
          <Link to="/sell">Sell a Pet</Link>
          <Link to="/ai-match">AI Pet Match</Link>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <Link to="/help">Help Center</Link>
          <Link to="/safety">Safety Center</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@pawsandclaws.com</p>
          <p>Phone: 1-800-PAWS-PET</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Paws & Claws. All rights reserved.</p>
      </div>
    </footer>
  );
}
