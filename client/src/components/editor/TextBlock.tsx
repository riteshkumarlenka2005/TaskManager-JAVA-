import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import type { Block } from '../../types';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
} from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
  isHeading?: boolean;
  onSlashCommand?: () => void;
}

const TextBlock: React.FC<Props> = ({ block, onChange, isHeading, onSlashCommand }) => {
  const level = (block.data.level as number) || 1;
  const initialContent = (block.data['html'] as string) || (block.data['text'] as string) || '';

  const handleUpdate = useCallback(
    ({ editor }: { editor: any }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onChange({ html, text });
    },
    [onChange]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: isHeading ? { levels: [1, 2, 3] } : false,
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: isHeading ? `Heading ${level}` : 'Type something, or press "/" for commands...',
      }),
    ],
    content: initialContent,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: isHeading
          ? `tiptap-editor tiptap-heading tiptap-h${level}`
          : 'tiptap-editor tiptap-text',
      },
      handleKeyDown: (_view, event) => {
        if (event.key === '/' && onSlashCommand) {
          // Allow the / to be typed, then trigger menu
          setTimeout(() => onSlashCommand(), 10);
        }
        return false;
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    isActive,
    onClick,
    children,
    title,
  }: {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded-lg transition-all ${
        isActive
          ? 'bg-[#00FF9C]/20 text-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.2)]'
          : 'text-[#7C8B93] hover:text-[#A8FFDF] hover:bg-[#00FF9C]/10'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="tiptap-wrapper">
      {editor && !isHeading && (
        <BubbleMenu
          editor={editor}
          options={{ placement: 'top', offset: 10 } as any}
          className="bubble-menu"
        >
          <ToolbarButton
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarButton>
          <div className="w-px h-5 bg-white/[0.15] mx-0.5" />
          <ToolbarButton
            isActive={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive('link')}
            onClick={setLink}
            title="Add Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
          <div className="w-px h-5 bg-white/[0.15] mx-0.5" />
          <ToolbarButton
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextBlock;
