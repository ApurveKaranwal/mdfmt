import { useState, useRef, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import { List, ChevronDown, RefreshCw } from 'lucide-react';

interface AutoTocButtonProps {
    editor: Editor | null;
}

interface HeadingItem {
    level: number;
    text: string;
    id: string;
}

const AutoTocButton = ({ editor }: AutoTocButtonProps) => {
    const [open, setOpen] = useState(false);
    const [headings, setHeadings] = useState<HeadingItem[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scanHeadings = () => {
        if (!editor) return;
        const items: HeadingItem[] = [];
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
        setHeadings(items);
    };

    const handleOpen = () => {
        if (!open) scanHeadings();
        setOpen(!open);
    };

    const handleInsert = () => {
        if (!editor || headings.length === 0) return;

        let tocHtml = '<h2>📑 Table of Contents</h2><ul>';
        headings.forEach((h) => {
            const indent = h.level > 1 ? '<ul>'.repeat(h.level - 1) : '';
            const indentClose = h.level > 1 ? '</ul>'.repeat(h.level - 1) : '';
            tocHtml += `${indent}<li><a href="#${h.id}">${h.text}</a></li>${indentClose}`;
        });
        tocHtml += '</ul>';

        editor.chain().focus().insertContent(tocHtml).run();
        setOpen(false);
    };

    if (!editor) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all active:scale-[0.97]"
                title="Auto Table of Contents"
            >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">TOC</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-dropdown-in">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Auto-Generated TOC</h3>
                            <button
                                onClick={scanHeadings}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400"
                                title="Rescan headings"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {headings.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-400">No headings found</p>
                                <p className="text-xs text-gray-400 mt-1">Add H1, H2, or H3 headings to your document first</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3 mb-3 max-h-48 overflow-y-auto">
                                    {headings.map((h, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 py-1"
                                            style={{ paddingLeft: `${(h.level - 1) * 16}px` }}
                                        >
                                            <span className="text-[10px] font-mono text-gray-400 w-5 shrink-0">H{h.level}</span>
                                            <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{h.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleInsert}
                                    className="w-full py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                    Insert TOC ({headings.length} heading{headings.length !== 1 ? 's' : ''})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoTocButton;
