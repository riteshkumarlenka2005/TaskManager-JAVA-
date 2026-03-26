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
    <div className="quote-block relative pl-5 py-3 border-l-[3px] border-[#E0D4FF]/50 bg-[#E0D4FF]/[0.03] rounded-r-xl">
      <Quote className="absolute top-3 right-4 w-8 h-8 text-[#E0D4FF]/10" />
      <textarea
        value={text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Write a quote..."
        className="w-full bg-transparent outline-none text-base italic text-text-primary/90 placeholder:text-text-secondary/40 resize-none leading-relaxed pr-12"
        rows={Math.max(2, text.split('\n').length)}
      />
      <input
        value={author}
        onChange={(e) => onChange({ author: e.target.value })}
        placeholder="— Author (optional)"
        className="w-full bg-transparent outline-none text-sm text-text-secondary placeholder:text-text-secondary/30 mt-1"
      />
    </div>
  );
};

export default QuoteBlock;
