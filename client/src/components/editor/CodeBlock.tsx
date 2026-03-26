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
    <div className="code-block-wrapper rounded-xl border border-[#00FF9C]/20 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#05070A]/50 border-b border-[#00FF9C]/10">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 text-xs text-[#7C8B93] hover:text-[#00FF9C] transition-colors px-2 py-1 rounded-md hover:bg-[#00FF9C]/10"
          >
            {language}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showLangMenu && (
            <div
              className="absolute top-full left-0 mt-1 z-50 glass-panel p-1.5 max-h-48 overflow-y-auto w-40 scrollbar-thin border-[#00FF9C]/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              style={{ background: '#0A0F14' }}
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
                      ? 'bg-[#00FF9C]/15 text-[#00FF9C]'
                      : 'text-[#7C8B93] hover:text-[#A8FFDF] hover:bg-[#00FF9C]/05'
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
           className="flex items-center gap-1 text-xs text-[#7C8B93] hover:text-[#00FF9C] transition-colors px-2 py-1 rounded-md hover:bg-[#00FF9C]/10"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#00FF9C]" /> Copied
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
        className="w-full bg-[#05070A] text-[#A8FFDF] font-mono text-sm leading-relaxed p-4 outline-none resize-none min-h-[120px] placeholder:text-[#00FF9C]/20"
        rows={Math.max(4, code.split('\n').length)}
      />
    </div>
  );
};

export default CodeBlock;
