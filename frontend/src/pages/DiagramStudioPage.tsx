import { useState, useEffect, useRef } from 'react';
import { Workflow, Loader2, Send, CheckCircle2, Code2, Eye } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useDraftStore } from '../store/useDraftStore';
import Navbar from '../components/Navbar';
import mermaid from 'mermaid';

export default function DiagramStudioPage() {
    const { isDarkMode } = useThemeStore();
    const { markdown, setMarkdown } = useDraftStore();

    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mermaidCode, setMermaidCode] = useState("graph TD\n    A[Client] -->|HTTP POST| B(API Gateway)\n    B --> C{Router}\n    C -->|/users| D[User Service]\n    C -->|/auth| E[Auth Service]");
    
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [inserted, setInserted] = useState(false);
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: isDarkMode ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif'
        });
    }, [isDarkMode]);

    useEffect(() => {
        let isMounted = true;
        
        const renderDiagram = async () => {
            if (activeTab === 'preview' && mermaidRef.current) {
                try {
                    // Generate a unique ID for the SVG
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, mermaidCode);
                    if (isMounted && mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg;
                    }
                } catch (err) {
                    console.error("Mermaid parsing error", err);
                    if (isMounted && mermaidRef.current) {
                        mermaidRef.current.innerHTML = `<div class="text-red-500 text-xs p-4 border border-red-500 rounded bg-red-50 dark:bg-red-900/20">Syntax Error: Cannot render diagram. Please check the Mermaid code.</div>`;
                    }
                }
            }
        };

        renderDiagram();
        
        return () => { isMounted = false; };
    }, [mermaidCode, activeTab, isDarkMode]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('https://mdfmt.onrender.com/api/build-ai/diagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate diagram');
            }

            const data = await res.json();
            // Clean up the response in case the LLM returned markdown code blocks or invalid syntax
            let code = data.mermaid || '';
            code = code.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
            // Automatically fix a common LLM hallucination: -->|text|> instead of -->|text|
            code = code.replace(/-->\|([^|]+)\|>/g, '-->|$1|');
            setMermaidCode(code);
            setActiveTab('preview');
        } catch (err: any) {
            setError(err.message || 'Server error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleInsertToDraft = () => {
        const mdBlock = `\n\`\`\`mermaid\n${mermaidCode}\n\`\`\`\n`;
        setMarkdown(markdown + mdBlock);
        setInserted(true);
        setTimeout(() => setInserted(false), 2000);
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex flex-col h-screen bg-transparent text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
                <Navbar />

                <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-4 md:gap-6">
                    {/* Left Panel: Input & Instructions */}
                    <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4 md:gap-5 overflow-y-auto lg:overflow-hidden custom-scrollbar">
                        <div className="glass-panel rounded-2xl p-5 shrink-0 flex flex-col h-full">
                            <div className="mb-5">
                                <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Workflow className="w-4 h-4 text-emerald-500" />
                                    AI Diagram Studio
                                </h2>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                    Describe your software architecture, user flow, or database schema in plain English, and our AI will generate a beautiful Mermaid.js diagram.
                                </p>
                            </div>

                            <form onSubmit={handleGenerate} className="flex-1 flex flex-col">
                                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                                    Description Prompt
                                </label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="E.g., A user logs in via Auth0, which talks to a Node.js API Gateway. The API Gateway routes to the User Service and Order Service..."
                                    className="w-full flex-1 min-h-[150px] p-4 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors custom-scrollbar resize-none mb-4"
                                />

                                {error && (
                                    <div className="p-3 mb-4 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !prompt.trim()}
                                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shrink-0"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> Generate Diagram
                                        </>
                                    )}
                                </button>
                            </form>
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
                                    <Eye className="w-3.5 h-3.5" /> Live Preview
                                </button>
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                        activeTab === 'code'
                                            ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                    }`}
                                >
                                    <Code2 className="w-3.5 h-3.5" /> Mermaid Code
                                </button>
                            </div>

                            <button
                                onClick={handleInsertToDraft}
                                disabled={!mermaidCode}
                                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    inserted
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:scale-105'
                                }`}
                            >
                                {inserted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                                {inserted ? 'Inserted!' : 'Insert to Editor'}
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-slate-50/20 dark:bg-slate-950/10 flex items-center justify-center relative">
                            {activeTab === 'preview' ? (
                                <div className="w-full h-full flex items-center justify-center min-h-[300px]">
                                    <div ref={mermaidRef} className="text-center w-full max-w-full overflow-auto [&>svg]:max-w-none [&>svg]:w-auto [&>svg]:h-auto">
                                        {/* Mermaid SVG will be injected here */}
                                    </div>
                                </div>
                            ) : (
                                <textarea
                                    value={mermaidCode}
                                    onChange={(e) => setMermaidCode(e.target.value)}
                                    className="w-full h-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none text-slate-700 dark:text-slate-300"
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
