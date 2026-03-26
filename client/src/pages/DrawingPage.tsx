import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { DrawingTool } from '../types';
import {
  Pen,
  Pencil,
  Eraser,
  Palette,
  RotateCcw,
  Trash2,
  Download,
} from 'lucide-react';

const PRESET_COLORS = [
  '#FFFFFF', '#EF4444', '#F59E0B', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#5B944D',
  '#000000', '#6B7280', '#A3E635', '#FBBF24', '#F472B6',
];

const DrawingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState('#FFFFFF');
  const [size, setSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 700;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(ctx, canvas);
  }, []);

  const saveToHistory = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-30), data]);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent | Touch | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      // Prevent scrolling on touch
      if ('touches' in e) {
        if (e.cancelable) e.preventDefault();
      }

      const pos = getPos(e);
      setIsDrawing(true);
      setLastPos(pos);

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      if (tool === 'pen' || tool === 'pencil') {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = tool === 'pencil' ? 0.35 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    },
    [tool, color, size]
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !lastPos) return;

      // Prevent scrolling on touch
      if ('touches' in e) {
        if (e.cancelable) e.preventDefault();
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const pos = getPos(e);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = size;

      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.globalAlpha = tool === 'pencil' ? 0.35 : 1;
      }

      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      setLastPos(pos);
    },
    [isDrawing, lastPos, tool, color, size]
  );

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPos(null);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) saveToHistory(ctx, canvas);
  }, [isDrawing]);

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || history.length <= 1) return;
    const prev = history[history.length - 2];
    ctx.putImageData(prev, 0, 0);
    setHistory((h) => h.slice(0, -1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(ctx, canvas);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'drawing.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const tools: { key: DrawingTool; icon: React.FC<{ className?: string }>; label: string }[] = [
    { key: 'pen', icon: Pen, label: 'Pen' },
    { key: 'pencil', icon: Pencil, label: 'Pencil' },
    { key: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Drawing Canvas</h1>
          <p className="text-text-secondary">Create illustrations with pen, pencil & eraser tools.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadDrawing}
          className="btn-primary"
        >
          <Download className="w-4 h-4" /> Download PNG
        </motion.button>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-4 flex flex-wrap items-center gap-3 mb-4"
      >
        {/* Tool Buttons */}
        <div className="flex bg-white/[0.04] rounded-xl p-1 border border-white/[0.08]">
          {tools.map((t) => (
            <button
              key={t.key}
              onClick={() => setTool(t.key)}
              title={t.label}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                tool === t.key
                  ? 'bg-[#F5E6A7]/20 text-[#F5E6A7] shadow-lg shadow-[#F5E6A7]/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.06]'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-white/[0.1]" />

        {/* Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
          >
            <div className="w-5 h-5 rounded-full border-2 border-white/[0.2]" style={{ background: color }} />
            <Palette className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">Color</span>
          </button>

          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 left-0 z-50 glass-panel p-3 w-52"
              style={{ background: 'rgba(26,26,31,0.97)' }}
            >
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setShowColorPicker(false);
                    }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      color === c ? 'border-[#F5E6A7] scale-110 shadow-lg' : 'border-white/[0.1]'
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 rounded-lg cursor-pointer bg-transparent"
              />
            </motion.div>
          )}
        </div>

        <div className="w-px h-8 bg-white/[0.1]" />

        {/* Brush Size */}
        <div className="flex items-center gap-3">
          <span className="text-text-secondary text-sm">Size</span>
          <input
            type="range"
            min="1"
            max="40"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-28 accent-[#F5E6A7]"
          />
          <div
            className="rounded-full border border-white/[0.2] shrink-0"
            style={{
              width: Math.max(8, Math.min(size, 30)),
              height: Math.max(8, Math.min(size, 30)),
              background: tool === 'eraser' ? 'rgba(255,255,255,0.2)' : color,
            }}
          />
        </div>

        <div className="w-px h-8 bg-white/[0.1]" />

        {/* Actions */}
        <button onClick={undo} className="btn-outline" title="Undo">
          <RotateCcw className="w-4 h-4" /> Undo
        </button>
        <button onClick={clearCanvas} className="btn-danger" title="Clear">
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </motion.div>

      {/* Canvas */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-2 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="w-full rounded-xl cursor-crosshair touch-none"
          style={{ aspectRatio: '12/7' }}
        />
      </motion.div>
    </div>
  );
};

export default DrawingPage;
