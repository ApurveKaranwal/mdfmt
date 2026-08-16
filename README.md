<p align="center">
  <img src="https://img.icons8.com/fluency/96/markdown.png" alt="mdfmt logo" width="80" />
</p>

<h1 align="center">mdfmt</h1>

<p align="center">
  <strong>Comprehensive Markdown Studio and Automated Documentation Engine</strong>
</p>

<p align="center">
  <em>Visual WYSIWYG editor, AI documentation generation, local repository CLI analysis, and developer asset tooling.</em>
</p>

<br />

<p align="center">
  <a href="#overview"><img src="https://img.shields.io/badge/Overview-4f46e5?style=flat-square" alt="Overview" /></a>&nbsp;
  <a href="#cli-tool"><img src="https://img.shields.io/badge/CLI_Tool-0284c7?style=flat-square" alt="CLI Tool" /></a>&nbsp;
  <a href="#core-features"><img src="https://img.shields.io/badge/Features-0891b2?style=flat-square" alt="Features" /></a>&nbsp;
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-059669?style=flat-square" alt="Architecture" /></a>&nbsp;
  <a href="#getting-started"><img src="https://img.shields.io/badge/Getting_Started-dc2626?style=flat-square" alt="Getting Started" /></a>&nbsp;
  <a href="#api-reference"><img src="https://img.shields.io/badge/API_Reference-7c3aed?style=flat-square" alt="API Reference" /></a>
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react&logoColor=white" alt="React 19.2" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-7.3-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite 7.3" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3.4" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white" alt="Express 5.2" />
  <img src="https://img.shields.io/badge/TipTap-3.20-1a1a2e?style=flat-square&logo=tiptap&logoColor=white" alt="TipTap 3.20" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-f55036?style=flat-square&logo=meta&logoColor=white" alt="Groq LLM" />
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT License" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [CLI Tool](#cli-tool)
  - [Quick Start](#quick-start)
  - [Command Reference](#command-reference)
  - [Options and Flags](#options-and-flags)
  - [Local Analysis Engine](#local-analysis-engine)
  - [Offline Fallback Mode](#offline-fallback-mode)
- [Core Features](#core-features)
  - [Visual WYSIWYG Editor](#visual-wysiwyg-editor)
  - [Real-Time Markdown Engine](#real-time-markdown-engine)
  - [Dual-Pane GitHub-Flavored Preview](#dual-pane-github-flavored-preview)
  - [AI Repository Documentation Agent](#ai-repository-documentation-agent)
  - [Badge Studio](#badge-studio)
  - [Diagram Studio](#diagram-studio)
  - [GitHub Profile Builder](#github-profile-builder)
  - [Template Library](#template-library)
  - [Document Outline and Navigation](#document-outline-and-navigation)
  - [Table of Contents Generator](#table-of-contents-generator)
  - [Import and Export Engine](#import-and-export-engine)
  - [User Authentication](#user-authentication)
- [Architecture](#architecture)
  - [Monorepo Structure](#monorepo-structure)
  - [Editor Data Flow](#editor-data-flow)
  - [AI Generation Pipeline](#ai-generation-pipeline)
  - [CLI Scanning Pipeline](#cli-scanning-pipeline)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Installation](#frontend-installation)
  - [Backend Installation](#backend-installation)
  - [CLI Installation](#cli-installation)
- [Configuration and Environment Variables](#configuration-and-environment-variables)
- [API Reference](#api-reference)
- [Project Directory Structure](#project-directory-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**mdfmt** is an open-source documentation suite engineered to streamline technical documentation workflows for individual developers and engineering teams. It unites visual rich-text composition with real-time GitHub-Flavored Markdown (GFM) synchronization, an automated repository analysis engine, an offline-capable CLI generator, interactive diagram synthesis, and badge generation utilities.

Developers frequently encounter friction when documenting repositories: manual syntax formatting is tedious, while conventional AI generators typically inspect only top-level file names, resulting in superficial summaries. mdfmt resolves this through two complementary workflows:

1. **Web Studio**: A visual workspace combining TipTap rich-text editing, live syntax-highlighted preview, structure outline navigation, badge synthesis, and AI agent integration.
2. **CLI Engine**: A zero-configuration command-line utility that inspects local repository trees, parses source file contents for architecture patterns, routes, dependencies, and environment references, and outputs complete, production-grade documentation in fractions of a second.

---

## CLI Tool

The `mdfmt` command-line interface enables developers to generate comprehensive README documentation directly from their terminal or IDE workspace without requiring browser interaction.

```
+-------------------------------------------------------------------------+
| $ npx mdfmt generate --offline                                          |
|                                                                         |
|  mdfmt — Interactive Documentation Wizard                               |
|                                                                         |
|  [x] Analyzed workspace (TypeScript, React, Express, Prisma)            |
|  [x] Scanned 81 files across 4 module directories                       |
|  [x] Extracted 15 environment variables and 9 UI components             |
|  [x] Generated README.md via local template engine (0.12s)              |
+-------------------------------------------------------------------------+
```

### Quick Start

Execute directly via `npx` in any project root directory without prior installation:

```bash
npx mdfmt
```

Alternatively, install the package globally via npm:

```bash
npm install -g mdfmt
mdfmt generate
```

### Command Reference

| Command | Description |
|---|---|
| `npx mdfmt` | Launches the interactive setup wizard, scans the current directory, and prompts for depth and tone options |
| `mdfmt generate` | Scans the local workspace and generates a standardized `README.md` |
| `mdfmt generate --offline` | Executes the local deterministic analysis engine, bypassing external server requests |
| `mdfmt generate --yes` | Runs non-interactively using detected defaults, suitable for CI/CD pipelines and scripts |
| `mdfmt generate -o DOCS.md` | Writes generated markdown to a custom destination file |
| `mdfmt generate -i "<text>"` | Supplies custom instructions and developer emphasis to the generation engine |
| `mdfmt generate -k <key>` | Supplies a Groq API key directly for LLM-powered synthesis |
| `mdfmt init` | Initializes project configuration and launches the generation wizard |

### Options and Flags

```text
Usage: mdfmt [command] [options]

Commands:
  generate [options]           Scan workspace and generate README.md (default command)
  init                         Initialize mdfmt documentation wizard

Options:
  -V, --version                Output the version number
  -o, --output <filename>      Destination file path (default: "README.md")
  -y, --yes                    Skip interactive confirmation prompts and accept defaults
  -i, --instructions <text>    Custom focus instructions for the documentation engine
  -s, --server <url>           Custom mdfmt backend API URL (default: "http://localhost:5000")
  -k, --groq-key <key>         Groq API key for direct remote LLM generation
  -l, --offline                Execute standalone offline generator (bypasses server communication)
  -h, --help                   Display command-line help
```

### Local Analysis Engine

The CLI features a content-aware static analysis scanner (`cli/src/scanner/localScanner.ts` and `cli/src/api/client.ts`) that performs deep heuristic inspection across up to 80 prioritized source files:

- **API Route Extraction**: Identifies Express, Fastify, and standard REST route declarations (`app.get`, `router.post`, `router.delete`, etc.) along with their corresponding endpoint paths and handler files.
- **Component Discovery**: Scans React and Vue source files (`.tsx`, `.jsx`, `.vue`) to extract declared component signatures and UI entry points.
- **Exported Module Signatures**: Detects public functions, utility classes, and typed interfaces across library packages.
- **Environment Variable Detection**: Extracts `process.env.*` and `import.meta.env.*` references across all source files, cross-referencing `.env.example` templates to construct configuration tables without exposing sensitive secrets.
- **Database Schema Recognition**: Inspects Prisma schema models (`schema.prisma`), Mongoose definitions, TypeORM entities, and raw SQL migration files.
- **Metrics and Language Distribution**: Calculates precise lines of code (LOC) per file extension and identifies dominant language distribution.
- **CI/CD and Tooling Configuration**: Categorizes build configurations including `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `tailwind.config.js`, Dockerfile, and GitHub Actions workflows (`.github/workflows/`).
- **Secret Redaction**: Employs pattern-based sanitization rules (`API_KEY`, `AUTH_TOKEN`, `sk_live_*`, `ghp_*`, `AKIA*`) to ensure credentials and tokens are redacted prior to processing.

### Offline Fallback Mode

When executing with `--offline` or when network connectivity to the backend service is unavailable, mdfmt switches to its deterministic local template engine. This mode compiles the structural snapshot into a structured GitHub-Flavored Markdown file in under 200ms with zero network overhead.

---

## Core Features

### Visual WYSIWYG Editor

The web studio integrates a rich-text editing surface powered by TipTap and ProseMirror, removing the requirement to memorize complex markdown markup.

- **Header Hierarchy**: Support for H1 through H6 with GitHub-standard bottom rule demarcations.
- **Inline Typography**: Bold, italic, strikethrough, inline code, and text highlight formatting.
- **Structured Block Formats**: Ordered lists, unordered bullet lists, interactive task checklists, and blockquotes.
- **GitHub Alert Callouts**: Native syntax generation for `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]` containers.
- **Table Management**: Insertion and visual editing of tabular grids with row/column manipulation and column alignment.
- **Keyboard Shortcuts**: Standard keybindings (`Ctrl+B`, `Ctrl+I`, `Ctrl+Shift+X`, `Ctrl+Z`, `Ctrl+Y`) for seamless desktop editing.
- **Drag-and-Drop Ingestion**: Direct drag-and-drop support for `.md` and `.txt` files with automated AST transformation.

### Real-Time Markdown Engine

Every modification within the WYSIWYG canvas triggers instant transformation via Turndown into standardized GitHub-Flavored Markdown:

```
[ User Input in WYSIWYG Canvas ]
               │
               ▼
[ ProseMirror Document Node Model ]
               │
               ▼
[ HTML Serialization (TipTap) ]
               │
               ▼
[ Custom Turndown Pipeline (GFM Rules) ]
               │
               ▼
[ Pristine Markdown Output & Draft Store ]
```

### Dual-Pane GitHub-Flavored Preview

The output pane provides instantaneous side-by-side verification:

- **Raw Code View**: Formatted markdown syntax with word count, character count, and estimated reading time statistics.
- **Rendered Preview**: Visual presentation rendered via `react-markdown` and `remark-gfm`, paired with `react-syntax-highlighter` utilizing the One Dark syntax theme to mirror GitHub's desktop environment.

### AI Repository Documentation Agent

For existing repositories, mdfmt provides an automated documentation generation pipeline backed by the **Llama 3.3-70B** large language model via Groq:

- **Repository Ingestion**: Performs shallow repository cloning (`git clone --depth 1`) in sandboxed temporary storage.
- **Static Ranking Algorithm**: Prioritizes key structural files (`package.json`, `go.mod`, `Cargo.toml`, database schemas, routing controllers, configuration files) up to a 260KB token-optimized context window.
- **Configurable Generation Depth**:
  - `readme-only`: Concise, high-impact documentation focused on setup, features, and core workflows.
  - `standard`: Comprehensive README paired with system architecture breakdowns.
  - `complete`: Full documentation suite including architecture blueprints, development workflows, and API route references.
- **Review and Revision Lifecycle**: Interactive feedback loop allowing developers to submit prompt revisions before exporting the finalized draft.

### Badge Studio

A centralized badge construction and catalogue utility integrating with [Shields.io](https://shields.io):

- **Pre-Built Technology Library**: Over 80 verified badges across programming languages, backend frameworks, UI libraries, databases, and cloud providers.
- **Custom Badge Designer**: Granular configuration of labels, messages, hex color codes, and visual badge styles (`for-the-badge`, `flat`, `flat-square`, `plastic`).
- **Social Platform Linking**: One-click badge generators for GitHub, LinkedIn, Twitter/X, Discord, YouTube, Telegram, and developer portfolios.
- **Tech Stack Matrix**: Fast-selection grid for rapidly appending categorized technology matrices to project documentation.

### Diagram Studio

A text-to-diagram generation studio combining natural language prompts with Mermaid.js rendering:

- **Natural Language Translation**: Converts natural architectural descriptions into valid Mermaid flowchart, sequence, or class diagram syntax using LLM integration.
- **Interactive Visualizer**: Renders SVG diagrams with support for light and dark color schemes.
- **Code Editor**: Raw Mermaid code editing with live visual feedback and one-click insertion into the active document draft.

### GitHub Profile Builder

A dedicated wizard for constructing GitHub personal profile READMEs (`username/username`):

- **Identity and Headline Modules**: Form inputs for developer titles, biographies, and contact links.
- **Dynamic Metric Cards**: Integration with `github-readme-stats` and language distribution analytics with theme customization (Radical, Tokyo Night, Dracula, etc.).
- **Aligned Badge Arrays**: Automated alignment of social links, tech stacks, and contribution trackers.

### Template Library

A curated repository of structured templates targeting diverse software domains:

- **Minimalist Application**: Concise structure for utilities, scripts, and micro-libraries.
- **Comprehensive Monorepo**: Enterprise-ready structure supporting multi-package architectures.
- **REST API Server**: Dedicated endpoint tables, environment specifications, and authentication guides.
- **Developer Portfolio**: Showcase layout emphasizing project highlights, live links, and tech stacks.

### Document Outline and Navigation

A collapsible navigation sidebar that scans document headings in real time:

- Hierarchical indentation matching H1 through H6 levels.
- Smooth-scroll navigation with visual element highlighting upon selection.
- Continuous synchronization as document sections are added, modified, or removed.

### Table of Contents Generator

Automated generation of linked Table of Contents sections:

- Traverses document heading nodes to produce slugified, GitHub-compatible anchor links.
- Generates indented markdown list structures capable of dynamic regeneration upon document edits.

### Import and Export Engine

- **Markdown Import**: Upload `.md` or `.txt` files directly into the editor through file selection or drag-and-drop.
- **Direct File Export**: Client-side blob generation allowing one-click download of `README.md` or raw HTML files.
- **Clipboard Utility**: One-click clipboard copy with visual confirmation feedback.

### User Authentication

Built-in user management with Firebase Authentication:

- Email and password registration with client-side password strength validation.
- Google OAuth and GitHub OAuth single sign-on providers.
- Persistent session state managed through Zustand and Firebase authentication listeners.

---

## Architecture

### Monorepo Structure

```
+-------------------------------------------------------------------------------+
|                               mdfmt Workspace                                 |
+-----------------------+-------------------------------+-----------------------+
|       frontend/       |           backend/            |         cli/          |
|   React 19 + Vite 7   |      Express 5 + Node.js      |   Node.js CLI Tool    |
|   Tailwind + TipTap   |      Prisma + Groq SDK        |  Commander + Scanner  |
|                       |                               |                       |
|  * EditorPage         |  * REST Endpoints             |  * localScanner       |
|  * CliPage            |    - /api/build-ai/jobs       |  * client (Analysis)  |
|  * AiGeneratorPage    |    - /api/build-ai/diagram    |  * generateCommand    |
|  * BadgeStudioPage    |  * Repository Analysis Engine |  * diff Utility       |
|  * DiagramStudioPage  |  * Groq LLM Client            |                       |
|  * ProfileBuilderPage |  * In-Memory / DB Job Queue   |                       |
+-----------------------+-------------------------------+-----------------------+
```

### Editor Data Flow

```
┌────────────────────────┐      HTML       ┌────────────────────────┐
│                        │ ──────────────> │                        │
│     TipTap Editor      │    onUpdate     │    Turndown Engine     │
│   (ProseMirror Core)   │                 │   (GFM Rule Pipeline)  │
│                        │                 │                        │
└────────────────────────┘                 └────────────────────────┘
            │                                           │
            │                                           │ Markdown
            ▼                                           ▼
┌────────────────────────┐                 ┌────────────────────────┐
│   HTML Persistence     │                 │   Markdown Preview /   │
│   (useDraftStore)      │                 │   Raw Code Output Pane │
└────────────────────────┘                 └────────────────────────┘
```

### AI Generation Pipeline

```
┌──────────────────┐    POST /jobs     ┌──────────────────┐   git clone   ┌──────────────────┐
│  Frontend Client │ ────────────────> │   Express API    │ ────────────> │ GitHub API /     │
│  or CLI Ingestion│                   │   (Job Engine)   │   --depth 1   │ Target Repo Host │
└──────────────────┘                   └──────────────────┘               └──────────────────┘
         │                                       │                                  │
         │ Polling / Status                      ▼                                  ▼
         │                             ┌──────────────────┐               ┌──────────────────┐
         └───────────────────────────  │ Token Optimization│ <───────────── │ File Tree and    │
                                       │ Context Builder  │   Source Read │ Source Sampling  │
                                       └──────────────────┘               └──────────────────┘
                                                 │
                                                 ▼
                                       ┌──────────────────┐
                                       │ Groq LLM Service │
                                       │ (Llama 3.3-70B)  │
                                       └──────────────────┘
```

### CLI Scanning Pipeline

```
┌──────────────────┐
│ Target Workspace │
└──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ localScanner: Walk directory with .gitignore filter rules   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Static Inspector: Sample up to 80 high-priority files       │
│ - Parse Express/Fastify route declarations                  │
│ - Extract React/Vue component definitions                   │
│ - Identify Prisma/Mongoose database schemas                 │
│ - Inspect environment variable references (process.env.*)   │
│ - Calculate lines of code (LOC) metrics per language        │
│ - Detect build and CI configuration files                   │
│ - Redact sensitive credentials and API tokens               │
└─────────────────────────────────────────────────────────────┘
         │
         ├─── [ Online Mode ] ──────> Send snapshot to mdfmt API Service
         │
         └─── [ Offline Mode ] ─────> Local deterministic README compilation (0.1s)
```

---

## Technology Stack

### Frontend Application

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 19.2 | Component architecture, state hooks, and concurrent rendering |
| Language | TypeScript | 5.9 | Static type enforcement and interface declarations |
| Build Tool | Vite | 7.3 | Local development server with sub-100ms HMR and Rollup bundling |
| Styling | Tailwind CSS | 3.4 | Utility-first responsive design tokens and dark mode support |
| WYSIWYG Engine | TipTap / ProseMirror | 3.20 | Headless, schema-driven rich text editing engine |
| Markdown Converter | Turndown | 7.2 | HTML-to-GFM serialization with custom extensions |
| State Management | Zustand | 5.0 | Lightweight centralized store with localStorage persistence |
| Routing | React Router | 7.13 | Client-side page routing |
| Markdown Parser | react-markdown | 10.1 | Markdown-to-JSX preview renderer with GFM plugin support |
| Syntax Highlighting | Prism / SyntaxHighlighter | 16.1 | Tokenized syntax highlighting for multi-language code snippets |
| Icons | Lucide React | 0.575 | Vector icon library |
| Authentication | Firebase | 12.9 | Authentication handlers for Email, Google, and GitHub providers |

### Backend Service

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Web Framework | Express | 5.2 | REST API routing and middleware pipeline |
| Language | TypeScript | 5.9 | Static type checking across server modules |
| LLM Provider | Groq SDK | 1.2 | High-throughput inference for Llama 3.3-70B |
| ORM | Prisma | 7.4 | Database schema management and migrations |
| Security | bcrypt / JWT | 6.0 / 9.0 | Password hashing and signed token verification |
| Dev Server | Nodemon / ts-node | 3.1 | Automated server reload during local development |
| Environment | dotenv | 17.3 | Secure configuration management |

### CLI Tooling

| Component | Technology | Version | Purpose |
|---|---|---|---|
| CLI Framework | Commander | 12.1 | Command-line argument parsing and flag management |
| Terminal UI | @clack/prompts | 0.8 | Interactive command-line wizards and spinners |
| File System | fs-extra | 11.2 | Enhanced promise-based file system utilities |
| Ignore Parser | ignore | 6.0 | `.gitignore` rule processing during repository scanning |
| Styling | picocolors | 1.1 | Terminal ANSI color output formatting |

---

## Getting Started

### Prerequisites

Ensure the following runtimes and tools are installed on your workstation:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (or `pnpm` / `yarn`)
- **Git**: Installed and available in system `PATH` (required for repository cloning)

### Frontend Installation

```bash
# Clone the repository
git clone https://github.com/ApurveKaranwal/mdfmt.git
cd mdfmt

# Install frontend dependencies
cd frontend
npm install

# Configure environment variables (optional)
cp .env.example .env

# Launch the development server
npm run dev
```

The web client will be accessible at `http://localhost:5173`.

### Backend Installation

```bash
# Navigate to backend directory
cd ../backend
npm install

# Configure environment variables
cp .env.example .env
# Provide your GROQ_API_KEY if testing AI generation capabilities

# Launch backend service
npm run dev
```

The backend API server will listen on `http://localhost:4000`.

### CLI Installation

```bash
# Navigate to cli directory
cd ../cli
npm install

# Compile TypeScript
npm run build

# Link globally for local testing
npm link
```

Once linked, the `mdfmt` binary is executable from any directory on your system.

---

## Configuration and Environment Variables

### Frontend Configuration (`frontend/.env`)

| Variable | Required | Default | Description |
|---|:---:|:---:|---|
| `VITE_FIREBASE_API_KEY` | No | — | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | No | — | Firebase authentication domain |
| `VITE_FIREBASE_PROJECT_ID` | No | — | Firebase project identifier |
| `VITE_FIREBASE_STORAGE_BUCKET` | No | — | Firebase storage bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | No | — | Firebase cloud messaging sender ID |
| `VITE_FIREBASE_APP_ID` | No | — | Firebase application ID |

### Backend Configuration (`backend/.env`)

| Variable | Required | Default | Description |
|---|:---:|:---:|---|
| `PORT` | No | `4000` | HTTP server listening port |
| `FRONTEND_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin for frontend requests |
| `GROQ_API_KEY` | Conditional | — | API key for Groq LLM inference (required for AI features) |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | LLM model identifier used for generation |
| `GITHUB_TOKEN` | No | — | Personal access token for authenticated repository cloning |
| `MAX_REPO_FILES` | No | `220` | Maximum number of files to sample during cloning |
| `MAX_REPO_BYTES` | No | `260000` | Maximum aggregate bytes read during analysis |
| `MAX_FILE_BYTES` | No | `12000` | Maximum bytes sampled per individual file |

---

## API Reference

All backend API endpoints are routed under the `/api/build-ai` namespace.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check endpoint returning service status |
| `POST` | `/api/build-ai/jobs` | Creates an asynchronous documentation generation job (returns job ID) |
| `POST` | `/api/build-ai/generate` | Synchronously generates documentation and returns the completed payload |
| `GET` | `/api/build-ai/jobs/:jobId` | Retrieves status, logs, and generated content for a specific job |
| `POST` | `/api/build-ai/jobs/:jobId/revise` | Submits natural language feedback to revise previously generated documentation |
| `POST` | `/api/build-ai/jobs/:jobId/approve` | Approves and finalizes generated files |
| `POST` | `/api/build-ai/diagram` | Generates Mermaid.js diagram definitions from a text prompt |

### Documentation Job Payload Example

```json
POST /api/build-ai/jobs
Content-Type: application/json

{
  "projectName": "ExampleService",
  "githubUrl": "https://github.com/organization/example-service",
  "groqApiKey": "gsk_...",
  "instructions": "Emphasize production deployment and environment variable reference.",
  "documentationDepth": "standard"
}
```

#### Response:

```json
{
  "job": {
    "id": "c8f1e582-7d21-49fa-9281-a6e5b98b9e02",
    "projectName": "ExampleService",
    "status": "queued",
    "createdAt": "2026-08-16T06:00:00.000Z"
  }
}
```

---

## Project Directory Structure

```text
mdfmt/
├── LICENSE                                # MIT License file
├── README.md                              # Repository documentation
├── .gitignore                             # Workspace gitignore rules
│
├── frontend/                              # Web application client
│   ├── index.html                         # Single page application entry HTML
│   ├── package.json                       # Frontend dependencies and scripts
│   ├── vite.config.ts                     # Vite bundler configuration
│   ├── tailwind.config.js                 # Tailwind design tokens and dark mode config
│   ├── postcss.config.js                  # PostCSS plugin declarations
│   ├── tsconfig.json                      # TypeScript root configuration
│   ├── src/
│   │   ├── main.tsx                       # React mounting and browser router setup
│   │   ├── App.tsx                        # Route definitions and layout shell
│   │   ├── index.css                      # Global styles and TipTap editor rules
│   │   ├── pages/
│   │   │   ├── EditorPage.tsx             # Visual WYSIWYG editor and dual-pane preview
│   │   │   ├── CliPage.tsx                # CLI documentation and reference console
│   │   │   ├── AiGeneratorPage.tsx        # Automated GitHub repository doc generator
│   │   │   ├── BadgeStudioPage.tsx        # Shield badge library and custom badge designer
│   │   │   ├── DiagramStudioPage.tsx      # Natural language to Mermaid.js diagram tool
│   │   │   ├── ProfileBuilderPage.tsx     # GitHub profile README configuration wizard
│   │   │   ├── TemplatesPage.tsx          # Structured documentation templates gallery
│   │   │   ├── SignInPage.tsx             # User authentication sign-in
│   │   │   └── SignUpPage.tsx             # User authentication registration
│   │   ├── components/
│   │   │   ├── Navbar.tsx                 # Header navigation bar
│   │   │   ├── Toolbar.tsx                # WYSIWYG editor formatting controls
│   │   │   ├── TableToolbar.tsx           # Tabular grid controls
│   │   │   ├── AutoTocButton.tsx          # Table of contents generator button
│   │   │   └── TechStackGrid.tsx          # Technology badge selection grid
│   │   ├── store/
│   │   │   ├── useThemeStore.ts           # Theme state management (light / dark)
│   │   │   ├── useDraftStore.ts           # Editor content draft persistence
│   │   │   └── useAuthStore.ts            # Authentication state store
│   │   └── lib/
│   │       ├── firebase.ts                # Firebase client initialization
│   │       └── markdownParser.ts          # Markdown-to-HTML ingestion parser
│
├── backend/                               # Server API application
│   ├── package.json                       # Backend dependencies and scripts
│   ├── tsconfig.json                      # Backend TypeScript configuration
│   └── src/
│       ├── server.ts                      # Express application initialization and middleware
│       ├── config.ts                      # Server configuration and environment mapping
│       ├── types.ts                       # Shared TypeScript interfaces
│       ├── routes/
│       │   └── buildAiRoutes.ts           # Documentation generation REST routes
│       ├── services/
│       │   ├── aiService.ts               # Core documentation generation engine
│       │   ├── githubService.ts           # Git repository shallow cloning and tree parsing
│       │   ├── groqService.ts             # Groq LLM SDK client integration
│       │   └── jobStore.ts                # Documentation job state management
│       └── utils/
│           ├── asyncHandler.ts            # Express async handler wrapper
│           └── httpErrors.ts              # HTTP error classification utilities
│
└── cli/                                   # Command-line interface package
    ├── package.json                       # CLI package manifests and dependencies
    ├── tsconfig.json                      # CLI TypeScript configuration
    ├── bin/
    │   └── mdfmt.js                       # Executable CLI binary entrypoint
    └── src/
        ├── index.ts                       # Commander program and option declarations
        ├── commands/
        │   └── generate.ts                # Generate command execution logic
        ├── scanner/
        │   └── localScanner.ts            # Workspace tree walker and static file inspector
        ├── api/
        │   └── client.ts                  # Code analyzer, route parser, and fallback engine
        └── utils/
            └── diff.ts                    # Terminal colorized diff comparison formatter
```

---

## Contributing

We welcome community contributions. To contribute to mdfmt:

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Implement Changes**: Ensure all code conforms to project formatting and TypeScript type definitions.
4. **Run Verification Builds**:
   ```bash
   # In frontend/
   npm run build

   # In backend/
   npm run build

   # In cli/
   npm run build
   ```
5. **Commit and Push**:
   ```bash
   git commit -m "feat(scope): concise description of changes"
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request**: Submit your pull request to the `main` branch with a clear summary of modifications.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the complete license text.

<p align="center">
  <sub>Maintained by <a href="https://github.com/ApurveKaranwal">Apurve Karanwal</a> and contributors.</sub>
</p>
