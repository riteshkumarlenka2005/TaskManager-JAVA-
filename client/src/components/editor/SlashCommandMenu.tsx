import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type, Heading1, Heading2, Image, Table, Paintbrush,
  Music, Video, Minus, Code, Quote, CheckSquare, AlertCircle,
} from 'lucide-react';

interface SlashOption {
  type: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  description: string;
  data?: Record<string, unknown>;
}

const SLASH_OPTIONS: SlashOption[] = [
  { type: 'text', icon: Type, label: 'Text', description: 'Plain text block' },
  { type: 'heading', icon: Heading1, label: 'Heading 1', description: 'Large heading', data: { text: '', level: 1 } },
  { type: 'heading', icon: Heading2, label: 'Heading 2', description: 'Medium heading', data: { text: '', level: 2 } },
  { type: 'image', icon: Image, label: 'Image', description: 'Upload an image' },
  { type: 'video', icon: Video, label: 'Video', description: 'Upload or embed video' },
  { type: 'audio', icon: Music, label: 'Audio', description: 'Upload audio file' },
  { type: 'code', icon: Code, label: 'Code', description: 'Code with syntax highlighting' },
  { type: 'quote', icon: Quote, label: 'Quote', description: 'Blockquote' },
  { type: 'checklist', icon: CheckSquare, label: 'Checklist', description: 'To-do list' },
  { type: 'callout', icon: AlertCircle, label: 'Callout', description: 'Info/warning box' },
  { type: 'table', icon: Table, label: 'Table', description: 'Data table with merge' },
  { type: 'drawing', icon: Paintbrush, label: 'Drawing', description: 'Freehand canvas' },
  { type: 'divider', icon: Minus, label: 'Divider', description: 'Horizontal line' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string, data?: Record<string, unknown>) => void;
  position?: { top: number; left: number };
}

const SlashCommandMenu: React.FC<Props> = ({ isOpen, onClose, onSelect, position }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SLASH_OPTIONS.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelect(filtered[selectedIndex].type, filtered[selectedIndex].data);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute z-[60] w-72 glass-panel shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden border-[#00FF9C]/30"
          style={{
            top: position?.top ?? 'auto',
            left: position?.left ?? 0,
            background: '#0A0F14',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Search */}
          <div className="p-2 border-b border-[#00FF9C]/10">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search blocks..."
              className="w-full bg-[#05070A]/50 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-[#7C8B93]/40 text-[#A8FFDF] border border-[#00FF9C]/10 focus:border-[#00FF9C]/40 transition-colors"
            />
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="text-center py-6 text-text-secondary text-sm">
                No matching blocks
              </div>
            ) : (
              filtered.map((opt, i) => (
                <button
                  key={`${opt.type}-${opt.label}`}
                  onClick={() => {
                    onSelect(opt.type, opt.data);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    i === selectedIndex
                      ? 'bg-[#00FF9C]/10 text-[#A8FFDF] cyber-glow'
                      : 'text-[#7C8B93] hover:bg-[#00FF9C]/05'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                      i === selectedIndex
                        ? 'bg-[#00FF9C]/15 border-[#00FF9C]/40 text-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.3)]'
                        : 'bg-[#05070A]/30 border-[#00FF9C]/10'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-[#7C8B93]/60 truncate">{opt.description}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlashCommandMenu;
