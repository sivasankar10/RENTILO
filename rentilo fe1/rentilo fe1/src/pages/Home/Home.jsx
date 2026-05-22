import React from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Home = ({ onAuthClick }) => {
  return (
    <div className="home-page">
      <Navbar onAuthClick={onAuthClick} />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <h1 className="hero-title">
              Find Your Perfect Rental, <br />Without the Hassle
            </h1>
            <p className="hero-subtitle">
              Connecting tenants, owners, and brokers in one seamless platform built on trust and transparency.
            </p>
            
            <div className="search-bar-wrapper">
              <div className="search-bar">
                <div className="search-field city-selector">
                  <span className="material-symbols-outlined icon">location_on</span>
                  <select>
                    <option>Select City</option>
                    <option>New York</option>
                    <option>London</option>
                    <option>Mumbai</option>
                  </select>
                </div>
                
                <div className="search-field-divider"></div>
                
                <div className="search-field search-input">
                  <span className="material-symbols-outlined icon">search</span>
                  <input type="text" placeholder="Search by locality, landmark, or property..." />
                </div>
                
                <button className="btn-search">Search</button>
              </div>
            </div>
          </div>
          
          <div className="hero-bg-decoration-1"></div>
          <div className="hero-bg-decoration-2"></div>
        </section>

        {/* Why Choose Section */}
        <section className="features">
          <div className="section-header">
            <h2>Why Choose RENTILO?</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper verified">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <h3>Verified Listings</h3>
              <p>Every property is manually checked for authenticity to ensure you only see legitimate, high-quality rental options.</p>
            </div>
            
            <div className="feature-card alt-bg">
              <div className="feature-icon-wrapper search">
                <span className="material-symbols-outlined">travel_explore</span>
              </div>
              <h3>Easy Search</h3>
              <p>Intelligent filters and map-based exploration help you narrow down your search to the exact street you want to call home.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper trusted">
                <span className="material-symbols-outlined">handshake</span>
              </div>
              <h3>Trusted Connections</h3>
              <p>We bridge the gap between landlords and tenants with direct messaging and transparent rental history tracking.</p>
            </div>
          </div>
        </section>

        {/* Owner CTA Section */}
        <section className="owner-cta">
          <div className="cta-container">
            <div className="cta-overlay-image">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9dBsxn1DmZgZ91QQtxzAZOwnfxPPRK4G2TPn4P2btGS-0fhYeKvjvPkz1Emmuvy5kzJOkZnJBnAE_Bz6eoqF9GoxIqOqlzjnprIh-Z2e0oBH-d9lxUQmsZ_rUZKeiXRLA9q3H8HL8KiyFt0At7V3NsjeRZTp_FWpbMnX0CCZ_j3kIeD_5htXwYsMpGiXXBd5Cy5NYlDPqZ2Mxhu99EskjvPQPfQy6z49MhcyVkZ-YkrrwB5ca4TKpxZK7t3vfxQwPUX0_dzlF8tu_" 
                alt="Modern property interior" 
              />
            </div>
            <div className="cta-content">
              <div className="cta-text">
                <span className="cta-label">Partner with us</span>
                <h2>Are you a property owner?</h2>
                <p>List your property and find high-quality tenants faster. Our automated vetting process saves you hours of paperwork.</p>
              </div>
              <button className="btn-post">Post Your Property</button>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="collections">
          <div className="collections-header">
            <div>
              <h2>Hand-picked Collections</h2>
              <p>Curated estates for the modern professional.</p>
            </div>
            <button className="view-all">
              View All Collections 
              <span className="material-symbols-outlined">trending_flat</span>
            </button>
          </div>

          <div className="bento-grid">
            <div className="collection-item large">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6_Ef4jvA5jfyZiufUaD4zcEyIlOHIRlpKV2vJpJdSWOUpBcuNLaBkeQ588I4CcCmIMI8wYvPIB1GuAAqdhxUL2IFd2ko9rXTPcJfUmO-UZSwKs6AVH3P58HFujBerVQvDBwS_dbmzQLsEODrMUpvGTWW6CIvARbf1TEhZhb8_ieum1fS0nyEeQhz4eQ2mnpsaOv13mpLiRuUSS4aNEGdJO2l-6qvS74NU5ES3CecK8XynOibIPqQW8nfRyvag63FU00ytABpOEYM1" alt="Urban Penthouses" />
              <div className="collection-overlay">
                <span className="badge">Luxury Edition</span>
                <h3>Urban Penthouses</h3>
              </div>
            </div>
            
            <div className="collection-item wide">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIbFTomh7DpHuI-dXwMBgEM4HEaZ2ocpyjJ2odZ6FnjoFLat9DYG34h35yL3jlUQTavpM229bHGqWxXVmW3kh7iYV9P_E6VQPjcLJXj5AthzsdLWUurD0SUOtDL5cS3SeZ_OcmYwNW_czT83SA1InTLLzodMKY0B0Q6s7rDRvfFyBLcRIZa6TNk-O-wAoi-l3cd4qiPc777BP1UjMNjBORdD2FQjNYvaf74FZIW8bnamCxT0DBFR-APGSSPjKWrIgwMEAE8MR3Dn5s" alt="Waterfront Living" />
              <div className="collection-overlay">
                <h3>Waterfront Living</h3>
              </div>
            </div>
            
            <div className="collection-item small">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUb7dK52OHzj79aMDP1qG3q5DdZFb1JF2vH3Lih6abMO8HQZf5DTPq-RCvnZy-r6muVCxeWdjS7fL9e6nw2wn8sxEo2g1kGoCW-H4YRt4nj6qY73eZa0IaUMw_848tR0LeN60fAaeB0EacfFbI-X8javQJzrgJQ9iy7xaRm44j6rj4v1svJM8I9IwOCJ669tZnsKq93aSLzXZE_h4S_taOsUKxLcAelab7zVrVjMVh7D23dk3BCF0bIHtPTZaqxYoYIge0YPZqB-qr" alt="Compact Studios" />
              <div className="collection-overlay">
                <h3>Compact Studios</h3>
              </div>
            </div>
            
            <div className="collection-item small">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZHBzhVwAANAXMoCqiy2Flc5MPRnXQ1o1hQY4OxBLtRDUA18KSK4k6YnFPL3yiUOoFT2ICgcOF0S2RLTbKobGrx6RhSXa-tjZzxvfV6uibhuO_Qzwl5EAe1KXFc-XqPR-gcMmryiqeM1enQa_co56rLJW0CK8Wr5U1p6tW6r5sCbftvmx51-gAO6JFDyxfxrC7uKBcwSfvMoyAjpKrHCJ-bshVNVoxwTS21K885syaFoLqaMv29VS4erFmdNlq_m6Qr8IPsAFJarrN" alt="Family Estates" />
              <div className="collection-overlay">
                <h3>Family Estates</h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
