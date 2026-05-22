import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <div className="footer-logo">RENTILO</div>
          <p className="footer-tagline">
            Elevating property management through premium design and verified connections.
          </p>
        </div>

        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">Terms of Service</a>
          <a href="#" className="privacy-link">Privacy Policy</a>
        </div>

        <div className="footer-copyright">
          © 2024 RENTILO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
