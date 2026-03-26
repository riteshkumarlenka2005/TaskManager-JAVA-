import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, CheckSquare, FileText, User, Layers } from 'lucide-react';
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
      {/* Branding Bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[rgba(190,196,255,0.1)] border border-[rgba(190,196,255,0.2)] flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#BEC4FF]" />
          </div>
          <span className="font-black text-sm tracking-tighter text-[#BEC4FF] uppercase">TaskManager</span>
        </Link>
        <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">
          <img 
            src={`https://ui-avatars.com/api/?name=${username || 'User'}&background=18181B&color=BEC4FF`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Dynamic Header */}
      <header className="mobile-header" style={{ paddingTop: '1rem' }}>
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
      </header>

      {/* Main Content Area */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="mobile-nav">
        {navItems.map((item) => {
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
