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
  Calendar,
} from 'lucide-react';

const statusColors: Record<Status, string> = {
  PENDING: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  IN_PROGRESS: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  COMPLETED: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
};

const priorityStyles: Record<Priority, string> = {
  LOW: 'bg-gray-500/10 text-gray-400',
  MEDIUM: 'bg-blue-500/10 text-blue-400',
  HIGH: 'bg-[#BEC4FF]/20 text-[#BEC4FF] ring-1 ring-[#BEC4FF]/30',
};

function formatDate(dateArray: number[] | null): string {
  if (!dateArray || !Array.isArray(dateArray)) return 'Just now';
  try {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3] || 0,
      dateArray[4] || 0
    );
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
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
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Workspace</h1>
          <p className="text-[#7C8B93] text-lg font-medium">Manage and organize your projects with ease.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 px-8 py-4 text-black bg-[#BEC4FF] hover:bg-[#D6DAFF] rounded-2xl font-bold transition-all shadow-xl shadow-[#BEC4FF]/10">
          <Plus className="w-5 h-5" />
          Create New Task
        </button>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Active', value: stats.inProgress, color: 'text-blue-400' },
          { label: 'Pending', value: stats.pending, color: 'text-orange-400' },
          { label: 'Done', value: stats.completed, color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-6 border-none bg-[#18181B]">
            <p className="text-sm font-bold text-[#7C8B93] mb-1 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-[#BEC4FF] animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel text-center py-24 border-dashed border-2 border-white/5">
          <ClipboardList className="w-16 h-16 text-[#7C8B93] mx-auto mb-6 opacity-30" />
          <h3 className="text-2xl font-bold mb-2">Empty Workspace</h3>
          <p className="text-[#7C8B93] mb-8 max-w-xs mx-auto">No tasks found in your workspace yet. Start by creating one!</p>
          <button onClick={openCreate} className="btn-outline border-[#BEC4FF] text-[#BEC4FF] px-8 py-3 rounded-xl font-bold">
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-panel p-6 flex flex-col gap-4 border-none bg-[#18181B] group hover:bg-[#222226] relative overflow-hidden`}
              >
                {/* Priority Indicator */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: task.priority === 'HIGH' ? '#BEC4FF' : 'transparent' }} />
                
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${priorityStyles[task.priority]}`}>
                    {task.priority}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(task)} className="p-2 rounded-xl hover:bg-white/10 text-[#7C8B93] hover:text-white transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 rounded-xl hover:bg-red-500/10 text-[#7C8B93] hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${task.status === 'COMPLETED' ? 'line-through opacity-40' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-[#7C8B93] line-clamp-2 min-h-[2.5rem]">
                    {task.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#7C8B93]">
                    <Clock className="w-3 h-3" />
                    {formatDate(task.createdAt)}
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal - Redesigned Modal for SaaS Theme */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#18181B] rounded-[32px] p-8 w-full max-w-xl shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black tracking-tight">{editingTask ? 'Edit Task' : 'New Task'}</h2>
                <button onClick={closeModal} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#7C8B93] mb-2">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#222226] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#BEC4FF] transition-all"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#7C8B93] mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-[#222226] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#BEC4FF] transition-all resize-none"
                    placeholder="Add more context..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[#7C8B93] mb-2">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                      className="w-full bg-[#222226] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#BEC4FF] transition-all"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[#7C8B93] mb-2">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                      className="w-full bg-[#222226] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#BEC4FF] transition-all"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#BEC4FF] hover:bg-[#D6DAFF] text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-[#BEC4FF]/10 mt-4 h-14 flex items-center justify-center"
                >
                  {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : editingTask ? 'Update Task' : 'Confirm'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
