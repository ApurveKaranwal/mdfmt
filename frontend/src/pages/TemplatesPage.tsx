import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Copy, ArrowRight, Building2, Server, 
    BrainCircuit, Globe2, Terminal, UserSquare2
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
        id: 'enterprise-monorepo',
        name: 'Enterprise Monorepo',
        description: 'Massive blueprint designed for large-scale corporate monorepos with multiple packages, deep architecture diagrams, and comprehensive setup guides.',
        icon: <Building2 className="w-6 h-6 text-blue-500" />,
        content: `<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-green?style=for-the-badge" alt="Active Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Coverage-98%25-brightgreen?style=for-the-badge" alt="Coverage" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" alt="Build Status" />
</p>

# 🏢 Enterprise Core Services Monorepo

Welcome to the central repository for the Enterprise Core Services architecture. This monorepo utilizes Turborepo and pnpm workspaces to seamlessly manage shared libraries, microservices, and internal UI components.

---

## 🏗️ Architecture Overview

The codebase is strictly modularized into distinct packages:

| Package | Role | Path | Tech Stack |
|---------|------|------|------------|
| \`@core/ui\` | Shared React Component Library | \`/packages/ui\` | React, Tailwind, Storybook |
| \`@core/auth\` | Authentication Microservice | \`/apps/auth-service\` | Node.js, Express, Redis |
| \`@core/db\` | Database ORM & Migrations | \`/packages/db\` | Prisma, PostgreSQL |
| \`@core/web\` | Main Customer Facing Portal | \`/apps/web\` | Next.js, TRPC |

### Data Flow Pattern

\`\`\`mermaid
graph TD;
    Client[Web Client] --> Gateway[API Gateway];
    Gateway --> Auth[Auth Service];
    Gateway --> Users[User Service];
    Auth --> Cache[(Redis Cache)];
    Users --> DB[(PostgreSQL Master)];
\`\`\`

## 🚀 Quick Start & Environment Setup

This project requires **Node.js v20+** and **pnpm v8+**.

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/company/enterprise-core.git
cd enterprise-core
pnpm install
\`\`\`

### 2. Infrastructure Setup
You must have Docker running locally to spin up the required databases and caches:
\`\`\`bash
cd packages/infrastructure
docker-compose up -d
\`\`\`

### 3. Database Initialization
\`\`\`bash
pnpm --filter @core/db db:push
pnpm --filter @core/db db:seed
\`\`\`

### 4. Run the Development Server
This will start all applications concurrently utilizing Turbo's pipeline.
\`\`\`bash
pnpm run dev
\`\`\`

## 🔒 Security Guidelines & CI/CD

All pull requests must pass the rigorous CI/CD pipeline which includes:
1. **ESLint & Prettier** checks on all modified files.
2. **Jest Unit Tests** achieving a minimum of 90% branch coverage.
3. **Snyk Security Scans** for dependency vulnerabilities.
4. **Playwright E2E Tests** running against a staging preview deployment.

## 📄 Licensing & Governance
Confidential and Proprietary. All rights reserved by Enterprise Inc. Do not distribute without explicit permission.`
    },
    {
        id: 'api-server-pro',
        name: 'API Server Pro',
        description: 'Extensive REST and GraphQL API backend template featuring deep endpoint documentation, authentication flows, and deployment configurations.',
        icon: <Server className="w-6 h-6 text-green-500" />,
        content: `# ⚡ High-Performance API Gateway

The primary REST API backend serving millions of requests per day. Built on Go and Fiber for extreme concurrency and low latency.

## 🔧 Prerequisites
- Go 1.21+
- PostgreSQL 15+
- Redis 7+

## 🚀 Installation & Running

\`\`\`bash
# 1. Download Modules
go mod download

# 2. Setup Config
cp config.example.yaml config.yaml
# Edit config.yaml with your local database credentials

# 3. Start the Server
go run cmd/server/main.go
\`\`\`

## 📚 Core API Endpoints

All endpoints are prefixed with \`/api/v1\`. Authentication is required via the \`Authorization: Bearer <token>\` header for all protected routes.

### User Management

| Method | Endpoint | Auth | Description | Parameters |
|--------|----------|------|-------------|------------|
| POST | \`/users/register\` | No | Create a new user account | \`email\`, \`password\`, \`name\` |
| POST | \`/users/login\` | No | Authenticate and retrieve JWT | \`email\`, \`password\` |
| GET | \`/users/me\` | Yes | Get the currently authenticated user's profile | None |
| PATCH | \`/users/me\` | Yes | Update user profile details | \`name\`, \`avatar_url\` |
| DELETE | \`/users/me\` | Yes | Permanently delete account | None |

### Product Catalog

| Method | Endpoint | Auth | Description | Parameters |
|--------|----------|------|-------------|------------|
| GET | \`/products\` | No | List available products | \`limit\`, \`offset\`, \`category\` |
| GET | \`/products/:id\` | No | Get details for a single product | None |
| POST | \`/products\` | Admin | Create a new product | \`title\`, \`price\`, \`inventory\` |

## 🛡️ Authentication Architecture

The system utilizes stateless JWTs (JSON Web Tokens) with short-lived access tokens (15m) and long-lived, rotating refresh tokens (7d) stored securely in Redis.

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant API
    participant Redis
    participant DB
    
    Client->>API: POST /users/login {email, password}
    API->>DB: Verify credentials
    DB-->>API: Valid user details
    API->>Redis: Store Refresh Token
    API-->>Client: Access Token (JWT) + HTTPOnly Cookie (Refresh)
\`\`\`

## 🐳 Docker Deployment

To build for production environments:

\`\`\`bash
docker build -t api-gateway:latest -f build/Dockerfile .
docker run -p 8080:8080 --env-file .env api-gateway:latest
\`\`\`

## 📝 License
This project is open-sourced under the Apache 2.0 License.`
    },
    {
        id: 'data-science',
        name: 'Data Science & ML Pipeline',
        description: 'Organized outline designed for scientific repositories, papers, ML pipelines, featuring datasets, metrics, and citations.',
        icon: <BrainCircuit className="w-6 h-6 text-amber-500" />,
        content: `# 🧠 Deep Sparse Convolutional Transformers

Official repository for the paper: *"Optimizing Attention Mechanisms using Sparse Convolutions for Low-Latency Inference"*

This repository contains the complete PyTorch implementation, training scripts, dataset loaders, and pre-trained weights to reproduce the results presented in our publication.

## 📊 Abstract

Traditional Transformer architectures scale quadratically with sequence length, severely bottlenecking deployment on edge devices. By introducing a novel Sparse Convolutional projection layer before the multi-head attention mechanism, we achieve a **45% reduction in FLOPs** while maintaining 99% of the baseline accuracy on the GLUE benchmark.

## 🛠️ Environment Setup

We strictly manage dependencies using Anaconda to ensure CUDA compatibility.

\`\`\`bash
# Create the isolated environment
conda create -n sparse_tf python=3.10
conda activate sparse_tf

# Install PyTorch with CUDA 11.8 support
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install library dependencies
pip install -r requirements.txt
\`\`\`

## 📂 Project Structure

\`\`\`text
├── checkpoints/       # Saved model weights
├── configs/           # YAML configuration files for experiments
├── data/              # Dataset loading and preprocessing scripts
├── models/            # PyTorch network architectures
│   ├── layers/        # Custom SparseConv modules
│   └── transformer.py # Core model definition
├── scripts/           # Slurm scripts for cluster training
├── train.py           # Main training loop
└── evaluate.py        # Evaluation metrics generation
\`\`\`

## 🏋️‍♂️ Training the Model

To train the model from scratch on the WikiText-103 dataset, execute the following command. Note that a GPU with at least 16GB of VRAM is required.

\`\`\`bash
python train.py \\
    --config configs/sparse_baseline.yaml \\
    --batch_size 32 \\
    --learning_rate 3e-4 \\
    --epochs 50 \\
    --wandb_logging True
\`\`\`

### Distributed Data Parallel (DDP)

For multi-GPU training, use the torchrun utility:

\`\`\`bash
torchrun --nproc_per_node=4 train.py --config configs/sparse_large.yaml
\`\`\`

## 📈 Results & Evaluation

| Model | Params (M) | FLOPs (G) | GLUE Score | Inference (ms) |
|-------|------------|-----------|------------|----------------|
| Standard T5 | 220 | 14.5 | 88.4 | 145 |
| **Sparse-T5 (Ours)** | 215 | **8.1** | **88.1** | **82** |

## 📜 Citation

If you find this code or our paper useful in your research, please cite:

\`\`\`bibtex
@article{sparse_transformers_2026,
  author = {Smith, J. and Doe, J.},
  title = {Optimizing Attention Mechanisms using Sparse Convolutions},
  journal = {Journal of Machine Learning Research},
  volume = {42},
  year = {2026}
}
\`\`\``
    },
    {
        id: 'open-source',
        name: 'Open Source Master',
        description: 'The ultimate template for community-driven open source projects. Includes contribution guidelines, sponsors, and detailed library usage.',
        icon: <Globe2 className="w-6 h-6 text-indigo-500" />,
        content: `<p align="center">
  <img src="https://img.shields.io/github/stars/username/repo?style=social" alt="Stars" />
  <img src="https://img.shields.io/npm/dw/package-name?style=flat-square" alt="Downloads" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
</p>

<h1 align="center">SuperUI Component Library</h1>

<p align="center">
  <strong>The most accessible, customizable, and lightweight UI library for React.</strong>
</p>

## ✨ Features

- ♿ **Fully Accessible:** Strictly adheres to WAI-ARIA guidelines.
- 🎨 **Headless & Styled:** Use our beautiful default styles, or bring your own CSS/Tailwind.
- 📦 **Tree-shakeable:** Zero dependencies and tiny bundle sizes.
- 🌙 **Dark Mode Native:** First-class support for dynamic color themes.

## 📦 Installation

Available via npm, pnpm, and yarn.

\`\`\`bash
npm install super-ui
# or
pnpm add super-ui
\`\`\`

## 💻 Usage Example

Integrating SuperUI into your application is incredibly simple.

\`\`\`tsx
import { Button, Modal, useToast } from 'super-ui';
import 'super-ui/styles.css'; // Optional default styles

export default function App() {
  const { toast } = useToast();

  return (
    <div className="app-container">
      <Button 
        variant="primary" 
        onClick={() => toast('Hello World!')}
      >
        Click Me!
      </Button>
    </div>
  );
}
\`\`\`

## 🛠️ Component API Reference

### \`<Button>\`

The primary call-to-action component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`variant\` | \`'primary' \| 'secondary' \| 'ghost' \| 'danger'\` | \`'primary'\` | The visual style of the button. |
| \`size\` | \`'sm' \| 'md' \| 'lg'\` | \`'md'\` | The physical dimensions and padding. |
| \`isLoading\` | \`boolean\` | \`false\` | Displays a spinner and disables the button. |
| \`leftIcon\` | \`ReactNode\` | \`undefined\` | Renders an icon before the text. |

## 🤝 Contributing

We love our contributors! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes using conventional commits
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## ❤️ Sponsors

This project is supported by generous individuals and companies. If you use SuperUI in a commercial project, please consider sponsoring us!

[Become a Sponsor!](https://github.com/sponsors/username)`
    },
    {
        id: 'cli-tool',
        name: 'Command Line Tool',
        description: 'A crisp, no-nonsense template tailored for CLI applications, featuring install scripts, flags documentation, and animated terminal demos.',
        icon: <Terminal className="w-6 h-6 text-pink-500" />,
        content: `# 🚀 turbo-fetch

A ridiculously fast, concurrent HTTP benchmarking and data extraction CLI tool built in Rust.

![Demo](https://via.placeholder.com/800x400.png?text=Terminal+GIF+Demo)

## ⚡ Quick Install

**Mac / Linux (Homebrew):**
\`\`\`bash
brew tap username/turbo-fetch
brew install turbo-fetch
\`\`\`

**Windows (Scoop):**
\`\`\`bash
scoop bucket add username https://github.com/username/scoop-bucket.git
scoop install turbo-fetch
\`\`\`

**Cargo (Cross-platform):**
\`\`\`bash
cargo install turbo-fetch
\`\`\`

## 💻 Usage

Run a simple benchmark with 100 concurrent connections:
\`\`\`bash
tf --url https://api.example.com --concurrency 100 --requests 1000
\`\`\`

Extract JSON payloads to a local file:
\`\`\`bash
tf --url https://api.example.com/data --extract ".data.users" --output users.json
\`\`\`

### 🚩 Available Flags

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| \`--url\` | \`-u\` | REQUIRED | The target URL to fetch |
| \`--concurrency\` | \`-c\` | \`10\` | Number of concurrent workers |
| \`--requests\` | \`-n\` | \`1\` | Total number of requests to execute |
| \`--extract\` | \`-e\` | \`""\` | jq-style query to extract JSON data |
| \`--output\` | \`-o\` | \`stdout\` | Output file path |
| \`--headers\` | \`-H\` | \`""\` | Custom HTTP headers (e.g. \`"Auth: Bearer token"\`) |

## 🛠️ Build from Source

\`\`\`bash
git clone https://github.com/username/turbo-fetch.git
cd turbo-fetch
cargo build --release
./target/release/tf --version
\`\`\`

## 📝 License

MIT License. See \`LICENSE\` for more details.
`
    },
    {
        id: 'portfolio',
        name: 'Personal Portfolio',
        description: 'Clean personal profile README for your GitHub profile with tech stacks, social links, and current projects.',
        icon: <UserSquare2 className="w-6 h-6 text-teal-500" />,
        content: `### Hi there, I'm Alex 👋

I'm a Full-Stack Developer passionate about building accessible web applications and scaling distributed systems. Currently working at **TechCorp**, helping build the future of cloud computing.

<p align="left">
  <a href="https://twitter.com/alexdev"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"/></a>
  <a href="https://linkedin.com/in/alexdev"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>
  <a href="https://alexdev.io"><img src="https://img.shields.io/badge/Portfolio-2563EB?style=for-the-badge&logo=react&logoColor=white" alt="Portfolio"/></a>
</p>

---

### 💻 Tech Stack

- **Frontend:** React, Next.js, TypeScript, TailwindCSS
- **Backend:** Node.js, Go, Express, GraphQL
- **Database:** PostgreSQL, MongoDB, Redis
- **DevOps:** Docker, AWS (EC2, S3, RDS), GitHub Actions

### 🚀 Currently Working On

- 🔭 Building a high-performance open-source HTTP client in Rust.
- 🌱 Learning WebAssembly and WebGL for interactive 3D experiences.
- 👯 Looking to collaborate on tools that improve developer productivity.
- 💬 Ask me about **React Architecture** or **Database Optimization**.

### 📈 GitHub Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=dracula" alt="GitHub Stats" width="48%"/>
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_USERNAME&layout=compact&theme=dracula" alt="Top Languages" width="48%"/>
</p>

### 📫 Contact Me

Drop me an email at **hello@alexdev.io** if you want to chat about a project or just say hi!
`
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
            <div className="flex flex-col h-screen bg-transparent text-slate-950 dark:text-slate-100 transition-colors font-sans antialiased overflow-hidden">
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
                                    className="glass-panel rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
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
