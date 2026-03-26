import React, { useState } from 'react';
import type { Block, CalloutType } from '../../types';
import { Info, AlertTriangle, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const CALLOUT_CONFIG: Record<CalloutType, { icon: React.FC<{ className?: string }>; emoji: string; bg: string; border: string; text: string }> = {
  info: { icon: Info, emoji: 'ℹ️', bg: 'bg-[#00FFC6]/[0.08]', border: 'border-[#00FFC6]/30', text: 'text-[#00FFC6]' },
  warning: { icon: AlertTriangle, emoji: '⚠️', bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' },
  success: { icon: CheckCircle, emoji: '✅', bg: 'bg-[#00FF9C]/[0.08]', border: 'border-[#00FF9C]/30', text: 'text-[#00FF9C]' },
  error: { icon: XCircle, emoji: '🚫', bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger' },
};

const CalloutBlock: React.FC<Props> = ({ block, onChange }) => {
  const calloutType = (block.data.type as CalloutType) || 'info';
  const text = (block.data.text as string) || '';
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const config = CALLOUT_CONFIG[calloutType];

  return (
    <div className={`callout-block relative rounded-xl border ${config.border} ${config.bg} p-4 shadow-[0_4px_15px_rgba(0,0,0,0.3)]`}>
      <div className="flex items-start gap-3">
        {/* Type selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className={`text-lg flex items-center gap-1 p-1 rounded-md hover:bg-[#00FF9C]/10 transition-all`}
            title="Change callout type"
          >
            <span>{CALLOUT_CONFIG[calloutType].emoji}</span>
            <ChevronDown className="w-3 h-3 text-[#7C8B93]" />
          </button>
          {showTypeMenu && (
            <div
              className="absolute top-full left-0 mt-1 z-50 glass-panel p-1.5 w-36 border-[#00FF9C]/20 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              style={{ background: '#0A0F14' }}
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
                      ? 'bg-[#00FF9C]/10 text-[#A8FFDF]'
                      : 'text-[#7C8B93] hover:text-[#A8FFDF] hover:bg-[#00FF9C]/05'
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
          className={`flex-1 bg-transparent outline-none text-sm leading-relaxed resize-none placeholder:text-[#7C8B93]/30 ${config.text}`}
          rows={Math.max(1, text.split('\n').length)}
        />
      </div>
    </div>
  );
};

export default CalloutBlock;
