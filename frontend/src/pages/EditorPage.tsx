import { useState, useEffect, useRef } from 'react';
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
  Copy, Eye, Code2, BookOpen, FileDown, Upload, Trash2, List
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useDraftStore } from '../store/useDraftStore';
import Toolbar from '../components/Toolbar';
import TableToolbar from '../components/TableToolbar';
import Navbar from '../components/Navbar';
import { markdownToHtml } from '../lib/markdownParser';

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
  const { isDarkMode } = useThemeStore();
  const { markdown, htmlContent, setMarkdown, setHtmlContent, clearDraft } = useDraftStore();

  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [outline, setOutline] = useState<{ level: number; text: string; id: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    content: htmlContent,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const md = turndownService.turndown(html);
      setMarkdown(md);
      setHtmlContent(html);
    },
  });

  // Sync editor content with global store changes (e.g. from template load or AI generate)
  useEffect(() => {
    if (editor && htmlContent !== editor.getHTML()) {
      editor.commands.setContent(htmlContent);
    }
  }, [htmlContent, editor]);

  // Sync initial markdown on load if missing
  useEffect(() => {
    if (editor && !markdown) {
      const html = editor.getHTML();
      setMarkdown(turndownService.turndown(html));
    }
  }, [editor]);

  // Outline tracker
  useEffect(() => {
    if (!editor) return;
    const updateOutline = () => {
      const items: { level: number; text: string; id: string }[] = [];
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'heading') {
          const text = node.textContent;
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          items.push({ level: node.attrs.level, text, id });
        }
      });
      setOutline(items);
    };

    editor.on('update', updateOutline);
    updateOutline();
    return () => {
      editor.off('update', updateOutline);
    };
  }, [editor]);

  const scrollToHeading = (text: string) => {
    const editorEl = document.querySelector('.editor-area .tiptap');
    if (!editorEl) return;
    const headings = editorEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].textContent === text) {
        headings[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        const target = headings[i] as HTMLElement;
        const originalBg = target.style.backgroundColor;
        target.style.backgroundColor = 'rgba(226, 232, 240, 0.5)';
        target.style.transition = 'background-color 0.5s ease';
        setTimeout(() => {
          target.style.backgroundColor = originalBg;
        }, 1000);
        break;
      }
    }
  };

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

  const downloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
      const text = await file.text();
      const html = markdownToHtml(text);
      setMarkdown(text);
      setHtmlContent(html);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const html = markdownToHtml(text);
        setMarkdown(text);
        setHtmlContent(html);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the editor? This will erase your current draft.")) {
      clearDraft();
    }
  };

  const wordCount = markdown.trim() === '' ? 0 : markdown.trim().split(/\s+/).length;
  const charCount = markdown.length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-transparent text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
        <Navbar />

        {/* Sub-header actions */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setShowOutline(!showOutline)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                showOutline
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-650'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Outline {outline.length > 0 && `(${outline.length})`}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".md,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-slate-650"
              title="Import markdown file"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Import MD
            </button>
            <button
              onClick={handleClear}
              className="flex items-center px-3 py-1.5 text-xs font-semibold border border-red-200 dark:border-red-950/40 rounded-lg text-red-600 dark:text-red-400 bg-red-50/10 hover:bg-red-50/40 dark:hover:bg-red-950/20 transition-colors"
              title="Start from scratch"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear Draft
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-1.5 text-xs font-semibold border border-slate-350 dark:border-slate-750 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>

            {/* Dropdown export */}
            <div className="relative group inline-block">
              <button
                onClick={downloadMarkdown}
                className="flex items-center px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-lg transition-all shadow-sm"
              >
                Export
              </button>
              <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-xl z-50 p-1">
                <button
                  onClick={downloadMarkdown}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                >
                  <FileDown className="w-3.5 h-3.5" /> Raw .MD
                </button>
                <button
                  onClick={downloadHtml}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                >
                  <FileDown className="w-3.5 h-3.5" /> HTML Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden p-4 md:p-6 gap-4 md:gap-6 custom-scrollbar">
          {/* Collapsible Outline Pane */}
          {showOutline && (
            <div className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 overflow-y-auto custom-scrollbar animate-modal-in max-h-[300px] md:max-h-none">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-850 mb-3">
                <BookOpen className="w-4.5 h-4.5 text-slate-650" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Outline
                </h3>
              </div>
              {outline.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[11px] text-slate-450">No headings detected.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {outline.map((h, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToHeading(h.text)}
                      className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg text-left transition-colors"
                      style={{ paddingLeft: `${(h.level - 1) * 10 + 6}px` }}
                    >
                      <span className="text-[9px] font-bold text-slate-400 uppercase">H{h.level}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-350 truncate">{h.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Editor Area */}
          <div
            className={`flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-w-0 transition-all ${
              !previewMode ? 'active-pane-glow' : ''
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Toolbar editor={editor} />
            <TableToolbar editor={editor} />
            <div
              className="flex-1 overflow-y-auto cursor-text editor-area custom-scrollbar"
              onClick={() => editor?.commands.focus()}
            >
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Preview Toggle Area */}
          <div
            className={`flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-w-0 transition-all ${
              previewMode ? 'active-pane-glow' : ''
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setPreviewMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    !previewMode
                      ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> Code
                </button>
                <button
                  onClick={() => setPreviewMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    previewMode
                      ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-450 dark:text-slate-550 font-medium">
                <span>{wordCount} words</span>
                <span className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <span>{charCount} chars</span>
                <span className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <span>{readingTime}m read</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                              borderRadius: '12px',
                              margin: '1.25rem 0',
                              fontSize: '0.85rem',
                              border: '1px solid rgba(51, 65, 85, 0.4)'
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
                <div className="p-5 bg-slate-50/20 dark:bg-slate-950/10 h-full font-mono">
                  <pre className="text-xs text-slate-750 dark:text-slate-350 whitespace-pre-wrap break-words leading-relaxed">{markdown}</pre>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;
