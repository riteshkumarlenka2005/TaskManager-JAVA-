import type { Block, TableCell, ChecklistItem, CalloutType } from '../types';

/**
 * Generates a self-contained HTML file from document blocks.
 * All media (images, audio, video, drawings) are embedded as base64 data URIs.
 */
export function generateHtml(title: string, blocks: Block[]): string {
  const bodyContent = blocks.map((block) => renderBlock(block)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${getEmbeddedStyles()}</style>
</head>
<body>
  <div class="document">
    <h1 class="doc-title">${escapeHtml(title)}</h1>
    ${bodyContent}
  </div>
</body>
</html>`;
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case 'text':
      return renderTextBlock(block);
    case 'heading':
      return renderHeadingBlock(block);
    case 'image':
      return renderImageBlock(block);
    case 'video':
      return renderVideoBlock(block);
    case 'audio':
      return renderAudioBlock(block);
    case 'drawing':
      return renderDrawingBlock(block);
    case 'table':
      return renderTableBlock(block);
    case 'code':
      return renderCodeBlock(block);
    case 'quote':
      return renderQuoteBlock(block);
    case 'checklist':
      return renderChecklistBlock(block);
    case 'callout':
      return renderCalloutBlock(block);
    case 'divider':
      return '<hr class="divider" />';
    default:
      return '';
  }
}

function renderTextBlock(block: Block): string {
  const html = (block.data.html as string) || '';
  const text = (block.data.text as string) || '';
  return `<div class="block block-text">${html || escapeHtml(text)}</div>`;
}

function renderHeadingBlock(block: Block): string {
  const level = (block.data.level as number) || 1;
  const html = (block.data.html as string) || '';
  const text = (block.data.text as string) || '';
  const tag = `h${Math.min(level + 1, 4)}`; // h2, h3, h4 (h1 is doc title)
  return `<${tag} class="block block-heading">${html || escapeHtml(text)}</${tag}>`;
}

function renderImageBlock(block: Block): string {
  const url = (block.data.url as string) || '';
  const caption = (block.data.caption as string) || '';
  if (!url) return '';
  return `<figure class="block block-image">
    <img src="${escapeAttr(url)}" alt="${escapeAttr(caption)}" />
    ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
  </figure>`;
}

function renderVideoBlock(block: Block): string {
  const url = (block.data.url as string) || '';
  const caption = (block.data.caption as string) || '';
  if (!url) return '';
  return `<figure class="block block-video">
    <video controls><source src="${escapeAttr(url)}"></video>
    ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
  </figure>`;
}

function renderAudioBlock(block: Block): string {
  const url = (block.data.url as string) || '';
  const caption = (block.data.caption as string) || '';
  if (!url) return '';
  return `<figure class="block block-audio">
    <audio controls src="${escapeAttr(url)}"></audio>
    ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
  </figure>`;
}

function renderDrawingBlock(block: Block): string {
  const dataUrl = (block.data.dataUrl as string) || '';
  if (!dataUrl) return '';
  return `<figure class="block block-drawing">
    <img src="${escapeAttr(dataUrl)}" alt="Drawing" />
  </figure>`;
}

function renderTableBlock(block: Block): string {
  const rows = (block.data.rows as TableCell[][]) || [];
  if (rows.length === 0) return '';

  const headerRow = rows[0]
    .filter((c) => !c.merged)
    .map((cell) => `<th rowspan="${cell.rowSpan || 1}" colspan="${cell.colSpan || 1}">${escapeHtml(cell.content)}</th>`)
    .join('');

  const bodyRows = rows
    .slice(1)
    .map(
      (row) =>
        `<tr>${row
          .filter((c) => !c.merged)
          .map((cell) => `<td rowspan="${cell.rowSpan || 1}" colspan="${cell.colSpan || 1}">${escapeHtml(cell.content)}</td>`)
          .join('')}</tr>`
    )
    .join('');

  return `<table class="block block-table">
    <thead><tr>${headerRow}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>`;
}

function renderCodeBlock(block: Block): string {
  const code = (block.data.code as string) || '';
  const language = (block.data.language as string) || 'plaintext';
  return `<div class="block block-code">
    <div class="code-lang">${escapeHtml(language)}</div>
    <pre><code>${escapeHtml(code)}</code></pre>
  </div>`;
}

function renderQuoteBlock(block: Block): string {
  const text = (block.data.text as string) || '';
  const author = (block.data.author as string) || '';
  return `<blockquote class="block block-quote">
    <p>${escapeHtml(text)}</p>
    ${author ? `<cite>— ${escapeHtml(author)}</cite>` : ''}
  </blockquote>`;
}

function renderChecklistBlock(block: Block): string {
  const items = (block.data.items as ChecklistItem[]) || [];
  const listItems = items
    .map(
      (item) =>
        `<li class="${item.checked ? 'checked' : ''}">
          <span class="checkbox">${item.checked ? '✓' : ''}</span>
          <span>${escapeHtml(item.text)}</span>
        </li>`
    )
    .join('');
  return `<ul class="block block-checklist">${listItems}</ul>`;
}

function renderCalloutBlock(block: Block): string {
  const type = (block.data.type as CalloutType) || 'info';
  const text = (block.data.text as string) || '';
  const emojis: Record<string, string> = { info: 'ℹ️', warning: '⚠️', success: '✅', error: '🚫' };
  return `<div class="block block-callout callout-${type}">
    <span class="callout-icon">${emojis[type] || 'ℹ️'}</span>
    <span>${escapeHtml(text)}</span>
  </div>`;
}

// --- Helpers ---

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;');
}

// --- Embedded CSS ---

function getEmbeddedStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0C0C0C;
      color: #E8E8E8;
      line-height: 1.7;
      padding: 2rem;
    }
    .document {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 3rem;
    }
    .doc-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #E0D4FF 0%, #F5E6A7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .block { margin-bottom: 1.2rem; }
    .block-text { font-size: 1rem; color: rgba(232,232,232,0.9); }
    .block-text p { margin-bottom: 0.5em; }
    .block-text a { color: #E0D4FF; text-decoration: underline; }
    .block-text code { background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    .block-text ul, .block-text ol { padding-left: 1.5rem; margin: 0.5rem 0; }
    h2.block-heading { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; }
    h3.block-heading { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; }
    h4.block-heading { font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; }
    .block-image img, .block-drawing img {
      max-width: 100%;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    figcaption {
      text-align: center;
      font-size: 0.85rem;
      color: rgba(232,232,232,0.5);
      margin-top: 0.5rem;
    }
    .block-video video {
      max-width: 100%;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .block-audio audio { width: 100%; }
    .block-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      overflow: hidden;
    }
    .block-table th, .block-table td {
      padding: 10px 14px;
      border: 1px solid rgba(255,255,255,0.08);
      text-align: left;
      font-size: 0.9rem;
    }
    .block-table th {
      background: rgba(224,212,255,0.08);
      font-weight: 600;
    }
    .block-code {
      background: #0a0a0f;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      overflow: hidden;
    }
    .code-lang {
      padding: 6px 14px;
      font-size: 0.75rem;
      color: rgba(232,232,232,0.4);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.02);
    }
    .block-code pre {
      padding: 1rem;
      overflow-x: auto;
    }
    .block-code code {
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #e2e8f0;
    }
    .block-quote {
      padding: 1rem 1.5rem;
      border-left: 3px solid rgba(224,212,255,0.5);
      background: rgba(224,212,255,0.03);
      border-radius: 0 12px 12px 0;
    }
    .block-quote p { font-style: italic; color: rgba(232,232,232,0.9); }
    .block-quote cite { display: block; margin-top: 0.5rem; font-size: 0.85rem; color: rgba(232,232,232,0.5); }
    .block-checklist { list-style: none; }
    .block-checklist li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      font-size: 0.95rem;
    }
    .block-checklist li.checked { color: rgba(232,232,232,0.4); text-decoration: line-through; }
    .checkbox {
      width: 18px;
      height: 18px;
      border-radius: 5px;
      border: 2px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
    }
    .block-checklist li.checked .checkbox {
      background: #E0D4FF;
      border-color: #E0D4FF;
      color: #0C0C0C;
    }
    .block-callout {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 0.9rem;
    }
    .callout-icon { font-size: 1.1rem; flex-shrink: 0; }
    .callout-info { background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.2); color: #93c5fd; }
    .callout-warning { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); color: #fcd34d; }
    .callout-success { background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }
    .callout-error { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
    .divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 1.5rem 0;
    }
    @media (max-width: 640px) {
      body { padding: 1rem; }
      .document { padding: 1.5rem; }
      .doc-title { font-size: 1.8rem; }
    }
  `;
}

/**
 * Downloads the generated HTML file
 */
export function downloadHtml(title: string, blocks: Block[]): void {
  const html = generateHtml(title, blocks);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title || 'document'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
