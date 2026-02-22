import { useState, useRef, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import {
    FileText, BookOpen, Terminal, Users, Scale, Heart, ChevronDown, ChevronRight,
} from 'lucide-react';

interface SnippetDropdownProps {
    editor: Editor | null;
}

interface Snippet {
    id: string;
    label: string;
    icon: React.ReactNode;
    description: string;
    content: string;
}

const SNIPPETS: Snippet[] = [
    {
        id: 'toc',
        label: 'Table of Contents',
        icon: <FileText className="w-4 h-4" />,
        description: 'Auto-linked section navigation',
        content:
            '<h2>📑 Table of Contents</h2>' +
            '<ul>' +
            '<li><a href="#about">About</a></li>' +
            '<li><a href="#features">Features</a></li>' +
            '<li><a href="#installation">Installation</a></li>' +
            '<li><a href="#usage">Usage</a></li>' +
            '<li><a href="#contributing">Contributing</a></li>' +
            '<li><a href="#license">License</a></li>' +
            '</ul>',
    },
    {
        id: 'installation',
        label: 'Installation',
        icon: <Terminal className="w-4 h-4" />,
        description: 'Setup and install instructions',
        content:
            '<h2>⚡ Installation</h2>' +
            '<p>Clone the repository:</p>' +
            '<pre><code>git clone https://github.com/username/repo.git\ncd repo</code></pre>' +
            '<p>Install dependencies:</p>' +
            '<pre><code>npm install</code></pre>' +
            '<p>Start the development server:</p>' +
            '<pre><code>npm run dev</code></pre>',
    },
    {
        id: 'usage',
        label: 'Usage',
        icon: <BookOpen className="w-4 h-4" />,
        description: 'How to use the project',
        content:
            '<h2>🚀 Usage</h2>' +
            '<p>Here\'s a quick example to get started:</p>' +
            '<pre><code>import { example } from \'your-package\';\n\nconst result = example();\nconsole.log(result);</code></pre>' +
            '<p>For more examples, see the <a href="#documentation">documentation</a>.</p>',
    },
    {
        id: 'contributing',
        label: 'Contributing',
        icon: <Users className="w-4 h-4" />,
        description: 'Contribution guidelines',
        content:
            '<h2>🤝 Contributing</h2>' +
            '<p>Contributions are welcome! Here\'s how you can help:</p>' +
            '<ol>' +
            '<li>Fork the repository</li>' +
            '<li>Create a new branch (<code>git checkout -b feature/amazing-feature</code>)</li>' +
            '<li>Commit your changes (<code>git commit -m "Add amazing feature"</code>)</li>' +
            '<li>Push to the branch (<code>git push origin feature/amazing-feature</code>)</li>' +
            '<li>Open a Pull Request</li>' +
            '</ol>',
    },
    {
        id: 'license',
        label: 'License',
        icon: <Scale className="w-4 h-4" />,
        description: 'License section',
        content:
            '<h2>📄 License</h2>' +
            '<p>This project is licensed under the <strong>MIT License</strong> — see the <a href="LICENSE">LICENSE</a> file for details.</p>',
    },
    {
        id: 'acknowledgements',
        label: 'Acknowledgements',
        icon: <Heart className="w-4 h-4" />,
        description: 'Credits and thanks',
        content:
            '<h2>🙏 Acknowledgements</h2>' +
            '<ul>' +
            '<li><a href="https://example.com">Awesome Library</a> — for making X possible</li>' +
            '<li><a href="https://example.com">Another Resource</a> — inspiration and guidance</li>' +
            '<li>All the amazing <a href="#contributing">contributors</a></li>' +
            '</ul>',
    },
    {
        id: 'collapsible',
        label: 'Collapsible Section',
        icon: <ChevronRight className="w-4 h-4" />,
        description: 'Expandable details block',
        content:
            '<h3>🔽 Details</h3>' +
            '<blockquote>' +
            '<p><strong>&lt;details&gt;&lt;summary&gt;Click to expand&lt;/summary&gt;</strong></p>' +
            '<p>Your hidden content goes here. This will be collapsed by default on GitHub.</p>' +
            '<p><strong>&lt;/details&gt;</strong></p>' +
            '</blockquote>',
    },
];

const SnippetDropdown = ({ editor }: SnippetDropdownProps) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) return null;

    const handleInsert = (snippet: Snippet) => {
        editor.chain().focus().insertContent(snippet.content).run();
        setOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-[0.97]"
            >
                <FileText className="w-4 h-4" />
                Snippets
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-dropdown-in">
                    <div className="p-2">
                        <p className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                            Quick Insert
                        </p>
                        {SNIPPETS.map((snippet) => (
                            <button
                                key={snippet.id}
                                onClick={() => handleInsert(snippet)}
                                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                            >
                                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
                                    {snippet.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{snippet.label}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{snippet.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SnippetDropdown;
