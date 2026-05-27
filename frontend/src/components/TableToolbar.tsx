import { type Editor } from '@tiptap/react';
import {
    Plus, Trash2, ChevronDown, AlignLeft
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TableToolbarProps {
    editor: Editor | null;
}

export default function TableToolbar({ editor }: TableToolbarProps) {
    const [openCol, setOpenCol] = useState(false);
    const [openRow, setOpenRow] = useState(false);
    const colRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (colRef.current && !colRef.current.contains(e.target as Node)) {
                setOpenCol(false);
            }
            if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
                setOpenRow(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor || !editor.isActive('table')) return null;

    return (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-blue-50/80 dark:bg-blue-900/10 border-b border-gray-200 dark:border-gray-700 animate-dropdown-in">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-2 flex items-center gap-1">
                <AlignLeft className="w-3.5 h-3.5" /> Table Controls:
            </span>

            {/* Column operations */}
            <div className="relative" ref={colRef}>
                <button
                    onClick={() => setOpenCol(!openCol)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Columns <ChevronDown className="w-3 h-3" />
                </button>
                {openCol && (
                    <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5">
                        <button
                            onClick={() => { editor.chain().focus().addColumnBefore().run(); setOpenCol(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                        >
                            <Plus className="w-3.5 h-3.5 text-blue-500" /> Add Column Before
                        </button>
                        <button
                            onClick={() => { editor.chain().focus().addColumnAfter().run(); setOpenCol(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                        >
                            <Plus className="w-3.5 h-3.5 text-blue-500" /> Add Column After
                        </button>
                        <div className="h-px bg-gray-150 dark:bg-gray-700 my-1" />
                        <button
                            onClick={() => { editor.chain().focus().deleteColumn().run(); setOpenCol(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Column
                        </button>
                    </div>
                )}
            </div>

            {/* Row operations */}
            <div className="relative" ref={rowRef}>
                <button
                    onClick={() => setOpenRow(!openRow)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Rows <ChevronDown className="w-3 h-3" />
                </button>
                {openRow && (
                    <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5">
                        <button
                            onClick={() => { editor.chain().focus().addRowBefore().run(); setOpenRow(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                        >
                            <Plus className="w-3.5 h-3.5 text-blue-500" /> Add Row Above
                        </button>
                        <button
                            onClick={() => { editor.chain().focus().addRowAfter().run(); setOpenRow(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                        >
                            <Plus className="w-3.5 h-3.5 text-blue-500" /> Add Row Below
                        </button>
                        <div className="h-px bg-gray-150 dark:bg-gray-700 my-1" />
                        <button
                            onClick={() => { editor.chain().focus().deleteRow().run(); setOpenRow(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Row
                        </button>
                    </div>
                )}
            </div>

            {/* Delete entire table */}
            <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ml-auto"
            >
                <Trash2 className="w-3.5 h-3.5" /> Delete Table
            </button>
        </div>
    );
}
