# ✨ mdfmt Features Breakdown

**mdfmt** is not just an editor; it's a comprehensive README and project documentation studio. This guide provides an in-depth look at all available tools and how to get the most out of them.

![Features Header](https://placehold.co/1000x200/0f172a/a855f7?text=mdfmt+Feature+Suite)

---

## 1. WYSIWYG Markdown Editor
At the heart of mdfmt is the rich-text editor. 
- **No syntax required:** Use keyboard shortcuts (`Ctrl+B` for bold, `Ctrl+I` for italics) or the toolbar.
- **Block Elements:** Drag and drop lists, code blocks, quote blocks, and tables.
- **GFM Alerts:** Native support for GitHub alerts (`> [!NOTE]`, `> [!WARNING]`, etc.).
- **Live Output:** As you write, proper GitHub-Flavored Markdown is generated instantly.

## 2. AI Documentation Agent
Instead of writing a README from scratch, let mdfmt write it for you.
- Provide a public GitHub URL.
- The backend clones the repo, analyzes the tech stack (`package.json`, `Cargo.toml`, etc.), and reads the source files.
- The **LLaMA 3.3 70B** model generates an incredibly detailed architecture and setup guide.
- **Review UI:** You can manually approve and tweak the output section by section before inserting it.

## 3. 🎨 Badge Studio
Enhance your README with colorful status and tech badges.
- **Library:** Access over 80+ pre-built technology badges (React, Python, AWS).
- **Custom Builder:** Enter a custom label, message, and color hex to generate a Shields.io badge on the fly.
- **Socials:** Quick inserts for Twitter, LinkedIn, Hashnode, Dev.to, and Discord badges.

## 4. 🔀 Diagram Studio (New!)
Text-heavy READMEs can be boring. Visuals help explain architecture faster.
- **AI-Powered:** Type "A user login flow" and the AI will generate the appropriate Mermaid.js code.
- **Live Preview:** See your diagram render dynamically in light or dark mode.
- **One-Click Insert:** Push the generated diagram code block directly into your editor draft.

## 5. 🧑‍💻 GitHub Profile Builder (New!)
Create a stunning `user/user` special GitHub profile repository.
- **Wizard Interface:** Fill out your name, bio, and social links.
- **Tech Stack Selector:** Click technologies to add them to your profile layout seamlessly.
- **Dynamic Stats:** Easily toggle GitHub Profile Stats, Top Languages, and Theme Customization (Radical, Tokyo Night, Dracula).
- **Instant Preview:** See your profile build out in real time before exporting the markdown.

## 6. Document Utilities
- **Auto Table of Contents:** Generates a clickable ToC based on your H1-H3 headers.
- **Import/Export:** Drag a `.md` file into the editor, or hit Export to save your draft natively.
- **Emoji Picker:** Browse categorized emojis directly inside the editor without relying on OS pickers.
