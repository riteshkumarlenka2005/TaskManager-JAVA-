import React, { useRef } from 'react';
import type { Block } from '../../types';
import { Upload, ImageIcon } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const ImageBlock: React.FC<Props> = ({ block, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const url = block.data.url as string;
  const caption = (block.data.caption as string) || '';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (!url) {
    return (
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[#00FF9C]/20 rounded-xl p-10 text-center cursor-pointer hover:border-[#00FF9C]/50 hover:bg-[#00FF9C]/05 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <ImageIcon className="w-10 h-10 text-[#7C8B93] mx-auto mb-3" />
        <p className="text-[#A8FFDF] text-sm font-medium">Click to upload an image</p>
        <p className="text-[#7C8B93]/50 text-xs mt-1 font-mono uppercase tracking-widest">PNG, JPG, GIF, SVG</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden glass-panel border-[#00FF9C]/20 p-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="relative group/img rounded-lg overflow-hidden border border-white/05">
        <img
          src={url}
          alt={caption || 'Image'}
          className="max-w-full block transition-transform duration-500 group-hover/img:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <input
        value={caption}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="Add a caption..."
        className="w-full mt-3 bg-transparent border-none outline-none text-sm text-[#A8FFDF] placeholder:text-[#7C8B93]/40 px-2 font-medium italic"
      />
      <div className="flex gap-2 mt-2 px-1">
        <button
          onClick={() => fileRef.current?.click()}
          className="text-[10px] uppercase tracking-wider font-bold text-[#7C8B93] hover:text-[#00FF9C] transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#00FF9C]/10"
        >
          <Upload className="w-3 h-3" /> Replace
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
};

export default ImageBlock;
