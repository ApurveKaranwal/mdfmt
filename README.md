<p align="center">
  <img src="https://img.icons8.com/fluency/96/markdown.png" alt="mdfmt logo" width="80" />
</p>

<h1 align="center">mdfmt — README Studio</h1>

<p align="center">
  <strong>A modern, WYSIWYG Markdown editor purpose-built for crafting beautiful README files.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#future-improvements">Future Improvements</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19.2-61dafb?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-7.3-646cff?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwindcss-3.4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

---

## Overview

**mdfmt** (README Studio) is an open-source, browser-based Markdown editor that lets you write and design README files using a rich-text, what-you-see-is-what-you-get (WYSIWYG) interface — then export pristine, GitHub-flavored Markdown with a single click.

Instead of memorizing Markdown syntax or switching back and forth between a text editor and a preview, mdfmt gives you a **split-pane workspace**: a fully interactive rich-text editor on the left, and a live Markdown output panel on the right. Every keystroke in the editor is instantly converted to clean Markdown in real time.

---

## Features

### 🖊️ Rich Text Editing (WYSIWYG)

Write naturally in a rich-text editor powered by [TipTap](https://tiptap.dev/). No need to memorize Markdown syntax — just click a toolbar button or use a keyboard shortcut.

| Category | Supported Elements |
|---|---|
| **Headings** | H1, H2, H3 with GitHub-style bottom borders |
| **Inline Formatting** | **Bold**, *Italic*, ~~Strikethrough~~, `Inline Code` |
| **Lists** | Bullet lists, Ordered (numbered) lists, Task lists (checkboxes) |
| **Block Elements** | Blockquotes, Horizontal rules, Fenced code blocks |
| **Links** | Hyperlinks with URL prompt dialog |
| **Tables** | Insertable 3×3 tables with header rows (resizable) |

### ⚡ Real-Time Markdown Conversion

As you type in the WYSIWYG editor, the Markdown output panel updates **instantly**. The conversion is powered by [Turndown](https://github.com/mixmark-io/turndown), configured specifically for GitHub-Flavored Markdown (GFM):

- **ATX-style headings** (`# Heading`)
- **Fenced code blocks** (triple backticks)
- **Dash bullet markers** (`- item`)
- **Strikethrough** (`~~text~~`)

### 📋 One-Click Copy to Clipboard

Click the **Copy** button in the header to instantly copy the generated Markdown to your clipboard. A visual "Copied!" confirmation appears for 2 seconds so you never wonder if it worked.

### 💾 Export as `.md` File

Click **Export .md** to instantly download the generated Markdown as a `README.md` file. The download is created entirely client-side using the Blob API — no server round-trip required.

### 🌙 Dark Mode

Toggle between light and dark themes with a single click. The dark mode state is managed globally via [Zustand](https://github.com/pmndrs/zustand) and applies instantly across the entire application — editor, toolbar, output pane, and header. The implementation uses Tailwind CSS's `class` strategy, toggling the `dark` class on the root `<html>` element.

### 📊 Live Word Count

The Markdown output pane displays a real-time word count in the header bar, giving you an at-a-glance metric of your README's length.

### 🎨 Polished Editor Styling

The TipTap editor area features carefully hand-crafted CSS for every Markdown element:

- Headings with distinct sizes, weights, and subtle bottom borders (matching GitHub's rendering)
- Blockquotes with a blue left border and italic gray text
- Code blocks with a dark background, `Fira Code` monospace font, and rounded corners
- Tables with clean borders and alternating header backgrounds
- Task lists with checkbox alignment and proper spacing

All styles are fully dark-mode aware with separate color values for light and dark themes.

---

## Demo

The editor workspace is split into two panes:

```
┌──────────────────────────────────────────────────────────────────┐
│  🖊️ README Studio              [Templates] [🌙] [Copy] [Export] │
├──────────────────────────────────────────────────────────────────┤
│  H1 H2 H3 │ B I S ` │ • 1. ☐ │ ❝ — 🔗 ▦    ← Toolbar         │
├───────────────────────────┬──────────────────────────────────────┤
│                           │  README.md                  42 words │
│   WYSIWYG Rich Editor     │                                      │
│                           │  # Welcome to README Studio          │
│   Welcome to README       │                                      │
│   Studio                  │  Start typing to design your         │
│                           │  beautiful README.                   │
│   Start typing to design  │                                      │
│   your beautiful README.  │                                      │
│                           │                                      │
└───────────────────────────┴──────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19.2 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Static type checking |
| [Vite](https://vite.dev/) | 7.3 | Build tool & dev server with HMR |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS framework |
| [TipTap](https://tiptap.dev/) | 3.20 | Headless rich-text editor framework |
| [Turndown](https://github.com/mixmark-io/turndown) | 7.2 | HTML → Markdown conversion |
| [Zustand](https://github.com/pmndrs/zustand) | 5.0 | Lightweight state management |
| [Lucide React](https://lucide.dev/) | 0.575 | Icon library |
| [React Router](https://reactrouter.com/) | 7.13 | Client-side routing |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — | Conditional class name utilities |

### Backend (Scaffolded)

| Technology | Version | Purpose |
|---|---|---|
| [Express](https://expressjs.com/) | 5.2 | Web framework |
| [Prisma](https://www.prisma.io/) | 7.4 | Database ORM |
| [JSON Web Tokens (JWT)](https://github.com/auth0/node-jsonwebtoken) | 9.0 | Authentication tokens |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 6.0 | Password hashing |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Static type checking |
| [Nodemon](https://nodemon.io/) | 3.1 | Dev server with auto-restart |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          mdfmt Monorepo                         │
├──────────────────────────────┬──────────────────────────────────┤
│        frontend/             │          backend/                │
│                              │                                  │
│  ┌────────────────────────┐  │  ┌────────────────────────────┐  │
│  │      React + Vite      │  │  │    Express + Prisma        │  │
│  │                        │  │  │                            │  │
│  │  ┌──────────────────┐  │  │  │  ┌──────────────────────┐  │  │
│  │  │    TipTap Editor │  │  │  │  │   REST API Routes    │  │  │
│  │  │    (WYSIWYG)     │  │  │  │  │                      │  │  │
│  │  └───────┬──────────┘  │  │  │  │  • User Auth (JWT)   │  │  │
│  │          │ HTML output │  │  │  │  • README CRUD        │  │  │
│  │          ▼             │  │  │  │  • Template Storage   │  │  │
│  │  ┌──────────────────┐  │  │  │  └──────────┬───────────┘  │  │
│  │  │    Turndown      │  │  │  │             │              │  │
│  │  │  (HTML → MD)     │  │  │  │             ▼              │  │
│  │  └───────┬──────────┘  │  │  │  ┌──────────────────────┐  │  │
│  │          │ Markdown    │  │  │  │  Prisma ORM + DB     │  │  │
│  │          ▼             │  │  │  └──────────────────────┘  │  │
│  │  ┌──────────────────┐  │  │  │                            │  │
│  │  │  Output Pane     │  │  │  └────────────────────────────┘  │
│  │  │  (Live Preview)  │  │  │                                  │
│  │  └──────────────────┘  │  │                                  │
│  └────────────────────────┘  │                                  │
├──────────────────────────────┴──────────────────────────────────┤
│                    Zustand (Global State)                        │
│                    • Theme (dark/light mode)                     │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. The user types in the **TipTap WYSIWYG editor**, which internally maintains a ProseMirror document.
2. On every keystroke (`onUpdate`), TipTap emits the current document as **HTML**.
3. The HTML is piped through **Turndown** (configured for GFM) to produce clean **Markdown**.
4. The Markdown string is set in React state and rendered in the **output pane** in real time.
5. The user can **copy** the Markdown to clipboard or **download** it as a `.md` file.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or **yarn** / **pnpm**)

### Installation

```bash
# Clone the repository
git clone https://github.com/ApurveKaranwal/mdfmt.git
cd mdfmt
```

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server will start at `http://localhost:5173` with hot module replacement (HMR) enabled.

### Running the Backend (Scaffolded)

```bash
cd backend
npm install
# Backend source files are being developed — see Future Improvements below
```

### Building for Production

```bash
cd frontend
npm run build
npm run preview   # Preview the production build locally
```

The production build outputs optimized static assets to `frontend/dist/`.

---

## Project Structure

```
mdfmt/
├── LICENSE                          # MIT License
├── README.md                        # This file
│
├── frontend/                        # React + Vite frontend
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Dependencies & scripts
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration (class-based dark mode)
│   ├── postcss.config.js            # PostCSS plugins (Tailwind + Autoprefixer)
│   ├── tsconfig.json                # TypeScript project references
│   ├── tsconfig.app.json            # App-level TS config
│   ├── tsconfig.node.json           # Node-level TS config (for Vite)
│   ├── eslint.config.js             # ESLint flat config
│   ├── public/                      # Static assets (favicon)
│   │   └── vite.svg
│   └── src/
│       ├── main.tsx                 # App entry — mounts React with BrowserRouter
│       ├── App.tsx                  # Root component — defines routes
│       ├── index.css                # Global styles (Tailwind + TipTap editor styles)
│       ├── pages/
│       │   └── EditorPage.tsx       # Main editor page — WYSIWYG + Markdown output
│       ├── components/
│       │   └── Toolbar.tsx          # Editor toolbar — formatting buttons
│       └── store/
│           └── useThemeStore.ts     # Zustand store — dark mode state
│
└── backend/                         # Express + Prisma backend (scaffolded)
    └── package.json                 # Backend dependencies
```

---

## How It Works

### TipTap Editor Configuration

The WYSIWYG editor is built on [TipTap](https://tiptap.dev/), a headless, framework-agnostic rich-text editor built on top of [ProseMirror](https://prosemirror.net/). The following TipTap extensions are loaded:

| Extension | Purpose |
|---|---|
| `StarterKit` | Bundles essential nodes (paragraph, heading, code block, blockquote, bullet list, ordered list, horizontal rule) and marks (bold, italic, strike, code) |
| `Link` | Adds hyperlink support with `openOnClick: false` to prevent accidental navigation |
| `TaskList` + `TaskItem` | Enables GitHub-style task lists with interactive checkboxes and nested support |
| `Table` + `TableRow` + `TableHeader` + `TableCell` | Adds full table support with resizable columns |

### HTML-to-Markdown Conversion (Turndown)

[Turndown](https://github.com/mixmark-io/turndown) converts the HTML output from TipTap into Markdown. The service is configured with these specific options:

```typescript
const turndownService = new TurndownService({
  headingStyle: 'atx',          // Use # for headings (not underline style)
  codeBlockStyle: 'fenced',    // Use ``` for code blocks (not indentation)
  bulletListMarker: '-',        // Use - for bullet items (not * or +)
});
```

A custom rule is added for **strikethrough** to produce `~~text~~` syntax from `<del>` and `<s>` HTML tags.

### State Management (Zustand)

Global application state is managed by [Zustand](https://github.com/pmndrs/zustand), a minimal, unopinionated state management library. Currently, a single store handles the theme:

```typescript
// useThemeStore.ts — manages dark mode toggle
// Toggles the 'dark' class on document.documentElement
// Tailwind's 'class' darkMode strategy reads this class
```

### Class Name Utility (`cn`)

The project uses a common pattern combining [clsx](https://github.com/lukeed/clsx) and [tailwind-merge](https://github.com/dcastil/tailwind-merge) into a `cn()` helper function. This allows conditional, conflict-free Tailwind class composition:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Future Improvements

The project has a solid foundation and is designed for extensibility. Here is a roadmap of improvements organized by priority:

### 🔴 High Priority

| Improvement | Description |
|---|---|
| **User Authentication** | Implement JWT-based signup/login with the Express backend. bcrypt and jsonwebtoken are already installed. |
| **Cloud Persistence** | Save README files to a database via Prisma ORM so users can access their work across sessions and devices. |
| **README Templates** | Build a template gallery (the "Templates" button in the header is already in the UI). Pre-built templates for open-source projects, libraries, APIs, portfolios, etc. |
| **Live Markdown Preview (Rendered)** | Add a third pane or toggle that renders the Markdown output as actual HTML (GitHub-style rendered preview), not just raw Markdown text. |

### 🟡 Medium Priority

| Improvement | Description |
|---|---|
| **Image Upload & Embedding** | Support image insertion via drag-and-drop, paste, or file picker. Store images on a CDN or as base64. |
| **Code Block Language Selector** | Add a dropdown to specify the programming language for fenced code blocks (e.g., ` ```python`). |
| **Keyboard Shortcuts Panel** | Show a help modal listing all available keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic, etc.). |
| **Undo/Redo Buttons** | Expose TipTap's built-in undo/redo commands as toolbar buttons for discoverability. |
| **Table Enhancements** | Add toolbar buttons for adding/removing rows and columns, merging cells, and toggling header rows. |
| **Local Storage Auto-Save** | Persist the editor content in `localStorage` so unsaved work survives browser refreshes. |
| **Import Existing Markdown** | Allow users to upload or paste existing `.md` files and parse them back into the WYSIWYG editor. |
| **Responsive / Mobile Layout** | Stack the editor and output panes vertically on smaller screens. Currently, the side-by-side layout is not mobile-optimized. |

### 🟢 Nice to Have

| Improvement | Description |
|---|---|
| **AI-Powered Writing Assistance** | Integrate an LLM API to suggest README sections, auto-generate descriptions, or improve writing quality. |
| **Collaborative Editing** | Add real-time collaboration via WebSockets and CRDTs (TipTap supports Yjs via the Collaboration extension). |
| **Export to Multiple Formats** | Support exporting to PDF, HTML, or RST in addition to `.md`. |
| **GitHub Integration** | Allow users to push the generated README directly to a GitHub repository via the GitHub API. |
| **Syntax Highlighting in Code Blocks** | Add code syntax highlighting in the editor using extensions like `@tiptap/extension-code-block-lowlight`. |
| **Custom Themes / Font Selection** | Let users choose editor fonts, accent colors, and overall theme beyond light/dark. |
| **Version History** | Track changes over time and allow users to revert to previous versions of their README. |
| **Badge Builder** | Add a visual UI for inserting shields.io badges (build status, license, npm version, etc.) into the README. |
| **Table of Contents Generator** | Auto-generate a clickable table of contents based on the headings in the document. |
| **Emoji Picker** | Integrate an emoji picker for easy insertion of emojis into the README. |
| **Drag-and-Drop Block Reordering** | Allow sections to be reordered via drag-and-drop for easy README restructuring. |

---

## Scripts

### Frontend

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Start Vite dev server with HMR |
| **Build** | `npm run build` | Type-check with `tsc` then bundle for production |
| **Preview** | `npm run preview` | Serve the production build locally |
| **Lint** | `npm run lint` | Run ESLint on all source files |

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/my-feature`)
3. **Commit** your changes (`git commit -m 'Add my feature'`)
4. **Push** to the branch (`git push origin feature/my-feature`)
5. **Open** a Pull Request

Please ensure your code passes linting (`npm run lint`) and builds successfully (`npm run build`) before submitting.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

**Copyright © 2026 [Apurve Karanwal](https://github.com/ApurveKaranwal)**

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ApurveKaranwal">Apurve Karanwal</a>
</p>
