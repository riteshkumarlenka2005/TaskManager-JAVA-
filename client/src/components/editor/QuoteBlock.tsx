import React from 'react';
import type { Block } from '../../types';
import { Quote } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const QuoteBlock: React.FC<Props> = ({ block, onChange }) => {
  const text = (block.data.text as string) || '';
  const author = (block.data.author as string) || '';

  return (
    <div className="quote-block relative pl-5 py-3 border-l-[3px] border-[#00FF9C]/40 bg-[#00FF9C]/[0.05] rounded-r-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
      <Quote className="absolute top-3 right-4 w-8 h-8 text-[#00FF9C]/10" />
      <textarea
        value={text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Write a quote..."
        className="w-full bg-transparent outline-none text-base italic text-[#A8FFDF]/90 placeholder:text-[#7C8B93]/40 resize-none leading-relaxed pr-12"
        rows={Math.max(2, text.split('\n').length)}
      />
      <input
        value={author}
        onChange={(e) => onChange({ author: e.target.value })}
        placeholder="— Author (optional)"
        className="w-full bg-transparent outline-none text-sm text-[#7C8B93] placeholder:text-[#7C8B93]/30 mt-1"
      />
    </div>
  );
};

export default QuoteBlock;
