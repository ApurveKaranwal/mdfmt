import { type Editor } from '@tiptap/react';
import { Layers, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TechStackGridProps {
    editor: Editor | null;
}

interface BadgeItem {
    name: string;
    logo: string;
    color: string;
    logoColor?: string;
}

const LANGUAGES: BadgeItem[] = [
    { name: 'Python', logo: 'python', color: '3776AB', logoColor: 'white' },
    { name: 'JavaScript', logo: 'javascript', color: 'F7DF1E', logoColor: 'black' },
    { name: 'TypeScript', logo: 'typescript', color: '3178C6', logoColor: 'white' },
    { name: 'Go', logo: 'go', color: '00ADD8', logoColor: 'white' },
    { name: 'Rust', logo: 'rust', color: '000000', logoColor: 'white' },
    { name: 'C++', logo: 'cplusplus', color: '00599C', logoColor: 'white' },
    { name: 'Java', logo: 'openjdk', color: 'ED8B00', logoColor: 'white' },
];

const FRAMEWORKS: BadgeItem[] = [
    { name: 'React', logo: 'react', color: '61DAFB', logoColor: 'black' },
    { name: 'Vue.js', logo: 'vuedotjs', color: '4FC08D', logoColor: 'white' },
    { name: 'Next.js', logo: 'nextdotjs', color: '000000', logoColor: 'white' },
    { name: 'Node.js', logo: 'nodedotjs', color: '5FA04E', logoColor: 'white' },
    { name: 'Tailwind CSS', logo: 'tailwindcss', color: '06B6D4', logoColor: 'white' },
    { name: 'FastAPI', logo: 'fastapi', color: '009688', logoColor: 'white' },
    { name: 'Django', logo: 'django', color: '092E20', logoColor: 'white' },
];

const TOOLS: BadgeItem[] = [
    { name: 'Docker', logo: 'docker', color: '2496ED', logoColor: 'white' },
    { name: 'Kubernetes', logo: 'kubernetes', color: '326CE5', logoColor: 'white' },
    { name: 'AWS', logo: 'amazonaws', color: '232F3E', logoColor: 'white' },
    { name: 'Firebase', logo: 'firebase', color: 'DD2C00', logoColor: 'white' },
    { name: 'PostgreSQL', logo: 'postgresql', color: '4169E1', logoColor: 'white' },
    { name: 'MongoDB', logo: 'mongodb', color: '47A248', logoColor: 'white' },
    { name: 'Redis', logo: 'redis', color: 'DC382D', logoColor: 'white' },
];

export default function TechStackGrid({ editor }: TechStackGridProps) {
    const [insertedList, setInsertedList] = useState<string[]>([]);

    if (!editor) return null;

    const handleInsert = (tech: BadgeItem) => {
        const logoColorParam = tech.logoColor ? `&logoColor=${tech.logoColor}` : '';
        const url = `https://img.shields.io/badge/${encodeURIComponent(tech.name)}-${tech.color}?style=for-the-badge&logo=${tech.logo}${logoColorParam}`;

        editor.chain().focus().setImage({ src: url, alt: tech.name }).run();
        editor.chain().focus().insertContent(' ').run(); // add space helper

        setInsertedList((prev) => [...prev, tech.name]);
        setTimeout(() => {
            setInsertedList((prev) => prev.filter((item) => item !== tech.name));
        }, 1500);
    };

    const renderSection = (title: string, list: BadgeItem[]) => (
        <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {title}
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
                {list.map((tech) => {
                    const isInserted = insertedList.includes(tech.name);
                    return (
                        <button
                            key={tech.name}
                            onClick={() => handleInsert(tech)}
                            className="flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all text-left"
                        >
                            <span className="truncate pr-1">{tech.name}</span>
                            {isInserted ? (
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            ) : (
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: `#${tech.color}` }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-150 dark:border-gray-800">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tech Stack Icons</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Click any technology below to instantly insert its corresponding badge at your cursor location.
            </p>

            <div className="space-y-3.5">
                {renderSection('Languages', LANGUAGES)}
                {renderSection('Frameworks & Runtimes', FRAMEWORKS)}
                {renderSection('Databases & Infra', TOOLS)}
            </div>
        </div>
    );
}
