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
import TurndownService from 'turndown';
import { PenTool, Moon, Sun, Download, Copy, LayoutTemplate } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import Toolbar from '../components/Toolbar';

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

const EditorPage = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
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

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-lg font-semibold">README Studio</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Templates
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={downloadMarkdown}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export .md
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

          {/* Markdown Output Pane */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-w-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">README.md</span>
              <span className="text-xs text-gray-400">{wordCount} words</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
              <pre className="font-mono text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">{markdown}</pre>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;
