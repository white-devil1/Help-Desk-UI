import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TicketRegistration from './pages/TicketRegistration';
import TicketList from './pages/TicketList';
import Assets from './pages/Assets';
import AIChat from './pages/AIChat';
import UserManagement from './pages/UserManagement';
import Attendance from './pages/Attendance';
import './App.css';

/**
 * Remote entry for Native Federation
 * Exports a component factory that Angular shell can use
 */
export default function HelpDeskApp({ container }) {
  if (!container) {
    console.error('HelpDeskApp: No container provided');
    return;
  }

  const mountPoint = document.createElement('div');
  mountPoint.style.width = '100%';
  mountPoint.style.height = '100%';
  mountPoint.style.minHeight = 'calc(100vh - 112px)';
  container.appendChild(mountPoint);

  const root = createRoot(mountPoint);

  root.render(
    <Router>
      <div className="app">
        <nav className="main-nav">
          <a href="#/" className="nav-link">🎫 My Requests</a>
          <a href="#/tickets/all" className="nav-link">📊 All Tickets</a>
          <a href="#/assets" className="nav-link">📦 Assets</a>
          <a href="#/chat" className="nav-link">🤖 AI Chat</a>
          <a href="#/users" className="nav-link">👥 Users</a>
          <a href="#/attendance" className="nav-link">⏰ Attendance</a>
        </nav>
        <Routes>
          <Route path="/" element={<TicketRegistration />} />
          <Route path="/tickets/all" element={<TicketList />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </Router>
  );

  return () => {
    root.unmount();
    mountPoint.remove();
  };
}
