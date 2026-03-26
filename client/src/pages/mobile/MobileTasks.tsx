import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import type { Task, TaskRequest, Status, Priority } from '../../types';
import {
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Loader2,
  ClipboardList,
} from 'lucide-react';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

const MobileTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TaskRequest>({
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
  });

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

  const filtered =
    filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', status: 'PENDING', priority: 'MEDIUM' });
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      closeModal();
      fetchTasks();
    } catch {
      // error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      // error
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus: Status = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description || '',
        status: newStatus,
        priority: task.priority,
      });
      fetchTasks();
    } catch {
      // error
    }
  };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filter Tabs - Styled as Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`mobile-tab ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filter === f.value ? 'white' : '#18181B',
              color: filter === f.value ? 'black' : '#7C8B93',
              border: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader2 className="animate-spin text-[#BEC4FF]" style={{ width: 32, height: 32 }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mobile-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <ClipboardList style={{ width: 48, height: 48, color: '#7C8B93', margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ color: '#7C8B93', fontWeight: 600 }}>No tasks found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`mobile-task-card ${task.priority === 'HIGH' ? 'priority-high' : ''}`}
              style={{ position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleComplete(task); }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: `2px solid ${task.priority === 'HIGH' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)'}`,
                      background: task.status === 'COMPLETED' ? (task.priority === 'HIGH' ? 'black' : '#BEC4FF') : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    {task.status === 'COMPLETED' && <CheckCircle2 style={{ width: 14, height: 14, color: task.priority === 'HIGH' ? 'white' : 'black' }} />}
                  </button>
                  <h4 className="mobile-task-card-title">{task.title}</h4>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(task)} style={{ opacity: 0.6 }}><Edit3 style={{ width: 14, height: 14 }} /></button>
                  <button onClick={() => handleDelete(task.id)} style={{ opacity: 0.6 }}><Trash2 style={{ width: 14, height: 14 }} /></button>
                </div>
              </div>

              <div className="mobile-task-card-info" style={{ marginLeft: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock style={{ width: 12, height: 12 }} />
                  <span>{parseTaskDate(task.createdAt)}</span>
                </div>
                <div style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: 800, 
                  background: task.priority === 'HIGH' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '100px',
                  textTransform: 'uppercase'
                }}>
                  {task.priority}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL - Simplified for Mobile SaaS Theme */}
      {modalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 2000, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-end'
        }} onClick={closeModal}>
          <div style={{ 
            width: '100%', background: '#18181B', 
            borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem',
            padding: '2rem 1.5rem 3rem'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, margin: '0 auto 1.5rem' }} />
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
              {editingTask ? 'Update Task' : 'New Task'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <input
                className="mobile-panel"
                style={{ width: '100%', background: '#222226', border: 'none', padding: '1.25rem' }}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                required
              />
              <textarea
                className="mobile-panel"
                style={{ width: '100%', background: '#222226', border: 'none', padding: '1.25rem', minHeight: 100 }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select 
                  className="mobile-panel"
                  style={{ background: '#222226', border: 'none', padding: '1.25rem' }}
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <select 
                  className="mobile-panel"
                  style={{ background: '#222226', border: 'none', padding: '1.25rem' }}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <button
                type="submit"
                className="mobile-btn"
                disabled={saving}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Done'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB - Using Plus button from Layout instead, or just a trigger here */}
      <div style={{ height: '1rem' }} />
    </div>
  );
};

export default MobileTasks;
