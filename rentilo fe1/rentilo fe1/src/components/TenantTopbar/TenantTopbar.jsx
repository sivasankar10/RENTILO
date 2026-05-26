import React from "react";
import "../../pages/PropertyListings/PropertyListings.css";
import "./TenantTopbar.css";

const AVATAR_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsjFwGI8TSSdoEXUZWAE-nRGmK8p1eH8KgYLjT3Urn8_obEczpwXsONy_TGRwKE0xPxoIiwJBviAzhbr8_8hIDA4l_kLNXdDbBX6-QfmRcjzG89x6vzPJXOX37ffQJu6xx0_zNwcREd9vf8PK0Du-IaTWhO6oVo0nqBbRArkk5eIc0SIYI174D3jXGPi3s-g82-4iFdrt9-Rhjwsej9Y7K0PTNiC4gdcsm5cL4dCFxk6wfXLf_ncUSgwvGRPdp_YbPZzioXRLYcnuV";

const TenantTopbar = ({
  onNavigateHome,
  onNavigateListings,
  onNavigateDashboard,
  onNavigateSaved,
  onNavigateProfile,
  savedCount = 0,
  activeNav = "properties",
  onNavClick,
  extendedNav = false,
  showMembershipIcon = false,
  profileActive = false,
}) => {
  return (
    <header className="listings-topbar">
      <div className="listings-topbar-inner">
        <div className="topbar-left">
          <div className="topbar-brand" onClick={onNavigateHome}>
            RENTILO
          </div>
          <nav className="topbar-nav">
            <button
              type="button"
              className={`topbar-nav-link ${
                activeNav === "properties" ? "active" : ""
              }`}
              onClick={() =>
                onNavClick?.("properties") ?? onNavigateListings?.()
              }
            >
              Properties
            </button>
            <button
              type="button"
              className={`topbar-nav-link ${
                activeNav === "saved" ? "active" : ""
              }`}
              onClick={onNavigateSaved}
            >
              Saved
            </button>
            <button
              type="button"
              className={`topbar-nav-link ${
                activeNav === "myTenancy" ? "active" : ""
              }`}
              onClick={() =>
                onNavClick?.("myTenancy") ?? onNavigateDashboard?.()
              }
            >
              My Tenancy
            </button>
            {extendedNav && (
              <>
                <button
                  type="button"
                  className={`topbar-nav-link ${
                    activeNav === "payments" ? "active" : ""
                  }`}
                  onClick={() => onNavClick?.("payments")}
                >
                  Payments
                </button>
                <button
                  type="button"
                  className={`topbar-nav-link ${
                    activeNav === "maintenance" ? "active" : ""
                  }`}
                  onClick={() => onNavClick?.("maintenance")}
                >
                  Maintenance
                </button>
                <button
                  type="button"
                  className={`topbar-nav-link ${
                    activeNav === "documents" ? "active" : ""
                  }`}
                  onClick={() => onNavClick?.("documents")}
                >
                  Documents
                </button>
              </>
            )}
          </nav>
        </div>
        <div className="topbar-right">
          {showMembershipIcon && (
            <button
              type="button"
              className="topbar-icon-btn topbar-membership-icon"
              aria-label="Membership"
            >
              <span className="material-symbols-outlined">
                workspace_premium
              </span>
            </button>
          )}
          <button
            type="button"
            className="topbar-icon-btn"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            type="button"
            className="topbar-icon-btn"
            aria-label="Messages"
          >
            <span className="material-symbols-outlined">chat</span>
          </button>
          <button
            type="button"
            className={`topbar-icon-btn topbar-heart-btn ${
              activeNav === "saved" ? "active" : ""
            }`}
            aria-label="Saved properties"
            onClick={onNavigateSaved}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: savedCount > 0 ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
            {savedCount > 0 && (
              <span className="topbar-heart-count">{savedCount}</span>
            )}
          </button>
          <button
            type="button"
            className={`topbar-avatar-btn ${profileActive ? "active" : ""}`}
            onClick={onNavigateProfile}
            aria-label="Edit profile"
          >
            <img
              className="topbar-avatar"
              src={AVATAR_SRC}
              alt="Tenant profile"
            />
          </button>
        </div>
      </div>
      <div className="topbar-divider" />
    </header>
  );
};

export default TenantTopbar;
