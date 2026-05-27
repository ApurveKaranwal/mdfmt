/**
 * Simple markdown parser to convert common Github Flavored Markdown elements to HTML
 * for loading markdown content into the TipTap Editor.
 */
export function markdownToHtml(markdown: string): string {
    if (!markdown) return '';

    let html = markdown;

    // Normalize line endings
    html = html.replace(/\r\n/g, '\n');

    // 1. Code blocks (fenced)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 2. Headings
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
    html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');

    // 3. Images and links
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // 4. Blockquotes & Alert blocks
    // Format blockquotes
    html = html.replace(/^\s*>\s*(.*?)$/gm, '<blockquote><p>$1</p></blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // 5. Unordered Lists (simple bullet parser)
    html = html.replace(/^\s*[-*+]\s+(.*?)$/gm, '<li>$1</li>');
    // Wrap consecutive list items
    html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');

    // 6. Ordered Lists
    html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, (match) => {
        // If it's already wrapped in ul, skip it.
        if (match.trim().startsWith('<ul>') || match.trim().startsWith('<li>') && match.includes('<ul>')) return match;
        return `<ol>${match}</ol>`;
    });

    // Fix double wrapping lists
    html = html.replace(/<\/ul>\n<ul>/g, '');
    html = html.replace(/<\/ol>\n<ol>/g, '');

    // 7. Paragraphs
    const blocks = html.split(/\n{2,}/);
    const parsedBlocks = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        // Skip blocks that are already structural HTML
        if (trimmed.startsWith('<h') ||
            trimmed.startsWith('<pre') ||
            trimmed.startsWith('<blockquote') ||
            trimmed.startsWith('<ul') ||
            trimmed.startsWith('<ol') ||
            trimmed.startsWith('<table') ||
            trimmed.startsWith('<hr') ||
            trimmed.startsWith('<p') ||
            trimmed.startsWith('<div')) {
            return trimmed;
        }
        // Otherwise, wrap in paragraph
        return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    });

    return parsedBlocks.join('\n');
}
