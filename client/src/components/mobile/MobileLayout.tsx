import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar, Settings, User, LayoutGrid } from 'lucide-react';
import '../../mobile.css';

const MobileLayout: React.FC = () => {
  return (
    <div className="mobile-app-container pt-8 pb-32 px-6">
      {/* Dynamic Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-medium text-mobile-text-muted">Hey, Ektiar!</h2>
          <p className="text-xs text-mobile-text-muted/60">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' })}</p>
        </div>
        <button className="mobile-icon-box bg-white/10 hover:bg-white/20 transition-colors">
          <LayoutGrid className="w-5 h-5 text-mobile-primary" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/mobile/home" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-tight">Home</span>
        </NavLink>
        <NavLink to="/mobile/tasks" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-tight">Tasks</span>
        </NavLink>
        <NavLink to="/mobile/settings" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Settings className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-tight">Set</span>
        </NavLink>
        <NavLink to="/mobile/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-tight">Pro</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MobileLayout;
