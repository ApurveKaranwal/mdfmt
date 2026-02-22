import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TurndownService from 'turndown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  PenTool, Moon, Sun, Download, Copy, LayoutTemplate,
  ImageIcon, Tags, Github, Smile, Palette, Globe,
  Eye, Code2,
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import Toolbar from '../components/Toolbar';
import InsertImageModal from '../components/InsertImageModal';
import BadgePickerModal from '../components/BadgePickerModal';
import GitHubStatsModal from '../components/GitHubStatsModal';
import SnippetDropdown from '../components/SnippetDropdown';
import EmojiPickerModal from '../components/EmojiPickerModal';
import AlertBlockDropdown from '../components/AlertBlockDropdown';
import CustomBadgeModal from '../components/CustomBadgeModal';
import SocialLinksModal from '../components/SocialLinksModal';
import AutoTocButton from '../components/AutoTocButton';

// Configure Turndown for GitHub Flavored Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

turndownService.addRule('strikethrough', {
  filter: ['del', 's'],
  replacement: function (content: string) {
    return '~~' + content + '~~';
  }
});

// Add image rule for proper markdown output
turndownService.addRule('image', {
  filter: 'img',
  replacement: function (_content: string, node: Node) {
    const el = node as HTMLElement;
    const alt = el.getAttribute('alt') || '';
    const src = el.getAttribute('src') || '';
    return `![${alt}](${src})`;
  }
});

const EditorPage = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [showCustomBadgeModal, setShowCustomBadgeModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: `<h1>Welcome to README Studio</h1><p>Start typing to design your beautiful README.</p>`,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setMarkdown(turndownService.turndown(html));
    },
  });

  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      setMarkdown(turndownService.turndown(html));
    }
  }, [editor]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = markdown.trim() === '' ? 0 : markdown.trim().split(/\s+/).length;

  // Row 1 insert features (existing)
  const insertRow1 = [
    { id: 'image', label: 'Image', icon: <ImageIcon className="w-3.5 h-3.5" />, color: 'text-blue-600 dark:text-blue-400', bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/30', onClick: () => setShowImageModal(true) },
    { id: 'badges', label: 'Badges', icon: <Tags className="w-3.5 h-3.5" />, color: 'text-purple-600 dark:text-purple-400', bg: 'hover:bg-purple-50 dark:hover:bg-purple-900/30', onClick: () => setShowBadgeModal(true) },
    { id: 'github', label: 'Stats', icon: <Github className="w-3.5 h-3.5" />, color: 'text-gray-800 dark:text-gray-200', bg: 'hover:bg-gray-100 dark:hover:bg-gray-700', onClick: () => setShowGitHubModal(true) },
    { id: 'emoji', label: 'Emoji', icon: <Smile className="w-3.5 h-3.5" />, color: 'text-amber-600 dark:text-amber-400', bg: 'hover:bg-amber-50 dark:hover:bg-amber-900/30', onClick: () => setShowEmojiModal(true) },
    { id: 'custom-badge', label: 'Custom', icon: <Palette className="w-3.5 h-3.5" />, color: 'text-pink-600 dark:text-pink-400', bg: 'hover:bg-pink-50 dark:hover:bg-pink-900/30', onClick: () => setShowCustomBadgeModal(true) },
    { id: 'social', label: 'Social', icon: <Globe className="w-3.5 h-3.5" />, color: 'text-cyan-600 dark:text-cyan-400', bg: 'hover:bg-cyan-50 dark:hover:bg-cyan-900/30', onClick: () => setShowSocialModal(true) },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <PenTool className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-lg font-semibold hidden lg:block">README Studio</h1>
            <h1 className="text-lg font-semibold lg:hidden">RS</h1>
          </div>

          {/* Center: Insert Features */}
          <div className="flex items-center gap-0.5 mx-2">
            <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-0.5 gap-0.5 border border-gray-200 dark:border-gray-700">
              {insertRow1.map((btn) => (
                <button
                  key={btn.id}
                  onClick={btn.onClick}
                  className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all active:scale-[0.97] ${btn.color} ${btn.bg}`}
                  title={btn.label}
                >
                  {btn.icon}
                  <span className="hidden md:inline">{btn.label}</span>
                </button>
              ))}
              {/* Dropdowns */}
              <AlertBlockDropdown editor={editor} />
              <AutoTocButton editor={editor} />
              <SnippetDropdown editor={editor} />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button className="flex items-center px-2.5 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <LayoutTemplate className="w-3.5 h-3.5 mr-1" />
              <span className="hidden lg:inline">Templates</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center px-2.5 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              {copied ? '✓' : 'Copy'}
            </button>
            <button
              onClick={downloadMarkdown}
              className="flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Export
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* Editor Pane */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-w-0">
            <Toolbar editor={editor} />
            <div
              className="flex-1 overflow-y-auto cursor-text editor-area"
              onClick={() => editor?.commands.focus()}
            >
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Markdown / Preview Pane */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-w-0">
            {/* Pane Header with Toggle */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${!previewMode
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <Code2 className="w-3 h-3" />
                    Markdown
                  </button>
                  <button
                    onClick={() => setPreviewMode(true)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${previewMode
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
              </div>
              <span className="text-xs text-gray-400">{wordCount} words</span>
            </div>

            {/* Raw Markdown or Rendered Preview */}
            <div className="flex-1 overflow-y-auto">
              {previewMode ? (
                <div className="p-6 github-markdown-preview">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code(props) {
                        const { children, className, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        return isInline ? (
                          <code className={className} {...rest}>
                            {children}
                          </code>
                        ) : (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              borderRadius: '8px',
                              margin: '1rem 0',
                              fontSize: '0.875rem',
                            }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
                      },
                      img(props) {
                        return (
                          <img
                            {...props}
                            className="inline-block"
                            style={{ maxHeight: '28px', verticalAlign: 'middle' }}
                          />
                        );
                      },
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 h-full">
                  <pre className="font-mono text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">{markdown}</pre>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showImageModal && editor && (
        <InsertImageModal editor={editor} onClose={() => setShowImageModal(false)} />
      )}
      {showBadgeModal && editor && (
        <BadgePickerModal editor={editor} onClose={() => setShowBadgeModal(false)} />
      )}
      {showGitHubModal && editor && (
        <GitHubStatsModal editor={editor} onClose={() => setShowGitHubModal(false)} />
      )}
      {showEmojiModal && editor && (
        <EmojiPickerModal editor={editor} onClose={() => setShowEmojiModal(false)} />
      )}
      {showCustomBadgeModal && editor && (
        <CustomBadgeModal editor={editor} onClose={() => setShowCustomBadgeModal(false)} />
      )}
      {showSocialModal && editor && (
        <SocialLinksModal editor={editor} onClose={() => setShowSocialModal(false)} />
      )}
    </div>
  );
};

export default EditorPage;
