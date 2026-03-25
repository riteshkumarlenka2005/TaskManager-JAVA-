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
        className="border-2 border-dashed border-white/[0.1] rounded-xl p-10 text-center cursor-pointer hover:border-[#E0D4FF]/40 hover:bg-[#E0D4FF]/5 transition-all"
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <ImageIcon className="w-10 h-10 text-text-secondary mx-auto mb-3" />
        <p className="text-text-secondary text-sm">Click to upload an image</p>
        <p className="text-text-secondary/50 text-xs mt-1">PNG, JPG, GIF, SVG</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden">
      <img
        src={url}
        alt={caption || 'Image'}
        className="max-w-full rounded-xl border border-white/[0.08]"
      />
      <input
        value={caption}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="Add a caption..."
        className="w-full mt-2 bg-transparent border-none outline-none text-sm text-text-secondary placeholder:text-text-secondary/50 px-1"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs text-text-secondary hover:text-[#E0D4FF] transition-colors flex items-center gap-1"
        >
          <Upload className="w-3 h-3" /> Replace
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
};

export default ImageBlock;
