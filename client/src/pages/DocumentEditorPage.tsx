import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import type { Block, Document as DocType } from '../types';
import {
  ArrowLeft,
  Save,
  Download,
  Plus,
  Type,
  Heading1,
  Heading2,
  Image,
  Table,
  Paintbrush,
  Music,
  Video,
  Minus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Loader2,
  Check,
} from 'lucide-react';
import TextBlock from '../components/editor/TextBlock.tsx';
import ImageBlock from '../components/editor/ImageBlock.tsx';
import TableBlock from '../components/editor/TableBlock.tsx';
import MediaBlock from '../components/editor/MediaBlock.tsx';
import DrawingBlock from '../components/editor/DrawingBlock.tsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const blockOptions = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'heading', icon: Heading1, label: 'Heading 1', data: { text: '', level: 1 } },
  { type: 'heading', icon: Heading2, label: 'Heading 2', data: { text: '', level: 2 } },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'table', icon: Table, label: 'Table' },
  { type: 'drawing', icon: Paintbrush, label: 'Drawing' },
  { type: 'audio', icon: Music, label: 'Audio' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'divider', icon: Minus, label: 'Divider' },
];

const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<DocType | null>(null);
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchDocument = useCallback(async () => {
    try {
      const res = await api.get<DocType>(`/documents/${id}`);
      setDoc(res.data);
      setTitle(res.data.title);
      try {
        const parsed = JSON.parse(res.data.content || '[]');
        setBlocks(Array.isArray(parsed) ? parsed : []);
      } catch {
        setBlocks([{ id: crypto.randomUUID(), type: 'text', data: { text: '' } }]);
      }
    } catch {
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const saveDocument = useCallback(async () => {
    if (!doc) return;
    setSaving(true);
    try {
      await api.put(`/documents/${doc.id}`, {
        title,
        content: JSON.stringify(blocks),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error
    } finally {
      setSaving(false);
    }
  }, [doc, title, blocks]);

  // Auto-save
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveDocument();
    }, 3000);
  }, [saveDocument]);

  const updateBlock = useCallback(
    (blockId: string, data: Record<string, unknown>) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, data: { ...b.data, ...data } } : b))
      );
      triggerAutoSave();
    },
    [triggerAutoSave]
  );

  const addBlock = (type: string, afterIndex: number, customData?: Record<string, unknown>) => {
    const defaults: Record<string, Record<string, unknown>> = {
      text: { text: '' },
      heading: { text: '', level: 1 },
      image: { url: '', caption: '' },
      table: {
        rows: [
          [
            { content: '', rowSpan: 1, colSpan: 1 },
            { content: '', rowSpan: 1, colSpan: 1 },
            { content: '', rowSpan: 1, colSpan: 1 },
          ],
          [
            { content: '', rowSpan: 1, colSpan: 1 },
            { content: '', rowSpan: 1, colSpan: 1 },
            { content: '', rowSpan: 1, colSpan: 1 },
          ],
          [
            { content: '', rowSpan: 1, colSpan: 1 },
            { content: '', rowSpan: 1, colSpan: 1 },
            { content: '', rowSpan: 1, colSpan: 1 },
          ],
        ],
      },
      drawing: { dataUrl: '', width: 800, height: 400 },
      audio: { url: '', type: 'audio', caption: '' },
      video: { url: '', type: 'video', caption: '' },
      divider: {},
    };

    const newBlock: Block = {
      id: crypto.randomUUID(),
      type: type as Block['type'],
      data: customData || defaults[type] || {},
    };

    setBlocks((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newBlock);
      return next;
    });
    setShowBlockMenu(null);
    triggerAutoSave();
  };

  const deleteBlock = (blockId: string) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    triggerAutoSave();
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    setBlocks((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
    triggerAutoSave();
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#0C0C0C',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${title || 'document'}.pdf`);
    } catch {
      // error
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#E0D4FF] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/documents')}
            className="p-2 rounded-xl hover:bg-white/[0.08] text-text-secondary hover:text-text-primary transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              triggerAutoSave();
            }}
            className="text-xl sm:text-2xl font-bold bg-transparent border-none outline-none placeholder:text-text-secondary w-full max-w-xs sm:max-w-md"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[#CDEAC0] text-sm flex items-center gap-1"
            >
              <Check className="w-4 h-4" /> Saved
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveDocument}
            disabled={saving}
            className="btn-outline"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            disabled={exporting}
            className="btn-primary"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Editor Content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 lg:p-10 min-h-[600px]"
      >
        <AnimatePresence mode="popLayout">
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="group relative mb-2"
            >
              {/* Block Controls */}
              <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
                <button
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-white/[0.08] text-text-secondary hover:text-text-primary disabled:opacity-20 transition-all"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <div className="text-text-secondary cursor-grab">
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
                <button
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 rounded hover:bg-white/[0.08] text-text-secondary hover:text-text-primary disabled:opacity-20 transition-all"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delete Button */}
              {blocks.length > 1 && (
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="absolute -right-10 top-1 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger/10 text-text-secondary hover:text-danger transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Block Content */}
              {block.type === 'text' && (
                <TextBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'heading' && (
                <TextBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} isHeading />
              )}
              {block.type === 'image' && (
                <ImageBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'table' && (
                <TableBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'drawing' && (
                <DrawingBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {(block.type === 'audio' || block.type === 'video') && (
                <MediaBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'divider' && (
                <div className="py-4">
                  <hr className="border-white/[0.1]" />
                </div>
              )}

              {/* Add Block Button */}
              <div className="relative flex justify-center -mb-1 mt-1">
                <button
                  onClick={() => setShowBlockMenu(showBlockMenu === index ? null : index)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-[#E0D4FF]/20 text-[#E0D4FF] hover:bg-[#E0D4FF]/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Block Type Menu */}
                <AnimatePresence>
                  {showBlockMenu === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      className="absolute top-8 z-50 glass-panel p-2 grid grid-cols-3 gap-1 w-72"
                      style={{ background: 'rgba(26, 26, 31, 0.95)' }}
                    >
                      {blockOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => addBlock(opt.type, index, opt.data)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/[0.08] text-text-secondary hover:text-text-primary transition-all text-xs"
                        >
                          <opt.icon className="w-5 h-5" />
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DocumentEditorPage;
