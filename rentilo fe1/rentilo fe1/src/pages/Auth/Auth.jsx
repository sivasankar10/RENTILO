import React, { useState } from "react";
import "./Auth.css";

const Auth = ({ onContinue }) => {
  const [isBroker, setIsBroker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onContinue) onContinue();
  };

  return (
    <main className="auth-page">
      {/* Top-Left Logo */}
      <div className="auth-logo-fixed">
        <div className="logo-container">
          <div className="logo-icon-box">
            <span className="material-symbols-outlined fill-icon">domain</span>
          </div>
          <span className="brand-name">RENTILO</span>
        </div>
      </div>

      <div className="auth-layout">
        {/* Left Side: Content Section */}
        <section className="auth-content">
          <div className="content-inner">
            <div className="content-header">
              <h1>Your complete real estate ecosystem</h1>
              <p>
                The smartest way for tenants, owners, and brokers to connect and
                transact.
              </p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon-box">
                  <span className="material-symbols-outlined fill-icon">
                    verified
                  </span>
                </div>
                <div className="feature-text">
                  <p className="feature-title">Verified Listings</p>
                  <p className="feature-desc">
                    Every property is hand-checked for accuracy.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <span className="material-symbols-outlined fill-icon">
                    contact_support
                  </span>
                </div>
                <div className="feature-text">
                  <p className="feature-title">
                    Direct Professional Networking
                  </p>
                  <p className="feature-desc">
                    Connect directly with verified owners and professional
                    brokers.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <span className="material-symbols-outlined fill-icon">
                    bolt
                  </span>
                </div>
                <div className="feature-text">
                  <p className="feature-title">Fast & Secure Booking</p>
                  <p className="feature-desc">
                    Reservation process completed in minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="auth-decoration"></div>
        </section>

        {/* Right Side: Auth Form Section */}
        <section className="auth-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Login or Sign Up</h2>
              <p>Enter your mobile number to continue</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="input-label">Mobile Number</label>
                <div className="mobile-input-wrapper">
                  <div className="country-code">
                    <span className="code-text">+91</span>
                    <span className="material-symbols-outlined">
                      expand_more
                    </span>
                  </div>
                  <input
                    type="tel"
                    className="mobile-input"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <div className="role-toggle">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={isBroker}
                    onChange={() => setIsBroker(!isBroker)}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">Sign in as Broker</span>
                </label>
              </div>

              <button type="submit" className="btn-continue">
                Continue
              </button>
            </form>

            <p className="legal-notice">
              By continuing, you agree to RENTILO’s <a href="#">Terms</a> &{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
