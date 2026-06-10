import { useState } from 'react';
import {
    Copy, Eye, ArrowRight
} from 'lucide-react';
import { useDraftStore } from '../store/useDraftStore';
import { useThemeStore } from '../store/useThemeStore';
import Navbar from '../components/Navbar';
import { markdownToHtml } from '../lib/markdownParser';

// Badges definitions
const TECH_STACK = [
    { name: 'Python', logo: 'python', color: '3776AB' },
    { name: 'JavaScript', logo: 'javascript', color: 'F7DF1E' },
    { name: 'TypeScript', logo: 'typescript', color: '3178C6' },
    { name: 'Go', logo: 'go', color: '00ADD8' },
    { name: 'Rust', logo: 'rust', color: '000000' },
    { name: 'C++', logo: 'cplusplus', color: '00599C' },
    { name: 'Java', logo: 'openjdk', color: 'ED8B00' },
    { name: 'React', logo: 'react', color: '61DAFB' },
    { name: 'Vue.js', logo: 'vuedotjs', color: '4FC08D' },
    { name: 'Next.js', logo: 'nextdotjs', color: '000000' },
    { name: 'Node.js', logo: 'nodedotjs', color: '5FA04E' },
    { name: 'Tailwind CSS', logo: 'tailwindcss', color: '06B6D4' },
    { name: 'Docker', logo: 'docker', color: '2496ED' },
    { name: 'AWS', logo: 'amazonaws', color: '232F3E' },
    { name: 'PostgreSQL', logo: 'postgresql', color: '4169E1' },
    { name: 'MongoDB', logo: 'mongodb', color: '47A248' }
];

const SOCIAL_CHANNELS = [
    { name: 'Twitter', logo: 'x', color: '000000', template: 'https://twitter.com/{value}' },
    { name: 'LinkedIn', logo: 'linkedin', color: '0A66C2', template: 'https://linkedin.com/in/{value}' },
    { name: 'YouTube', logo: 'youtube', color: 'FF0000', template: 'https://youtube.com/{value}' },
    { name: 'Discord', logo: 'discord', color: '5865F2', template: 'https://discord.gg/{value}' },
    { name: 'GitHub', logo: 'github', color: '181717', template: 'https://github.com/{value}' },
    { name: 'Email', logo: 'gmail', color: 'EA4335', template: 'mailto:{value}' }
];

const REPO_BADGES = [
    { id: 'stars', name: 'GitHub Stars', path: 'github/stars/{user}/{repo}' },
    { id: 'forks', name: 'GitHub Forks', path: 'github/forks/{user}/{repo}' },
    { id: 'issues', name: 'GitHub Issues', path: 'github/issues/{user}/{repo}' },
    { id: 'license', name: 'GitHub License', path: 'github/license/{user}/{repo}' },
    { id: 'last-commit', name: 'Last Commit', path: 'github/last-commit/{user}/{repo}' },
    { id: 'npm', name: 'NPM Version', path: 'npm/v/{repo}' },
    { id: 'pypi', name: 'PyPI Version', path: 'pypi/v/{repo}' }
];

const STATS_THEMES = ['dracula', 'radical', 'tokyonight', 'dark', 'github_dark', 'nord', 'synthwave'];
const STATS_TYPES = [
    { id: 'overview', name: 'Overview Stats' },
    { id: 'top-langs', name: 'Top Languages' }
];

const STYLES = ['for-the-badge', 'flat', 'flat-square', 'plastic'];

export default function BadgeStudioPage() {
    const { isDarkMode } = useThemeStore();
    const { markdown, setMarkdown, setHtmlContent } = useDraftStore();

    const [activeTab, setActiveTab] = useState<'custom' | 'tech' | 'social' | 'repo' | 'stats'>('custom');
    const [copied, setCopied] = useState(false);

    // Custom badge state
    const [label, setLabel] = useState('framework');
    const [message, setMessage] = useState('mdfmt');
    const [color, setColor] = useState('2496ED');
    const [style, setStyle] = useState('for-the-badge');

    // Social handles state
    const [socialPlatform, setSocialPlatform] = useState('GitHub');
    const [socialHandle, setSocialHandle] = useState('username');

    // Tech stack state
    const [insertedTech, setInsertedTech] = useState<string | null>(null);

    // Repo badges state
    const [repoUser, setRepoUser] = useState('username');
    const [repoName, setRepoName] = useState('repository');
    const [repoBadgeType, setRepoBadgeType] = useState('stars');

    // Stats state
    const [statsUser, setStatsUser] = useState('username');
    const [statsTheme, setStatsTheme] = useState('dracula');
    const [statsType, setStatsType] = useState('overview');

    const getCustomUrl = () => {
        const encLabel = encodeURIComponent(label || 'label');
        const encMsg = encodeURIComponent(message || 'message');
        return `https://img.shields.io/badge/${encLabel}-${encMsg}-${color}?style=${style}`;
    };

    const getSocialUrl = () => {
        const platform = SOCIAL_CHANNELS.find(c => c.name === socialPlatform) || SOCIAL_CHANNELS[4];
        return `https://img.shields.io/badge/${platform.name}-${platform.color}?style=for-the-badge&logo=${platform.logo}&logoColor=white`;
    };

    const getRepoBadgeUrl = () => {
        const badge = REPO_BADGES.find(b => b.id === repoBadgeType) || REPO_BADGES[0];
        const p = badge.path.replace('{user}', repoUser || 'user').replace('{repo}', repoName || 'repo');
        return `https://img.shields.io/${p}?style=${style}`;
    };

    const getStatsUrl = () => {
        const endpoint = statsType === 'overview' ? 'api' : 'api/top-langs/';
        return `https://github-readme-stats.vercel.app/${endpoint}?username=${statsUser || 'username'}&theme=${statsTheme}&show_icons=true${statsType === 'top-langs' ? '&layout=compact' : ''}`;
    };

    const getPreviewUrl = () => {
        if (activeTab === 'custom') return getCustomUrl();
        if (activeTab === 'social') return getSocialUrl();
        if (activeTab === 'repo') return getRepoBadgeUrl();
        if (activeTab === 'stats') return getStatsUrl();
        return `https://img.shields.io/badge/TechStack-Grid-blue?style=for-the-badge`;
    };

    const getMarkdownString = () => {
        if (activeTab === 'custom') return `![${label}](${getCustomUrl()})`;
        if (activeTab === 'social') {
            const platform = SOCIAL_CHANNELS.find(c => c.name === socialPlatform) || SOCIAL_CHANNELS[4];
            const link = platform.template.replace('{value}', socialHandle);
            return `[![${socialPlatform}](${getSocialUrl()})](${link})`;
        }
        if (activeTab === 'repo') {
            const badge = REPO_BADGES.find(b => b.id === repoBadgeType) || REPO_BADGES[0];
            return `![${badge.name}](${getRepoBadgeUrl()})`;
        }
        if (activeTab === 'stats') {
            return `[![GitHub Stats](${getStatsUrl()})](https://github.com/${statsUser})`;
        }
        return '';
    };

    const handleCopyMarkdown = async (markdownText: string) => {
        await navigator.clipboard.writeText(markdownText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleInsertToDraft = (imgUrl: string, altText: string, linkUrl?: string) => {
        const markdownBadge = linkUrl ? `[![${altText}](${imgUrl})](${linkUrl})` : `![${altText}](${imgUrl})`;
        const updatedMarkdown = `${markdown}\n${markdownBadge} `;
        setMarkdown(updatedMarkdown);
        setHtmlContent(markdownToHtml(updatedMarkdown));

        // Flash inserted indicator
        setInsertedTech(altText);
        setTimeout(() => setInsertedTech(null), 1500);
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex flex-col h-screen bg-transparent text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                        <div>
                            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900 dark:text-slate-100">
                                Badge Design Studio
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Generate customized Shields.io badges, technology chips, repository analytics, and GitHub profile stats.
                            </p>
                        </div>

                        {/* Layout grids */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left: Toggles and inputs */}
                            <div className="md:col-span-2 glass-panel rounded-2xl p-5 space-y-5">
                                {/* Subtab navigation */}
                                <div className="flex flex-wrap border-b border-slate-100 dark:border-slate-800 pb-2 gap-x-4 gap-y-2">
                                    {(['custom', 'tech', 'social', 'repo', 'stats'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`text-[11px] font-bold uppercase tracking-wider pb-1 transition-all border-b-2 ${
                                                activeTab === tab
                                                    ? 'border-slate-900 dark:border-slate-200 text-slate-900 dark:text-slate-100'
                                                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                                            }`}
                                        >
                                            {tab === 'custom' ? 'Custom Shield' : tab === 'tech' ? 'Tech Stack' : tab === 'social' ? 'Social Handle' : tab === 'repo' ? 'Repo Badges' : 'GitHub Stats'}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Tab */}
                                {activeTab === 'custom' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={label}
                                                    onChange={(e) => setLabel(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Message
                                                </label>
                                                <input
                                                    type="text"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    HEX Color
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 font-mono">#</span>
                                                    <input
                                                        type="text"
                                                        value={color}
                                                        onChange={(e) => setColor(e.target.value)}
                                                        className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 font-mono transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Style
                                                </label>
                                                <select
                                                    value={style}
                                                    onChange={(e) => setStyle(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                >
                                                    {STYLES.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tech Stack Tab */}
                                {activeTab === 'tech' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Click any icon to append its corresponding shields.io badge directly into your active draft workspace.
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {TECH_STACK.map((tech) => {
                                                const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(tech.name)}-${tech.color}?style=for-the-badge&logo=${tech.logo}&logoColor=white`;
                                                const isInserted = insertedTech === tech.name;
                                                return (
                                                    <button
                                                        key={tech.name}
                                                        onClick={() => handleInsertToDraft(badgeUrl, tech.name)}
                                                        className="flex flex-col items-center justify-center p-3 border border-slate-100 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-750 bg-transparent rounded-xl transition-all gap-1 text-center"
                                                    >
                                                        <img src={badgeUrl} alt={tech.name} className="h-5 max-w-full object-contain" />
                                                        <span className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">
                                                            {isInserted ? 'Inserted!' : tech.name}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Social Handle Tab */}
                                {activeTab === 'social' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Platform
                                                </label>
                                                <select
                                                    value={socialPlatform}
                                                    onChange={(e) => setSocialPlatform(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                >
                                                    {SOCIAL_CHANNELS.map(sc => (
                                                        <option key={sc.name} value={sc.name}>{sc.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Username / Invite Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={socialHandle}
                                                    onChange={(e) => setSocialHandle(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Repo Badges Tab */}
                                {activeTab === 'repo' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    GitHub/NPM Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={repoUser}
                                                    onChange={(e) => setRepoUser(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Repository / Package Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={repoName}
                                                    onChange={(e) => setRepoName(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Badge Type
                                                </label>
                                                <select
                                                    value={repoBadgeType}
                                                    onChange={(e) => setRepoBadgeType(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                >
                                                    {REPO_BADGES.map(b => (
                                                        <option key={b.id} value={b.id}>{b.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Style
                                                </label>
                                                <select
                                                    value={style}
                                                    onChange={(e) => setStyle(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                >
                                                    {STYLES.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stats Tab */}
                                {activeTab === 'stats' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    GitHub Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={statsUser}
                                                    onChange={(e) => setStatsUser(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                    Card Type
                                                </label>
                                                <select
                                                    value={statsType}
                                                    onChange={(e) => setStatsType(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                                >
                                                    {STATS_TYPES.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                Visual Theme
                                            </label>
                                            <select
                                                value={statsTheme}
                                                onChange={(e) => setStatsTheme(e.target.value)}
                                                className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-450 transition-colors"
                                            >
                                                {STATS_THEMES.map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Right: Live Preview & integration block */}
                            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-fit">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5" /> Preview
                                    </h3>
                                    <div className="p-6 bg-transparent dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-center min-h-[140px] overflow-hidden">
                                        <img
                                            src={getPreviewUrl()}
                                            alt="live badge preview"
                                            className="max-h-[200px] max-w-full object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-6">
                                    <button
                                        onClick={() => handleCopyMarkdown(getMarkdownString())}
                                        disabled={activeTab === 'tech'}
                                        className="w-full py-2 text-xs font-bold border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        {copied ? 'Markdown Copied!' : 'Copy Markdown'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (activeTab === 'custom') handleInsertToDraft(getCustomUrl(), label);
                                            else if (activeTab === 'social') {
                                                const platform = SOCIAL_CHANNELS.find(c => c.name === socialPlatform) || SOCIAL_CHANNELS[4];
                                                const link = platform.template.replace('{value}', socialHandle);
                                                handleInsertToDraft(getSocialUrl(), socialPlatform, link);
                                            } else if (activeTab === 'repo') {
                                                const badge = REPO_BADGES.find(b => b.id === repoBadgeType) || REPO_BADGES[0];
                                                handleInsertToDraft(getRepoBadgeUrl(), badge.name);
                                            } else if (activeTab === 'stats') {
                                                handleInsertToDraft(getStatsUrl(), 'GitHub Stats', `https://github.com/${statsUser}`);
                                            }
                                        }}
                                        disabled={activeTab === 'tech'}
                                        className="w-full py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl transition-all flex items-center justify-center gap-1 disabled:opacity-40"
                                    >
                                        Insert into Editor <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
