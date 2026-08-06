import { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Sparkles,
  Laptop,
  CheckCircle2,
  Zap,
  Code2,
  Eye,
  FileText,
  GitCompare,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function CliPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'commands' | 'flags' | 'local'>('quick');
  const [simTab, setSimTab] = useState<'console' | 'preview' | 'diff'>('console');

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const commandsList = [
    {
      command: 'npx mdfmt',
      description: 'Zero-setup interactive wizard. Scans local repo, detects stack, and prompts for tone.',
      example: 'npx mdfmt'
    },
    {
      command: 'mdfmt generate -l',
      description: 'Instant 0.1s offline mode. Generates complete README locally without server connection.',
      example: 'mdfmt generate --offline'
    },
    {
      command: 'mdfmt generate -y',
      description: 'Non-interactive CI/CD mode. Uses smart repo defaults to write README.md.',
      example: 'mdfmt generate --yes'
    },
    {
      command: 'mdfmt generate -o DOCS.md',
      description: 'Custom output target path or custom file destination.',
      example: 'mdfmt generate -o documentation.md'
    },
    {
      command: 'mdfmt generate -i "Add API table"',
      description: 'Pass custom instructions to tailor specific section requirements.',
      example: 'mdfmt generate -i "Focus on REST endpoints & security"'
    },
    {
      command: 'mdfmt generate -k <KEY>',
      description: 'Pass direct Groq API Key to power generation with Groq LLaMA 3.3 models.',
      example: 'mdfmt generate --groq-key gsk_...'
    },
    {
      command: 'mdfmt init',
      description: 'Initialize mdfmt documentation wizard profile in local project folder.',
      example: 'mdfmt init'
    }
  ];

  const flagsList = [
    { flag: '-l, --offline', desc: 'Instant standalone offline generator (bypasses network/server)' },
    { flag: '-o, --output <path>', desc: 'Output target filename (default: README.md)' },
    { flag: '-y, --yes', desc: 'Skip interactive prompts and execute non-interactively' },
    { flag: '-i, --instructions <text>', desc: 'Custom developer instructions for AI engine' },
    { flag: '-s, --server <url>', desc: 'Specify custom mdfmt backend API server URL (default: http://localhost:5000)' },
    { flag: '-k, --groq-key <key>', desc: 'Provide direct Groq API Key for local LLM generation' },
    { flag: '-h, --help', desc: 'Display CLI help menu and list of available options' },
    { flag: '-V, --version', desc: 'Print current mdfmt CLI version' }
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-10">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            mdfmt CLI Engine 1.0
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Document repos directly from your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Terminal & VS Code
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Run <code className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-md border border-indigo-200 dark:border-indigo-800/50">npx mdfmt</code> in any repository to scan files, detect tech stacks, format package scripts, and write human-like README documentation in seconds.
          </p>

          {/* QUICK COMMAND BAR */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl shadow-xl font-mono text-sm sm:text-base w-full sm:w-auto justify-between flex-1">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">$</span>
                <span className="font-semibold text-white">npx mdfmt</span>
              </div>
              <button
                onClick={() => copyToClipboard('npx mdfmt')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'npx mdfmt' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 px-5 py-3.5 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md font-mono text-sm sm:text-base w-full sm:w-auto justify-between flex-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">$</span>
                <span className="text-slate-700 dark:text-slate-300">mdfmt generate -l</span>
              </div>
              <button
                onClick={() => copyToClipboard('mdfmt generate --offline')}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy offline command"
              >
                {copiedCmd === 'mdfmt generate --offline' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* WEBSITE-MATCHING TERMINAL & README PREVIEW SIMULATOR */}
        <section className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl p-2">
          {/* WINDOW TITLE BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-slate-900/90 dark:bg-slate-900 rounded-2xl border border-slate-800/80 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-300 flex items-center gap-2 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> mdfmt — Interactive CLI Simulator
              </span>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSimTab('console')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  simTab === 'console'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Console Output
              </button>
              <button
                onClick={() => setSimTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  simTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Live README Preview
              </button>
              <button
                onClick={() => setSimTab('diff')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  simTab === 'diff'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" /> Terminal Diff
              </button>
            </div>
          </div>

          {/* TAB 1: CONSOLE OUTPUT */}
          {simTab === 'console' && (
            <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 bg-slate-950/90 rounded-b-2xl mt-2 min-h-[380px]">
              <div className="text-cyan-400 pt-1 flex items-center gap-3">
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold shadow-sm">mdfmt</span>
                <span className="text-slate-200 font-bold">README Studio CLI — v1.0.0</span>
              </div>

              <div className="flex items-center gap-2 text-slate-100 pt-2">
                <span className="text-green-400 font-bold">~/my-awesome-app</span>
                <span className="text-indigo-400 font-bold">$</span>
                <span className="text-white font-bold">mdfmt generate --offline</span>
              </div>

              <div className="text-slate-400 flex items-center gap-2">
                <span className="text-green-400">✔</span>
                <span>Analyzed workspace: <strong className="text-white">my-awesome-app</strong></span>
                <span className="text-slate-500">(Node.js, TypeScript, React, TailwindCSS, Express)</span>
              </div>

              <div className="text-slate-400 flex items-center gap-2">
                <span className="text-amber-400">⚡</span>
                <span>Generated using mdfmt local engine (Instant 0.1s Offline Mode)</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="text-indigo-400 font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Generated Sections matching mdfmt Website Templates:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Centered Brand Logo & Title Header</div>
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Custom Navigation Pills (<span className="text-indigo-400">for-the-badge</span>)</div>
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Tech Stack Architecture Table</div>
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Directory Module Guide Table</div>
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Package Scripts Reference Table</div>
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Interactive Installation Guide</div>
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Environment Variables Table</div>
                  <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-indigo-400" /> Troubleshooting & FAQ Dropdowns</div>
                </div>
              </div>

              <div className="text-green-400 font-semibold pt-2 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>🎉 Successfully generated README.md! Saved directly in local project root.</span>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE RENDERED PREVIEW (EXACT WEBSITE STYLING) */}
          {simTab === 'preview' && (
            <div className="p-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 max-h-[500px] overflow-y-auto space-y-6 text-sm rounded-b-2xl mt-2">
              <div className="text-center space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <img
                  src="https://img.icons8.com/fluency/96/markdown.png"
                  alt="mdfmt logo"
                  className="w-16 h-16 mx-auto"
                />
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  my-awesome-app
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                  A modern, high-performance web platform built with Node.js, TypeScript, React, Express, and TailwindCSS.
                </p>

                {/* NAVIGATION BADGES */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-md">📖 Overview</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-cyan-600 text-white font-bold text-xs shadow-md">✨ Features</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-md">⚙️ Tech Stack</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs shadow-md">🚀 Getting Started</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs shadow-md">📂 Directory Guide</span>
                </div>

                {/* TECH SHIELDS */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
                  <img src="https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react&logoColor=white" alt="React" />
                  <img src="https://img.shields.io/badge/Node.js-20.0-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
                  <img src="https://img.shields.io/badge/Express-5.0-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
                  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
                  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT License" />
                </div>
              </div>

              {/* OVERVIEW */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" /> Overview
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>my-awesome-app</strong> is engineered to deliver a structured, scalable, and maintainable codebase. It decouples business logic from presentation layers, enforcing clean software design principles across modules.
                </p>
              </div>

              {/* TECH STACK TABLE */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" /> Tech Stack Architecture
                </h2>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Technology</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Role in Repository</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                      <tr>
                        <td className="p-3 font-bold text-indigo-500">TypeScript</td>
                        <td className="p-3 font-mono">Language</td>
                        <td className="p-3">Static typing, interface definitions, and IDE intellisense.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-indigo-500">React</td>
                        <td className="p-3 font-mono">Frontend UI</td>
                        <td className="p-3">Component-based reactive UI rendering and state hooks.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-indigo-500">Express</td>
                        <td className="p-3 font-mono">Backend API</td>
                        <td className="p-3">RESTful API routing, middleware chains, and HTTP request handling.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TERMINAL DIFF */}
          {simTab === 'diff' && (
            <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 space-y-2 bg-slate-950/90 rounded-b-2xl mt-2 min-h-[380px]">
              <div className="text-indigo-400 font-bold border-b border-slate-800 pb-2">--- Terminal Diff Preview (Existing vs mdfmt Generated) ---</div>
              <div className="text-red-400">- L1: # my-awesome-app</div>
              <div className="text-red-400">- L2: A simple project.</div>
              <div className="text-green-400">+ L1: &lt;p align="center"&gt;&lt;img src="https://img.icons8.com/fluency/96/markdown.png" width="80" /&gt;&lt;/p&gt;</div>
              <div className="text-green-400">+ L2: &lt;h1 align="center"&gt;my-awesome-app&lt;/h1&gt;</div>
              <div className="text-green-400">+ L3: &lt;p align="center"&gt;&lt;a href="#-overview"&gt;&lt;img src="https://img.shields.io/badge/📖_Overview-4f46e5?style=for-the-badge" /&gt;&lt;/a&gt;&lt;/p&gt;</div>
              <div className="text-green-400">+ L4: ## ⚙️ Tech Stack Architecture Matrix Table</div>
              <div className="text-slate-500 pt-2">... [200+ detailed lines generated cleanly]</div>
            </div>
          )}
        </section>

        {/* FEATURES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3 hover:-translate-y-1">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 w-fit text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">VS Code Terminal Native</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Works seamlessly inside VS Code integrated terminal (`Ctrl + ~`) across Windows PowerShell, macOS, and Linux.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3 hover:-translate-y-1">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 w-fit text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">0.1s Instant Offline Mode</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Use `--offline` to generate complete, ultra-detailed documentation locally without any server dependencies.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3 hover:-translate-y-1">
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 w-fit text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Directory & Script Scanner</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Scans manifests (`package.json`, `Cargo.toml`, `pyproject.toml`) and categorizes scripts and modules automatically.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3 hover:-translate-y-1">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 w-fit text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Privacy & Secret Redaction</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Parses `.gitignore` and redacts API keys, credentials, and `.env` secrets automatically.
            </p>
          </div>
        </section>

        {/* COMMAND REFERENCE TABS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">CLI Documentation & Command Guide</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to master mdfmt CLI in terminal</p>
            </div>

            <div className="flex glass-panel p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex-wrap">
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'quick'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Quick Setup
              </button>
              <button
                onClick={() => setActiveTab('commands')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'commands'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Commands
              </button>
              <button
                onClick={() => setActiveTab('flags')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'flags'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Flags & Options
              </button>
              <button
                onClick={() => setActiveTab('local')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'local'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Local Dev Setup
              </button>
            </div>
          </div>

          {activeTab === 'quick' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-md">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> 1. Interactive Terminal Setup
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Open VS Code integrated terminal (`Ctrl + ~`) in your project folder and run:
                </p>
                <div className="p-3.5 bg-slate-900 text-indigo-400 font-mono text-xs rounded-2xl flex items-center justify-between border border-slate-800">
                  <span className="font-semibold text-indigo-300">npx mdfmt</span>
                  <button onClick={() => copyToClipboard('npx mdfmt')} className="text-slate-400 hover:text-white">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-md">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                  <Zap className="w-5 h-5 text-amber-500" /> 2. Instant 0.1s Offline Generation
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Generate complete README locally without waiting for server connection:
                </p>
                <div className="p-3.5 bg-slate-900 text-amber-400 font-mono text-xs rounded-2xl flex items-center justify-between border border-slate-800">
                  <span className="font-semibold text-amber-300">mdfmt generate --offline</span>
                  <button onClick={() => copyToClipboard('mdfmt generate --offline')} className="text-slate-400 hover:text-white">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-lg">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 font-semibold">Command</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {commandsList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        {item.command}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{item.description}</td>
                      <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-950/50 rounded-lg">
                        {item.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'flags' && (
            <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-lg">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 font-semibold">Flag / Option</th>
                    <th className="p-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {flagsList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                        {item.flag}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-500" /> Running mdfmt Locally in Your Repository
              </h3>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                  <div className="font-semibold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    Step 1: Link CLI Globally
                  </div>
                  <p className="text-xs text-slate-300">Run <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">npm link</code> inside the <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">cli/</code> directory so <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">mdfmt</code> is registered globally across all terminal sessions:</p>
                  <div className="p-3 bg-slate-950 text-indigo-300 font-mono text-xs rounded-xl border border-slate-800">
                    cd cli && npm link
                  </div>
                </div>

                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                  <div className="font-semibold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    Step 2: Execute in Any Repository
                  </div>
                  <p className="text-xs text-slate-300">Navigate to any folder in your terminal (or VS Code terminal) and execute:</p>
                  <div className="p-3 bg-slate-950 text-green-400 font-mono text-xs rounded-xl border border-slate-800">
                    mdfmt generate --offline
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
        mdfmt — Modern AI-powered README Studio & CLI Tool.
      </footer>
    </div>
  );
}
