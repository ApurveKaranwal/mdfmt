import { useState, useRef, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import { AlertTriangle, ChevronDown, Info, Lightbulb, AlertCircle, ShieldAlert } from 'lucide-react';

interface AlertBlockDropdownProps {
    editor: Editor | null;
}

interface AlertType {
    id: string;
    label: string;
    keyword: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
}

const ALERT_TYPES: AlertType[] = [
    {
        id: 'note',
        label: 'Note',
        keyword: 'NOTE',
        icon: <Info className="w-4 h-4" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        description: 'Highlights useful information',
    },
    {
        id: 'tip',
        label: 'Tip',
        keyword: 'TIP',
        icon: <Lightbulb className="w-4 h-4" />,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/30',
        borderColor: 'border-green-200 dark:border-green-800',
        description: 'Helpful advice for the reader',
    },
    {
        id: 'important',
        label: 'Important',
        keyword: 'IMPORTANT',
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/30',
        borderColor: 'border-purple-200 dark:border-purple-800',
        description: 'Critical information to be aware of',
    },
    {
        id: 'warning',
        label: 'Warning',
        keyword: 'WARNING',
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-900/30',
        borderColor: 'border-amber-200 dark:border-amber-800',
        description: 'Potential issues or risks',
    },
    {
        id: 'caution',
        label: 'Caution',
        keyword: 'CAUTION',
        icon: <ShieldAlert className="w-4 h-4" />,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
        description: 'Dangerous or destructive actions',
    },
];

const AlertBlockDropdown = ({ editor }: AlertBlockDropdownProps) => {
    const [open, setOpen] = useState(false);
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

    if (!editor) return null;

    const handleInsert = (alert: AlertType) => {
        // Insert as a blockquote with the GitHub alert syntax
        const content = `<blockquote><p><strong>[!${alert.keyword}]</strong></p><p>Your ${alert.label.toLowerCase()} text here.</p></blockquote>`;
        editor.chain().focus().insertContent(content).run();
        setOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all active:scale-[0.97]"
                title="Alert Blocks"
            >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-dropdown-in">
                    <div className="p-2">
                        <p className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                            GitHub Alert Blocks
                        </p>
                        {ALERT_TYPES.map((alert) => (
                            <button
                                key={alert.id}
                                onClick={() => handleInsert(alert)}
                                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                            >
                                <div className={`p-1.5 rounded-lg ${alert.bgColor} ${alert.color} transition-colors mt-0.5`}>
                                    {alert.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-semibold ${alert.color}`}>{alert.label}</p>
                                        <code className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                                            [!{alert.keyword}]
                                        </code>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{alert.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertBlockDropdown;
