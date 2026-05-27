import { type Editor } from '@tiptap/react';
import { LayoutTemplate, FileText, CheckCircle, BookOpen, User, GraduationCap } from 'lucide-react';

interface TemplatesSidebarProps {
    editor: Editor | null;
}

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
        description: 'Clean skeleton for simple libraries or tools.',
        icon: <FileText className="w-5 h-5 text-gray-500" />,
        content: `<h1>My Minimal Project</h1>
<p>A short and sweet description of what this project does and why it is awesome.</p>
<h2>Installation</h2>
<pre><code>npm install my-minimal-project</code></pre>
<h2>Usage</h2>
<pre><code>import { greet } from 'my-minimal-project';\ngreet('World');</code></pre>
<h2>License</h2>
<p>MIT</p>`
    },
    {
        id: 'comprehensive',
        name: 'Comprehensive Project',
        description: 'Detailed structure for production libraries.',
        icon: <BookOpen className="w-5 h-5 text-blue-500" />,
        content: `<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-green?style=for-the-badge" alt="Active Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>
<h1 align="center">Awesome App</h1>
<p align="center">The ultimate tool to solve all your modern dev workflows.</p>

<hr />

<h2>Features</h2>
<ul>
  <li>Lightning fast performance</li>
  <li>Premium dark/light themes built-in</li>
  <li>Highly secure and tested</li>
</ul>

<h2>Tech Stack</h2>
<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

<h2>Setup & Development</h2>
<p>Follow these steps to run the application locally:</p>
<pre><code># Install dependencies\nnpm install\n\n# Run local dev server\nnpm run dev</code></pre>

<h2>Contributing</h2>
<p>Contributions, issues, and feature requests are welcome! Feel free to check the issues page.</p>

<h2>License</h2>
<p>This project is licensed under the MIT License.</p>`
    },
    {
        id: 'api-server',
        name: 'API Reference Server',
        description: 'Perfect for backend service applications.',
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        content: `<h1>API Server Core</h1>
<p>Production backend service that powers user management, notifications, and telemetry.</p>

<h2>Quick Start</h2>
<pre><code># Duplicate template env file\ncp .env.example .env\n\n# Startup server\ndocker-compose up -d</code></pre>

<h2>Endpoint Documentation</h2>
<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Response Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GET</td>
      <td><code>/api/v1/health</code></td>
      <td>Liveness probe</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td>POST</td>
      <td><code>/api/v1/auth/login</code></td>
      <td>Returns JWT session token</td>
      <td>200 OK / 401 Unauthorized</td>
    </tr>
  </tbody>
</table>

<h2>Deployment</h2>
<p>Deploy directly to AWS ECS using GitHub Actions workflow config.</p>`
    },
    {
        id: 'portfolio',
        name: 'Developer Profile',
        description: 'Sleek index card for Github profile profiles.',
        icon: <User className="w-5 h-5 text-purple-500" />,
        content: `<h1>Hi there, I'm a Software Engineer!</h1>
<p>I am passionate about creating tools that automate and enhance software developer environments.</p>

<h2>About Me</h2>
<ul>
  <li>Currently studying Distributed Systems architectures</li>
  <li>Contributor to several developer tools & open-source formats</li>
  <li>Let's connect on <a href="https://linkedin.com">LinkedIn</a></li>
</ul>

<h2>Core Languages & Frameworks</h2>
<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
</p>

<h2>GitHub Analytics</h2>
<p align="left">
  <img src="https://img.shields.io/github/stars/your-username?style=for-the-badge&color=gold" alt="stars" />
</p>`
    },
    {
        id: 'academic',
        name: 'Academic & Research',
        description: 'Structure for data science and ML papers.',
        icon: <GraduationCap className="w-5 h-5 text-amber-500" />,
        content: `<h1>Deep Learning Training Pipeline</h1>
<p>Official repository containing raw training data loaders, model definition, and metrics compilation.</p>

<h2>Abstract</h2>
<p>This repository provides a reproducible implementation of our research paper detailing optimization configurations for sparse convolutional transformers.</p>

<h2>Setup Environment</h2>
<pre><code>conda create -n paper python=3.10\nconda activate paper\npip install -r requirements.txt</code></pre>

<h2>Training & Evaluation</h2>
<pre><code>python train.py --config configs/transformer_baseline.yaml --epochs 100</code></pre>

<h2>Citation</h2>
<pre><code>@article{research_paper_2026,\n  author = {Your Name et al.},\n  title = {Sparse Convolutional Transformers},\n  journal = {Journal of AI Research},\n  year = {2026}\n}</code></pre>`
    }
];

export default function TemplatesSidebar({ editor }: TemplatesSidebarProps) {
    if (!editor) return null;

    const applyTemplate = (content: string, method: 'replace' | 'append') => {
        if (method === 'replace') {
            const confirm = window.confirm("Are you sure you want to replace all current editor content? This action cannot be undone.");
            if (confirm) {
                editor.commands.setContent(content);
            }
        } else {
            editor.chain().focus().insertContent(content).run();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-150 dark:border-gray-800">
                <LayoutTemplate className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Choose a Template</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Kickstart your readme using one of our curated templates. You can append or overwrite.
            </p>

            <div className="space-y-2.5">
                {TEMPLATES.map((tpl) => (
                    <div
                        key={tpl.id}
                        className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col gap-2 group"
                    >
                        <div className="flex items-start gap-2.5">
                            <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 group-hover:scale-105 transition-transform shrink-0">
                                {tpl.icon}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-gray-850 dark:text-gray-200">{tpl.name}</h4>
                                <p className="text-[11px] text-gray-550 dark:text-gray-550 leading-snug line-clamp-2">{tpl.description}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-1">
                            <button
                                onClick={() => applyTemplate(tpl.content, 'append')}
                                className="py-1 px-2 text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md transition-colors"
                            >
                                Append
                            </button>
                            <button
                                onClick={() => applyTemplate(tpl.content, 'replace')}
                                className="py-1 px-2 text-[10px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                            >
                                Replace
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
