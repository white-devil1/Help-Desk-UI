import { useState } from 'react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import ShellLayout from './layout/ShellLayout';
import Sidebar from './layout/Sidebar';
import TicketRegistration from './pages/TicketRegistration';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import AIChat from './pages/AIChat';
import './index.css';

// ── Embedded layout: sidebar + main only (no header/footer — shell provides those) ──
function EmbeddedLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-canvas)' }}>
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-canvas)' }}>
        {children}
      </main>
    </div>
  );
}

// ── Standalone app (bootstrap.jsx — opened directly in browser) ──────────────
function App() {
  return (
    <Router>
      <ShellLayout>
        <Routes>
          <Route path="/"            element={<TicketRegistration />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/tickets/all" element={<TicketList />} />
          <Route path="/chat"        element={<AIChat />} />
        </Routes>
      </ShellLayout>
    </Router>
  );
}

// ── Mount — called by Angular shell wrapper ───────────────────────────────────
// MemoryRouter keeps routing in memory (Angular owns the browser URL).
// EmbeddedLayout shows the sidebar but not the header/footer (shell provides those).
export function mount(element) {
  const root = createRoot(element);
  root.render(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <EmbeddedLayout>
        <Routes>
          <Route path="/"            element={<TicketRegistration />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/tickets/all" element={<TicketList />} />
          <Route path="/chat"        element={<AIChat />} />
        </Routes>
      </EmbeddedLayout>
    </MemoryRouter>
  );
  return () => root.unmount();
}

export default App;
