import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings, Play, Loader2, AlertCircle, FileText, RefreshCw,
    ChevronRight, HelpCircle
} from 'lucide-react';
import { useDraftStore } from '../store/useDraftStore';
import { useThemeStore } from '../store/useThemeStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '../components/Navbar';
import { markdownToHtml } from '../lib/markdownParser';

interface Job {
    id: string;
    status: 'scraping' | 'generating' | 'needs_review' | 'failed' | 'revising';
    request: {
        projectName: string;
        githubUrl: string;
        instructions?: string;
        documentationDepth: 'readme-only' | 'standard' | 'complete';
    };
    repository?: {
        owner: string;
        repo: string;
        githubUrl: string;
        fileCount: number;
        sampledFileCount: number;
        detectedStack: string[];
    };
    result?: {
        readme: string;
        docs: { path: string; title: string; content: string }[];
        summary: string;
        creatorQuestions: string[];
    };
    error?: string;
}

export default function AiGeneratorPage() {
    const navigate = useNavigate();
    const { isDarkMode } = useThemeStore();
    const { setMarkdown, setHtmlContent } = useDraftStore();

    // Form inputs
    const [projectName, setProjectName] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [groqApiKey, setGroqApiKey] = useState(() => sessionStorage.getItem('mdfmt_groq_api_key') || '');
    const [instructions, setInstructions] = useState('');
    const [depth, setDepth] = useState<'readme-only' | 'standard' | 'complete'>('standard');

    // Job runner state
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [revisionFeedback, setRevisionFeedback] = useState('');
    const [revising, setRevising] = useState(false);

    // Polling hook
    useEffect(() => {
        if (!job || job.status === 'needs_review' || job.status === 'failed') return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/build-ai/jobs/${job.id}`);
                if (!res.ok) throw new Error('Failed to fetch job status');
                const data = await res.json();
                setJob(data.job);
            } catch (err) {
                console.error(err);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [job]);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setJob(null);
        sessionStorage.setItem('mdfmt_groq_api_key', groqApiKey);

        try {
            const res = await fetch('http://localhost:4000/api/build-ai/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName,
                    githubUrl,
                    groqApiKey,
                    instructions,
                    documentationDepth: depth
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to start AI generation job');
            }

            const data = await res.json();
            setJob(data.job);
        } catch (err: any) {
            setError(err.message || 'Server error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRevise = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!job || !revisionFeedback.trim()) return;
        setRevising(true);
        setError('');

        try {
            const res = await fetch(`http://localhost:4000/api/build-ai/jobs/${job.id}/revise`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback: revisionFeedback })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to apply revision feedback');
            }

            const data = await res.json();
            setJob(data.job);
            setRevisionFeedback('');
        } catch (err: any) {
            setError(err.message || 'Server error during revision');
        } finally {
            setRevising(false);
        }
    };

    const handleLoadIntoEditor = () => {
        if (!job || !job.result) return;
        setMarkdown(job.result.readme);
        setHtmlContent(markdownToHtml(job.result.readme));
        navigate('/');
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
                <Navbar />

                <main className="flex-1 flex overflow-hidden p-6 gap-6">
                    {/* Left: Input console panel */}
                    <div className="w-[380px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-y-auto p-5 flex flex-col justify-between custom-scrollbar">
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900 dark:text-slate-100">
                                    AI Readme Agent
                                </h2>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Analyze a GitHub repository with your Groq key and generate deeper README/docs drafts.
                                </p>
                            </div>

                            <form onSubmit={handleCreateJob} className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="e.g. mdfmt"
                                        required
                                        disabled={!!(job && job.status !== 'failed' && job.status !== 'needs_review')}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors disabled:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                                        GitHub Repository URL
                                    </label>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/owner/repo"
                                        required
                                        disabled={!!(job && job.status !== 'failed' && job.status !== 'needs_review')}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors disabled:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                                        Groq API Key
                                    </label>
                                    <input
                                        type="password"
                                        value={groqApiKey}
                                        onChange={(e) => setGroqApiKey(e.target.value)}
                                        placeholder="gsk_..."
                                        required
                                        autoComplete="off"
                                        disabled={!!(job && job.status !== 'failed' && job.status !== 'needs_review')}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors disabled:opacity-60"
                                    />
                                    <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                                        Used only for this generation request. It is not returned by the backend.
                                    </p>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                                        Custom Instructions (Optional)
                                    </label>
                                    <textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="Make it detailed. Emphasize developer setup. Keep tone professional."
                                        rows={3}
                                        disabled={!!(job && job.status !== 'failed' && job.status !== 'needs_review')}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors resize-none disabled:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                                        Output Depth
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
                                        {(['readme-only', 'standard', 'complete'] as const).map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => setDepth(d)}
                                                disabled={!!(job && job.status !== 'failed' && job.status !== 'needs_review')}
                                                className={`py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wide transition-all ${
                                                    depth === d
                                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                                                        : 'text-slate-450 dark:text-slate-500 hover:text-slate-850 dark:hover:text-slate-350'
                                                }`}
                                            >
                                                {d.replace('-only', '')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !!(job && job.status !== 'failed' && job.status !== 'needs_review')}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-850 rounded-xl transition-all disabled:opacity-50 shadow-sm shadow-slate-900/10"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-3.5 h-3.5 fill-current" /> Run Documenter
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Reset / start fresh */}
                        {job && (
                            <button
                                onClick={() => setJob(null)}
                                className="mt-5 w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-400 transition-all"
                            >
                                Reset Form & Start Fresh
                            </button>
                        )}
                    </div>

                    {/* Right: Workspace result pane */}
                    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col min-w-0">
                        {error && (
                            <div className="m-5 p-3 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-xs shrink-0">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Landing view */}
                        {!job && !loading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                                    <Settings className="w-8 h-8 text-slate-350 dark:text-slate-600 animate-pulse mb-4" />
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Workspace Ready</h3>
                                    <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                                    Fill in the repository details and your Groq API key on the left. The generated documentation will appear here.
                                </p>
                            </div>
                        )}

                        {/* Generating workflow screen */}
                        {job && job.status !== 'needs_review' && job.status !== 'failed' && (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-sm mx-auto gap-5">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800 border-t-slate-800 dark:border-t-slate-200 animate-spin flex items-center justify-center" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                                <div className="text-center space-y-1">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                                        Agent Processing Status
                                    </h4>
                                    <p className="text-xs text-slate-500 capitalize">{job.status} repository files...</p>
                                </div>
                            </div>
                        )}

                        {/* Failed screen */}
                        {job && job.status === 'failed' && (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto gap-4 text-center">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Generation Failed</h4>
                                    <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                                        {job.error || 'The scraper could not read repository information correctly. Check your GitHub URL and try again.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Generated Draft review page */}
                        {job && job.status === 'needs_review' && job.result && (
                            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">
                                            Preview Generated Draft
                                        </h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{job.result.summary}</p>
                                    </div>
                                    <button
                                        onClick={handleLoadIntoEditor}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors shadow-sm"
                                    >
                                        Use in Editor <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="flex-1 flex overflow-hidden min-w-0">
                                    {/* Markdown render pane */}
                                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar github-markdown-preview border-r border-slate-250 dark:border-slate-800">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {job.result.readme}
                                        </ReactMarkdown>
                                    </div>

                                    {/* AI Revision sidebar */}
                                    <div className="w-[300px] shrink-0 bg-slate-50/40 dark:bg-slate-950/20 p-5 overflow-y-auto custom-scrollbar flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                                                Review Questions
                                            </h4>
                                            {job.result.creatorQuestions.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {job.result.creatorQuestions.map((q, idx) => (
                                                        <li key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal flex gap-1.5 items-start">
                                                            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                                            {q}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-[11px] text-slate-400">All configurations confidently parsed. No questions pending.</p>
                                            )}
                                        </div>

                                        <form onSubmit={handleRevise} className="space-y-2.5 mt-6 border-t border-slate-150 dark:border-slate-800 pt-4">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                                Request Changes
                                            </label>
                                            <textarea
                                                value={revisionFeedback}
                                                onChange={(e) => setRevisionFeedback(e.target.value)}
                                                placeholder="Ask the AI to change sections, fix information, or rewrite parts..."
                                                rows={4}
                                                required
                                                disabled={revising}
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors resize-none disabled:opacity-60"
                                            />
                                            <button
                                                type="submit"
                                                disabled={revising || !revisionFeedback.trim()}
                                                className="w-full py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                                            >
                                                {revising ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Revising...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="w-3.5 h-3.5" /> Apply Revision
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
