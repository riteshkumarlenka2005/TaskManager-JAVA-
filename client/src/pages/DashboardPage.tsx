import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import type { Task, TaskRequest, Status, Priority } from '../types';
import {
  Plus,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit3,
  X,
  Loader2,
} from 'lucide-react';

const statusColors: Record<Status, string> = {
  PENDING: 'bg-warning/10 text-warning border-warning/20',
  IN_PROGRESS: 'bg-[#00FFC6]/10 text-[#00FFC6] border-[#00FFC6]/20',
  COMPLETED: 'bg-[#00FF9C]/10 text-[#00FF9C] border-[#00FF9C]/20',
};

const priorityColors: Record<Priority, string> = {
  LOW: 'border-l-[#4F5B62]',
  MEDIUM: 'border-l-warning shadow-[inset_4px_0_10px_-4px_rgba(255,173,0,0.3)]',
  HIGH: 'border-l-danger shadow-[inset_4px_0_10px_-4px_rgba(255,62,62,0.3)]',
};

function formatDate(dateArray: number[] | null): string {
  if (!dateArray || !Array.isArray(dateArray)) return 'Unknown';
  const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3] || 0, dateArray[4] || 0);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskRequest>({
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
  });
  const [saving, setSaving] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<any>('/tasks');
      setTasks(Array.isArray(res.data) ? res.data : (res.data?.content || res.data?.data || []));
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return (
    <div className="min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex min-w-0 flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center"
      >
        <div className="min-w-0">
          <h1 className="mb-1! break-words text-2xl font-bold sm:text-3xl text-[#A8FFDF]">My Dashboard</h1>
          <p className="text-[#7C8B93]">Manage and track your tasks effectively.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreate}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Task
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8!"
      >
        {[
          { label: 'Total Tasks', value: stats.total, icon: ClipboardList, color: 'text-[#A8FFDF]' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-warning' },
          { label: 'In Progress', value: stats.inProgress, icon: AlertTriangle, color: 'text-[#00FFC6]' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-[#00FF9C]' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-panel glass-panel-hover min-w-0 cursor-default p-5!"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="min-w-0 break-words text-sm text-[#7C8B93]">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} style={{ filter: stat.color !== 'text-[#A8FFDF]' ? 'drop-shadow(0 0 5px currentColor)' : '' }} />
            </div>
            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#00FF9C] animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex flex-col items-center p-12 text-center"
        >
          <ClipboardList className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
          <p className="text-text-secondary mb-6">Create your first task to get started.</p>
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-panel glass-panel-hover min-w-0 border-l-4 p-5 ${priorityColors[task.priority]}`}
              >
                <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
                  <h3 className="min-w-0 flex-1 break-words text-lg font-semibold leading-tight">
                    {task.title}
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="mb-4 break-words text-sm text-text-secondary line-clamp-2">
                  {task.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(task.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(task)}
                      className="p-2 rounded-lg hover:bg-white/[0.05] text-text-secondary hover:text-[#FFFFFF] transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 rounded-lg hover:bg-danger/10 text-text-secondary hover:text-danger transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel p-6 w-full max-w-lg border-[#00FF9C]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              style={{ background: '#0A0F14' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                <button onClick={closeModal} className="p-1 hover:text-[#FFFFFF] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="What needs to be done?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field resize-y min-h-[80px]"
                    placeholder="Add some details..."
                    rows={3}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                      className="input-field"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                      className="input-field"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingTask ? 'Update Task' : 'Create Task'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
