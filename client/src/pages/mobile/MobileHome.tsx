import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Task } from '../../types';
import {
  ClipboardList,
  Clock,
  ArrowRight,
  Loader2,
  Share2,
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

  const recentTasks = tasks.slice(0, 4);

  // Mock dates for the calendar bar
  const days = [
    { name: 'Sun', date: 12 },
    { name: 'Mon', date: 13 },
    { name: 'Tue', date: 14 },
    { name: 'Wed', date: 15 },
    { name: 'Thu', date: 16, active: true },
    { name: 'Fri', date: 17 },
    { name: 'Sat', date: 18 },
  ];

  const parseTaskDate = (dateVal: any): string => {
    if (!dateVal) return 'Recently';
    try {
      if (Array.isArray(dateVal)) {
        const d = new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      }
      return new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader2 className="animate-spin text-[#BEC4FF]" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div>
      {/* Calendar horizontal date bar */}
      <div className="mobile-calendar-bar">
        {days.map((day) => (
          <div key={day.date} className={`mobile-calendar-day ${day.active ? 'active' : ''}`}>
            <span className="mobile-calendar-day-name">{day.name}</span>
            <span className="mobile-calendar-date">{day.date}</span>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {recentTasks.length === 0 ? (
          <div className="mobile-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <ClipboardList style={{ width: 48, height: 48, color: '#7C8B93', margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ color: '#7C8B93', fontWeight: 600 }}>No tasks found</p>
          </div>
        ) : (
          recentTasks.map((task) => (
            <div 
              key={task.id} 
              className={`mobile-task-card ${task.priority === 'HIGH' ? 'priority-high' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  background: task.priority === 'HIGH' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '100px',
                  textTransform: 'capitalize'
                }}>
                  {task.priority.toLowerCase()}
                </div>
                <Share2 style={{ width: 14, height: 14, opacity: 0.6 }} />
              </div>
              
              <h4 className="mobile-task-card-title">{task.title}</h4>
              
              <div className="mobile-task-card-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock style={{ width: 12, height: 12 }} />
                  <span>{parseTaskDate(task.createdAt)}</span>
                </div>
                
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <div style={{ display: 'flex', gap: '0.25rem', opacity: 0.6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '2px', border: '1px solid currentColor' }} />
                    <span>4</span>
                    <Share2 style={{ width: 10, height: 10, transform: 'rotate(180deg)' }} />
                    <span>16</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      <button 
        onClick={() => navigate('/mobile/tasks')}
        style={{
          width: '100%',
          padding: '1.25rem',
          borderRadius: '1.5rem',
          background: '#1C1C1E',
          color: 'white',
          border: 'none',
          fontWeight: 700,
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        View All Tasks <ArrowRight style={{ width: 16, height: 16 }} />
      </button>

      {/* Bottom spacer */}
      <div style={{ height: '2rem' }} />
    </div>
  );
};

export default MobileHome;
