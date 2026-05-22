import React, { useState, useRef, useEffect } from "react";
import "./Otp.css";

const Otp = ({ onVerify, onChangeNumber }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    setError("");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: clear current and move back
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setVerifying(true);
    setError("");

    // Simulate OTP verification
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);

      // Navigate to dashboard after brief success display
      setTimeout(() => {
        if (onVerify) onVerify();
      }, 1800);
    }, 1200);
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <main className="otp-page">
      {/* Left Side: Visual Panel */}
      <section className="otp-visual">
        <div className="otp-visual-inner">
          <div className="otp-visual-brand">
            <span>RENTILO</span>
          </div>

          <h1 className="otp-visual-headline">
            Your Portfolio,<br />Securely Managed.
          </h1>

          <p className="otp-visual-desc">
            Experience the next generation of property management with a platform
            built for architectural stability and archival precision.
          </p>

          <div className="otp-visual-features">
            <div className="otp-feature-item">
              <div className="otp-feature-icon-box">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div className="otp-feature-text">
                <h3>Multi-Factor Trust</h3>
                <p>Military-grade encryption for every tenant interaction.</p>
              </div>
            </div>

            <div className="otp-feature-item">
              <div className="otp-feature-icon-box">
                <span className="material-symbols-outlined">insights</span>
              </div>
              <div className="otp-feature-text">
                <h3>Real-time Analytics</h3>
                <p>Instant financial insights across your entire estate portfolio.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="otp-bg-decor">
          <div className="otp-bg-decor-circle-1"></div>
          <div className="otp-bg-decor-circle-2"></div>
        </div>

        <div className="otp-visual-footer">
          © 2024 Rentilo Management Suite • Est. 2024
        </div>
      </section>

      {/* Right Side: OTP Form */}
      <section className="otp-form-section">
        <div className="otp-form-container">
          {/* Mobile Logo */}
          <div className="otp-mobile-logo">
            <span>RENTILO</span>
          </div>

          <div className="otp-form-header">
            <h2>Verify OTP</h2>
            <p>Enter the code sent to your mobile number</p>
          </div>

          <form className="otp-form" onSubmit={handleSubmit}>
            {/* OTP Digit Inputs */}
            <div className="otp-inputs-row">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`otp-digit-input${digit ? " filled" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  aria-label={`Digit ${index + 1}`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && <p className="otp-error">{error}</p>}

            {/* Resend Timer */}
            <div className="otp-resend-section">
              <p>
                Resend OTP in <span className="timer">{timer}s</span>
              </p>
              <button
                type="button"
                className="btn-resend"
                disabled={!canResend}
                onClick={handleResend}
              >
                Resend Code
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="btn-verify"
              disabled={!isComplete || verifying}
            >
              {verifying ? "Verifying..." : "Verify Identity"}
            </button>
          </form>

          {/* Change Number Link */}
          <div className="otp-change-number">
            <a href="#" onClick={(e) => { e.preventDefault(); if (onChangeNumber) onChangeNumber(); }}>
              <span className="material-symbols-outlined">edit_note</span>
              Change Mobile Number
            </a>
          </div>

          {/* Mobile Footer */}
          <div className="otp-mobile-footer">
            <p>Rentilo Security Protocol</p>
          </div>
        </div>
      </section>

      {/* Corner Decorative Image */}
      <div className="otp-corner-image">
        <div className="otp-corner-image-inner">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8h-uyzPkaS_-gnrag-ZJZl4RbTtIW75VkAzmxIS-_kDVh3yAgF7TmKZSqtuutT3oPWBoiXJ96HBCYwVOQpAzzFjNCPt1N49oL4E7pA7F12ASY-VIowhNm6stzY5xJKxVuLvsL0-7KkazP5lkP_4z8cGof2FxHZoV7msqOrRYlBLha1wlzaYsaNcr9RK3Moc1GwfyHyIOvfOu5SEuZ0eeDYJGz1b8322nPGna-Yf6GLwQ1YDi9mhC0nJ_wp-0imjoWkLIgkO---xuw"
            alt="Modern luxury residential complex"
          />
        </div>
      </div>

      {/* Verification Success Overlay */}
      {verified && (
        <div className="otp-success-overlay">
          <div className="otp-success-card">
            <span className="material-symbols-outlined success-icon">check_circle</span>
            <h2>Identity Verified</h2>
            <p>Your mobile number has been successfully verified.</p>
            <span className="redirect-text">Redirecting to your dashboard...</span>
          </div>
        </div>
      )}
    </main>
  );
};

export default Otp;
