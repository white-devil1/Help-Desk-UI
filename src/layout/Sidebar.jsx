import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    label: 'My Requests',
    route: '/',
    exact: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'All Tickets',
    route: '/tickets/all',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    label: 'AI Assistant',
    route: '/chat',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10a10 10 0 0 1-10-10c0-2.76 1.12-5.26 2.93-7.07"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
];

// Nicer AI icon
NAV_ITEMS[3].icon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 9h6M9 12h6M9 15h4"/>
  </svg>
);

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (label) =>
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}
      <aside className={`mfe-sidebar${mobileOpen ? ' sidebar--mobile-open' : ''}`}>
        <div className="sidebar-section-label">Help Desk</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.route}
              to={item.route}
              end={item.exact}
              className={({ isActive }) =>
                'sidebar-item' + (isActive ? ' sidebar-item--active' : '')
              }
              onClick={onCloseMobile}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
