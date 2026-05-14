import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './ShellLayout.css';

export default function ShellLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="shell">
      <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />

      <div className="shell-body">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
        <main className="shell-main">
          {children}
        </main>
      </div>

      <Footer />

      {/* Mobile bottom nav */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <NavLink to="/" end className={({ isActive }) => 'mob-nav-item' + (isActive ? ' mob-nav-item--active' : '')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Requests</span>
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => 'mob-nav-item' + (isActive ? ' mob-nav-item--active' : '')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tickets/all" className={({ isActive }) => 'mob-nav-item' + (isActive ? ' mob-nav-item--active' : '')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
          </svg>
          <span>Tickets</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => 'mob-nav-item' + (isActive ? ' mob-nav-item--active' : '')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>AI Chat</span>
        </NavLink>
      </nav>
    </div>
  );
}
