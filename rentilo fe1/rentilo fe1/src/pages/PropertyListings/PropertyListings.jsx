import React, { useState } from "react";
import { PROPERTIES } from "../../data/properties";
import TenantTopbar from "../../components/TenantTopbar/TenantTopbar";
import "./PropertyListings.css";

const PropertyListings = ({
  savedPropertyIds,
  onToggleSaved,
  onSaveAndGoToSaved,
  onNavigateHome,
  onNavigateDashboard,
  onNavigateSaved,
  onNavigateProfile,
  onSelectProperty,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("properties");

  // Filter states
  const [sortBy, setSortBy] = useState("recommended");
  const [tenantTypes, setTenantTypes] = useState({
    family: false,
    bachelors: false,
    couples: true,
  });
  const [bhkConfig, setBhkConfig] = useState({
    "1RK": false,
    "1BHK": false,
    "2BHK": true,
    "3BHK": false,
    "4BHK+": false,
  });

  const toggleTenantType = (type) => {
    setTenantTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleBhk = (config) => {
    setBhkConfig((prev) => ({ ...prev, [config]: !prev[config] }));
  };

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    if (nav === "myTenancy" && onNavigateDashboard) {
      onNavigateDashboard();
    }
  };

  return (
    <div
      className="listings-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--background)",
      }}
    >
      <TenantTopbar
        onNavigateHome={onNavigateHome}
        onNavigateListings={() => handleNavClick("properties")}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateSaved={onNavigateSaved}
        onNavigateProfile={onNavigateProfile}
        savedCount={savedPropertyIds.length}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        extendedNav
      />

      {/* Location Bar */}
      <div className="location-bar-wrapper">
        <div className="location-bar-inner">
          <div className="location-bar">
            <div className="location-bar-left">
              <div className="location-icon-circle">
                <span className="material-symbols-outlined">navigation</span>
              </div>
              <div className="location-text-col">
                <div className="location-label-row">
                  <span>Pg</span>
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
                <span className="location-address">
                  134-b, Srinivasa Premium Coliving, Kid...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Profile Bar */}
      <div className="search-profile-bar">
        <div className="search-profile-inner">
          <div className="search-box-listings">
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <input
              type="text"
              placeholder="Search locations, properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-my-profile" onClick={onNavigateDashboard}>
            <span className="material-symbols-outlined">person</span>
            My Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="listings-main-content">
        {/* Listings Area */}
        <div className="listings-area">
          <div className="listings-heading-row">
            <div>
              <h1>Curated Properties</h1>
              <p>
                Showing {PROPERTIES.length} available residences matching your
                criteria.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="listings-cards-grid">
            {PROPERTIES.map((property) => (
              <article
                key={property.id}
                className="listing-card"
                onClick={() => onSelectProperty?.(property.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProperty?.(property.id);
                  }
                }}
              >
                <button
                  type="button"
                  className={`listing-card-fav-btn ${
                    savedPropertyIds.includes(property.id) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveAndGoToSaved(property.id);
                  }}
                  aria-label="Save property and view saved list"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: savedPropertyIds.includes(
                        property.id
                      )
                        ? "'FILL' 1"
                        : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                </button>

                <div className="listing-card-image-box">
                  {property.badge && (
                    <div className="listing-card-badge">{property.badge}</div>
                  )}
                  <img src={property.image} alt={property.title} />
                  <div className="listing-card-dots">
                    <div className="listing-card-dot active"></div>
                    <div className="listing-card-dot"></div>
                    <div className="listing-card-dot"></div>
                  </div>
                </div>

                <div className="listing-card-body">
                  <div className="listing-card-title-row">
                    <h2>{property.title}</h2>
                    <div className="listing-card-price">
                      <span className="amount">{property.price} </span>
                      <span className="period">/mo</span>
                    </div>
                  </div>

                  <p className="listing-card-location">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    {property.location}
                  </p>

                  <div className="listing-card-specs">
                    <span className="listing-card-spec">
                      <span className="material-symbols-outlined">bed</span>
                      {property.beds} Bed
                    </span>
                    <span className="listing-card-spec">
                      <span className="material-symbols-outlined">bathtub</span>
                      {property.baths} Bath
                    </span>
                    <span className="listing-card-spec">
                      <span className="material-symbols-outlined">
                        straighten
                      </span>
                      {property.sqft} sqft
                    </span>
                  </div>

                  <div className="listing-card-footer">
                    <div className="listing-card-deposit">
                      <span className="lbl">Deposit</span>
                      <span className="val">{property.deposit}</span>
                    </div>
                    <span className="listing-card-posted">
                      {property.posted}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Filters Sidebar */}
        <aside className="listings-filters-sidebar">
          <div className="filters-panel">
            {/* Sort */}
            <div>
              <label className="filter-section-label">Sort Results</label>
              <div className="filter-select-wrapper">
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <span className="material-symbols-outlined filter-select-arrow">
                  expand_more
                </span>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="filter-section-label">Monthly Rent Range</label>
              <div className="price-slider-container">
                <div className="price-slider-track">
                  <div className="price-slider-fill"></div>
                  <div className="price-slider-thumb left"></div>
                  <div className="price-slider-thumb right"></div>
                </div>
                <div className="price-slider-labels">
                  <span>$1,500</span>
                  <span>$8,000+</span>
                </div>
              </div>
            </div>

            {/* Tenant Profile */}
            <div>
              <label className="filter-section-label">Tenant Profile</label>
              <div className="filter-checkbox-group">
                {["family", "bachelors", "couples"].map((type) => (
                  <label key={type} className="filter-checkbox-label">
                    <div className="filter-checkbox-box">
                      <input
                        type="checkbox"
                        className="filter-checkbox-input"
                        checked={tenantTypes[type]}
                        onChange={() => toggleTenantType(type)}
                      />
                      <span className="material-symbols-outlined filter-checkbox-check">
                        check
                      </span>
                    </div>
                    <span className="filter-checkbox-text">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div>
              <label className="filter-section-label">Configuration</label>
              <div className="filter-chips-row">
                {Object.keys(bhkConfig).map((config) => (
                  <label key={config} className="filter-chip-label">
                    <input
                      type="checkbox"
                      className="filter-chip-input"
                      checked={bhkConfig[config]}
                      onChange={() => toggleBhk(config)}
                    />
                    <div className="filter-chip-visual">{config}</div>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn-apply-filters">Apply Filters</button>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="listings-footer">
        <div className="listings-footer-strip"></div>
        <div className="listings-footer-inner">
          <div className="listings-footer-brand">RENTILO</div>
          <nav className="listings-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
            <a href="#">Contact Support</a>
          </nav>
          <p className="listings-footer-copy">
            © 2024 RENTILO. A Curated Estate Management Experience.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PropertyListings;
