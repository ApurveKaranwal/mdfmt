import { useState } from 'react';
import { type Editor } from '@tiptap/react';
import { X, Palette, Eye } from 'lucide-react';

interface CustomBadgeModalProps {
    editor: Editor;
    onClose: () => void;
}

const BADGE_STYLES = [
    { id: 'for-the-badge', label: 'For the Badge' },
    { id: 'flat', label: 'Flat' },
    { id: 'flat-square', label: 'Flat Square' },
    { id: 'plastic', label: 'Plastic' },
    { id: 'social', label: 'Social' },
];

const PRESET_COLORS = [
    { name: 'Blue', hex: '0d6efd' },
    { name: 'Green', hex: '198754' },
    { name: 'Red', hex: 'dc3545' },
    { name: 'Yellow', hex: 'ffc107' },
    { name: 'Purple', hex: '6f42c1' },
    { name: 'Cyan', hex: '0dcaf0' },
    { name: 'Orange', hex: 'fd7e14' },
    { name: 'Pink', hex: 'd63384' },
    { name: 'Teal', hex: '20c997' },
    { name: 'Indigo', hex: '6610f2' },
    { name: 'Dark', hex: '212529' },
    { name: 'Gray', hex: '6c757d' },
    { name: 'Success', hex: '28a745' },
    { name: 'Info', hex: '17a2b8' },
    { name: 'Navy', hex: '001f3f' },
    { name: 'Lime', hex: '01ff70' },
];

const POPULAR_LOGOS = [
    'github', 'python', 'javascript', 'typescript', 'react', 'node.js', 'docker',
    'npm', 'yarn', 'git', 'linux', 'windows', 'apple', 'android', 'firebase',
    'mongodb', 'postgresql', 'redis', 'graphql', 'rust', 'go', 'java', 'swift',
    'flutter', 'vue.js', 'angular', 'svelte', 'nextdotjs', 'vercel', 'netlify',
    'amazonaws', 'googlecloud', 'microsoftazure', 'heroku', 'digitalocean',
];

const CustomBadgeModal = ({ editor, onClose }: CustomBadgeModalProps) => {
    const [label, setLabel] = useState('build');
    const [message, setMessage] = useState('passing');
    const [color, setColor] = useState('28a745');
    const [labelColor] = useState('555');
    const [style, setStyle] = useState('for-the-badge');
    const [logo, setLogo] = useState('');
    const [logoColor] = useState('white');

    const getBadgeUrl = () => {
        const encodedLabel = encodeURIComponent(label || 'label');
        const encodedMessage = encodeURIComponent(message || 'message');
        let url = `https://img.shields.io/badge/${encodedLabel}-${encodedMessage}-${color}?style=${style}&labelColor=${labelColor}`;
        if (logo) url += `&logo=${encodeURIComponent(logo)}&logoColor=${encodeURIComponent(logoColor)}`;
        return url;
    };

    const handleInsert = () => {
        const url = getBadgeUrl();
        editor.chain().focus().setImage({ src: url, alt: `${label}: ${message}` }).run();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-modal-in max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-lg">
                            <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Badge</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Live Preview */}
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Eye className="w-3.5 h-3.5" /> Live Preview
                        </div>
                        <img src={getBadgeUrl()} alt="badge preview" className="h-8 object-contain" />
                    </div>

                    {/* Label & Message */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Label (left)</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Message (right)</label>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Badge Color */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Badge Color</label>
                        <div className="flex flex-wrap gap-1.5">
                            {PRESET_COLORS.map((c) => (
                                <button
                                    key={c.hex}
                                    onClick={() => setColor(c.hex)}
                                    className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${color === c.hex ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: `#${c.hex}` }}
                                    title={c.name}
                                />
                            ))}
                            <div className="flex items-center gap-1 ml-2">
                                <span className="text-xs text-gray-400">#</span>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value.replace('#', ''))}
                                    className="w-20 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Style */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Badge Style</label>
                        <div className="flex flex-wrap gap-1.5">
                            {BADGE_STYLES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setStyle(s.id)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${style === s.id
                                        ? 'border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Logo */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                            Logo <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {POPULAR_LOGOS.slice(0, 18).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLogo(logo === l ? '' : l)}
                                    className={`px-2 py-1 text-[10px] font-medium rounded-md border transition-colors ${logo === l
                                        ? 'border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            placeholder="Or type logo name..."
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="px-5 py-2 text-sm font-medium text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition-colors shadow-sm"
                    >
                        Insert Badge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomBadgeModal;
