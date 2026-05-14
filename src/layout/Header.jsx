import { useState, useEffect, useRef } from 'react';
import { useTheme, COLOR_THEMES, COLOR_THEME_LABELS } from '../theme/useTheme';
import './Header.css';

const SWATCH_COLORS = {
  'forest-green': '#16a34a',
  'rose-gold':    '#e11d48',
  'deep-plum':    '#a21caf',
  'volcanic-red': '#b91c1c',
  'arctic-blue':  '#1d4ed8',
  'aurora':       '#6366f1',
  'golden-hour':  '#d97706',
};

export default function Header({ onMenuToggle }) {
  const { isDark, toggleMode, colorTheme, setColorTheme } = useTheme();
  const [userOpen,  setUserOpen]  = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const userRef  = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const initials = 'HD';

  return (
    <header className="mfe-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <a className="brand" href="#">
          <span className="brand-bolt">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2 4.5 13.5h6L9.5 22 19 9.5h-6L13 2z"/>
            </svg>
          </span>
          <span className="brand-name">Workforce</span>
          <span className="brand-divider"></span>
          <span className="brand-module">Help Desk</span>
        </a>
      </div>

      <div className="header-right">
        {/* Dark / Light toggle */}
        <button className="icon-btn" onClick={toggleMode} aria-label={isDark ? 'Light mode' : 'Dark mode'}>
          {isDark ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Color theme picker */}
        <div className="theme-picker-wrap" ref={themeRef}>
          <button className="icon-btn" onClick={() => setThemeOpen(v => !v)} aria-label="Color theme">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
              <circle cx="8.5"  cy="7.5"  r=".5" fill="currentColor"/>
              <circle cx="6.5"  cy="12.5" r=".5" fill="currentColor"/>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
            </svg>
          </button>
          {themeOpen && (
            <div className="theme-picker-dropdown">
              <div className="theme-picker-label">Color Theme</div>
              <div className="theme-swatches">
                {COLOR_THEMES.map(theme => (
                  <button
                    key={theme}
                    className={`theme-swatch${colorTheme === theme ? ' active' : ''}`}
                    style={{ background: SWATCH_COLORS[theme] }}
                    title={COLOR_THEME_LABELS[theme]}
                    onClick={() => { setColorTheme(theme); setThemeOpen(false); }}
                  >
                    {colorTheme === theme && <span className="swatch-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="icon-btn" aria-label="Notifications">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* User chip */}
        <div className="user-menu-wrap" ref={userRef}>
          <button className={`user-chip${userOpen ? ' open' : ''}`} onClick={() => setUserOpen(v => !v)}>
            <span className="user-avatar">{initials}</span>
            <span className="user-name">Help Desk</span>
            <span className="chip-chevron">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </button>
          {userOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-username">Help Desk User</span>
                <span className="dropdown-email">helpdesk@workforce.com</span>
              </div>
              <button className="dropdown-item dropdown-item--danger" onClick={() => setUserOpen(false)}>
                <span className="dropdown-item-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
