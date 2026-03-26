import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { downloadHtml } from '../services/htmlExporter';
import type { Block, Document as DocType } from '../types';
import {
  ArrowLeft,
  Save,
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
  Code,
  Quote,
  CheckSquare,
  AlertCircle,
  FileCode2,
  FileText,
} from 'lucide-react';
import TextBlock from '../components/editor/TextBlock.tsx';
import ImageBlock from '../components/editor/ImageBlock.tsx';
import TableBlock from '../components/editor/TableBlock.tsx';
import MediaBlock from '../components/editor/MediaBlock.tsx';
import DrawingBlock from '../components/editor/DrawingBlock.tsx';
import CodeBlock from '../components/editor/CodeBlock.tsx';
import QuoteBlock from '../components/editor/QuoteBlock.tsx';
import ChecklistBlock from '../components/editor/ChecklistBlock.tsx';
import CalloutBlock from '../components/editor/CalloutBlock.tsx';
import SlashCommandMenu from '../components/editor/SlashCommandMenu.tsx';
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
  { type: 'code', icon: Code, label: 'Code' },
  { type: 'quote', icon: Quote, label: 'Quote' },
  { type: 'checklist', icon: CheckSquare, label: 'Checklist' },
  { type: 'callout', icon: AlertCircle, label: 'Callout' },
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
  const [exportingHtml, setExportingHtml] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Drag & drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // Slash command state
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuBlockIndex, setSlashMenuBlockIndex] = useState<number | null>(null);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDocument();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        handleExportHtml();
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
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

  const getDefaultData = (type: string): Record<string, unknown> => {
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
      code: { code: '', language: 'javascript' },
      quote: { text: '', author: '' },
      checklist: {
        items: [
          { id: crypto.randomUUID(), text: '', checked: false },
        ],
      },
      callout: { type: 'info', text: '' },
      divider: {},
    };
    return defaults[type] || {};
  };

  const addBlock = (type: string, afterIndex: number, customData?: Record<string, unknown>) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type: type as Block['type'],
      data: customData || getDefaultData(type),
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

  // Drag & Drop handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
  };

  const handleDragEnd = () => {
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      setBlocks((prev) => {
        const next = [...prev];
        const [dragged] = next.splice(dragIndex, 1);
        next.splice(dropIndex, 0, dragged);
        return next;
      });
      triggerAutoSave();
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  // Slash command handler
  const handleSlashCommand = (blockIndex: number) => {
    setSlashMenuBlockIndex(blockIndex);
    setSlashMenuOpen(true);
  };

  const handleSlashSelect = (type: string, data?: Record<string, unknown>) => {
    if (slashMenuBlockIndex !== null) {
      addBlock(type, slashMenuBlockIndex, data);
    }
    setSlashMenuOpen(false);
    setSlashMenuBlockIndex(null);
  };

  // Export handlers
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

  const handleExportHtml = () => {
    setExportingHtml(true);
    try {
      downloadHtml(title, blocks);
    } finally {
      setTimeout(() => setExportingHtml(false), 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#00FF9C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={() => navigate('/documents')}
            className="p-2 rounded-lg hover:bg-[#00FF9C]/10 text-[#7C8B93] hover:text-[#00FF9C] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              triggerAutoSave();
            }}
            className="w-full min-w-0 flex-1 bg-transparent text-xl font-bold outline-none placeholder:text-[#7C8B93] text-[#A8FFDF] sm:max-w-md sm:text-2xl"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[#00FF9C] text-sm flex items-center gap-1"
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
            onClick={handleExportHtml}
            disabled={exportingHtml}
            className="btn-outline"
            title="Export as self-contained HTML (Ctrl+Shift+E)"
          >
            {exportingHtml ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode2 className="w-4 h-4" />}
            HTML
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            disabled={exporting}
            className="btn-primary"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Editor Content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel min-w-0 min-h-[600px] p-6 lg:p-10"
      >
        <AnimatePresence mode="popLayout">
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: dragIndex === index ? 0.4 : 1,
                y: 0,
                scale: dragIndex === index ? 0.98 : 1,
              }}
              exit={{ opacity: 0, height: 0 }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative mb-2 ${
                dropIndex === index && dragIndex !== index
                  ? 'before:absolute before:left-0 before:right-0 before:-top-1 before:h-0.5 before:bg-[#00FF9C] before:rounded-full before:shadow-[0_0_8px_rgba(0,255,156,0.4)]'
                  : ''
              }`}
            >
              {/* Block Controls */}
              <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
                 <button
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-[#00FF9C]/10 text-[#7C8B93] hover:text-[#00FF9C] disabled:opacity-20 transition-all"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <div
                  className="text-[#7C8B93] cursor-grab active:cursor-grabbing p-1 hover:bg-[#00FF9C]/10 rounded transition-all"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
                <button
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 rounded hover:bg-[#00FF9C]/10 text-[#7C8B93] hover:text-[#00FF9C] disabled:opacity-20 transition-all"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delete Button */}
              {blocks.length > 1 && (
                 <button
                  onClick={() => deleteBlock(block.id)}
                  className="absolute -right-10 top-1 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#FF3E3E]/10 text-[#7C8B93] hover:text-[#FF3E3E] transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Block Content */}
              {block.type === 'text' && (
                <TextBlock
                  block={block}
                  onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)}
                  onSlashCommand={() => handleSlashCommand(index)}
                />
              )}
              {block.type === 'heading' && (
                <TextBlock
                  block={block}
                  onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)}
                  isHeading
                />
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
              {block.type === 'code' && (
                <CodeBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'quote' && (
                <QuoteBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'checklist' && (
                <ChecklistBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'callout' && (
                <CalloutBlock block={block} onChange={(data: Record<string, unknown>) => updateBlock(block.id, data)} />
              )}
              {block.type === 'divider' && (
                 <div className="py-4">
                  <hr className="border-[#00FF9C]/10" />
                </div>
              )}

              {/* Slash Command Menu */}
              {slashMenuOpen && slashMenuBlockIndex === index && (
                <SlashCommandMenu
                  isOpen={true}
                  onClose={() => {
                    setSlashMenuOpen(false);
                    setSlashMenuBlockIndex(null);
                  }}
                  onSelect={handleSlashSelect}
                  position={{ top: 40, left: 0 }}
                />
              )}

              {/* Add Block Button */}
              <div className="relative flex justify-center -mb-1 mt-1">
                 <button
                  onClick={() => setShowBlockMenu(showBlockMenu === index ? null : index)}
                  className="p-1 rounded-full bg-[#00FF9C]/10 text-[#00FF9C] opacity-0 group-hover:opacity-100 border border-[#00FF9C]/20 cyber-glow hover:bg-[#00FF9C]/20 transition-all"
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
                      className="absolute top-8 z-50 glass-panel p-2 grid grid-cols-3 gap-1 w-80 border-[#00FF9C]/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                      style={{ background: '#0A0F14' }}
                    >
                      {blockOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => addBlock(opt.type, index, opt.data)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-[#00FF9C]/10 text-[#7C8B93] hover:text-[#A8FFDF] transition-all text-xs"
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

      {/* Keyboard Shortcut Hint */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-secondary/40 justify-center">
        <span>Ctrl+S to save</span>
        <span>Ctrl+Shift+E to export HTML</span>
        <span>Type "/" for block commands</span>
        <span>Drag blocks to reorder</span>
      </div>
    </div>
  );
};

export default DocumentEditorPage;
