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
  Code2
} from 'lucide-react';

export default function CliPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'commands' | 'flags' | 'local'>('quick');

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const commandsList = [
    {
      command: 'npx mdfmt',
      description: 'Zero-setup interactive wizard. Scans workspace and prompts for tone and depth.',
      example: 'npx mdfmt'
    },
    {
      command: 'mdfmt generate -l',
      description: 'Instant offline generator. Generates ultra-detailed README locally in 0.1s without server.',
      example: 'mdfmt generate --offline'
    },
    {
      command: 'mdfmt generate -y',
      description: 'Non-interactive mode. Uses smart repo defaults to instantly write README.md.',
      example: 'mdfmt generate --yes'
    },
    {
      command: 'mdfmt generate -o DOCS.md',
      description: 'Specify a custom output path or filename for the generated documentation.',
      example: 'mdfmt generate -o documentation.md'
    },
    {
      command: 'mdfmt generate -i "Add API table"',
      description: 'Provide extra AI instructions to focus on specific features or endpoints.',
      example: 'mdfmt generate -i "Focus on REST API endpoints and setup"'
    },
    {
      command: 'mdfmt generate -k <KEY>',
      description: 'Pass direct Groq API Key to power generation with Groq LLaMA 3 models.',
      example: 'mdfmt generate --groq-key gsk_...'
    },
    {
      command: 'mdfmt init',
      description: 'Initialize mdfmt documentation wizard for the current project.',
      example: 'mdfmt init'
    }
  ];

  const flagsList = [
    { flag: '-l, --offline', desc: 'Instant standalone offline generator (bypasses network/server)' },
    { flag: '-o, --output <path>', desc: 'Output target filename (default: README.md)' },
    { flag: '-y, --yes', desc: 'Skip interactive prompts and run non-interactively' },
    { flag: '-i, --instructions <text>', desc: 'Custom developer instructions for AI engine' },
    { flag: '-s, --server <url>', desc: 'Specify custom mdfmt backend API server URL (default: http://localhost:5000)' },
    { flag: '-k, --groq-key <key>', desc: 'Provide direct Groq API Key for local generation' },
    { flag: '-h, --help', desc: 'Display CLI help menu and list of commands' },
    { flag: '-V, --version', desc: 'Print current mdfmt CLI version' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-12">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            mdfmt CLI Engine 1.0
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Document repos directly from your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Terminal & VS Code
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Run <code className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">npx mdfmt</code> in any repository to scan files, detect tech stacks, format package scripts, and write human-like README documentation in seconds.
          </p>

          {/* QUICK COMMAND BAR */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-3 px-5 py-3 bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100 border border-slate-800 rounded-xl shadow-xl font-mono text-sm sm:text-base w-full sm:w-auto justify-between">
              <span className="text-indigo-400 font-bold">$</span>
              <span>npx mdfmt</span>
              <button
                onClick={() => copyToClipboard('npx mdfmt')}
                className="ml-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'npx mdfmt' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm font-mono text-sm sm:text-base w-full sm:w-auto justify-between">
              <span className="text-amber-500 font-bold">$</span>
              <span className="text-slate-700 dark:text-slate-300">mdfmt generate --offline</span>
              <button
                onClick={() => copyToClipboard('mdfmt generate --offline')}
                className="ml-4 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
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

        {/* TERMINAL SIMULATOR COMPONENT */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> bash — VS Code Integrated Terminal
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">v1.0.0</span>
          </div>

          <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
            <div className="flex items-center gap-2 text-slate-100">
              <span className="text-green-400">~/my-awesome-app</span>
              <span className="text-indigo-400">$</span>
              <span className="text-white font-bold">mdfmt generate --offline</span>
            </div>

            <div className="text-cyan-400 pt-1">
              <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-xs font-bold mr-2">mdfmt</span>
              README Studio CLI
            </div>

            <div className="text-slate-400 flex items-center gap-2">
              <span className="text-green-400">✔</span>
              <span>Analyzed workspace structure: <strong className="text-white">my-awesome-app</strong></span>
              <span className="text-slate-500">(Node.js, TypeScript, React, TailwindCSS, Express)</span>
            </div>

            <div className="text-slate-400 flex items-center gap-2">
              <span className="text-amber-400">ℹ</span>
              <span>Generated using local engine (Instant 0.1s Offline Mode)</span>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1 text-slate-400">
              <div className="text-indigo-400 font-semibold">--- Detailed Output Sections Created ---</div>
              <div className="text-green-400">+ Title & Status Badges (Version, License, Tech Stack)</div>
              <div className="text-green-400">+ 📋 Table of Contents & Overview Narrative</div>
              <div className="text-green-400">+ ⚙️ Tech Stack Architecture Matrix Table</div>
              <div className="text-green-400">+ 📂 Directory Breakdown & Module Guide Table</div>
              <div className="text-green-400">+ 📜 Available Package Scripts Reference Table</div>
              <div className="text-green-400">+ 🚀 Step-by-Step Installation & Setup Walkthrough</div>
              <div className="text-green-400">+ 🔧 Environment Variables Reference Table</div>
              <div className="text-green-400">+ ❓ Interactive Troubleshooting & FAQ Dropdowns</div>
            </div>

            <div className="text-green-400 font-semibold pt-1 flex items-center gap-2">
              <span>🎉 Successfully generated README.md in local project root!</span>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 w-fit text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">VS Code Terminal Native</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Works seamlessly inside VS Code integrated terminal (`Ctrl + ~`) across Windows, macOS, and Linux.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 w-fit text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">0.1s Instant Offline Mode</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Use `--offline` to generate complete, ultra-detailed documentation locally without any server dependencies.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 w-fit text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Directory & Script Scanner</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Scans manifests (`package.json`, `Cargo.toml`, `pyproject.toml`) and categorizes scripts and modules automatically.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 w-fit text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">CLI Documentation & Command Guide</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to master mdfmt CLI in terminal</p>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-wrap">
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'quick'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Quick Setup
              </button>
              <button
                onClick={() => setActiveTab('commands')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'commands'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Commands
              </button>
              <button
                onClick={() => setActiveTab('flags')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'flags'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Flags & Options
              </button>
              <button
                onClick={() => setActiveTab('local')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'local'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Local Dev Setup
              </button>
            </div>
          </div>

          {activeTab === 'quick' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> 1. Interactive Terminal Setup
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Open VS Code integrated terminal (`Ctrl + ~`) in your project folder and run:
                </p>
                <div className="p-3 bg-slate-900 text-indigo-400 font-mono text-xs rounded-xl flex items-center justify-between">
                  <span>npx mdfmt</span>
                  <button onClick={() => copyToClipboard('npx mdfmt')} className="text-slate-400 hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                  <Zap className="w-5 h-5 text-amber-500" /> 2. Instant 0.1s Offline Generation
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Generate complete README locally without waiting for server connection:
                </p>
                <div className="p-3 bg-slate-900 text-amber-400 font-mono text-xs rounded-xl flex items-center justify-between">
                  <span>mdfmt generate --offline</span>
                  <button onClick={() => copyToClipboard('mdfmt generate --offline')} className="text-slate-400 hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
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
                      <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded">
                        {item.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'flags' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-500" /> Running mdfmt Locally in Your Repository
              </h3>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-500">
                    Step 1: Link CLI Globally
                  </div>
                  <p className="text-xs">Run <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">npm link</code> inside the <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">cli/</code> directory so <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">mdfmt</code> is registered globally across all terminal sessions:</p>
                  <div className="p-2.5 bg-slate-900 text-indigo-300 font-mono text-xs rounded-lg">
                    cd cli && npm link
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-500">
                    Step 2: Execute in Any Repository
                  </div>
                  <p className="text-xs">Navigate to any folder in your terminal (or VS Code terminal) and execute:</p>
                  <div className="p-2.5 bg-slate-900 text-green-400 font-mono text-xs rounded-lg">
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
