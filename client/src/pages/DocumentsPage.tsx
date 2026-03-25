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
      const res = await api.get<Document[]>('/documents');
      setDocuments(res.data);
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
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Documents</h1>
          <p className="text-text-secondary">Create rich notes with text, images, tables & more.</p>
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
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
          <Loader2 className="w-8 h-8 text-[#E0D4FF] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-12 text-center"
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
                className="glass-panel glass-panel-hover p-5 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E0D4FF]/10 flex items-center justify-center border border-[#E0D4FF]/20">
                      <FileText className="w-5 h-5 text-[#E0D4FF]" />
                    </div>
                    <h3 className="font-semibold text-lg leading-tight">{doc.title}</h3>
                  </div>
                  <button
                    onClick={(e) => deleteDocument(doc.id, e)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-danger/10 text-text-secondary hover:text-danger transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary">
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
              className="glass-panel p-6 w-full max-w-md"
              style={{ background: 'rgba(26, 26, 31, 0.97)' }}
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
