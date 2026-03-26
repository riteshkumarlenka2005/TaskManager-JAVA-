import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { Block, DrawingTool } from '../../types';
import {
  Pen,
  Pencil,
  Eraser,
  Minus,
  Palette,
  Save,
  RotateCcw,
} from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const PRESET_COLORS = [
  '#FFFFFF', '#EF4444', '#F59E0B', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#5B944D',
  '#000000', '#6B7280', '#475569',
];

const DrawingBlock: React.FC<Props> = ({ block, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState('#FFFFFF');
  const [size, setSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const existingDataUrl = block.data.dataUrl as string;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Deep cyber background
    ctx.fillStyle = '#05070A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load existing drawing if any
    if (existingDataUrl) {
      const img = new window.Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveToHistory(ctx, canvas);
      };
      img.src = existingDataUrl;
    } else {
      saveToHistory(ctx, canvas);
    }
  }, []);

  const saveToHistory = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-20), data]);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getPos(e);
      setIsDrawing(true);
      setLastPos(pos);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      if (tool === 'pen' || tool === 'pencil') {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = tool === 'pencil' ? 0.4 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    },
    [tool, color, size]
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !lastPos) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const pos = getPos(e);

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = size;

      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.globalAlpha = 1;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.globalAlpha = tool === 'pencil' ? 0.4 : 1;
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
    if (ctx && canvas) {
      saveToHistory(ctx, canvas);
    }
  }, [isDrawing]);

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange({ dataUrl, width: canvas.width, height: canvas.height });
  };

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
    ctx.fillStyle = '#05070A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(ctx, canvas);
  };

  const tools: { key: DrawingTool; icon: React.FC<{ className?: string }>; label: string }[] = [
    { key: 'pen', icon: Pen, label: 'Pen' },
    { key: 'pencil', icon: Pencil, label: 'Pencil' },
    { key: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  return (
    <div className="rounded-xl">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Tool Selection */}
        <div className="flex bg-[#05070A]/50 rounded-lg p-0.5 border border-[#00FF9C]/20">
          {tools.map((t) => (
            <button
              key={t.key}
              onClick={() => setTool(t.key)}
              title={t.label}
              className={`p-2 rounded-md transition-all ${
                tool === t.key
                  ? 'bg-[#00FF9C]/20 text-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.2)]'
                  : 'text-[#7C8B93] hover:text-[#A8FFDF] hover:bg-[#00FF9C]/10'
              }`}
            >
              <t.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/[0.1]" />

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#05070A]/50 border border-[#00FF9C]/20 hover:bg-[#00FF9C]/10 transition-all"
          >
            <div className="w-4 h-4 rounded-full border border-white/[0.2]" style={{ background: color }} />
            <Palette className="w-3.5 h-3.5 text-[#7C8B93]" />
          </button>

          {showColorPicker && (
            <div className="absolute top-full mt-2 left-0 z-50 glass-panel p-3 grid grid-cols-5 gap-1.5 w-44 border-[#00FF9C]/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]" style={{ background: '#0A0F14' }}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setShowColorPicker(false);
                  }}
                  className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                    color === c ? 'border-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.4)] scale-110' : 'border-white/[0.1]'
                  }`}
                  style={{ background: c }}
                />
              ))}
              <div className="col-span-5 mt-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-white/[0.1]" />

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-[#7C8B93] text-xs">Size</span>
          <input
            type="range"
            min="1"
            max="30"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-20 accent-[#00FF9C]"
          />
          <span className="text-[#7C8B93] text-xs w-6 text-right">{size}</span>
        </div>

        <div className="w-px h-6 bg-white/[0.1]" />

        {/* Actions */}
        <button onClick={undo} className="btn-outline text-xs py-1.5 px-2.5" title="Undo">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button onClick={clearCanvas} className="btn-outline text-xs py-1.5 px-2.5 text-warning border-warning/30" title="Clear">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button onClick={saveDrawing} className="btn-primary text-xs py-1.5 px-3">
          <Save className="w-3.5 h-3.5" /> Save
        </button>
      </div>

      {/* Canvas */}
      <div className="rounded-xl border border-[#00FF9C]/20 overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          className="w-full cursor-crosshair opacity-90 hover:opacity-100 transition-opacity"
          style={{ aspectRatio: '2/1' }}
        />
      </div>
    </div>
  );
};

export default DrawingBlock;
