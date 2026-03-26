import React from 'react';
import type { Block, ChecklistItem } from '../../types';
import { Plus, X } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const ChecklistBlock: React.FC<Props> = ({ block, onChange }) => {
  const items: ChecklistItem[] = (block.data.items as ChecklistItem[]) || [];

  const updateItems = (newItems: ChecklistItem[]) => {
    onChange({ items: newItems });
  };

  const toggleItem = (id: string) => {
    updateItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const updateText = (id: string, text: string) => {
    updateItems(items.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const addItem = () => {
    updateItems([
      ...items,
      { id: crypto.randomUUID(), text: '', checked: false },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    updateItems(items.filter((item) => item.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        text: '',
        checked: false,
      };
      const newItems = [...items];
      newItems.splice(index + 1, 0, newItem);
      updateItems(newItems);
      // Focus next input after render
      setTimeout(() => {
        const inputs = document.querySelectorAll(
          `[data-checklist-block="${block.id}"] input[type="text"]`
        );
        (inputs[index + 1] as HTMLInputElement)?.focus();
      }, 50);
    }
    if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) {
      e.preventDefault();
      removeItem(items[index].id);
      setTimeout(() => {
        const inputs = document.querySelectorAll(
          `[data-checklist-block="${block.id}"] input[type="text"]`
        );
        const focusIndex = Math.max(0, index - 1);
        (inputs[focusIndex] as HTMLInputElement)?.focus();
      }, 50);
    }
  };

  return (
    <div className="checklist-block space-y-1" data-checklist-block={block.id}>
      {items.map((item, index) => (
        <div key={item.id} className="group flex items-center gap-3 py-1 px-2 -mx-2 rounded-lg hover:bg-white/[0.02] transition-colors">
          <button
            onClick={() => toggleItem(item.id)}
            className={`w-[18px] h-[18px] shrink-0 rounded-[5px] border-2 transition-all flex items-center justify-center ${
              item.checked
                ? 'bg-[#E0D4FF] border-[#E0D4FF] text-[#0C0C0C]'
                : 'border-white/[0.2] hover:border-[#E0D4FF]/50'
            }`}
          >
            {item.checked && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateText(item.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder="To-do item..."
            className={`flex-1 bg-transparent outline-none text-sm transition-all placeholder:text-text-secondary/30 ${
              item.checked ? 'line-through text-text-secondary/50' : 'text-text-primary/90'
            }`}
          />
          <button
            onClick={() => removeItem(item.id)}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-secondary hover:text-danger transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-2 text-xs text-text-secondary/50 hover:text-[#E0D4FF] transition-colors py-1.5 px-2"
      >
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>
    </div>
  );
};

export default ChecklistBlock;
