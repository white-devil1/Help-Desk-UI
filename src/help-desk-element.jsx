import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import TicketRegistration from './pages/TicketRegistration';
import TicketList from './pages/TicketList';
import Assets from './pages/Assets';
import AIChat from './pages/AIChat';
import UserManagement from './pages/UserManagement';
import Attendance from './pages/Attendance';
import './App.css';

// ─── Inner nav: uses React Router's <Link> so routing stays in memory ─────────
function HelpDeskNav() {
  const location = useLocation();
  const navItems = [
    { to: '/',            label: '🎫 My Requests' },
    { to: '/tickets/all', label: '📊 All Tickets'  },
    { to: '/assets',      label: '📦 Assets'       },
    { to: '/chat',        label: '🤖 AI Chat'       },
    { to: '/users',       label: '👥 User Mgmt'    },
    { to: '/attendance',  label: '⏰ Attendance'    },
  ];

  return (
    <nav className="main-nav">
      {navItems.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`nav-link${location.pathname === to ? ' nav-link--active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

// ─── Root app wrapped in MemoryRouter ─────────────────────────────────────────
// MemoryRouter keeps ALL routing state in memory — it never touches the browser
// URL. This is the correct choice when embedding a React app inside Angular,
// because Angular already owns the URL. HashRouter / BrowserRouter both
// manipulate window.location, which Angular intercepts and redirects away.
function HelpDeskAppRoot() {
  return (
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <div className="app">
        <HelpDeskNav />
        <Routes>
          <Route path="/"            element={<TicketRegistration />} />
          <Route path="/tickets/all" element={<TicketList />}         />
          <Route path="/assets"      element={<Assets />}             />
          <Route path="/chat"        element={<AIChat />}             />
          <Route path="/users"       element={<UserManagement />}     />
          <Route path="/attendance"  element={<Attendance />}         />
        </Routes>
      </div>
    </MemoryRouter>
  );
}

// ─── Web Component class ──────────────────────────────────────────────────────
class HelpDeskElement extends HTMLElement {
  constructor() {
    super();
    this.root = null;
    this.mountPoint = null;
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.mountPoint.style.width = '100%';
    this.mountPoint.style.height = '100%';
    this.appendChild(this.mountPoint);

    this.root = createRoot(this.mountPoint);
    this.root.render(<HelpDeskAppRoot />);
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}

// Register custom element (guard against duplicate define on re-navigation)
if (!customElements.get('help-desk-app')) {
  customElements.define('help-desk-app', HelpDeskElement);
}

export default HelpDeskElement;
