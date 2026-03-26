import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import type { Document, DocumentRequest } from '../types';
import {
  Plus,
  FileText,
  Trash2,
  Clock,
  Loader2,
  X,
  Search,
} from 'lucide-react';

function formatDate(dateArray: number[] | null): string {
  if (!dateArray || !Array.isArray(dateArray)) return 'Unknown';
  const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3] || 0, dateArray[4] || 0);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await api.get<any>('/documents');
      setDocuments(Array.isArray(res.data) ? res.data : (res.data?.content || res.data?.data || []));
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const createDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const req: DocumentRequest = {
        title: newTitle,
        content: JSON.stringify([
          { id: crypto.randomUUID(), type: 'text', data: { text: '' } },
        ]),
      };
      const res = await api.post<Document>('/documents', req);
      setCreateModal(false);
      setNewTitle('');
      navigate(`/documents/${res.data.id}`);
    } catch {
      // error
    } finally {
      setCreating(false);
    }
  };

  const deleteDocument = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch {
      // error
    }
  };

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const getBlockCount = (doc: Document): number => {
    try {
      const blocks = JSON.parse(doc.content || '[]');
      return Array.isArray(blocks) ? blocks.length : 0;
    } catch {
      return 0;
    }
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
          <h1 className="mb-1 break-words text-2xl font-bold sm:text-3xl text-[#BEC4FF]">Documents</h1>
          <p className="text-[#7C8B93]">Create rich notes with text, images, tables & more.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Document
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8B93]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="input-field pl-11"
        />
      </motion.div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#BEC4FF] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex flex-col items-center p-12 text-center"
        >
          <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {search ? 'No matching documents' : 'No documents yet'}
          </h3>
          <p className="text-text-secondary mb-6">
            {search ? 'Try a different search term.' : 'Create your first document to get started.'}
          </p>
          {!search && (
            <button onClick={() => setCreateModal(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Create Document
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/documents/${doc.id}`)}
                className="glass-panel glass-panel-hover group min-w-0 cursor-pointer p-5"
              >
                <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#BEC4FF]/10 flex items-center justify-center border border-[#BEC4FF]/20">
                      <FileText className="w-5 h-5 text-[#BEC4FF]" />
                    </div>
                    <h3 className="min-w-0 flex-1 break-words text-lg font-semibold leading-tight">
                      {doc.title}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => deleteDocument(doc.id, e)}
                    className="shrink-0 rounded-lg p-2 text-text-secondary opacity-0 transition-all group-hover:opacity-100 hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-[#7C8B93]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(doc.updatedAt)}
                  </span>
                  <span>{getBlockCount(doc)} blocks</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {createModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel p-6 w-full max-w-md border-[#BEC4FF]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              style={{ background: '#12121a' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">New Document</h2>
                <button onClick={() => setCreateModal(false)} className="p-1 hover:text-[#FFFFFF] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={createDocument} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Document Title</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="input-field"
                    placeholder="Enter document title..."
                    required
                    autoFocus
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={creating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Document'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsPage;
