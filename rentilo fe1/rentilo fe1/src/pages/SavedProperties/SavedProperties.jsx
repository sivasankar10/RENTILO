import React from "react";
import { PROPERTIES } from "../../data/properties";
import TenantTopbar from "../../components/TenantTopbar/TenantTopbar";
import "../PropertyListings/PropertyListings.css";
import "./SavedProperties.css";

const SavedProperties = ({
  savedPropertyIds,
  onToggleSaved,
  onNavigateHome,
  onNavigateListings,
  onNavigateDashboard,
  onNavigateProfile,
  onSelectProperty,
}) => {
  const savedProperties = PROPERTIES.filter((p) =>
    savedPropertyIds.includes(p.id)
  );

  return (
    <div className="saved-properties-page">
      <TenantTopbar
        onNavigateHome={onNavigateHome}
        onNavigateListings={onNavigateListings}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateSaved={() => {}}
        onNavigateProfile={onNavigateProfile}
        savedCount={savedPropertyIds.length}
        activeNav="saved"
        onNavClick={(nav) => {
          if (nav === "properties") onNavigateListings();
          if (nav === "myTenancy") onNavigateDashboard();
        }}
      />

      <main className="saved-properties-main">
        <button
          type="button"
          className="saved-properties-back"
          onClick={onNavigateListings}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to all properties
        </button>

        <div className="saved-properties-heading">
          <h1>Saved Properties</h1>
          <p>
            {savedProperties.length === 0
              ? "Properties you save with the heart icon appear here."
              : `You have ${savedProperties.length} saved ${
                  savedProperties.length === 1 ? "property" : "properties"
                }.`}
          </p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="saved-properties-empty">
            <span className="material-symbols-outlined saved-empty-icon">
              favorite_border
            </span>
            <h2>No saved properties yet</h2>
            <p>Tap the heart on any listing to save it and view it here.</p>
            <button
              type="button"
              className="btn-browse-listings"
              onClick={onNavigateListings}
            >
              Browse properties
            </button>
          </div>
        ) : (
          <div className="listings-cards-grid saved-properties-grid">
            {savedProperties.map((property) => (
              <article
                key={property.id}
                className="listing-card"
                onClick={() => onSelectProperty(property.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProperty(property.id);
                  }
                }}
              >
                <button
                  type="button"
                  className="listing-card-fav-btn active"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSaved(property.id);
                  }}
                  aria-label="Remove from saved"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </button>

                <div className="listing-card-image-box">
                  {property.badge && (
                    <div className="listing-card-badge">{property.badge}</div>
                  )}
                  <img src={property.image} alt={property.title} />
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
        )}
      </main>

      <footer className="listings-footer">
        <div className="listings-footer-strip" />
        <div className="listings-footer-inner">
          <div className="listings-footer-brand">RENTILO</div>
          <p className="listings-footer-copy">
            © 2024 RENTILO. A Curated Estate Management Experience.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SavedProperties;
