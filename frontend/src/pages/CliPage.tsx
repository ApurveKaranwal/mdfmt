import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useThemeStore } from '../store/useThemeStore';
import {
  Terminal,
  Copy,
  Check,
  Eye,
  GitCompare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function CliPage() {
  const { isDarkMode } = useThemeStore();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'commands' | 'flags'>('quick');
  const [simTab, setSimTab] = useState<'console' | 'preview' | 'diff'>('console');

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const CopyBtn = ({ cmd }: { cmd: string }) => (
    <button
      onClick={() => copyToClipboard(cmd)}
      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      title="Copy"
    >
      {copiedCmd === cmd ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-transparent text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
        <Navbar />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-4 md:gap-6">

          {/* LEFT PANEL: Install & Commands */}
          <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-4 md:gap-5 overflow-y-auto custom-scrollbar pr-2">

            {/* Install */}
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-500" /> CLI Tool
              </h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Generate README files from your terminal. Works in VS Code, PowerShell, macOS, and Linux.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Quick Start (no install)</label>
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-900 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-200">
                    <span><span className="text-indigo-400">$</span> npx mdfmt</span>
                    <CopyBtn cmd="npx mdfmt" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Global Install</label>
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-900 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-200">
                    <span><span className="text-indigo-400">$</span> npm install -g mdfmt</span>
                    <CopyBtn cmd="npm install -g mdfmt" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Offline Mode (instant, no server)</label>
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-900 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-200">
                    <span><span className="text-amber-400">$</span> mdfmt generate --offline</span>
                    <CopyBtn cmd="mdfmt generate --offline" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Tabs */}
            <div className="glass-panel rounded-2xl p-5 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 rounded-xl mb-4 shrink-0">
                {(['quick', 'commands', 'flags'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wide transition-all ${
                      activeTab === t
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                        : 'text-slate-450 dark:text-slate-500 hover:text-slate-850 dark:hover:text-slate-350'
                    }`}
                  >
                    {t === 'quick' ? 'Setup' : t}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1">
                {activeTab === 'quick' && (
                  <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-950/50 space-y-2">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Step 1 — Link Locally</div>
                      <p>If developing from source, run <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">npm link</code> inside <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">cli/</code> to register the <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">mdfmt</code> command globally.</p>
                      <div className="px-3 py-1.5 bg-slate-900 dark:bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300">
                        cd cli && npm link
                      </div>
                    </div>
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-950/50 space-y-2">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Step 2 — Run Anywhere</div>
                      <p>Open any project in VS Code, press <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">Ctrl + `</code> to open the terminal, and run:</p>
                      <div className="px-3 py-1.5 bg-slate-900 dark:bg-slate-950 rounded-lg font-mono text-[11px] text-green-400">
                        mdfmt generate
                      </div>
                    </div>
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-950/50 space-y-2">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Step 3 — CI / Automation</div>
                      <p>For non-interactive pipelines or scripts, pass <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">--yes</code> to skip prompts:</p>
                      <div className="px-3 py-1.5 bg-slate-900 dark:bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300">
                        npx mdfmt generate --yes --offline
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'commands' && (
                  <div className="space-y-2">
                    {[
                      { cmd: 'npx mdfmt', desc: 'Interactive wizard — scans repo and prompts for tone and depth.' },
                      { cmd: 'mdfmt generate', desc: 'Generate README for the current directory.' },
                      { cmd: 'mdfmt generate -l', desc: 'Offline mode — instant generation without a server.' },
                      { cmd: 'mdfmt generate -y', desc: 'Non-interactive — use defaults, skip all prompts.' },
                      { cmd: 'mdfmt generate -o DOCS.md', desc: 'Write output to a custom filename.' },
                      { cmd: 'mdfmt generate -i "..."', desc: 'Pass custom instructions to the AI engine.' },
                      { cmd: 'mdfmt generate -k gsk_...', desc: 'Use your own Groq API key for generation.' },
                      { cmd: 'mdfmt init', desc: 'Initialize config wizard in the current project.' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <code className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap font-mono shrink-0 mt-0.5">{item.cmd}</code>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'flags' && (
                  <div className="space-y-2">
                    {[
                      { flag: '-l, --offline', desc: 'Bypass server, generate locally in ~0.1s.' },
                      { flag: '-o, --output <path>', desc: 'Output filename. Defaults to README.md.' },
                      { flag: '-y, --yes', desc: 'Skip interactive prompts.' },
                      { flag: '-i, --instructions <text>', desc: 'Custom instructions for the AI.' },
                      { flag: '-s, --server <url>', desc: 'Custom backend server URL.' },
                      { flag: '-k, --groq-key <key>', desc: 'Groq API key for LLM generation.' },
                      { flag: '-h, --help', desc: 'Show help.' },
                      { flag: '-V, --version', desc: 'Print version.' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-950/50">
                        <code className="text-[11px] font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap font-mono shrink-0 mt-0.5">{item.flag}</code>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Terminal Preview */}
          <div className="flex-1 flex flex-col overflow-hidden glass-panel rounded-2xl">
            {/* Preview/Source tabs */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
                <button
                  onClick={() => setSimTab('console')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all ${
                    simTab === 'console'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <Terminal className="w-3 h-3" /> Console
                </button>
                <button
                  onClick={() => setSimTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all ${
                    simTab === 'preview'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button
                  onClick={() => setSimTab('diff')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all ${
                    simTab === 'diff'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <GitCompare className="w-3 h-3" /> Diff
                </button>
              </div>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Live Demo</span>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">

              {simTab === 'console' && (
                <div className="p-5 bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed space-y-2.5 min-h-full">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">~/my-project</span>
                    <span className="text-slate-500">$</span>
                    <span className="text-white">mdfmt generate --offline</span>
                  </div>
                  <div className="text-slate-500 text-[10px] pt-1">mdfmt v1.0.0</div>

                  <div className="flex items-center gap-2 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>Scanned <span className="text-white font-semibold">my-project</span> — 47 files, 6 directories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>Detected stack: <span className="text-cyan-400">TypeScript</span>, <span className="text-cyan-400">React</span>, <span className="text-cyan-400">Express</span>, <span className="text-cyan-400">TailwindCSS</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Generated via local engine <span className="text-slate-500">(0.1s)</span></span>
                  </div>

                  <div className="mt-3 p-3 border border-slate-800 rounded-lg bg-slate-900 space-y-1.5">
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Sections created</div>
                    <div className="text-green-400">+ Header with logo, badges, navigation pills</div>
                    <div className="text-green-400">+ Table of contents</div>
                    <div className="text-green-400">+ Tech stack architecture table</div>
                    <div className="text-green-400">+ Directory breakdown & module guide</div>
                    <div className="text-green-400">+ Package scripts reference</div>
                    <div className="text-green-400">+ Installation walkthrough</div>
                    <div className="text-green-400">+ Environment variables table</div>
                    <div className="text-green-400">+ Troubleshooting FAQ</div>
                    <div className="text-green-400">+ Contributing guidelines & license</div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-green-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Written to README.md</span>
                  </div>
                </div>
              )}

              {simTab === 'preview' && (
                <div className="p-6 bg-white dark:bg-slate-950 github-markdown-preview min-h-full">
                  <div className="text-center space-y-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <img src="https://img.icons8.com/fluency/96/markdown.png" alt="logo" className="w-14 h-14 mx-auto" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">my-project</h1>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">A modern full-stack application built with TypeScript, React, Express, and TailwindCSS.</p>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                      <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
                      <img src="https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react&logoColor=white" alt="React" />
                      <img src="https://img.shields.io/badge/Express-5.0-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
                      <img src="https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
                      <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT" />
                    </div>
                  </div>
                  <div className="pt-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Overview</h2>
                      <p className="leading-relaxed">A production-ready codebase with decoupled business logic and presentation layers. Modular folder structure for scalability and maintainability.</p>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tech Stack</h2>
                      <table className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                          <tr>
                            <th className="p-2.5 text-left font-semibold border-b border-slate-200 dark:border-slate-800">Technology</th>
                            <th className="p-2.5 text-left font-semibold border-b border-slate-200 dark:border-slate-800">Category</th>
                            <th className="p-2.5 text-left font-semibold border-b border-slate-200 dark:border-slate-800">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-2.5 font-semibold text-indigo-600 dark:text-indigo-400">TypeScript</td><td className="p-2.5 font-mono text-slate-500">Language</td><td className="p-2.5">Static typing and IDE support</td></tr>
                          <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-2.5 font-semibold text-indigo-600 dark:text-indigo-400">React</td><td className="p-2.5 font-mono text-slate-500">Frontend</td><td className="p-2.5">Component-based UI rendering</td></tr>
                          <tr><td className="p-2.5 font-semibold text-indigo-600 dark:text-indigo-400">Express</td><td className="p-2.5 font-mono text-slate-500">Backend</td><td className="p-2.5">REST API routing and middleware</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {simTab === 'diff' && (
                <div className="p-5 bg-slate-950 font-mono text-xs text-slate-300 space-y-1.5 min-h-full">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold pb-2 border-b border-slate-800 mb-3">Diff — existing README vs generated</div>
                  <div className="text-red-400/80">− # my-project</div>
                  <div className="text-red-400/80">− A simple project.</div>
                  <div className="text-slate-600 my-1">...</div>
                  <div className="text-green-400/80">+ &lt;p align="center"&gt;&lt;img src="...markdown.png" width="80" /&gt;&lt;/p&gt;</div>
                  <div className="text-green-400/80">+ &lt;h1 align="center"&gt;my-project&lt;/h1&gt;</div>
                  <div className="text-green-400/80">+ &lt;p align="center"&gt;&lt;strong&gt;A modern full-stack application...&lt;/strong&gt;&lt;/p&gt;</div>
                  <div className="text-green-400/80">+ &lt;p align="center"&gt;</div>
                  <div className="text-green-400/80">+   &lt;a href="#overview"&gt;&lt;img src="...Overview-4f46e5?style=for-the-badge" /&gt;&lt;/a&gt;</div>
                  <div className="text-green-400/80">+   &lt;a href="#features"&gt;&lt;img src="...Features-0891b2?style=for-the-badge" /&gt;&lt;/a&gt;</div>
                  <div className="text-green-400/80">+ &lt;/p&gt;</div>
                  <div className="text-green-400/80">+ ## ⚙️ Tech Stack Architecture</div>
                  <div className="text-green-400/80">+ | Technology | Category | Role |</div>
                  <div className="text-green-400/80">+ | TypeScript | Language | Static typing... |</div>
                  <div className="text-green-400/80">+ ## 📂 Directory Structure</div>
                  <div className="text-green-400/80">+ | Directory | Purpose |</div>
                  <div className="text-green-400/80">+ ## 🚀 Getting Started</div>
                  <div className="text-green-400/80">+ ### Prerequisites</div>
                  <div className="text-green-400/80">+ 1. Clone the repository...</div>
                  <div className="text-slate-600 pt-2">... 180+ lines generated</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
