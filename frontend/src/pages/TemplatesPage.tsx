import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, CheckCircle, BookOpen, User,
    GraduationCap, Copy, ArrowRight
} from 'lucide-react';
import { useDraftStore } from '../store/useDraftStore';
import { useThemeStore } from '../store/useThemeStore';
import Navbar from '../components/Navbar';
import { markdownToHtml } from '../lib/markdownParser';

interface Template {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    content: string;
}

const TEMPLATES: Template[] = [
    {
        id: 'minimal',
        name: 'Minimalist Project',
        description: 'A clean, high-contrast skeleton for simple scripts, small libraries, or single-file packages.',
        icon: <FileText className="w-6 h-6 text-slate-500" />,
        content: `# My Minimal Project\n\nA short and sweet description of what this project does and why it is awesome.\n\n## Installation\n\n\`\`\`bash\nnpm install my-minimal-project\n\`\`\`\n\n## Usage\n\n\`\`\`javascript\nimport { greet } from 'my-minimal-project';\ngreet('World');\n\`\`\`\n\n## License\n\nMIT`
    },
    {
        id: 'comprehensive',
        name: 'Comprehensive Library',
        description: 'Detailed layout suitable for production packages, containing features lists, badge presets, run environments, and guides.',
        icon: <BookOpen className="w-6 h-6 text-blue-500" />,
        content: `<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-green?style=for-the-badge" alt="Active Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

# Awesome App

The ultimate tool to solve all your modern dev workflows.

---

## Features

- Lightning fast performance
- Premium dark/light themes built-in
- Highly secure and tested

## Tech Stack

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

## Setup & Development

Follow these steps to run the application locally:

\`\`\`bash\n# Install dependencies\nnpm install\n\n# Run local dev server\nnpm run dev\n\`\`\`

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License

This project is licensed under the MIT License.`
    },
    {
        id: 'api-server',
        name: 'API Reference Server',
        description: 'Specifically formatted for web services, REST APIs, or microservices, featuring endpoint tables and docker setups.',
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        content: `# API Server Core\n\nProduction backend service that powers user management, notifications, and telemetry.\n\n## Quick Start\n\n\`\`\`bash\n# Duplicate template env file\ncp .env.example .env\n\n# Startup server\ndocker-compose up -d\n\`\`\`\n\n## Endpoint Documentation\n\n| Method | Endpoint | Description | Response Code |\n|---|---|---|---|\n| GET | \`/api/v1/health\` | Liveness probe | 200 OK |\n| POST | \`/api/v1/auth/login\` | Returns JWT session token | 200 OK / 401 Unauthorized |\n\n## Deployment\n\nDeploy directly to AWS ECS using GitHub Actions workflow config.`
    },
    {
        id: 'portfolio',
        name: 'Developer Profile Page',
        description: 'Sleek index card skeleton to act as your Github Profile Readme introduction.',
        icon: <User className="w-6 h-6 text-purple-500" />,
        content: `# Hi there, I'm a Software Engineer!\n\nI am passionate about creating tools that automate and enhance software developer environments.\n\n## About Me\n\n- Currently studying Distributed Systems architectures\n- Contributor to several developer tools & open-source formats\n- Let's connect on [LinkedIn](https://linkedin.com)\n\n## Core Languages & Frameworks\n\n<p>\n  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />\n  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />\n  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />\n</p>`
    },
    {
        id: 'academic',
        name: 'Academic & Research',
        description: 'Organized outline designed for scientific repositories, papers, ML pipelines, featuring citations.',
        icon: <GraduationCap className="w-6 h-6 text-amber-500" />,
        content: `# Deep Learning Training Pipeline\n\nOfficial repository containing raw training data loaders, model definition, and metrics compilation.\n\n## Abstract\n\nThis repository provides a reproducible implementation of our research paper detailing optimization configurations for sparse convolutional transformers.\n\n## Setup Environment\n\n\`\`\`bash\nconda create -n paper python=3.10\nconda activate paper\npip install -r requirements.txt\n\`\`\`\n\n## Training & Evaluation\n\n\`\`\`bash\npython train.py --config configs/transformer_baseline.yaml --epochs 100\n\`\`\`\n\n## Citation\n\n\`\`\`bibtex\n@article{research_paper_2026,\n  author = {Your Name et al.},\n  title = {Sparse Convolutional Transformers},\n  journal = {Journal of AI Research},\n  year = {2026}\n}\n\`\`\``
    }
];

export default function TemplatesPage() {
    const navigate = useNavigate();
    const { isDarkMode } = useThemeStore();
    const { setMarkdown, setHtmlContent } = useDraftStore();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleLoad = (content: string) => {
        const confirm = window.confirm("Load this template? This will replace your current editor draft.");
        if (confirm) {
            setMarkdown(content);
            setHtmlContent(markdownToHtml(content));
            navigate('/');
        }
    };

    const handleCopy = async (id: string, content: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div>
                            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900 dark:text-slate-100">
                                Markdown Blueprint Center
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Pick from our clean, minimal templates designed for clarity and clean formatting.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {TEMPLATES.map((tpl) => (
                                <div
                                    key={tpl.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl shrink-0">
                                                {tpl.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                    {tpl.name}
                                                </h3>
                                                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                                                    {tpl.id}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {tpl.description}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-850">
                                        <button
                                            onClick={() => handleCopy(tpl.id, tpl.content)}
                                            className="flex-1 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            {copiedId === tpl.id ? 'Copied!' : 'Copy Code'}
                                        </button>
                                        <button
                                            onClick={() => handleLoad(tpl.content)}
                                            className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl transition-all flex items-center justify-center gap-1"
                                        >
                                            Use Blueprint <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
