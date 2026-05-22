import React from "react";
import "./Navbar.css";

const Navbar = ({ onAuthClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>RENTILO</div>

        <div className="nav-links">
          <a href="#" className="nav-link active">
            Post Your Property
          </a>
          <div className="auth-buttons">
            <button className="btn-login" onClick={onAuthClick}>
              Login
            </button>
            <button className="btn-signup" onClick={onAuthClick}>Sign Up</button>
          </div>
        </div>

        <button className="mobile-toggle">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

