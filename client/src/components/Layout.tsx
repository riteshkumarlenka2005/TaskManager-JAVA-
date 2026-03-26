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
  Plus,
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
    const check = () => setIsMobile(window.innerWidth < 1024);
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

  const sidebarWidth = isMobile ? 280 : collapsed ? 80 : 280;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white font-['Outfit']">
      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || mobileOpen) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0, width: sidebarWidth }}
            exit={isMobile ? { x: -300 } : undefined}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 h-screen z-[100] flex flex-col bg-[#18181B] border-r border-white/5"
          >
            {/* Brand */}
            <div className="flex items-center justify-between px-6 py-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#BEC4FF] flex items-center justify-center shadow-lg shadow-[#BEC4FF]/10">
                  <Layers className="w-5 h-5 text-black" />
                </div>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-black tracking-tighter"
                  >
                    TaskManager
                  </motion.span>
                )}
              </div>
              {isMobile && (
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#7C8B93]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-4 px-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-[#BEC4FF] text-black shadow-lg shadow-[#BEC4FF]/10'
                        : 'text-[#7C8B93] hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${location.pathname === item.path ? 'text-black' : 'group-hover:text-[#BEC4FF]'}`} />
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-bold"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="px-4 py-6 border-t border-white/5 space-y-2">
              {(!collapsed || isMobile) && (
                <div className="px-4 py-3 bg-white/5 rounded-2xl flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#BEC4FF]/20 flex items-center justify-center text-[#BEC4FF] text-[10px] font-black uppercase">
                    {username?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-bold text-white truncate">{username}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#7C8B93] hover:text-red-400 hover:bg-red-400/5 transition-all w-full font-bold text-sm"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {(!collapsed || isMobile) && <span>Sign Out</span>}
              </button>
            </div>
 
            {/* Collapse Toggle (desktop only) */}
            {!isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-24 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[#7C8B93] hover:text-[#BEC4FF] transition-all z-[110] bg-[#18181B] shadow-lg"
              >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Top Bar */}
      {isMobile && !mobileOpen && (
        <div className="fixed top-0 left-0 right-0 z-[50] flex items-center justify-between px-6 py-4 bg-[#18181B] border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[#BEC4FF] flex items-center justify-center">
               <Layers className="w-4 h-4 text-black" />
             </div>
             <span className="font-black text-lg tracking-tighter">TaskManager</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-white/5 text-[#7C8B93]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        animate={{ paddingLeft: (isMobile || mobileOpen) ? 0 : sidebarWidth }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        <main className="min-h-screen min-w-0">
          <div className={`mx-auto w-full max-w-7xl p-6 md:p-12 ${isMobile ? 'pt-24' : ''}`}>
             <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
