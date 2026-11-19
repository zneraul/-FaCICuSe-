import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAuthModal } from '../context/AuthModalContext.jsx';
import { PROJECT_INFO } from '../../server/domain/projectInfo.js';

export function PublicLayout({ children }) {
  const { user } = useAuth();
  const { openSignInModal } = useAuthModal();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFacilitiesActive = location.pathname.startsWith('/facilities');
  const isTimetableActive = location.pathname.startsWith('/timetable');

  return (
    <div className="ambient-canvas">
      <div className="ambient-backdrop" aria-hidden="true" />
      <div className="ambient-scrim" aria-hidden="true" />

      <header className="public-header">
        <div className="public-header-inner">
          <a href="/" className="brand-lockup">
            <span className="brand-logo-badge">
              <img
                src="/assets/images/facicuse-logo.jpg"
                alt="FaCICuSe logo"
                className="brand-logo-img"
                style={{ width: '28px', height: '28px' }}
              />
            </span>
            <span className="brand-wordmark">FaCICuSe</span>
          </a>

          <nav className="public-nav-links" aria-label="Primary navigation">
            <a href="/" className="public-nav-link">
              Home
            </a>
            <Link
              to="/facilities"
              className={`public-nav-link ${isFacilitiesActive ? 'active' : ''}`}
              aria-current={isFacilitiesActive ? 'page' : undefined}
            >
              Facilities
            </Link>
            <Link
              to="/timetable"
              className={`public-nav-link ${isTimetableActive ? 'active' : ''}`}
              aria-current={isTimetableActive ? 'page' : undefined}
            >
              Timetable
            </Link>
            <a href="/#reservations" className="public-nav-link">
              Availability
            </a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {user ? (
              <Link to="/app/dashboard" className="btn btn-coral btn-sm">
                Open Workspace
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-coral btn-sm"
                onClick={() => openSignInModal()}
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              className="icon-btn public-mobile-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="public-mobile-menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            id="public-mobile-menu"
            className="public-mobile-drawer"
            aria-label="Mobile section navigation"
          >
            <a href="/" className="public-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </a>
            <Link
              to="/facilities"
              className={`public-mobile-link ${isFacilitiesActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Facilities
            </Link>
            <Link
              to="/timetable"
              className={`public-mobile-link ${isTimetableActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Timetable
            </Link>
            <a
              href="/#reservations"
              className="public-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Availability
            </a>
            {!user && (
              <button
                type="button"
                className="public-mobile-link"
                style={{
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSignInModal();
                }}
              >
                Sign In
              </button>
            )}
          </nav>
        )}
      </header>

      <main className="public-main">{children}</main>

      <footer id="contact" className="public-footer" style={{ scrollMarginTop: '5.5rem' }}>
        <div className="public-footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <a href="/" className="brand-lockup">
              <span className="brand-logo-badge">
                <img
                  src="/assets/images/facicuse-logo.jpg"
                  alt="FaCICuSe logo"
                  className="brand-logo-img"
                  style={{ width: '28px', height: '28px' }}
                />
              </span>
              <span className="brand-wordmark">FaCICuSe</span>
            </a>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', maxWidth: '34ch' }}>
              <strong>{PROJECT_INFO.meaning}</strong> — {PROJECT_INFO.tagline}.
            </p>
            <address style={{ fontStyle: 'normal', fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
              {PROJECT_INFO.college}
              <br />
              {PROJECT_INFO.institutionShort}
              <br />
              {PROJECT_INFO.campusAddress}
              <br />
              Email:{' '}
              <a href={`mailto:${PROJECT_INFO.contactEmail}`} style={{ color: 'var(--accent-blue)' }}>
                {PROJECT_INFO.contactEmail}
              </a>
            </address>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem', fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--ink-primary)' }}>Quick Links</strong>
            <a href="/">Homepage</a>
            <Link to="/facilities">CICS Directory (37 Rooms)</Link>
            <Link to="/timetable">Class Timetable</Link>
            <a href="/#reservations">Live Availability</a>
            <a href="/#faq">FAQ</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem', fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--ink-primary)' }}>Campus Access</strong>
            {user ? (
              <Link to="/app/dashboard">Open Workspace</Link>
            ) : (
              <button
                type="button"
                onClick={() => openSignInModal()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                }}
              >
                University Sign In
              </button>
            )}
            <Link to="/app/dashboard">Authenticated Workspace</Link>
            <span style={{ color: 'var(--ink-muted)', marginTop: '0.4rem', fontSize: '0.8rem' }}>
              {PROJECT_INFO.copyright}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
