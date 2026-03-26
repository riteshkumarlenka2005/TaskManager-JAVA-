import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, CheckSquare, FileText, User, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../mobile.css';

const navItems = [
  { path: '/mobile/home', icon: Home, label: 'Home' },
  { path: '/mobile/documents', icon: FileText, label: 'Docs' },
  { path: 'plus', icon: CheckSquare, label: 'Add' }, // Special center button
  { path: '/mobile/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/mobile/profile', icon: User, label: 'Profile' },
];

const MobileLayout: React.FC = () => {
  const { username } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    if (location.pathname.includes('tasks')) return 'Tasks';
    if (location.pathname.includes('documents')) return 'Documents';
    if (location.pathname.includes('profile')) return 'Profile';
    return null; // Home uses greeting
  };

  const pageTitle = getPageTitle();

  return (
    <div className="mobile-view">
      {/* Dynamic Header */}
      <header className="mobile-header">
        <div>
          <h2 className="mobile-greeting">
            {pageTitle || (
              <>
                Manage <br /> 
                your tasks <span role="img" aria-label="pencil">✏️</span>
              </>
            )}
          </h2>
        </div>
        <div className="mobile-avatar">
          <img 
            src={`https://ui-avatars.com/api/?name=${username || 'User'}&background=18181B&color=BEC4FF`} 
            alt="Profile" 
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="mobile-nav">
        {navItems.map((item, idx) => {
          if (item.path === 'plus') {
            return (
              <button 
                key="plus" 
                className="mobile-nav-center"
                onClick={() => navigate('/mobile/tasks')}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 300 }}>+</div>
              </button>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mobile-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon style={{ width: 24, height: 24 }} />
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileLayout;
