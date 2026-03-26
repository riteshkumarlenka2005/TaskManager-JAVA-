import React, { useRef } from 'react';
import type { Block } from '../../types';
import { Upload, Music, Video } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const MediaBlock: React.FC<Props> = ({ block, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const url = block.data.url as string;
  const mediaType = block.type as 'audio' | 'video';
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

  const Icon = mediaType === 'audio' ? Music : Video;
  const acceptType = mediaType === 'audio' ? 'audio/*' : 'video/*';

  if (!url) {
    return (
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[#00FF9C]/20 rounded-xl p-10 text-center cursor-pointer hover:border-[#00FF9C]/50 hover:bg-[#00FF9C]/05 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
      >
        <input ref={fileRef} type="file" accept={acceptType} onChange={handleFile} className="hidden" />
        <Icon className="w-10 h-10 text-[#7C8B93] mx-auto mb-3" />
        <p className="text-[#A8FFDF] text-sm">Click to upload {mediaType}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl glass-panel border-[#00FFC6]/20 p-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="rounded-lg overflow-hidden border border-white/05 bg-black/20">
        {mediaType === 'audio' ? (
          <audio controls src={url} className="w-full h-11" />
        ) : (
          <video controls src={url} className="w-full block" />
        )}
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
          className="text-[10px] uppercase tracking-wider font-bold text-[#7C8B93] hover:text-[#00FFC6] transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#00FFC6]/10"
        >
          <Upload className="w-3 h-3" /> Replace
        </button>
        <input ref={fileRef} type="file" accept={acceptType} onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
};

export default MediaBlock;
