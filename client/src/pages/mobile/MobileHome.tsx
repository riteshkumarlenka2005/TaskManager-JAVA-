import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Task } from '../../types';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Loader2,
} from 'lucide-react';

const MobileHome: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<any>('/tasks');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.content || res.data?.data || [];
      setTasks(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentTasks = tasks.slice(0, 4);

  if (loading) {
    return (
      <div className="mobile-spinner">
        <Loader2 style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Summary Hero Card */}
      <div className="mobile-summary-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0, marginBottom: '0.25rem' }}>
              Task Overview
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#7C8B93', margin: 0 }}>
              {stats.total} total tasks this workspace
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#46F0D2', lineHeight: 1 }}>
              {completionRate}%
            </span>
            <p style={{ fontSize: '0.6rem', color: '#7C8B93', margin: '0.15rem 0 0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Completed
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
          <div
            style={{
              width: `${completionRate}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #46F0D2, #00CFFF)',
              borderRadius: 100,
              boxShadow: '0 0 10px rgba(70,240,210,0.5)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '1rem' }}>
          <StatMini icon={<ClipboardList />} label="Total" value={String(stats.total)} />
          <StatMini icon={<Clock />} label="Pending" value={String(stats.pending)} />
          <StatMini icon={<AlertTriangle />} label="Active" value={String(stats.inProgress)} />
          <StatMini icon={<CheckCircle2 />} label="Done" value={String(stats.completed)} />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="mobile-grid">
        <StatCard
          icon={<ClipboardList />}
          label="Total Tasks"
          value={stats.total}
          color="#46F0D2"
          bg="rgba(70,240,210,0.08)"
        />
        <StatCard
          icon={<Clock />}
          label="Pending"
          value={stats.pending}
          color="#FFAD00"
          bg="rgba(255,173,0,0.08)"
        />
        <StatCard
          icon={<TrendingUp />}
          label="In Progress"
          value={stats.inProgress}
          color="#00CFFF"
          bg="rgba(0,207,255,0.08)"
        />
        <StatCard
          icon={<CheckCircle2 />}
          label="Completed"
          value={stats.completed}
          color="#46F0D2"
          bg="rgba(70,240,210,0.08)"
        />
      </div>

      {/* Recent Tasks */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="mobile-section-title" style={{ marginBottom: 0 }}>Recent Tasks</span>
          <button
            onClick={() => navigate('/mobile/tasks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#46F0D2',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            View all <ArrowRight style={{ width: 12, height: 12 }} />
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="mobile-empty-state">
            <div className="mobile-empty-state-icon">
              <ClipboardList style={{ width: 24, height: 24 }} />
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>No tasks yet</p>
            <p style={{ fontSize: '0.75rem' }}>Create your first task to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recentTasks.map((task) => (
              <RecentTaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom spacer */}
      <div style={{ height: '1rem' }} />
    </div>
  );
};

// Mini stat inside hero card
const StatMini = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="mobile-stat-mini">
    <div className="mobile-stat-mini-icon">
      {React.cloneElement(icon as React.ReactElement<any, any>, { style: { width: 14, height: 14 } })}
    </div>
    <div className="mobile-stat-mini-value">{value}</div>
    <div className="mobile-stat-mini-label">{label}</div>
  </div>
);

// Grid stat card
const StatCard = ({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
}) => (
  <div className="mobile-stat-card">
    <div className="mobile-stat-card-icon" style={{ background: bg }}>
      {React.cloneElement(icon as React.ReactElement<any, any>, {
        style: { width: 20, height: 20, color },
      })}
    </div>
    <div className="mobile-stat-card-value" style={{ color }}>{value}</div>
    <div className="mobile-stat-card-label">{label}</div>
  </div>
);

// Recent task row
const RecentTaskItem = ({ task }: { task: Task }) => {
  const priorityColor =
    task.priority === 'HIGH'
      ? '#FF4D6A'
      : task.priority === 'MEDIUM'
        ? '#FFAD00'
        : '#46F0D2';

  const statusLabel = task.status.replace('_', ' ');

  return (
    <div className="mobile-task-card">
      <div
        style={{
          width: 4,
          height: 36,
          borderRadius: 100,
          background: priorityColor,
          flexShrink: 0,
          boxShadow: `0 0 8px ${priorityColor}40`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mobile-task-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.title}
        </div>
        <div className="mobile-task-meta">
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 100,
              background: `${priorityColor}15`,
              color: priorityColor,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
