<p align="center">
  <img src="https://img.icons8.com/fluency/96/markdown.png" alt="mdfmt logo" width="80" />
</p>

<h1 align="center">mdfmt — README Studio</h1>

<p align="center">
  <strong>A modern, AI-powered Markdown editor for crafting stunning README files — visually.</strong>
</p>

<p align="center">
  <em>Write in rich text. Export pristine GitHub-Flavored Markdown. Let AI document your repos.</em>
</p>

<br />

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/✨_Features-4f46e5?style=for-the-badge" alt="Features" /></a>&nbsp;
  <a href="#-architecture"><img src="https://img.shields.io/badge/🏗️_Architecture-0891b2?style=for-the-badge" alt="Architecture" /></a>&nbsp;
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/⚙️_Tech_Stack-059669?style=for-the-badge" alt="Tech Stack" /></a>&nbsp;
  <a href="#-getting-started"><img src="https://img.shields.io/badge/🚀_Get_Started-dc2626?style=for-the-badge" alt="Get Started" /></a>&nbsp;
  <a href="#-project-structure"><img src="https://img.shields.io/badge/📂_Structure-ca8a04?style=for-the-badge" alt="Structure" /></a>&nbsp;
  <a href="#-contributing"><img src="https://img.shields.io/badge/🤝_Contribute-7c3aed?style=for-the-badge" alt="Contribute" /></a>
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react&logoColor=white" alt="React 19.2" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-7.3-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite 7.3" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3.4" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white" alt="Express 5.2" />
  <img src="https://img.shields.io/badge/TipTap-3.20-1a1a2e?style=flat-square&logo=tiptap&logoColor=white" alt="TipTap 3.20" />
  <img src="https://img.shields.io/badge/Firebase-Auth-ffca28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-f55036?style=flat-square&logo=meta&logoColor=white" alt="Groq LLM" />
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT License" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Features](#-features)
  - [Rich Text Editor (WYSIWYG)](#-rich-text-editor-wysiwyg)
  - [Real-Time Markdown Conversion](#-real-time-markdown-conversion)
  - [Live GitHub-Style Preview](#-live-github-style-preview)
  - [AI Documentation Agent](#-ai-documentation-agent)
  - [Badge Studio](#-badge-studio)
  - [Templates Gallery](#-templates-gallery)
  - [Table of Contents Generator](#-table-of-contents-generator)
  - [Emoji Picker](#-emoji-picker)
  - [GitHub Statistics Badges](#-github-statistics-badges)
  - [Image Insertion](#-image-insertion)
  - [Document Outline & Navigation](#-document-outline--navigation)
  - [Import & Export](#-import--export)
  - [Dark Mode](#-dark-mode)
  - [Draft Persistence](#-draft-persistence)
  - [Authentication](#-authentication)
- [🏗️ Architecture](#-architecture)
  - [System Overview](#system-overview)
  - [Data Flow Pipeline](#data-flow-pipeline)
  - [AI Generation Pipeline](#ai-generation-pipeline)
- [⚙️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Environment Variables](#environment-variables)
- [📂 Project Structure](#-project-structure)
- [🔧 How It Works](#-how-it-works)
  - [TipTap Editor Configuration](#tiptap-editor-configuration)
  - [HTML-to-Markdown Conversion](#html-to-markdown-conversion)
  - [Markdown-to-HTML Parser](#markdown-to-html-parser)
  - [State Management](#state-management)
  - [GitHub Repository Scraping](#github-repository-scraping)
  - [AI Documentation Generation](#ai-documentation-generation)
- [📡 API Reference](#-api-reference)
- [🛣️ Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## Overview

**mdfmt** (README Studio) is an open-source, browser-based Markdown editor purpose-built for crafting beautiful README files. It combines a rich-text WYSIWYG editor with real-time Markdown conversion, an AI-powered documentation agent, a badge studio, template gallery, and more — all in a polished, split-pane workspace.

Instead of memorizing Markdown syntax or toggling between a text editor and a preview, mdfmt gives you a **visual editing experience**: write naturally in a rich-text editor on the left, see the generated Markdown and a rendered GitHub-style preview on the right. Every keystroke produces clean, GitHub-Flavored Markdown in real time.

For existing projects, point the **AI Agent** at any public GitHub repository and it will analyze your codebase — cloning the repo, inspecting your tech stack, sampling source files, and generating comprehensive documentation powered by the **Llama 3.3-70B** model via Groq.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⌘ mdfmt       Editor │ AI Agent │ Templates │ Badge Studio    [🌙] │
├──────────────────────────────────────────────────────────────────────┤
│  Outline │ Import MD │ Clear Draft              Copy Markdown │ Export│
├──────────────────────────────────────────────────────────────────────┤
│  H1 H2 H3 │ B I S ` │ • 1. ☐ │ ❝ — 🔗 📷 ▦ 🎯 😀 📊 ⚡ │ ↩ ↪  │
├─────────────────────────────────┬────────────────────────────────────┤
│                                 │  ┌─ Code ── Preview ─┐   42 words │
│                                 │  │                    │            │
│   WYSIWYG Rich-Text Editor      │  │   # My Project     │            │
│   ━━━━━━━━━━━━━━━━━━━━━━━━      │  │                    │            │
│                                 │  │   A modern web     │            │
│   Write naturally here.         │  │   application...   │            │
│   Format with the toolbar       │  │                    │            │
│   or keyboard shortcuts.        │  │   ## Features      │            │
│                                 │  │   - Feature one    │            │
│                                 │  │   - Feature two    │            │
│                                 │  └────────────────────┘            │
└─────────────────────────────────┴────────────────────────────────────┘
```

---

## ✨ Features

### 🖊️ Rich Text Editor (WYSIWYG)

Write naturally in a rich-text editor powered by [TipTap](https://tiptap.dev/) and [ProseMirror](https://prosemirror.net/). No Markdown syntax to memorize — just click a toolbar button or use a keyboard shortcut.

| Category | Supported Elements |
|---|---|
| **Headings** | H1, H2, H3 with GitHub-style bottom borders |
| **Inline Formatting** | **Bold**, *Italic*, ~~Strikethrough~~, `Inline Code` |
| **Lists** | Bullet lists, Ordered lists, Task lists with checkboxes |
| **Block Elements** | Blockquotes, Horizontal rules, Fenced code blocks |
| **Alert Blocks** | Note 📝, Tip 💡, Important ❗, Warning ⚠️ (GitHub-flavored syntax) |
| **Links** | Hyperlinks with URL prompt dialog |
| **Images** | Insert from URLs with alt text and live preview |
| **Tables** | 3×3 insertable tables with header rows, row/column management, and alignment controls |
| **Snippets** | Quick-insert pre-built content blocks |

**Power user features:**

- ⌨️ **Keyboard shortcuts** — `Ctrl+B` bold, `Ctrl+I` italic, `Ctrl+Shift+X` strikethrough, and more
- 📋 **Smart paste** — paste HTML, Markdown, or plain text and it auto-converts
- ↩️ **Undo/Redo** — full history with toolbar buttons
- 🎯 **Block selection** — easily select and manipulate entire paragraphs or tables
- 🖱️ **Drag & Drop** — drop `.md` or `.txt` files directly into the editor

---

### ⚡ Real-Time Markdown Conversion

As you type, the output panel updates **instantly**. The conversion engine uses [Turndown](https://github.com/mixmark-io/turndown) configured for GitHub-Flavored Markdown:

```
 User types in           Turndown converts            Output panel
 WYSIWYG Editor    ──►    HTML → Markdown      ──►    shows clean GFM
```

- **ATX-style headings** — `# Heading` (not underline style)
- **Fenced code blocks** — triple backticks with language tags
- **Dash bullet markers** — `- item` (consistent style)
- **Strikethrough** — `~~text~~` via custom Turndown rule
- **Task lists** — `- [x] Done` / `- [ ] Todo`
- **Alert blocks** — `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`
- **Table rendering** — pipe-delimited format with proper alignment
- **Image syntax** — `![alt](url)` via custom Turndown rule

---

### 👁️ Live GitHub-Style Preview

Toggle between **Code** view (raw Markdown) and **Preview** view (rendered output) in the output pane. The preview uses `react-markdown` with `remark-gfm` and `react-syntax-highlighter` with the **One Dark** theme for syntax-highlighted code blocks — matching how your README will actually look on GitHub.

**Live document metrics** are displayed in the output header:
- 📝 Word count
- 📊 Character count
- ⏱️ Estimated reading time

---

### 🤖 AI Documentation Agent

Point the AI agent at any public GitHub repository and it generates comprehensive documentation automatically.

#### How It Works

```
 1. User provides         2. Backend clones        3. AI analyzes &        4. User reviews
    GitHub repo URL   ──►    repo (depth=1)    ──►    generates docs   ──►   & revises
```

#### Generation Pipeline

| Stage | What Happens |
|---|---|
| **Repository Scraping** | Shallow clone via `git clone --depth 1`, then walks the file tree (skipping `node_modules`, `.git`, `dist`, etc.) |
| **File Sampling** | Ranks files by importance (package.json, README, routes, schemas, components), reads up to 220 files / 260KB total |
| **Tech Stack Detection** | Identifies frameworks from `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, Dockerfile, and more |
| **Analysis** | Extracts dependencies, scripts, API routes, entry points, env vars, and project structure |
| **Documentation Generation** | Uses the **Llama 3.3-70B** model via Groq for AI-powered writing, or falls back to a local template engine |

#### Three Documentation Depths

| Depth | Output |
|---|---|
| `readme-only` | Quick, focused README with essential sections |
| `standard` | README + Architecture documentation |
| `complete` | README + Architecture + Development Guide + API Reference |

#### Review & Revision Workflow

The generated documentation enters a review cycle:

```
queued → scraping → generating → needs_review → approved
                                       ↕
                                    revising
```

- 📝 Provide feedback and the AI revises based on your suggestions
- ✅ Selectively approve individual files before committing
- 🔄 Iterate until your documentation is perfect
- 📊 Real-time job status tracking with async polling

> **Note:** AI generation requires a [Groq API key](https://console.groq.com/). Without one, the system falls back to intelligent template-based generation using heuristics from your repository structure.

---

### 🎨 Badge Studio

A comprehensive badge creation and management system across a dedicated page:

#### Pre-Built Badge Library (80+ badges)

| Category | Examples |
|---|---|
| **Languages** | Python, JavaScript, TypeScript, Go, Rust, Java, C++, C#, PHP, Ruby, Swift, Kotlin |
| **Frameworks** | React, Vue, Angular, Next.js, Svelte, Django, FastAPI, Spring, Flask, Express, NestJS |
| **Tools & Platforms** | Docker, Kubernetes, Git, GitHub, GitLab, VS Code, AWS, Firebase, MongoDB, PostgreSQL, Redis |

#### Tech Stack Grid

Quick-insert buttons organized by category — Languages (7), Frameworks (7), Tools (7) — for rapidly building a standardized tech stack display.

#### Custom Badge Builder

Create unlimited custom badges with [shields.io](https://shields.io/) integration:

- 🏷️ **Label & Message** — full text customization
- 🎨 **Colors** — 16+ preset colors or custom hex values
- 🖌️ **Styles** — `for-the-badge`, `flat`, `flat-square`, `plastic`
- 👁️ **Live preview** before inserting
- 📋 **Copy-to-markdown** — instant `![badge](url)` generation

#### Social Media Links (16+ platforms)

GitHub · Twitter/X · LinkedIn · YouTube · Discord · Reddit · Twitch · Instagram · Stack Overflow · Dev.to · Medium · Hashnode · Mastodon · Telegram · Email · Website

Automatically generates properly formatted badge links with batch insert support.

---

### 📚 Templates Gallery

Pre-built README templates to jumpstart your documentation:

| Template | Use Case |
|---|---|
| **Minimalist Project** | Clean, lightweight template for small projects |
| **Comprehensive Library** | Full-featured template for open-source libraries |
| **API Reference Server** | Specialized template for API documentation |
| **Portfolio Project** | Template designed for personal portfolio showcases |

Each template includes pre-structured sections (Overview, Installation, Usage, Contributing, License), properly formatted headings and code blocks, and is fully editable in the WYSIWYG editor.

---

### 🎯 Table of Contents Generator

Automatically generate a clickable table of contents from your document:

- 🔍 **Auto-scans** all H1, H2, and H3 headings from the editor content
- 🔗 **Generates GitHub-compatible anchor links** (slugified, lowercase, hyphenated)
- 🔄 **Dynamic updates** — regenerate as you add or modify headings
- 📍 **Customizable placement** — insert anywhere in your document

---

### 😀 Emoji Picker

Browse and insert emojis organized by 7 categories:

| Category | Examples |
|---|---|
| Smileys & People | 😀 😂 🤔 👍 |
| Animals & Nature | 🐱 🌿 🌸 🦋 |
| Food & Drink | 🍕 ☕ 🍰 🍎 |
| Travel & Places | ✈️ 🏔️ 🌍 🏠 |
| Activities & Sports | ⚽ 🎮 🎨 🏆 |
| Objects | 💻 📱 🔧 📦 |
| Symbols | ❤️ ⭐ ✅ ⚡ |

---

### 📊 GitHub Statistics Badges

Insert dynamic badges that display live information from any GitHub repository:

- ⭐ **Stars** — repository star count
- 🍴 **Forks** — number of forks
- 👀 **Watchers** — active watchers
- 🐛 **Issues** — open issue count
- 📜 **License** — detected license type
- 📅 **Last Commit** — most recent commit date

These badges auto-update as your repository grows, always showing fresh metrics.

---

### 🖼️ Image Insertion

Seamlessly add images to your README from URLs:

- 👁️ **Live preview** — see images before inserting
- 📝 **Alt text support** — accessibility and SEO
- ✅ **URL validation** — ensures images load properly
- 📄 **Markdown-compatible** — generates `![alt](url)` syntax

---

### 📑 Document Outline & Navigation

A collapsible outline panel on the left side of the editor:

- 🗂️ Automatically detects all headings (H1–H6) from the editor
- 🏷️ Shows heading level indicators (H1, H2, H3)
- 🖱️ Click any heading to **smooth-scroll** to it with a highlight animation
- 📐 Indented hierarchy matching your document structure
- 🔄 Real-time updates as you type

---

### 📥 Import & Export

| Action | Details |
|---|---|
| **Import .md** | Upload existing Markdown files via file picker — auto-parsed into the WYSIWYG editor |
| **Drag & Drop** | Drop `.md` or `.txt` files directly into the editor area |
| **Export .md** | Download as `README.md` — client-side via the Blob API, no server needed |
| **Export .html** | Download the raw HTML representation |
| **Copy Markdown** | One-click copy to clipboard with a 2-second "Copied!" confirmation |

---

### 🌙 Dark Mode

Toggle between light and dark themes with a single click:

- 🌓 Full application coverage — editor, toolbar, output pane, modals, all pages
- 💾 Persistent state — remembered across sessions via Zustand
- ✨ Smooth CSS transitions when switching
- 🎨 Tailwind CSS `class` strategy for efficient dark mode styling

---

### 💾 Draft Persistence

Your work is automatically saved to `localStorage`:

- Every keystroke persists both the Markdown and HTML to local storage
- Drafts survive browser refreshes, tab closes, and crashes
- "Clear Draft" button with confirmation dialog to start fresh
- Templates and AI-generated content automatically populate the draft store

---

### 🔐 Authentication

Complete user authentication system (pages built, Firebase integration ready):

- 📧 **Email & Password** — traditional account creation with password strength indicator (Too Short → Fair → Good → Strong)
- 🔵 **Google OAuth** — one-click sign-in
- 🐙 **GitHub OAuth** — authenticate with your GitHub account
- 🔥 **Firebase Integration** — secure, reliable auth backend
- 💾 **Persistent Sessions** — stay logged in across browser sessions via `onAuthStateChanged`

---

## 🏗️ Architecture

### System Overview

mdfmt is a **monorepo** with two independent services:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         mdfmt Monorepo                              │
├──────────────────────────────┬──────────────────────────────────────┤
│         frontend/            │           backend/                   │
│      React 19 + Vite 7       │        Express 5 + Node.js          │
│                              │                                      │
│  ┌────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │    Pages               │  │  │    REST API                    │  │
│  │    ├── EditorPage      │  │  │    └── /api/build-ai           │  │
│  │    ├── AiGeneratorPage │  │  │        ├── POST /jobs          │  │
│  │    ├── BadgeStudioPage │  │  │        ├── POST /generate      │  │
│  │    ├── TemplatesPage   │  │  │        ├── GET  /jobs/:id      │  │
│  │    ├── SignInPage      │  │  │        ├── POST /jobs/:id/revise│ │
│  │    └── SignUpPage      │  │  │        └── POST /jobs/:id/approve││
│  └────────────────────────┘  │  └────────────────────────────────┘  │
│                              │                                      │
│  ┌────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │    Components (14)     │  │  │    Services                    │  │
│  │    ├── Toolbar         │  │  │    ├── githubService    (clone) │  │
│  │    ├── TableToolbar    │  │  │    ├── aiService    (generate)  │  │
│  │    ├── Navbar          │  │  │    ├── llmService      (Groq)  │  │
│  │    ├── AlertBlockDD    │  │  │    └── jobStore      (in-mem)  │  │
│  │    ├── AutoTocButton   │  │  └────────────────────────────────┘  │
│  │    ├── BadgePickerModal│  │                                      │
│  │    ├── CustomBadgeModal│  │  ┌────────────────────────────────┐  │
│  │    ├── EmojiPickerModal│  │  │    Utils                       │  │
│  │    ├── GitHubStatsModal│  │  │    ├── asyncHandler            │  │
│  │    ├── InsertImageModal│  │  │    └── httpErrors              │  │
│  │    ├── SnippetDropdown │  │  └────────────────────────────────┘  │
│  │    ├── SocialLinksModal│  │                                      │
│  │    ├── TechStackGrid   │  │                                      │
│  │    └── TemplatesSidebar│  │                                      │
│  └────────────────────────┘  │                                      │
│                              │                                      │
│  ┌────────────────────────┐  │                                      │
│  │    State (Zustand)     │  │                                      │
│  │    ├── useThemeStore   │  │                                      │
│  │    ├── useDraftStore   │  │                                      │
│  │    └── useAuthStore    │  │                                      │
│  └────────────────────────┘  │                                      │
│                              │                                      │
│  ┌────────────────────────┐  │                                      │
│  │    Libs                │  │                                      │
│  │    ├── firebase.ts     │  │                                      │
│  │    └── markdownParser  │  │                                      │
│  └────────────────────────┘  │                                      │
├──────────────────────────────┴──────────────────────────────────────┤
│                         Shared: TypeScript 5.9                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow Pipeline

The core editor follows a unidirectional data flow:

```
┌──────────────────┐     HTML      ┌──────────────────┐    Markdown    ┌──────────────────┐
│                  │ ──────────► │                  │ ──────────── ► │                  │
│   TipTap Editor  │  onUpdate   │     Turndown     │   setState     │   Output Panel   │
│   (ProseMirror)  │             │  (HTML → GFM)    │                │  (Code/Preview)  │
│                  │             │                  │                │                  │
└──────────────────┘             └──────────────────┘                └──────────────────┘
         │                                                                    │
         │                    ┌──────────────────┐                            │
         └──────────────── ► │   Zustand Store   │ ◄ ────────────────────────┘
           persist HTML       │  (useDraftStore)  │   persist Markdown
                              │   + localStorage  │
                              └──────────────────┘
```

1. User types in the **TipTap WYSIWYG editor**, which internally maintains a ProseMirror document
2. On every keystroke (`onUpdate`), TipTap emits the current document as **HTML**
3. HTML is piped through **Turndown** (configured for GFM) to produce clean **Markdown**
4. Both HTML and Markdown are persisted to the **Zustand draft store** (backed by `localStorage`)
5. The output panel renders either the raw Markdown or a GitHub-style preview

### AI Generation Pipeline

```
┌────────────┐     POST       ┌────────────────┐    git clone    ┌────────────────┐
│            │  /api/build-ai │                │   --depth 1     │                │
│  Frontend  │ ────────────► │  Express API   │ ──────────── ► │    GitHub       │
│  AI Agent  │               │  (Job Queue)   │                │   Repository   │
│   Page     │ ◄──────────── │                │ ◄──────────────│                │
│            │   Job Status   │                │   File Tree     │                │
└────────────┘   Polling      └───────┬────────┘   + Contents    └────────────────┘
                                      │
                              ┌───────▼────────┐
                              │  AI Service    │
                              │                │
                              │  ┌───────────┐ │
                              │  │ Groq LLM  │ │  ◄── Llama 3.3-70B
                              │  │ (primary) │ │
                              │  └───────────┘ │
                              │       OR       │
                              │  ┌───────────┐ │
                              │  │ Template  │ │  ◄── Heuristic fallback
                              │  │ Engine    │ │
                              │  └───────────┘ │
                              └────────────────┘
```

---

## ⚙️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|:---|:---:|:---|
| <img src="https://img.shields.io/badge/-React-61dafb?logo=react&logoColor=111&style=flat-square" alt="React" /> | `19.2` | UI component library with modern hooks and concurrent rendering |
| <img src="https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript" /> | `5.9` | Static type checking for code safety and IDE intelligence |
| <img src="https://img.shields.io/badge/-Vite-646cff?logo=vite&logoColor=white&style=flat-square" alt="Vite" /> | `7.3` | Lightning-fast build tool with sub-100ms HMR |
| <img src="https://img.shields.io/badge/-Tailwind_CSS-06b6d4?logo=tailwindcss&logoColor=white&style=flat-square" alt="Tailwind" /> | `3.4` | Utility-first CSS with class-based dark mode strategy |
| <img src="https://img.shields.io/badge/-TipTap-1a1a2e?logo=tiptap&logoColor=white&style=flat-square" alt="TipTap" /> | `3.20` | Headless rich-text editor built on ProseMirror |
| <img src="https://img.shields.io/badge/-Turndown-333?style=flat-square" alt="Turndown" /> | `7.2` | HTML → Markdown conversion with GFM support |
| <img src="https://img.shields.io/badge/-Zustand-443d3d?style=flat-square" alt="Zustand" /> | `5.0` | Lightweight state management (~2KB) |
| <img src="https://img.shields.io/badge/-React_Router-ca4245?logo=reactrouter&logoColor=white&style=flat-square" alt="React Router" /> | `7.13` | Client-side routing and navigation |
| <img src="https://img.shields.io/badge/-Firebase-ffca28?logo=firebase&logoColor=black&style=flat-square" alt="Firebase" /> | `12.9` | Authentication (Email, Google OAuth, GitHub OAuth) |
| <img src="https://img.shields.io/badge/-Lucide-f56565?style=flat-square" alt="Lucide" /> | `0.575` | Icon library with 500+ tree-shakable SVG icons |
| <img src="https://img.shields.io/badge/-React_Markdown-333?style=flat-square" alt="react-markdown" /> | `10.1` | Markdown rendering for the preview pane |
| <img src="https://img.shields.io/badge/-Prism-1d1d1d?style=flat-square" alt="Prism" /> | `16.1` | Syntax highlighting with One Dark theme |

### Backend

| Technology | Version | Purpose |
|:---|:---:|:---|
| <img src="https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat-square" alt="Express" /> | `5.2` | Fast, minimalist web framework for Node.js |
| <img src="https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript" /> | `5.9` | Static type checking for backend code |
| <img src="https://img.shields.io/badge/-Groq_SDK-f55036?style=flat-square" alt="Groq" /> | `1.2` | LLM integration (Llama 3.3-70B) for AI doc generation |
| <img src="https://img.shields.io/badge/-bcrypt-333?style=flat-square" alt="bcrypt" /> | `6.0` | Secure password hashing with salt |
| <img src="https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square" alt="JWT" /> | `9.0` | Authentication token generation and validation |
| <img src="https://img.shields.io/badge/-Prisma-2d3748?logo=prisma&logoColor=white&style=flat-square" alt="Prisma" /> | `7.4` | Modern ORM with type-safe database queries |
| <img src="https://img.shields.io/badge/-Nodemon-76d04b?logo=nodemon&logoColor=white&style=flat-square" alt="Nodemon" /> | `3.1` | Dev server with automatic restart on file changes |
| <img src="https://img.shields.io/badge/-dotenv-ecd53f?style=flat-square" alt="dotenv" /> | `17.3` | Environment variable management |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | ≥ 18 |
| **npm** | ≥ 9 (or yarn / pnpm) |
| **Git** | Required on the server for the AI agent's repository cloning |

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/ApurveKaranwal/mdfmt.git
cd mdfmt

# 2. Install frontend dependencies
cd frontend
npm install

# 3. (Optional) Configure Firebase for authentication
cp .env.example .env
# Fill in your Firebase credentials — see Environment Variables below

# 4. Start the dev server
npm run dev
```

The dev server starts at `http://localhost:5173` with Vite's hot module replacement enabled.

### Backend Setup

```bash
# 1. Navigate to backend
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Set your Groq API key and other options — see Environment Variables below

# 3. Start the dev server
npm run dev
```

The backend API starts at `http://localhost:4000`.

### Environment Variables

#### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|:---:|---|
| `VITE_FIREBASE_API_KEY` | Optional | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Optional | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Optional | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Optional | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Optional | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Optional | Firebase app ID |

> **Note:** Firebase variables are optional. The editor works fully without them — authentication features are simply disabled.

#### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|:---:|:---:|---|
| `PORT` | No | `4000` | Server port |
| `FRONTEND_ORIGIN` | No | `http://localhost:5173` | CORS allowed origin |
| `GITHUB_TOKEN` | No | — | Improves clone access for private repos / rate-limited environments |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | LLM model for AI generation |
| `MAX_REPO_FILES` | No | `220` | Max files to sample per repository |
| `MAX_REPO_BYTES` | No | `260000` | Max total bytes to read from a repo |
| `MAX_FILE_BYTES` | No | `12000` | Max bytes per individual file |

### Building for Production

```bash
cd frontend
npm run build       # Type-check with tsc, then bundle with Vite
npm run preview     # Preview the production build locally
```

Production assets are output to `frontend/dist/`.

---

## 📂 Project Structure

```
mdfmt/
├── 📄 LICENSE                              # MIT License
├── 📄 README.md                            # This file
├── 📄 .gitignore                           # Global gitignore
│
├── 🎨 frontend/                            # React + Vite + TailwindCSS
│   ├── 📄 index.html                       # HTML entry point
│   ├── 📄 package.json                     # Dependencies & scripts
│   ├── 📄 vite.config.ts                   # Vite configuration
│   ├── 📄 tailwind.config.js               # Tailwind (class-based dark mode)
│   ├── 📄 postcss.config.js                # PostCSS (Tailwind + Autoprefixer)
│   ├── 📄 tsconfig.json                    # TypeScript project references
│   ├── 📄 tsconfig.app.json                # App-level TS config
│   ├── 📄 tsconfig.node.json               # Node-level TS config (Vite)
│   ├── 📄 eslint.config.js                 # ESLint flat config
│   ├── 📄 .env.example                     # Firebase env template
│   ├── 📁 public/                          # Static assets
│   │   └── vite.svg
│   └── 📁 src/
│       ├── 📄 main.tsx                     # Entry — mounts React with BrowserRouter
│       ├── 📄 App.tsx                      # Root — defines 4 routes
│       ├── 📄 index.css                    # Global + TipTap editor styles (8KB)
│       │
│       ├── 📁 pages/
│       │   ├── 📄 EditorPage.tsx           # Main WYSIWYG editor + split preview
│       │   ├── 📄 AiGeneratorPage.tsx      # AI documentation generator UI
│       │   ├── 📄 BadgeStudioPage.tsx      # Badge creation & management
│       │   ├── 📄 TemplatesPage.tsx        # Pre-built README templates
│       │   ├── 📄 SignInPage.tsx           # Sign in (Email + OAuth)
│       │   └── 📄 SignUpPage.tsx           # Sign up with password strength
│       │
│       ├── 📁 components/
│       │   ├── 📄 Navbar.tsx               # Top navigation bar
│       │   ├── 📄 Toolbar.tsx              # Editor formatting toolbar
│       │   ├── 📄 TableToolbar.tsx         # Table-specific actions
│       │   ├── 📄 AlertBlockDropdown.tsx   # Alert block type picker
│       │   ├── 📄 AutoTocButton.tsx        # Table of contents generator
│       │   ├── 📄 SnippetDropdown.tsx      # Quick-insert snippets
│       │   ├── 📄 EmojiPickerModal.tsx     # Emoji browser (7 categories)
│       │   ├── 📄 InsertImageModal.tsx     # Image URL insertion
│       │   ├── 📄 BadgePickerModal.tsx     # Pre-built badge library
│       │   ├── 📄 CustomBadgeModal.tsx     # Custom badge builder
│       │   ├── 📄 GitHubStatsModal.tsx     # GitHub repo stats badges
│       │   ├── 📄 SocialLinksModal.tsx     # Social media link badges
│       │   ├── 📄 TechStackGrid.tsx        # Quick tech stack grid
│       │   └── 📄 TemplatesSidebar.tsx     # Template browser sidebar
│       │
│       ├── 📁 store/
│       │   ├── 📄 useThemeStore.ts         # Dark mode state (Zustand)
│       │   ├── 📄 useDraftStore.ts         # Editor draft persistence (Zustand + localStorage)
│       │   └── 📄 useAuthStore.ts          # Auth state + Firebase listener (Zustand)
│       │
│       └── 📁 lib/
│           ├── 📄 firebase.ts              # Firebase init + auth helpers
│           └── 📄 markdownParser.ts        # MD → HTML parser for imports
│
└── ⚙️ backend/                             # Express + TypeScript API
    ├── 📄 package.json                     # Dependencies & scripts
    ├── 📄 tsconfig.json                    # TypeScript configuration
    ├── 📄 .env.example                     # Backend env template
    └── 📁 src/
        ├── 📄 server.ts                    # Express app + middleware + error handling
        ├── 📄 config.ts                    # Environment variable configuration
        ├── 📄 types.ts                     # Shared TypeScript interfaces
        │
        ├── 📁 routes/
        │   └── 📄 buildAiRoutes.ts         # AI documentation REST endpoints
        │
        ├── 📁 services/
        │   ├── 📄 aiService.ts             # Documentation generation engine (857 lines)
        │   ├── 📄 githubService.ts         # Repository cloning & file analysis
        │   ├── 📄 llmService.ts            # Groq API integration
        │   └── 📄 jobStore.ts              # In-memory job queue
        │
        └── 📁 utils/
            ├── 📄 asyncHandler.ts          # Express async error wrapper
            └── 📄 httpErrors.ts            # Custom HTTP error class
```

---

## 🔧 How It Works

### TipTap Editor Configuration

The WYSIWYG editor is built on [TipTap](https://tiptap.dev/), a headless, framework-agnostic rich-text editor built on [ProseMirror](https://prosemirror.net/). The following extensions are loaded:

| Extension | Purpose |
|---|---|
| `StarterKit` | Core nodes (paragraph, heading, code block, blockquote, lists, horizontal rule) and marks (bold, italic, strike, code) |
| `Link` | Hyperlink support with `openOnClick: false` to prevent accidental navigation |
| `Image` | Inline image insertion with base64 support |
| `TaskList` + `TaskItem` | GitHub-style task lists with interactive checkboxes and nesting |
| `Table` + `TableRow` + `TableHeader` + `TableCell` | Full table support with resizable columns |

### HTML-to-Markdown Conversion

[Turndown](https://github.com/mixmark-io/turndown) converts TipTap's HTML output into clean Markdown:

```typescript
const turndownService = new TurndownService({
  headingStyle: 'atx',          // # Heading (not underline)
  codeBlockStyle: 'fenced',     // ``` blocks (not indentation)
  bulletListMarker: '-',        // - item (not * or +)
});

// Custom rule: <del>/<s> tags → ~~strikethrough~~
turndownService.addRule('strikethrough', {
  filter: ['del', 's'],
  replacement: (content) => `~~${content}~~`,
});

// Custom rule: <img> → ![alt](src)
turndownService.addRule('image', {
  filter: 'img',
  replacement: (_content, node) => {
    const el = node as HTMLElement;
    return `![${el.getAttribute('alt') || ''}](${el.getAttribute('src') || ''})`;
  },
});
```

### Markdown-to-HTML Parser

When importing `.md` files, a custom parser (`markdownParser.ts`) converts Markdown back to HTML for the TipTap editor. It handles:

- Fenced code blocks with language tags
- Inline code
- Headings (H1–H6)
- Images and links
- Blockquotes and alert blocks
- Unordered and ordered lists
- Paragraph wrapping with `<br />` for line breaks

### State Management

Three [Zustand](https://github.com/pmndrs/zustand) stores manage global state:

| Store | State | Persistence |
|---|---|---|
| `useThemeStore` | `isDarkMode`, `toggleDarkMode()` | Toggles `dark` class on `document.documentElement` |
| `useDraftStore` | `markdown`, `htmlContent`, `setMarkdown()`, `setHtmlContent()`, `clearDraft()` | `localStorage` (`mdfmt_md_draft`, `mdfmt_html_draft`) |
| `useAuthStore` | `user`, `loading`, `setUser()`, `setLoading()` | Firebase `onAuthStateChanged` listener |

### GitHub Repository Scraping

The `githubService` performs intelligent repository analysis:

1. **Shallow clone** — `git clone --depth 1` into a temp directory (supports authenticated clones via `GITHUB_TOKEN`)
2. **File tree walk** — recursively lists all files, skipping ignored directories (`node_modules`, `.git`, `dist`, `build`, `__pycache__`, `vendor`, etc.)
3. **Priority ranking** — files are scored by importance:
   - `package.json`, `README.md`, `Cargo.toml`, `go.mod` → +20 points
   - Routes, controllers, services, schemas → +8 points
   - Test files → +4 points
   - Markdown files → +10 points
4. **Content sampling** — reads up to 220 files / 260KB total, truncating individual files at 12KB
5. **Tech stack detection** — identifies Node.js, Vite, Tailwind, Next.js, React, Express, Python, Go, Rust, Docker, Firebase, Prisma, and more from manifests and file paths
6. **Cleanup** — temporary clone directory is always deleted (`rm -rf` in `finally` block)

### AI Documentation Generation

The `aiService` supports two generation modes:

**LLM-Powered (Groq):**
- Uses the **Llama 3.3-70B** model with temperature 0.45 for README, 0.5 for architecture docs
- Builds a focused context from repository metadata, dependencies, scripts, API routes, and sampled source files
- Token-efficient chunked context strategy to stay within limits
- Revision mode with temperature 0.35 for precise, feedback-driven edits

**Template-Based Fallback:**
- Activated when no Groq API key is provided
- Generates structured README from detected badges, tech stack, feature bullets, file tree, prerequisites, scripts, API routes, and configuration
- Produces architecture and development guide templates from repository analysis
- Includes intelligent "creator questions" for missing information

---

## 📡 API Reference

All endpoints are prefixed with `/api/build-ai`.

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/jobs` | Create a new documentation generation job (async, returns immediately) |
| `POST` | `/generate` | Create and wait for a documentation generation job (sync) |
| `GET` | `/jobs/:jobId` | Get the current status and result of a job |
| `POST` | `/jobs/:jobId/revise` | Submit feedback to revise generated documentation |
| `POST` | `/jobs/:jobId/approve` | Approve generated files (optionally selective via `approvedPaths`) |
| `GET` | `/health` | Health check endpoint |

### Request Body (`POST /jobs` and `POST /generate`)

```json
{
  "projectName": "My Project",
  "githubUrl": "https://github.com/owner/repo",
  "groqApiKey": "gsk_...",
  "instructions": "Focus on the API documentation...",
  "documentationDepth": "standard"
}
```

| Field | Type | Required | Description |
|---|---|:---:|---|
| `projectName` | string | ✅ | Title for the generated documentation (max 120 chars) |
| `githubUrl` | string | ✅ | GitHub repository URL to analyze |
| `groqApiKey` | string | ✅ | Groq API key for LLM-powered generation |
| `instructions` | string | ❌ | Custom instructions for the AI (max 4000 chars) |
| `documentationDepth` | string | ❌ | `readme-only` \| `standard` \| `complete` (default: `standard`) |

### Job Status Lifecycle

```
queued → scraping → generating → needs_review → approved
                                      ↕
                                   revising
                                      
         * Any stage can transition to → failed
```

---

## 🛣️ Roadmap

### 🔴 High Priority

| Feature | Description |
|---|---|
| **Cloud Persistence** | Save README files to a database via Prisma ORM for cross-device access |
| **Live Markdown Preview** | Rendered GitHub-style preview as a third pane option |
| **Code Block Language Selector** | Dropdown to specify language for fenced code blocks |

### 🟡 Medium Priority

| Feature | Description |
|---|---|
| **Collaborative Editing** | Real-time collaboration via WebSockets + Yjs (TipTap supports it natively) |
| **GitHub Push Integration** | Push generated README directly to a repository via the GitHub API |
| **Responsive / Mobile Layout** | Stack panes vertically on smaller screens |
| **Keyboard Shortcuts Panel** | Help modal listing all available shortcuts |
| **Syntax Highlighting in Editor** | Code highlighting via `@tiptap/extension-code-block-lowlight` |

### 🟢 Nice to Have

| Feature | Description |
|---|---|
| **Export to PDF / RST** | Additional export formats beyond .md and .html |
| **Version History** | Track changes over time with revert capability |
| **Custom Themes** | Font selection, accent colors, and theme customization |
| **Drag-and-Drop Reordering** | Reorder document sections via drag-and-drop |

---

## 📜 Scripts

### Frontend

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Start Vite dev server with HMR at `:5173` |
| **Build** | `npm run build` | Type-check with `tsc -b` then bundle for production |
| **Preview** | `npm run preview` | Serve the production build locally |
| **Lint** | `npm run lint` | Run ESLint on all source files |

### Backend

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Start with Nodemon + ts-node (auto-restart on changes) |
| **Build** | `npm run build` | Compile TypeScript to `dist/` |
| **Start** | `npm start` | Run the compiled production build |
| **Typecheck** | `npm run typecheck` | Run `tsc --noEmit` for type validation |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add my feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/my-feature
   ```
5. **Open** a Pull Request

Please ensure your code:
- ✅ Passes linting — `npm run lint`
- ✅ Builds successfully — `npm run build`
- ✅ Follows existing code style and TypeScript conventions

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Apurve Karanwal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

<p align="center">
  <img src="https://img.shields.io/badge/Made_with-❤️-dc2626?style=for-the-badge" alt="Made with love" />
</p>

<p align="center">
  Built by <a href="https://github.com/ApurveKaranwal"><strong>Apurve Karanwal</strong></a>
</p>

<p align="center">
  <a href="https://github.com/ApurveKaranwal"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" /></a>&nbsp;
</p>
