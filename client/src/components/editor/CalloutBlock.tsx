import React, { useState } from 'react';
import type { Block, CalloutType } from '../../types';
import { Info, AlertTriangle, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const CALLOUT_CONFIG: Record<CalloutType, { icon: React.FC<{ className?: string }>; emoji: string; bg: string; border: string; text: string }> = {
  info: { icon: Info, emoji: 'ℹ️', bg: 'bg-blue-500/[0.06]', border: 'border-blue-400/30', text: 'text-blue-300' },
  warning: { icon: AlertTriangle, emoji: '⚠️', bg: 'bg-amber-500/[0.06]', border: 'border-amber-400/30', text: 'text-amber-300' },
  success: { icon: CheckCircle, emoji: '✅', bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-400/30', text: 'text-emerald-300' },
  error: { icon: XCircle, emoji: '🚫', bg: 'bg-red-500/[0.06]', border: 'border-red-400/30', text: 'text-red-300' },
};

const CalloutBlock: React.FC<Props> = ({ block, onChange }) => {
  const calloutType = (block.data.type as CalloutType) || 'info';
  const text = (block.data.text as string) || '';
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const config = CALLOUT_CONFIG[calloutType];

  return (
    <div className={`callout-block relative rounded-xl border ${config.border} ${config.bg} p-4`}>
      <div className="flex items-start gap-3">
        {/* Type selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className={`text-lg flex items-center gap-1 p-1 rounded-md hover:bg-white/[0.06] transition-all`}
            title="Change callout type"
          >
            <span>{CALLOUT_CONFIG[calloutType].emoji}</span>
            <ChevronDown className="w-3 h-3 text-text-secondary" />
          </button>
          {showTypeMenu && (
            <div
              className="absolute top-full left-0 mt-1 z-50 glass-panel p-1.5 w-36"
              style={{ background: 'rgba(18,18,18,0.97)' }}
            >
              {(Object.keys(CALLOUT_CONFIG) as CalloutType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    onChange({ type: t });
                    setShowTypeMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 text-xs px-3 py-2 rounded-md transition-all ${
                    calloutType === t
                      ? 'bg-white/[0.08] text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{CALLOUT_CONFIG[t].emoji}</span>
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text content */}
        <textarea
          value={text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Type a callout..."
          className={`flex-1 bg-transparent outline-none text-sm leading-relaxed resize-none placeholder:text-text-secondary/30 ${config.text}`}
          rows={Math.max(1, text.split('\n').length)}
        />
      </div>
    </div>
  );
};

export default CalloutBlock;
