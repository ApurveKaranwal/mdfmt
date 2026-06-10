import { useState, useEffect } from 'react';
import { User, Send, CheckCircle2, Eye, Code2, Link as LinkIcon, Briefcase, Github, Twitter, Linkedin, Palette } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useDraftStore } from '../store/useDraftStore';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const POPULAR_TECHS = [
    { name: 'React', color: '61DAFB', logo: 'react', logoColor: 'white' },
    { name: 'Node.js', color: '339933', logo: 'nodedotjs', logoColor: 'white' },
    { name: 'TypeScript', color: '3178C6', logo: 'typescript', logoColor: 'white' },
    { name: 'JavaScript', color: 'F7DF1E', logo: 'javascript', logoColor: 'black' },
    { name: 'Python', color: '3776AB', logo: 'python', logoColor: 'white' },
    { name: 'Go', color: '00ADD8', logo: 'go', logoColor: 'white' },
    { name: 'Rust', color: '000000', logo: 'rust', logoColor: 'white' },
    { name: 'Docker', color: '2496ED', logo: 'docker', logoColor: 'white' },
    { name: 'AWS', color: '232F3E', logo: 'amazonaws', logoColor: 'white' },
    { name: 'MongoDB', color: '47A248', logo: 'mongodb', logoColor: 'white' },
    { name: 'PostgreSQL', color: '4169E1', logo: 'postgresql', logoColor: 'white' },
    { name: 'TailwindCSS', color: '06B6D4', logo: 'tailwindcss', logoColor: 'white' }
];

export default function ProfileBuilderPage() {
    const { isDarkMode } = useThemeStore();
    const { markdown, setMarkdown } = useDraftStore();

    // Form State
    const [name, setName] = useState('John Doe');
    const [title, setTitle] = useState('Full Stack Developer');
    const [bio, setBio] = useState('Building awesome things for the web. Open source enthusiast.');
    const [githubUser, setGithubUser] = useState('ApurveKaranwal');
    
    // Socials
    const [twitter, setTwitter] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [portfolio, setPortfolio] = useState('');

    // Tech Stack
    const [selectedTechs, setSelectedTechs] = useState<string[]>(['React', 'TypeScript', 'Node.js']);

    // Stats
    const [showStats, setShowStats] = useState(true);
    const [showLanguages, setShowLanguages] = useState(true);
    const [statsTheme, setStatsTheme] = useState('radical');

    // UI State
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [inserted, setInserted] = useState(false);
    const [generatedMd, setGeneratedMd] = useState('');

    useEffect(() => {
        let md = `Hi there! 👋 I'm **${name || 'Anonymous'}**\n`;
        md += `### ${title || 'Developer'}\n\n`;
        if (bio) md += `${bio}\n\n`;

        // Social Badges
        if (twitter || linkedin || portfolio) {
            md += `<p align="left">\n`;
            if (twitter) {
                md += `  <a href="https://twitter.com/${twitter}" target="_blank">\n    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="twitter" />\n  </a>\n`;
            }
            if (linkedin) {
                md += `  <a href="https://linkedin.com/in/${linkedin}" target="_blank">\n    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="linkedin" />\n  </a>\n`;
            }
            if (portfolio) {
                md += `  <a href="${portfolio}" target="_blank">\n    <img src="https://img.shields.io/badge/Portfolio-2563EB?style=for-the-badge&logo=globe&logoColor=white" alt="portfolio" />\n  </a>\n`;
            }
            md += `</p>\n\n`;
        }

        // Tech Stack
        if (selectedTechs.length > 0) {
            md += `### 🛠️ Tech Stack\n\n<p align="left">\n`;
            selectedTechs.forEach(techName => {
                const tech = POPULAR_TECHS.find(t => t.name === techName);
                if (tech) {
                    md += `  <img src="https://img.shields.io/badge/${tech.name.replace(' ', '%20')}-${tech.color}?style=for-the-badge&logo=${tech.logo}&logoColor=${tech.logoColor}" alt="${tech.name}" />\n`;
                }
            });
            md += `</p>\n\n`;
        }

        // GitHub Stats
        if (githubUser && (showStats || showLanguages)) {
            md += `### 📊 GitHub Stats\n\n<p align="center">\n`;
            if (showStats) {
                md += `  <img src="https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&theme=${statsTheme}&hide_border=true" alt="${githubUser} stats" />\n`;
            }
            if (showLanguages) {
                md += `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&layout=compact&theme=${statsTheme}&hide_border=true" alt="Top Languages" />\n`;
            }
            md += `</p>\n\n`;
        }

        setGeneratedMd(md);
    }, [name, title, bio, githubUser, twitter, linkedin, portfolio, selectedTechs, showStats, showLanguages, statsTheme]);

    const toggleTech = (tech: string) => {
        setSelectedTechs(prev => 
            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
        );
    };

    const handleInsertToDraft = () => {
        setMarkdown(markdown + (markdown.trim() ? '\n\n' : '') + generatedMd);
        setInserted(true);
        setTimeout(() => setInserted(false), 2000);
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex flex-col h-screen bg-transparent text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
                <Navbar />

                <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-4 md:gap-6">
                    {/* Left Panel: Form Wizard */}
                    <div className="w-full lg:w-[450px] shrink-0 flex flex-col gap-4 md:gap-5 overflow-y-auto custom-scrollbar pr-2">
                        
                        {/* Section 1: Intro */}
                        <div className="glass-panel rounded-2xl p-5">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" /> Personal Info
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Headline / Title</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Bio</label>
                                    <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none h-20 custom-scrollbar" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Socials */}
                        <div className="glass-panel rounded-2xl p-5">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-blue-500" /> Social Links
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                    <input type="text" placeholder="GitHub Username" value={githubUser} onChange={e => setGithubUser(e.target.value)} className="flex-1 px-3 py-1.5 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Twitter className="w-5 h-5 text-sky-500" />
                                    <input type="text" placeholder="Twitter Handle" value={twitter} onChange={e => setTwitter(e.target.value)} className="flex-1 px-3 py-1.5 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Linkedin className="w-5 h-5 text-blue-700" />
                                    <input type="text" placeholder="LinkedIn Username" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="flex-1 px-3 py-1.5 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-emerald-600" />
                                    <input type="url" placeholder="Portfolio URL" value={portfolio} onChange={e => setPortfolio(e.target.value)} className="flex-1 px-3 py-1.5 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Tech Stack */}
                        <div className="glass-panel rounded-2xl p-5">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-500" /> Tech Stack
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_TECHS.map(tech => (
                                    <button
                                        key={tech.name}
                                        onClick={() => toggleTech(tech.name)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                                            selectedTechs.includes(tech.name)
                                                ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                                                : 'bg-transparent border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    >
                                        {tech.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 4: Stats Widgets */}
                        <div className="glass-panel rounded-2xl p-5 mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-blue-500" /> GitHub Stats
                            </h2>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={showStats} onChange={e => setShowStats(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Show General Stats</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={showLanguages} onChange={e => setShowLanguages(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Show Top Languages</span>
                                </label>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Theme</label>
                                    <select value={statsTheme} onChange={e => setStatsTheme(e.target.value)} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-colors">
                                        <option value="radical">Radical</option>
                                        <option value="tokyonight">Tokyo Night</option>
                                        <option value="dracula">Dracula</option>
                                        <option value="nord">Nord</option>
                                        <option value="dark">Dark</option>
                                        <option value="github_dark">GitHub Dark</option>
                                        <option value="vue">Vue</option>
                                        <option value="synthwave">Synthwave</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Panel: Output & Code */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-w-0 transition-all">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 flex-wrap gap-3">
                            <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                        activeTab === 'preview'
                                            ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                    }`}
                                >
                                    <Eye className="w-3.5 h-3.5" /> Preview
                                </button>
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                        activeTab === 'code'
                                            ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                    }`}
                                >
                                    <Code2 className="w-3.5 h-3.5" /> Source
                                </button>
                            </div>

                            <button
                                onClick={handleInsertToDraft}
                                disabled={!generatedMd}
                                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    inserted
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'
                                }`}
                            >
                                {inserted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                                {inserted ? 'Added to Editor!' : 'Add to Editor'}
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/20 dark:bg-slate-950/10">
                            {activeTab === 'preview' ? (
                                <div className="p-6 md:p-10 github-markdown-preview max-w-4xl mx-auto">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {generatedMd}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <textarea
                                    value={generatedMd}
                                    readOnly
                                    className="w-full h-full p-6 font-mono text-xs bg-transparent border-none focus:outline-none resize-none text-slate-700 dark:text-slate-300 leading-loose"
                                    spellCheck={false}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
