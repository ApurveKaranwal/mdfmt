import { useState } from 'react';
import { type Editor } from '@tiptap/react';
import { X, Tags, Search } from 'lucide-react';

interface InsertImageModalProps {
    editor: Editor;
    onClose: () => void;
}

interface Badge {
    label: string;
    logo: string;
    color: string;
    logoColor?: string;
}

interface BadgeCategory {
    name: string;
    emoji: string;
    badges: Badge[];
}

const BADGE_CATEGORIES: BadgeCategory[] = [
    {
        name: 'Languages',
        emoji: '💻',
        badges: [
            { label: 'Python', logo: 'python', color: '3776AB', logoColor: 'white' },
            { label: 'JavaScript', logo: 'javascript', color: 'F7DF1E', logoColor: 'black' },
            { label: 'TypeScript', logo: 'typescript', color: '3178C6', logoColor: 'white' },
            { label: 'Java', logo: 'openjdk', color: 'ED8B00', logoColor: 'white' },
            { label: 'C%2B%2B', logo: 'cplusplus', color: '00599C', logoColor: 'white' },
            { label: 'C%23', logo: 'csharp', color: '239120', logoColor: 'white' },
            { label: 'Go', logo: 'go', color: '00ADD8', logoColor: 'white' },
            { label: 'Rust', logo: 'rust', color: '000000', logoColor: 'white' },
            { label: 'Ruby', logo: 'ruby', color: 'CC342D', logoColor: 'white' },
            { label: 'PHP', logo: 'php', color: '777BB4', logoColor: 'white' },
            { label: 'Swift', logo: 'swift', color: 'F05138', logoColor: 'white' },
            { label: 'Kotlin', logo: 'kotlin', color: '7F52FF', logoColor: 'white' },
            { label: 'Dart', logo: 'dart', color: '0175C2', logoColor: 'white' },
            { label: 'Lua', logo: 'lua', color: '2C2D72', logoColor: 'white' },
            { label: 'R', logo: 'r', color: '276DC3', logoColor: 'white' },
            { label: 'Scala', logo: 'scala', color: 'DC322F', logoColor: 'white' },
        ],
    },
    {
        name: 'Frameworks',
        emoji: '🧩',
        badges: [
            { label: 'React', logo: 'react', color: '61DAFB', logoColor: 'black' },
            { label: 'Vue.js', logo: 'vuedotjs', color: '4FC08D', logoColor: 'white' },
            { label: 'Angular', logo: 'angular', color: '0F0F11', logoColor: 'white' },
            { label: 'Next.js', logo: 'nextdotjs', color: '000000', logoColor: 'white' },
            { label: 'Svelte', logo: 'svelte', color: 'FF3E00', logoColor: 'white' },
            { label: 'Django', logo: 'django', color: '092E20', logoColor: 'white' },
            { label: 'Flask', logo: 'flask', color: '000000', logoColor: 'white' },
            { label: 'FastAPI', logo: 'fastapi', color: '009688', logoColor: 'white' },
            { label: 'Express', logo: 'express', color: '000000', logoColor: 'white' },
            { label: 'Spring Boot', logo: 'springboot', color: '6DB33F', logoColor: 'white' },
            { label: 'Laravel', logo: 'laravel', color: 'FF2D20', logoColor: 'white' },
            { label: 'TailwindCSS', logo: 'tailwindcss', color: '06B6D4', logoColor: 'white' },
            { label: 'Bootstrap', logo: 'bootstrap', color: '7952B3', logoColor: 'white' },
            { label: 'Flutter', logo: 'flutter', color: '02569B', logoColor: 'white' },
            { label: 'Electron', logo: 'electron', color: '47848F', logoColor: 'white' },
            { label: 'NestJS', logo: 'nestjs', color: 'E0234E', logoColor: 'white' },
        ],
    },
    {
        name: 'Tools & Platforms',
        emoji: '🔧',
        badges: [
            { label: 'Docker', logo: 'docker', color: '2496ED', logoColor: 'white' },
            { label: 'Kubernetes', logo: 'kubernetes', color: '326CE5', logoColor: 'white' },
            { label: 'Git', logo: 'git', color: 'F05032', logoColor: 'white' },
            { label: 'GitHub', logo: 'github', color: '181717', logoColor: 'white' },
            { label: 'GitHub Actions', logo: 'githubactions', color: '2088FF', logoColor: 'white' },
            { label: 'VS Code', logo: 'visualstudiocode', color: '007ACC', logoColor: 'white' },
            { label: 'Linux', logo: 'linux', color: 'FCC624', logoColor: 'black' },
            { label: 'AWS', logo: 'amazonaws', color: '232F3E', logoColor: 'white' },
            { label: 'Firebase', logo: 'firebase', color: 'DD2C00', logoColor: 'white' },
            { label: 'Vercel', logo: 'vercel', color: '000000', logoColor: 'white' },
            { label: 'Netlify', logo: 'netlify', color: '00C7B7', logoColor: 'white' },
            { label: 'Heroku', logo: 'heroku', color: '430098', logoColor: 'white' },
        ],
    },
    {
        name: 'Databases',
        emoji: '🗄️',
        badges: [
            { label: 'PostgreSQL', logo: 'postgresql', color: '4169E1', logoColor: 'white' },
            { label: 'MySQL', logo: 'mysql', color: '4479A1', logoColor: 'white' },
            { label: 'MongoDB', logo: 'mongodb', color: '47A248', logoColor: 'white' },
            { label: 'Redis', logo: 'redis', color: 'DC382D', logoColor: 'white' },
            { label: 'SQLite', logo: 'sqlite', color: '003B57', logoColor: 'white' },
            { label: 'Supabase', logo: 'supabase', color: '3FCF8E', logoColor: 'white' },
        ],
    },
    {
        name: 'Licenses',
        emoji: '📜',
        badges: [
            { label: 'MIT', logo: 'opensourceinitiative', color: '3DA639', logoColor: 'white' },
            { label: 'Apache 2.0', logo: 'apache', color: 'D22128', logoColor: 'white' },
            { label: 'GPL v3', logo: 'gnu', color: 'A42E2B', logoColor: 'white' },
            { label: 'BSD 3--Clause', logo: 'bsd', color: 'a30000', logoColor: 'white' },
            { label: 'Mozilla Public License', logo: 'mozilla', color: '000000', logoColor: 'white' },
        ],
    },
];

const getBadgeUrl = (badge: Badge) => {
    const encoded = badge.label.replace(/ /g, '%20');
    const logoColor = badge.logoColor ? `&logoColor=${badge.logoColor}` : '';
    return `https://img.shields.io/badge/${encoded}-${badge.color}?style=for-the-badge&logo=${badge.logo}${logoColor}`;
};

const BadgePickerModal = ({ editor, onClose }: InsertImageModalProps) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(0);
    const [insertedBadges, setInsertedBadges] = useState<Set<string>>(new Set());

    const handleInsertBadge = (badge: Badge) => {
        const url = getBadgeUrl(badge);
        editor.chain().focus().setImage({ src: url, alt: badge.label }).run();
        setInsertedBadges((prev) => new Set(prev).add(badge.label));
    };

    const filteredCategories = BADGE_CATEGORIES.map((cat) => ({
        ...cat,
        badges: cat.badges.filter((b) =>
            b.label.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((cat) => cat.badges.length > 0);

    const displayCategory = search
        ? filteredCategories
        : [BADGE_CATEGORIES[activeCategory]];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-modal-in max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                            <Tags className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Badges</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 pt-4 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search badges..."
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                {!search && (
                    <div className="flex gap-1 px-6 pt-3 overflow-x-auto shrink-0">
                        {BADGE_CATEGORIES.map((cat, idx) => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(idx)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${idx === activeCategory
                                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{cat.emoji}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Badge Grid */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {displayCategory.map((cat) => (
                        <div key={cat.name}>
                            {search && (
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    {cat.emoji} {cat.name}
                                </h3>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {cat.badges.map((badge) => {
                                    const isInserted = insertedBadges.has(badge.label);
                                    return (
                                        <button
                                            key={badge.label}
                                            onClick={() => handleInsertBadge(badge)}
                                            className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${isInserted
                                                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                                }`}
                                        >
                                            <img
                                                src={getBadgeUrl(badge)}
                                                alt={badge.label}
                                                className="h-7 object-contain"
                                                loading="lazy"
                                            />
                                            {isInserted && (
                                                <span className="absolute top-1 right-1 text-[10px] text-green-600 dark:text-green-400 font-medium">
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <span className="text-xs text-gray-400">
                        {insertedBadges.size > 0 && `${insertedBadges.size} badge${insertedBadges.size > 1 ? 's' : ''} inserted`}
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BadgePickerModal;
