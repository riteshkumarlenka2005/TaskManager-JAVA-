import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Paintbrush,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/drawing', icon: Paintbrush, label: 'Drawing' },
];

const Layout: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <div className="ambient-bg" />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-screen z-50 flex flex-col glass-panel"
        style={{
          borderRadius: 0,
          borderRight: '1px solid rgba(255,255,255,0.08)',
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.08]">
          <Layers className="w-7 h-7 text-[#F5E6A7] shrink-0" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold tracking-tight"
            >
              TaskManager
            </motion.span>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'btn-icon-active'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-3 py-4 border-t border-white/[0.08] space-y-2">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-2 text-sm text-text-secondary truncate"
            >
              {username}
            </motion.div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-danger hover:bg-danger/10 transition-all duration-300 w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1A1A1F] border border-white/[0.15] flex items-center justify-center text-text-secondary hover:text-[#FFFFFF] transition-all z-50"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen w-0"
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;
