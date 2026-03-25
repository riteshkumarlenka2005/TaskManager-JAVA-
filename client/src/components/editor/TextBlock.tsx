import React, { useRef, useEffect } from 'react';
import type { Block } from '../../types';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
  isHeading?: boolean;
}

const TextBlock: React.FC<Props> = ({ block, onChange, isHeading }) => {
  const ref = useRef<HTMLDivElement>(null);
  const level = (block.data.level as number) || 1;

  useEffect(() => {
    if (ref.current && ref.current.textContent !== (block.data.text as string)) {
      ref.current.textContent = (block.data.text as string) || '';
    }
  }, []);

  const handleInput = () => {
    if (ref.current) {
      onChange({ text: ref.current.textContent || '' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isHeading) {
      e.preventDefault();
    }
  };

  const baseClass =
    'w-full outline-none py-1 rounded-lg transition-colors focus:bg-white/[0.02] px-2 -mx-2';

  if (isHeading) {
    const sizes: Record<number, string> = {
      1: 'text-3xl font-bold',
      2: 'text-2xl font-semibold',
      3: 'text-xl font-medium',
    };
    return (
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={`Heading ${level}`}
        className={`${baseClass} ${sizes[level] || sizes[1]}`}
      />
    );
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      data-placeholder="Type something..."
      className={`${baseClass} text-base leading-relaxed text-text-primary/90`}
    />
  );
};

export default TextBlock;
