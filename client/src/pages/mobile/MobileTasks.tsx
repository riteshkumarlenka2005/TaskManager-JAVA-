import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import type { Task, TaskRequest, Status, Priority } from '../../types';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Tag,
  Trash2,
  Edit3,
  X,
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

  const formatDate = (dateArray: number[] | null): string => {
    if (!dateArray || !Array.isArray(dateArray)) return '';
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3] || 0,
      dateArray[4] || 0
    );
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filter Tabs */}
      <div className="mobile-tabs">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`mobile-tab ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task Count */}
      <p style={{ fontSize: '0.75rem', color: '#7C8B93', margin: 0, fontWeight: 600 }}>
        {filtered.length} task{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Task List */}
      {loading ? (
        <div className="mobile-spinner">
          <Loader2 style={{ width: 32, height: 32 }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mobile-empty-state">
          <div className="mobile-empty-state-icon">
            <ClipboardList style={{ width: 24, height: 24 }} />
          </div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {filter === 'ALL' ? 'No tasks yet' : `No ${filter.replace('_', ' ').toLowerCase()} tasks`}
          </p>
          <p style={{ fontSize: '0.75rem' }}>
            {filter === 'ALL' ? 'Tap the + button to create one' : 'Try a different filter'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`mobile-task-card ${task.status === 'COMPLETED' ? 'done' : ''}`}
            >
              {/* Checkbox */}
              <button
                className={`mobile-task-checkbox ${task.status === 'COMPLETED' ? 'checked' : ''}`}
                onClick={() => handleToggleComplete(task)}
              >
                {task.status === 'COMPLETED' ? (
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                ) : (
                  <Circle style={{ width: 14, height: 14 }} />
                )}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className={`mobile-task-title ${task.status === 'COMPLETED' ? 'completed' : ''}`}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {task.title}
                </div>
                <div className="mobile-task-meta">
                  {task.createdAt && (
                    <div className="mobile-task-meta-item">
                      <Clock style={{ width: 10, height: 10 }} />
                      {formatDate(task.createdAt)}
                    </div>
                  )}
                  <div
                    className={`mobile-task-meta-item mobile-priority-${task.priority.toLowerCase()}`}
                    style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                  >
                    <Tag style={{ width: 10, height: 10 }} />
                    {task.priority}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(task)}
                  style={{
                    padding: '0.4rem',
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    color: '#7C8B93',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Edit3 style={{ width: 14, height: 14 }} />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{
                    padding: '0.4rem',
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    color: '#7C8B93',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button className="mobile-fab" onClick={openCreate}>
        <Plus style={{ width: 26, height: 26 }} />
      </button>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="mobile-modal-overlay" onClick={closeModal}>
          <div className="mobile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-handle" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {editingTask ? 'Edit Task' : 'New Task'}
              </h3>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', color: '#7C8B93', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#7C8B93', marginBottom: '0.4rem' }}>
                  Title
                </label>
                <input
                  className="mobile-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#7C8B93', marginBottom: '0.4rem' }}>
                  Description
                </label>
                <textarea
                  className="mobile-input mobile-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add details..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#7C8B93', marginBottom: '0.4rem' }}>
                    Status
                  </label>
                  <select
                    className="mobile-input mobile-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#7C8B93', marginBottom: '0.4rem' }}>
                    Priority
                  </label>
                  <select
                    className="mobile-input mobile-select"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mobile-btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                ) : editingTask ? (
                  'Update Task'
                ) : (
                  'Create Task'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom spacer */}
      <div style={{ height: '1rem' }} />
    </div>
  );
};

export default MobileTasks;
