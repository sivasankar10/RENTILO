import React, { useState } from "react";
import { getPropertyById } from "../../data/properties";
import TenantTopbar from "../../components/TenantTopbar/TenantTopbar";
import "../PropertyListings/PropertyListings.css";
import "./PropertyDetails.css";

const PropertyDetails = ({
  propertyId,
  savedPropertyIds,
  onToggleSaved,
  onNavigateHome,
  onNavigateListings,
  onNavigateDashboard,
  onNavigateSaved,
  onNavigateProfile,
}) => {
  const property = getPropertyById(propertyId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeNearbyTab, setActiveNearbyTab] = useState("transit");

  const renderPlaceList = (places, emptyMessage) => {
    if (!places?.length) {
      return <p className="property-nearby-empty">{emptyMessage}</p>;
    }
    return (
      <ul className="property-nearby-list">
        {places.map((place) => (
          <li key={place.name} className="property-nearby-item">
            <span className="property-nearby-item-name">{place.name}</span>
            <span className="property-nearby-item-meta">
              {place.distance} | {place.time}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  if (!property) {
    return (
      <div className="property-details-page">
        <div className="property-details-not-found">
          <h2>Property not found</h2>
          <button
            type="button"
            className="btn-details-primary"
            onClick={onNavigateListings}
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const gallery = property.gallery ?? [property.image];

  return (
    <div className="property-details-page">
      <TenantTopbar
        onNavigateHome={onNavigateHome}
        onNavigateListings={onNavigateListings}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateSaved={onNavigateSaved}
        onNavigateProfile={onNavigateProfile}
        savedCount={savedPropertyIds?.length ?? 0}
        activeNav="properties"
        onNavClick={(nav) => {
          if (nav === "properties") onNavigateListings();
          if (nav === "myTenancy") onNavigateDashboard();
        }}
      />

      <main className="property-details-main">
        <button
          type="button"
          className="property-details-back"
          onClick={onNavigateListings}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to listings
        </button>

        <div className="property-details-header">
          <div className="property-details-header-left">
            <h1>{property.title}</h1>
            <p className="property-details-address">
              <span className="material-symbols-outlined">location_on</span>
              {property.location}
            </p>
          </div>
          <div className="property-details-header-right">
            <div className="property-details-price">
              <span className="amount">{property.price}</span>
              <span className="period">{property.pricePeriod ?? "/ mo"}</span>
            </div>
            <p className="property-details-deposit-label">
              DEPOSIT: {property.deposit}
            </p>
          </div>
        </div>

        <div className="property-details-layout">
          <div className="property-details-left">
            <section className="property-gallery">
              <div className="property-gallery-main">
                <img
                  src={gallery[activeImageIndex]}
                  alt={`${property.title} — view ${activeImageIndex + 1}`}
                />
              </div>
              <div className="property-gallery-thumbs">
                {gallery.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className={`property-gallery-thumb ${
                      activeImageIndex === index ? "active" : ""
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={src} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            </section>

            <section className="property-section">
              <h2>Overview</h2>
              {property.overview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}

              {property.overviewSpecs?.length > 0 && (
                <div className="property-overview-specs">
                  {property.overviewSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="property-overview-spec-item"
                    >
                      <span className="property-overview-spec-label">
                        {spec.label}
                      </span>
                      <span className="property-overview-spec-value">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* {property.noBrokerServices && (
                <div className="property-nobroker-badge">
                  <span className="material-symbols-outlined">
                    verified_user
                  </span>
                  <span>NoBroker Services</span>
                </div>
              )} */}
            </section>

            {property.nearby && (
              <section className="property-section property-nearby-section">
                <h2>What&apos;s Nearby</h2>
                <div className="property-nearby-tabs">
                  {[
                    { id: "transit", label: "Transit" },
                    { id: "essentials", label: "Essentials" },
                    { id: "utility", label: "Utility" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`property-nearby-tab ${
                        activeNearbyTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActiveNearbyTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="property-nearby-panel">
                  {activeNearbyTab === "transit" && (
                    <>
                      <div className="property-nearby-group">
                        <h3 className="property-nearby-group-title">
                          Bus Stations
                        </h3>
                        {renderPlaceList(
                          property.nearby.transit?.busStations,
                          "No bus stations within 2 km"
                        )}
                      </div>
                      <div className="property-nearby-group">
                        <h3 className="property-nearby-group-title">Airport</h3>
                        {renderPlaceList(
                          property.nearby.transit?.airport,
                          "No airport access points within 5 km"
                        )}
                      </div>
                      <div className="property-nearby-group">
                        <h3 className="property-nearby-group-title">
                          Train Stations
                        </h3>
                        {renderPlaceList(
                          property.nearby.transit?.trainStations,
                          "No train stations within 5 km"
                        )}
                      </div>
                    </>
                  )}

                  {activeNearbyTab === "essentials" && (
                    <div className="property-nearby-group">
                      <h3 className="property-nearby-group-title">
                        Essentials
                      </h3>
                      {renderPlaceList(
                        property.nearby.essentials,
                        "No essentials within 2 km"
                      )}
                    </div>
                  )}

                  {activeNearbyTab === "utility" && (
                    <div className="property-nearby-group">
                      <h3 className="property-nearby-group-title">Utility</h3>
                      {renderPlaceList(
                        property.nearby.utility,
                        "No utility points within 2 km"
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="property-section">
              <h2>Amenities</h2>
              <div className="property-amenities-grid">
                {property.amenities.map((item) => (
                  <div key={item.label} className="property-amenity-tile">
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="property-section">
              <h2>Property Rules</h2>
              <div className="property-rules-table-wrap">
                <table className="property-rules-table">
                  <thead>
                    <tr>
                      <th>Rule</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.rules.map((row, i) => (
                      <tr key={i}>
                        <td>{row.rule}</td>
                        <td>
                          <span className="property-rules-category">
                            {row.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="property-details-sidebar">
            <div className="property-info-card">
              <div className="property-info-grid">
                {(property.highlights ?? []).map((item) => (
                  <div key={item.label} className="property-info-item">
                    <span className="property-info-label">{item.label}</span>
                    <span className="property-info-value">{item.value}</span>
                  </div>
                ))}
              </div>

              <button type="button" className="btn-details-primary">
                Schedule Visit
              </button>
              <button type="button" className="btn-details-secondary">
                <span className="material-symbols-outlined">chat</span>
                I&apos;m Interested
              </button>

              <div className="property-stats-row">
                <div className="property-stat">
                  <span className="property-stat-num">{property.views}</span>
                  <span className="property-stat-lbl">VIEWS</span>
                </div>
                <div className="property-stat">
                  <span className="property-stat-num">
                    {property.shortlists}
                  </span>
                  <span className="property-stat-lbl">SHORTLISTS</span>
                </div>
                <div className="property-stat">
                  <span className="property-stat-num">{property.contacts}</span>
                  <span className="property-stat-lbl">CONTACTS</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="property-details-footer">
        <div className="property-details-footer-inner">
          <span className="property-details-footer-brand">
            © 2024 RENTILO. The Curated Estate.
          </span>
          <nav className="property-details-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetails;
