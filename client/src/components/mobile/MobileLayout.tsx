import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, CheckSquare, FileText, User, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../mobile.css';

const navItems = [
  { path: '/mobile/home', icon: Home, label: 'Home' },
  { path: '/mobile/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/mobile/documents', icon: FileText, label: 'Docs' },
  { path: '/mobile/profile', icon: User, label: 'Profile' },
];

const MobileLayout: React.FC = () => {
  const { username } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('tasks')) return 'Tasks';
    if (location.pathname.includes('documents')) return 'Documents';
    if (location.pathname.includes('profile')) return 'Profile';
    return null; // Home uses greeting
  };

  const pageTitle = getPageTitle();

  return (
    <div className="mobile-app-container pt-8 pb-28 px-5">
      {/* Dynamic Header */}
      <header className="mobile-header">
        {pageTitle ? (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
              {pageTitle}
            </h2>
          </div>
        ) : (
          <div className="mobile-header-greeting">
            <h2>
              Hey, <span>{username || 'User'}</span>! 👋
            </h2>
            <p>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
        <button
          className="mobile-icon-box"
          style={{ background: 'rgba(70,240,210,0.08)', border: '1px solid rgba(70,240,210,0.15)' }}
        >
          <LayoutGrid className="w-5 h-5" style={{ color: '#46F0D2' }} />
        </button>
      </header>

      {/* Main Content Area */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon style={{ width: 22, height: 22 }} />
            <span className="mobile-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileLayout;
