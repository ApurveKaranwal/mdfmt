import { useState } from 'react';
import { type Editor } from '@tiptap/react';
import { X, Globe, Eye } from 'lucide-react';

interface SocialLinksModalProps {
    editor: Editor;
    onClose: () => void;
}

interface SocialPlatform {
    id: string;
    name: string;
    logo: string;
    color: string;
    placeholder: string;
    urlTemplate: string;
}

const PLATFORMS: SocialPlatform[] = [
    { id: 'twitter', name: 'Twitter / X', logo: 'x', color: '000000', placeholder: 'username', urlTemplate: 'https://twitter.com/{value}' },
    { id: 'linkedin', name: 'LinkedIn', logo: 'linkedin', color: '0A66C2', placeholder: 'in/username', urlTemplate: 'https://linkedin.com/{value}' },
    { id: 'youtube', name: 'YouTube', logo: 'youtube', color: 'FF0000', placeholder: '@channel', urlTemplate: 'https://youtube.com/{value}' },
    { id: 'discord', name: 'Discord', logo: 'discord', color: '5865F2', placeholder: 'server-invite-code', urlTemplate: 'https://discord.gg/{value}' },
    { id: 'reddit', name: 'Reddit', logo: 'reddit', color: 'FF4500', placeholder: 'u/username', urlTemplate: 'https://reddit.com/{value}' },
    { id: 'stackoverflow', name: 'Stack Overflow', logo: 'stackoverflow', color: 'F58025', placeholder: 'user-id', urlTemplate: 'https://stackoverflow.com/users/{value}' },
    { id: 'devto', name: 'Dev.to', logo: 'devdotto', color: '0A0A0A', placeholder: 'username', urlTemplate: 'https://dev.to/{value}' },
    { id: 'medium', name: 'Medium', logo: 'medium', color: '000000', placeholder: '@username', urlTemplate: 'https://medium.com/{value}' },
    { id: 'twitch', name: 'Twitch', logo: 'twitch', color: '9146FF', placeholder: 'channel', urlTemplate: 'https://twitch.tv/{value}' },
    { id: 'instagram', name: 'Instagram', logo: 'instagram', color: 'E4405F', placeholder: 'username', urlTemplate: 'https://instagram.com/{value}' },
    { id: 'github', name: 'GitHub', logo: 'github', color: '181717', placeholder: 'username', urlTemplate: 'https://github.com/{value}' },
    { id: 'email', name: 'Email', logo: 'gmail', color: 'EA4335', placeholder: 'your@email.com', urlTemplate: 'mailto:{value}' },
    { id: 'website', name: 'Website', logo: 'googlechrome', color: '4285F4', placeholder: 'https://yoursite.com', urlTemplate: '{value}' },
    { id: 'hashnode', name: 'Hashnode', logo: 'hashnode', color: '2962FF', placeholder: 'username', urlTemplate: 'https://hashnode.com/@{value}' },
    { id: 'mastodon', name: 'Mastodon', logo: 'mastodon', color: '6364FF', placeholder: '@user@instance', urlTemplate: 'https://mastodon.social/{value}' },
    { id: 'telegram', name: 'Telegram', logo: 'telegram', color: '26A5E4', placeholder: 'username', urlTemplate: 'https://t.me/{value}' },
];

const getBadgeUrl = (platform: SocialPlatform) => {
    return `https://img.shields.io/badge/${encodeURIComponent(platform.name)}-${platform.color}?style=for-the-badge&logo=${platform.logo}&logoColor=white`;
};

const SocialLinksModal = ({ editor, onClose }: SocialLinksModalProps) => {
    const [values, setValues] = useState<Record<string, string>>({});

    const updateValue = (id: string, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    const filledPlatforms = PLATFORMS.filter((p) => values[p.id]?.trim());

    const handleInsert = () => {
        if (filledPlatforms.length === 0) return;

        filledPlatforms.forEach((platform) => {
            const url = getBadgeUrl(platform);
            // Insert badge as image wrapped in a link in the markdown
            // For the editor, insert as image. The link will be in the markdown alt text
            editor.chain().focus().setImage({ src: url, alt: `${platform.name}` }).run();
            editor.chain().focus().insertContent(' ').run();
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-modal-in max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg">
                            <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Platforms Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <p className="text-xs text-gray-400 mb-4">Enter your username/URL for each platform you want to include. Only filled platforms will be inserted.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PLATFORMS.map((platform) => (
                            <div
                                key={platform.id}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${values[platform.id]?.trim()
                                    ? 'border-cyan-300 dark:border-cyan-700 bg-cyan-50/50 dark:bg-cyan-900/10'
                                    : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <img
                                    src={getBadgeUrl(platform)}
                                    alt={platform.name}
                                    className="h-6 object-contain shrink-0"
                                    loading="lazy"
                                />
                                <input
                                    type="text"
                                    value={values[platform.id] || ''}
                                    onChange={(e) => updateValue(platform.id, e.target.value)}
                                    placeholder={platform.placeholder}
                                    className="flex-1 min-w-0 px-2 py-1 text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview + Footer */}
                {filledPlatforms.length > 0 && (
                    <div className="px-6 pb-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
                            <Eye className="w-3.5 h-3.5" /> Preview
                        </div>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                            {filledPlatforms.map((p) => (
                                <img key={p.id} src={getBadgeUrl(p)} alt={p.name} className="h-7 object-contain" />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <span className="text-xs text-gray-400">
                        {filledPlatforms.length > 0 ? `${filledPlatforms.length} platform${filledPlatforms.length > 1 ? 's' : ''} selected` : 'No platforms selected'}
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInsert}
                            disabled={filledPlatforms.length === 0}
                            className="px-5 py-2 text-sm font-medium text-white bg-cyan-600 rounded-xl hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            Insert {filledPlatforms.length} Badge{filledPlatforms.length !== 1 ? 's' : ''}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialLinksModal;
