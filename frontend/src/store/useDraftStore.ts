import { create } from 'zustand';

interface DraftState {
    markdown: string;
    htmlContent: string;
    setMarkdown: (markdown: string) => void;
    setHtmlContent: (htmlContent: string) => void;
    clearDraft: () => void;
}

const DEFAULT_HTML = `<h1>Welcome to mdfmt</h1><p>Start writing your documentation or generate it automatically using our AI agent.</p>`;
const DEFAULT_MD = `# Welcome to mdfmt\n\nStart writing your documentation or generate it automatically using our AI agent.`;

export const useDraftStore = create<DraftState>((set) => ({
    markdown: localStorage.getItem('mdfmt_md_draft') || DEFAULT_MD,
    htmlContent: localStorage.getItem('mdfmt_html_draft') || DEFAULT_HTML,
    setMarkdown: (markdown) => {
        localStorage.setItem('mdfmt_md_draft', markdown);
        set({ markdown });
    },
    setHtmlContent: (htmlContent) => {
        localStorage.setItem('mdfmt_html_draft', htmlContent);
        set({ htmlContent });
    },
    clearDraft: () => {
        localStorage.removeItem('mdfmt_md_draft');
        localStorage.removeItem('mdfmt_html_draft');
        set({ markdown: '', htmlContent: '' });
    }
}));
