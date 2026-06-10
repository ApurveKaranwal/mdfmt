import { Link, useLocation } from 'react-router-dom';
import { PenTool, Code2, BookOpen, Layers, Settings, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export default function Navbar() {
    const { isDarkMode, toggleDarkMode } = useThemeStore();
    const location = useLocation();

    const links = [
        { path: '/', label: 'Editor', icon: <Code2 className="w-3.5 h-3.5" /> },
        { path: '/ai-generator', label: 'AI Agent', icon: <Settings className="w-3.5 h-3.5" /> },
        { path: '/templates', label: 'Templates', icon: <BookOpen className="w-3.5 h-3.5" /> },
        { path: '/badge-studio', label: 'Badge Studio', icon: <Layers className="w-3.5 h-3.5" /> }
    ];

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 select-none z-30">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    <PenTool className="w-4 h-4 text-slate-900 dark:text-slate-100" />
                </div>
                <span className="text-2xl tracking-wide text-slate-900 dark:text-slate-50" style={{ fontFamily: "'Pacifico', cursive", transform: 'translateY(-2px)' }}>
                    mdfmt
                </span>
            </div>

            {/* Navigation links */}
            <nav className="flex items-center gap-1.5">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                isActive
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Action controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleDarkMode}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Toggle theme"
                >
                    {isDarkMode ? <Sun className="w-3.5 h-3.5 text-slate-300" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                </button>
            </div>
        </header>
    );
}
