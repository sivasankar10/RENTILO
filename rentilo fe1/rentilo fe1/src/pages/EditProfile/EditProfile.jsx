import React, { useState } from "react";
import TenantTopbar from "../../components/TenantTopbar/TenantTopbar";
import "../PropertyListings/PropertyListings.css";
import "./EditProfile.css";

const AVATAR_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsjFwGI8TSSdoEXUZWAE-nRGmK8p1eH8KgYLjT3Urn8_obEczpwXsONy_TGRwKE0xPxoIiwJBviAzhbr8_8hIDA4l_kLNXdDbBX6-QfmRcjzG89x6vzPJXOX37ffQJu6xx0_zNwcREd9vf8PK0Du-IaTWhO6oVo0nqBbRArkk5eIc0SIYI174D3jXGPi3s-g82-4iFdrt9-Rhjwsej9Y7K0PTNiC4gdcsm5cL4dCFxk6wfXLf_ncUSgwvGRPdp_YbPZzioXRLYcnuV";

const EditProfile = ({
  savedPropertyIds,
  onNavigateHome,
  onNavigateListings,
  onNavigateDashboard,
  onNavigateSaved,
  onLogout,
}) => {
  const [name, setName] = useState("Danush");
  const [email, setEmail] = useState("danush@example.com");
  const [phone, setPhone] = useState("+1 (555) 012-3456");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="edit-profile-page">
      <aside className="edit-profile-sidebar">
        <div className="sidebar-brand-block">
          <div className="sidebar-brand-title">RENTILO</div>
          <div className="sidebar-brand-tagline">THE CURATED ESTATE</div>
        </div>

        <nav className="sidebar-nav-links">
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={onNavigateListings}
          >
            <span className="material-symbols-outlined">dashboard</span>
            DASHBOARD
          </button>
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={onNavigateDashboard}
          >
            <span className="material-symbols-outlined">description</span>
            MY LEASE
          </button>
          <button type="button" className="sidebar-nav-item">
            <span className="material-symbols-outlined">payments</span>
            PAYMENTS
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="btn-help-center">
            <span className="material-symbols-outlined">help</span>
            Help Center
          </button>
          <button type="button" className="sidebar-logout" onClick={onLogout}>
            <span className="material-symbols-outlined">logout</span>
            LOG OUT
          </button>
        </div>
      </aside>

      <div className="edit-profile-content">
        <TenantTopbar
          onNavigateHome={onNavigateHome}
          onNavigateListings={onNavigateListings}
          onNavigateDashboard={onNavigateDashboard}
          onNavigateSaved={onNavigateSaved}
          onNavigateProfile={() => {}}
          savedCount={savedPropertyIds?.length ?? 0}
          activeNav="profile"
          showMembershipIcon
          profileActive
        />

        <main className="edit-profile-main">
          <form className="edit-profile-card" onSubmit={handleSubmit}>
            <h1 className="edit-profile-title">Edit Your Profile</h1>
            <div className="edit-profile-title-divider" />

            <div className="profile-avatar-section">
              <img
                className="profile-avatar-large"
                src={AVATAR_SRC}
                alt="Profile"
              />
              <div className="profile-avatar-actions">
                <button type="button" className="btn-profile-edit">
                  <span className="material-symbols-outlined">edit</span>
                  Edit
                </button>
                <button type="button" className="btn-profile-remove">
                  <span className="material-symbols-outlined">delete</span>
                  Remove
                </button>
              </div>
            </div>

            <div className="edit-profile-fields">
              <div className="form-field">
                <label htmlFor="profile-name">Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-email">Email Address</label>
                <div className="input-with-icon">
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="material-symbols-outlined field-warning-icon">
                    error
                  </span>
                </div>
                <button type="button" className="form-link-btn">
                  Click here to generate email verification mail
                </button>
              </div>

              <div className="form-field">
                <label>KYC Update</label>
                <div className="verification-status-bar pending">
                  <span className="material-symbols-outlined">schedule</span>
                  <span>PENDING</span>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="profile-phone">Mobile Phone</label>
                <div className="phone-field-row">
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <span className="verification-badge pending">
                    <span className="material-symbols-outlined">schedule</span>
                    PENDING
                  </span>
                </div>
              </div>

              <div className="form-field">
                <button type="button" className="form-link-btn with-icon">
                  <span className="material-symbols-outlined">refresh</span>
                  Click here to generate password reset email
                </button>
              </div>

              <div className="whatsapp-banner">
                <div className="whatsapp-banner-left">
                  <span className="material-symbols-outlined whatsapp-icon">
                    chat
                  </span>
                  <span>Get Updates on WhatsApp</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <h2 className="bank-details-title">Bank Details</h2>
            <div className="bank-details-grid">
              <div className="form-field">
                <label htmlFor="account-holder">Account Holder Name</label>
                <input
                  id="account-holder"
                  type="text"
                  placeholder="Enter full name"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="bank-name">Bank Name</label>
                <input
                  id="bank-name"
                  type="text"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="account-number">Account Number</label>
                <input
                  id="account-number"
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="ifsc-code">IFSC Code</label>
                <input
                  id="ifsc-code"
                  type="text"
                  placeholder="Enter IFSC code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </div>
            </div>

            <div className="edit-profile-actions">
              {saved && (
                <span className="save-success-msg">
                  Profile saved successfully
                </span>
              )}
              <button type="submit" className="btn-save-profile">
                <span className="material-symbols-outlined">save</span>
                Save Profile
              </button>
            </div>
          </form>

          <p className="edit-profile-page-footer">
            PROPERTY ID: RTL-882-DAN • LEASE ACTIVE UNTIL OCT 2024
          </p>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
