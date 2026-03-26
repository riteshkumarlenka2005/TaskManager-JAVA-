import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import type { Task } from '../../types';
import {
  User,
  LogOut,
  ChevronRight,
  Loader2,
  Shield,
  Settings,
  Bell,
  HelpCircle
} from 'lucide-react';

const MobileProfile: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<any>('/tasks');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.content || res.data?.data || [];
      setTasks(data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader2 className="animate-spin text-[#BEC4FF]" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Profile Header */}
      <div className="mobile-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div 
          style={{ 
            width: 80, height: 80, borderRadius: '32px', background: '#222226', 
            margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '4px solid #18181B', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          <img 
            src={`https://ui-avatars.com/api/?name=${username || 'User'}&background=222226&color=BEC4FF&size=128`} 
            alt="Avatar"
            style={{ width: '100%', height: '100%', borderRadius: '28px' }}
          />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontBlack: 900, marginBottom: '0.25rem' }}>{username || 'User'}</h3>
        <p style={{ fontSize: '0.85rem', color: '#7C8B93', fontWeight: 600 }}>Platinum Member</p>
      </div>

      {/* Stats Row */}
      <div className="mobile-stat-grid">
        <div className="mobile-stat-card">
          <div className="mobile-stat-value text-[#BEC4FF]">{tasks.length}</div>
          <div className="mobile-stat-label tracking-widest uppercase">Total Tasks</div>
        </div>
        <div className="mobile-stat-card">
          <div className="mobile-stat-value text-white">{completedCount}</div>
          <div className="mobile-stat-label tracking-widest uppercase">Finished</div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="mobile-panel" style={{ padding: '0.5rem' }}>
        <ProfileMenuItem icon={<Settings />} label="Settings" />
        <ProfileMenuItem icon={<Bell />} label="Notifications" />
        <ProfileMenuItem icon={<Shield />} label="Privacy & Security" />
        <ProfileMenuItem icon={<HelpCircle />} label="Support Center" />
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="mobile-btn-danger" 
        style={{ marginTop: '0.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <LogOut style={{ width: 18, height: 18 }} />
          <span>Sign Out</span>
        </div>
      </button>

      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <p style={{ fontSize: '0.65rem', color: '#4F5B62', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          TaskManager Elite v1.2.0
        </p>
      </div>

      <div style={{ height: '2rem' }} />
    </div>
  );
};

const ProfileMenuItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', 
      padding: '1.25rem', background: 'transparent', border: 'none', color: 'white',
      borderRadius: '1.5rem', transition: 'all 0.2s'
    }}
    className="hover:bg-white/5"
  >
    <div style={{ color: '#7C8B93' }}>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <span style={{ flex: 1, textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>{label}</span>
    <ChevronRight size={16} style={{ color: '#4F5B62' }} />
  </button>
);

export default MobileProfile;
