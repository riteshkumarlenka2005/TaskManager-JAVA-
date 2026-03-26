import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Paintbrush,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/drawing', icon: Paintbrush, label: 'Drawing' },
];

const Layout: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = isMobile ? 280 : collapsed ? 72 : 260;

  return (
    <div className="min-h-screen">
      <div className="ambient-bg" />

      {/* Mobile Header */}
      {isMobile && (
        <div
          className="fixed top-0 left-0 right-0 z-[60] flex items-center gap-3 px-4 py-3"
          style={{ background: 'rgba(5, 7, 10, 0.95)', borderBottom: '1px solid rgba(0,255,156,0.15)', boxShadow: '0 0 15px rgba(0,255,156,0.1)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-[#00FF9C]/10 text-[#7C8B93] transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Layers className="w-5 h-5 text-[#00FF9C]" style={{ filter: 'drop-shadow(0 0 5px rgba(0,255,156,0.5))' }} />
          <span className="text-base font-bold tracking-tight text-[#A8FFDF]">TaskManager</span>
        </div>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || mobileOpen) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0, width: sidebarWidth }}
            exit={isMobile ? { x: -300 } : undefined}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-screen z-[80] flex flex-col"
            style={{
              background: '#0A0F14',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(0,255,156,0.15)',
              boxShadow: '4px 0 24px -1px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Brand */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-[#00FF9C]/10">
              <div className="flex items-center gap-3">
                <Layers className="w-7 h-7 text-[#00FF9C]" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,156,0.4))' }} />
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-bold tracking-tight text-[#A8FFDF]"
                  >
                    TaskManager
                  </motion.span>
                )}
              </div>
              {isMobile && (
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[#A1A1AA]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-4 px-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 cyber-glow'
                        : 'text-[#7C8B93] hover:text-[#A8FFDF] hover:bg-[#00FF9C]/05'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {(!collapsed || isMobile) && (
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
            <div className="px-3 py-4 border-t border-[#00FF9C]/10 space-y-2">
              {(!collapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full px-3 py-2 text-sm text-[#7C8B93] truncate"
                >
                  {username}
                </motion.div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#7C8B93] hover:text-[#FF3E3E] hover:bg-[#FF3E3E]/10 transition-all duration-200 w-full"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {(!collapsed || isMobile) && <span className="text-sm font-medium">Logout</span>}
              </button>
            </div>
 
            {/* Collapse Toggle (desktop only) */}
            {!isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-[#00FF9C]/20 flex items-center justify-center text-[#7C8B93] hover:text-[#00FF9C] transition-all z-50 hover:cyber-glow"
                style={{ background: '#0D1117' }}
              >
                {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        animate={{ paddingLeft: isMobile ? 0 : sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        <main className="min-h-screen min-w-0 overflow-x-hidden">
          <div className={`mx-auto w-full min-w-0 max-w-7xl p-4 sm:p-6 lg:p-8 ${isMobile ? 'pt-[68px]' : ''}`}>
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
