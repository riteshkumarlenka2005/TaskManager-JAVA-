import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import type { Task } from '../../types';
import {
  User,
  LogOut,
  CheckCircle2,
  ClipboardList,
  TrendingUp,
  Shield,
  ChevronRight,
  Loader2,
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

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* User Info Card */}
      <div className="mobile-panel" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
        <div className="mobile-profile-avatar" style={{ margin: '0 auto 1rem' }}>
          <User style={{ width: 32, height: 32, color: '#46F0D2' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {username || 'User'}
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#7C8B93', margin: 0 }}>TaskManager Member</p>
      </div>

      {/* Stats Row */}
      {loading ? (
        <div className="mobile-spinner">
          <Loader2 style={{ width: 24, height: 24 }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
          <ProfileStat icon={<ClipboardList />} value={stats.total} label="Total" />
          <ProfileStat icon={<TrendingUp />} value={stats.inProgress} label="Active" />
          <ProfileStat icon={<CheckCircle2 />} value={stats.completed} label="Done" />
        </div>
      )}

      {/* Menu Items */}
      <div className="mobile-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <MenuItem
          icon={<Shield style={{ width: 18, height: 18, color: '#46F0D2' }} />}
          label="Security"
          sublabel="Password & authentication"
        />
        <div className="mobile-divider" style={{ margin: 0 }} />
        <MenuItem
          icon={<ClipboardList style={{ width: 18, height: 18, color: '#46F0D2' }} />}
          label="My Tasks"
          sublabel={`${stats.total} tasks total`}
          onClick={() => navigate('/mobile/tasks')}
        />
      </div>

      {/* App Info */}
      <div className="mobile-panel" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', color: '#4F5B62', margin: '0 0 0.25rem', fontWeight: 700 }}>
          TaskManager Mobile
        </p>
        <p style={{ fontSize: '0.6rem', color: '#4F5B62', margin: 0 }}>
          Version 1.0.0 • Cyber Edition
        </p>
      </div>

      {/* Logout Button */}
      <button className="mobile-btn-danger" style={{ width: '100%' }} onClick={handleLogout}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <LogOut style={{ width: 16, height: 16 }} />
          Log Out
        </span>
      </button>

      {/* Bottom spacer */}
      <div style={{ height: '1rem' }} />
    </div>
  );
};

const ProfileStat = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) => (
  <div className="mobile-stat-card" style={{ textAlign: 'center' }}>
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'rgba(70,240,210,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 0.5rem',
      }}
    >
      {React.cloneElement(icon as React.ReactElement<any, any>, {
        style: { width: 16, height: 16, color: '#46F0D2' },
      })}
    </div>
    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{value}</div>
    <div style={{ fontSize: '0.65rem', color: '#7C8B93', fontWeight: 600 }}>{label}</div>
  </div>
);

const MenuItem = ({
  icon,
  label,
  sublabel,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      padding: '1rem 1.25rem',
      width: '100%',
      background: 'none',
      border: 'none',
      cursor: onClick ? 'pointer' : 'default',
      textAlign: 'left',
      color: 'inherit',
      fontFamily: 'var(--mobile-font)',
      transition: 'background 0.2s',
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'rgba(70,240,210,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{label}</div>
      <div style={{ fontSize: '0.7rem', color: '#7C8B93' }}>{sublabel}</div>
    </div>
    <ChevronRight style={{ width: 16, height: 16, color: '#4F5B62' }} />
  </button>
);

export default MobileProfile;
