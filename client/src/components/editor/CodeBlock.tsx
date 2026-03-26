import React, { useState } from 'react';
import type { Block } from '../../types';
import { Copy, Check, ChevronDown } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const LANGUAGES = [
  'plaintext', 'javascript', 'typescript', 'python', 'java', 'c', 'cpp',
  'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html',
  'css', 'scss', 'sql', 'bash', 'json', 'yaml', 'xml', 'markdown',
];

const CodeBlock: React.FC<Props> = ({ block, onChange }) => {
  const code = (block.data.code as string) || '';
  const language = (block.data.language as string) || 'plaintext';
  const [copied, setCopied] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper rounded-xl border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1 rounded-md hover:bg-white/[0.06]"
          >
            {language}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showLangMenu && (
            <div
              className="absolute top-full left-0 mt-1 z-50 glass-panel p-1.5 max-h-48 overflow-y-auto w-40 scrollbar-thin"
              style={{ background: 'rgba(18,18,18,0.97)' }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onChange({ language: lang });
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left text-xs px-3 py-1.5 rounded-md transition-all ${
                    language === lang
                      ? 'bg-[#E0D4FF]/15 text-[#E0D4FF]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.06]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1 rounded-md hover:bg-white/[0.06]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#CDEAC0]" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <textarea
        value={code}
        onChange={(e) => onChange({ code: e.target.value })}
        placeholder="// Paste or type your code..."
        spellCheck={false}
        className="w-full bg-[#0a0a0f] text-[#e2e8f0] font-mono text-sm leading-relaxed p-4 outline-none resize-none min-h-[120px] placeholder:text-white/20"
        rows={Math.max(4, code.split('\n').length)}
      />
    </div>
  );
};

export default CodeBlock;
