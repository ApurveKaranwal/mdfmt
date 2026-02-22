import { useState } from 'react';
import { type Editor } from '@tiptap/react';
import { X, Github, Star, GitFork, Eye, AlertCircle, BookOpen, RefreshCw } from 'lucide-react';

interface GitHubStatsModalProps {
    editor: Editor;
    onClose: () => void;
}

interface StatOption {
    id: string;
    label: string;
    icon: React.ReactNode;
    getUrl: (repo: string) => string;
}

const STAT_OPTIONS: StatOption[] = [
    {
        id: 'stars',
        label: 'Stars',
        icon: <Star className="w-4 h-4" />,
        getUrl: (repo) => `https://img.shields.io/github/stars/${repo}?style=for-the-badge&logo=github&logoColor=white&label=Stars&color=f59e0b`,
    },
    {
        id: 'forks',
        label: 'Forks',
        icon: <GitFork className="w-4 h-4" />,
        getUrl: (repo) => `https://img.shields.io/github/forks/${repo}?style=for-the-badge&logo=github&logoColor=white&label=Forks&color=3b82f6`,
    },
    {
        id: 'watchers',
        label: 'Watchers',
        icon: <Eye className="w-4 h-4" />,
        getUrl: (repo) => `https://img.shields.io/github/watchers/${repo}?style=for-the-badge&logo=github&logoColor=white&label=Watchers&color=22c55e`,
    },
    {
        id: 'issues',
        label: 'Issues',
        icon: <AlertCircle className="w-4 h-4" />,
        getUrl: (repo) => `https://img.shields.io/github/issues/${repo}?style=for-the-badge&logo=github&logoColor=white&label=Issues&color=ef4444`,
    },
    {
        id: 'license',
        label: 'License',
        icon: <BookOpen className="w-4 h-4" />,
        getUrl: (repo) => `https://img.shields.io/github/license/${repo}?style=for-the-badge&logo=opensourceinitiative&logoColor=white&label=License&color=8b5cf6`,
    },
    {
        id: 'last-commit',
        label: 'Last Commit',
        icon: <RefreshCw className="w-4 h-4" />,
        getUrl: (repo) => `https://img.shields.io/github/last-commit/${repo}?style=for-the-badge&logo=github&logoColor=white&label=Last%20Commit&color=06b6d4`,
    },
];

const GitHubStatsModal = ({ editor, onClose }: GitHubStatsModalProps) => {
    const [repo, setRepo] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set(['stars', 'forks', 'license']));

    const toggleStat = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const isValidRepo = /^[\w.-]+\/[\w.-]+$/.test(repo.trim());

    const handleInsert = () => {
        if (!isValidRepo) return;
        const trimmedRepo = repo.trim();

        // Insert each selected badge as an image
        const selectedStats = STAT_OPTIONS.filter((s) => selected.has(s.id));
        selectedStats.forEach((stat) => {
            editor.chain().focus().setImage({ src: stat.getUrl(trimmedRepo), alt: `${stat.label} for ${trimmedRepo}` }).run();
            // Add a space after each badge
            editor.chain().focus().insertContent(' ').run();
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub Stats</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Repo Input */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            <Github className="w-3.5 h-3.5" />
                            Repository
                        </label>
                        <input
                            type="text"
                            value={repo}
                            onChange={(e) => setRepo(e.target.value)}
                            placeholder="username/repository"
                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                            autoFocus
                        />
                        {repo.trim() && !isValidRepo && (
                            <p className="text-xs text-red-500 mt-1">Format: username/repository (e.g. facebook/react)</p>
                        )}
                    </div>

                    {/* Stat Toggles */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Select Stats to Include
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {STAT_OPTIONS.map((stat) => (
                                <button
                                    key={stat.id}
                                    onClick={() => toggleStat(stat.id)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${selected.has(stat.id)
                                            ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    {stat.icon}
                                    {stat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    {isValidRepo && selected.size > 0 && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Preview</label>
                            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-wrap gap-2 items-center">
                                {STAT_OPTIONS.filter((s) => selected.has(s.id)).map((stat) => (
                                    <img
                                        key={stat.id}
                                        src={stat.getUrl(repo.trim())}
                                        alt={stat.label}
                                        className="h-7 object-contain"
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        disabled={!isValidRepo || selected.size === 0}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        Insert {selected.size} Badge{selected.size !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GitHubStatsModal;
