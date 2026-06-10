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
import { Sparkles } from 'lucide-react';

interface Job {
    id: string;
    status: 'scraping' | 'generating' | 'needs_review' | 'failed' | 'revising' | 'approved';
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
    const [instructions, setInstructions] = useState('');
    const [depth, setDepth] = useState<'readme-only' | 'standard' | 'complete'>('standard');

    // Job runner state
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [revisionFeedback, setRevisionFeedback] = useState('');
    const [revising, setRevising] = useState(false);

    // In-browser local AI Worker
    const [magicAiState, setMagicAiState] = useState<{ loading: boolean; progress?: any; error?: string }>({ loading: false });

    // UI State
    const [activeTab, setActiveTab] = useState<'ai' | 'raw'>('ai');

    // Polling hook
    useEffect(() => {
        if (!job || job.status === 'needs_review' || job.status === 'failed' || job.status === 'approved') return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`https://mdfmt.onrender.com/api/build-ai/jobs/${job.id}`);
                if (!res.ok) throw new Error('Failed to fetch job status');
                const data = await res.json();
                setJob(data.job);
            } catch (err) {
                console.error(err);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [job]);

    // History hook
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    
    const fetchRecentJobs = async () => {
        try {
            const res = await fetch('https://mdfmt.onrender.com/api/build-ai/jobs');
            if (res.ok) {
                const data = await res.json();
                setRecentJobs(data.jobs || []);
                // If we don't have a job selected and there are past jobs, maybe we don't auto-select yet
            }
        } catch (err) {
            console.error('Failed to load job history', err);
        }
    };

    useEffect(() => {
        fetchRecentJobs();
    }, []);

    // Also refresh history when a new job finishes
    useEffect(() => {
        if (job && (job.status === 'needs_review' || job.status === 'failed')) {
            fetchRecentJobs();
        }
    }, [job?.status]);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setJob(null);

        try {
            const res = await fetch('https://mdfmt.onrender.com/api/build-ai/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName,
                    githubUrl,
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
            const res = await fetch(`https://mdfmt.onrender.com/api/build-ai/jobs/${job.id}/revise`, {
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
        setRevising(false);
        navigate('/');
    };

    const handleMagicAiExpand = () => {
        if (!job?.result) return;
        setMagicAiState({ loading: true });

        const worker = new Worker(new URL('../lib/aiWorker.ts', import.meta.url), {
            type: 'module'
        });

        worker.postMessage({ text: job.result.readme.slice(0, 300) }); // Send a smaller chunk to prevent OOM

        worker.addEventListener('message', (event) => {
            const { status, result, error } = event.data;

            if (status === 'progress') {
                // Ignore rapid progress updates to prevent React from crashing
                // setMagicAiState({ loading: true, progress });
            } else if (status === 'complete') {
                const newReadme = job.result!.readme + '\n\n### AI Expanded Details\n\n' + result;
                setJob({
                    ...job,
                    result: {
                        ...job.result!,
                        readme: newReadme
                    }
                });
                setMagicAiState({ loading: false });
                worker.terminate();
            } else if (status === 'error') {
                setMagicAiState({ loading: false, error });
                worker.terminate();
            }
        });
    };

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex flex-col h-screen bg-transparent text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
                <Navbar />

                <main className="flex-1 flex overflow-hidden p-6 gap-6">
                    {/* Left: Input console panel */}
                    <div className="w-[380px] shrink-0 flex flex-col gap-5">
                        <div className="glass-panel rounded-2xl p-5">
                            <div className="mb-5">
                                <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900 dark:text-slate-100">
                                    AI Readme Agent
                                </h2>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Analyze a GitHub repository completely offline and generate deeper README/docs drafts.
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
                                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-850 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-sm shadow-slate-900/10"
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

                        {/* Recent Jobs History Sidebar section */}
                        <div className="flex-1 glass-panel rounded-2xl p-5 overflow-hidden flex flex-col">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 shrink-0">Recent Projects</h3>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                {recentJobs.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 italic">No past jobs saved.</p>
                                ) : (
                                    recentJobs.map(pastJob => (
                                        <button
                                            key={pastJob.id}
                                            onClick={() => setJob(pastJob)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all ${
                                                job?.id === pastJob.id 
                                                    ? 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600' 
                                                    : 'bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-xs text-slate-900 dark:text-white truncate max-w-[180px]">
                                                    {pastJob.request.projectName}
                                                </span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                                    pastJob.status === 'needs_review' || pastJob.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    pastJob.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                    {pastJob.status === 'needs_review' ? 'Ready' : pastJob.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-1 truncate">
                                                {pastJob.request.githubUrl.replace('https://github.com/', '')}
                                            </p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Workspace result pane */}
                    <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col min-w-0">
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
                                    Fill in the repository details on the left. The generated documentation will appear here.
                                </p>
                            </div>
                        )}

                        {/* Generating workflow screen */}
                        {job && job.status !== 'needs_review' && job.status !== 'approved' && job.status !== 'failed' && (
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
                        {job && (job.status === 'needs_review' || job.status === 'approved') && job.result && (
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
                                    <div className="w-[300px] shrink-0 bg-slate-50/40 dark:bg-slate-950/20 flex flex-col border-l border-slate-200 dark:border-slate-800">
                                        
                                        {/* Tab Headers */}
                                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                                            <button 
                                                onClick={() => setActiveTab('ai')}
                                                className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'ai' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                            >
                                                AI Tools
                                            </button>
                                            <button 
                                                onClick={() => setActiveTab('raw')}
                                                className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'raw' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                            >
                                                Raw Markdown
                                            </button>
                                        </div>

                                        {/* Tab Content */}
                                        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col justify-between">
                                            {activeTab === 'ai' ? (
                                                <>
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

                                        <div>
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

                                            {/* Magic AI Button */}
                                            <div className="mt-6 border-t border-slate-150 dark:border-slate-800 pt-4">
                                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                                                    <Sparkles className="w-3 h-3 text-purple-500" /> WebGPU Local AI
                                                </h4>
                                                <button
                                                    onClick={handleMagicAiExpand}
                                                    disabled={magicAiState.loading}
                                                    className="w-full py-2 text-[11px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                                                >
                                                    {magicAiState.loading ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 animate-spin" /> First run? Downloading Model (~300MB)...
                                                        </>
                                                    ) : (
                                                        <>Magic Expand Section</>
                                                    )}
                                                </button>
                                                {magicAiState.error && (
                                                    <p className="text-[9px] text-red-500 mt-2">{magicAiState.error}</p>
                                                )}
                                            </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col h-full space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                                        Live Markdown Edit
                                                    </label>
                                                    <textarea
                                                        value={job.result.readme}
                                                        onChange={(e) => setJob({...job, result: {...job.result!, readme: e.target.value}})}
                                                        className="w-full h-full flex-1 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-300 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors custom-scrollbar resize-none"
                                                        placeholder="Edit your raw markdown here..."
                                                    />
                                                </div>
                                            )}
                                        </div>
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
