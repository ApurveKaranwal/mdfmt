import { useState, useMemo } from 'react';
import { type Editor } from '@tiptap/react';
import { X, Search, Smile } from 'lucide-react';

interface EmojiPickerModalProps {
    editor: Editor;
    onClose: () => void;
}

interface EmojiCategory {
    name: string;
    icon: string;
    emojis: string[];
}

const EMOJI_DATA: EmojiCategory[] = [
    {
        name: 'Smileys',
        icon: '😀',
        emojis: [
            '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘',
            '😗', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '😐', '😑', '😶', '🙄',
            '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😷', '🤒', '🤕', '🤢',
            '🤮', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😲',
            '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩',
            '😤', '😡', '😠', '🤬', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖',
        ],
    },
    {
        name: 'Hands',
        icon: '👋',
        emojis: [
            '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
            '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
            '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴',
        ],
    },
    {
        name: 'Nature',
        icon: '🌿',
        emojis: [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
            '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
            '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪲', '🪳', '🦟', '🦗', '🕷️', '🦂', '🐢',
            '🐍', '🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿',
            '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🐙', '🐚',
        ],
    },
    {
        name: 'Food',
        icon: '🍕',
        emojis: [
            '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐',
            '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄',
            '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕',
            '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢',
            '☕', '🍵', '🫖', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🧃', '🧉', '🧊',
        ],
    },
    {
        name: 'Travel',
        icon: '✈️',
        emojis: [
            '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️',
            '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '🚀', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢',
            '✈️', '🛩️', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌',
            '🌍', '🌎', '🌏', '🗺️', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🗾',
            '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉', '🌁',
        ],
    },
    {
        name: 'Objects',
        icon: '💡',
        emojis: [
            '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀',
            '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️',
            '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🧯', '🛢️',
            '💰', '🪙', '💴', '💵', '💶', '💷', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️',
            '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🪓', '🔪', '🗡️', '⚔️', '🛡️',
            '📦', '📫', '📬', '📭', '📮', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '📁', '📂', '🗂️',
            '📅', '📆', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗑️',
            '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️',
        ],
    },
    {
        name: 'Symbols',
        icon: '💜',
        emojis: [
            '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗',
            '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
            '⚛️', '♾️', '🆔', '⚕️', '✖️', '➕', '➖', '➗', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️',
            '💱', '💲', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '🟢', '🔵',
            '🟣', '⚫', '⚪', '🟤', '🔴', '🟠', '🟡', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘',
            '⭐', '🌟', '💫', '✨', '🔥', '💥', '🎯', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️',
        ],
    },
    {
        name: 'Dev',
        icon: '🚀',
        emojis: [
            '🚀', '⚡', '🔥', '💡', '🎯', '✅', '❌', '⚠️', '📝', '📋', '📌', '🔧', '⚙️', '🛠️', '🔨',
            '🧪', '🧬', '🔬', '🔭', '💻', '🖥️', '📱', '🌐', '🔗', '📡', '🗄️', '💾', '🔒', '🔓', '🔑',
            '🏗️', '📦', '🗂️', '📊', '📈', '📉', '🎨', '🖌️', '✏️', '📐', '♻️', '🔄', '⏰', '🕐', '💎',
            '🏆', '🥇', '🎖️', '⭐', '🌟', '💯', '🎉', '🎊', '🎁', '🙌', '👏', '🤝', '💪', '🧠', '👀',
            '📢', '💬', '💭', '🗣️', '🔔', '📣', '🏁', '🚩', '🏴', '🏳️',
        ],
    },
];

const EmojiPickerModal = ({ editor, onClose }: EmojiPickerModalProps) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(0);

    const filteredEmojis = useMemo(() => {
        if (!search.trim()) return null;
        const all = EMOJI_DATA.flatMap((cat) => cat.emojis);
        // Simple search just returns all emojis (emoji search by name would require a mapping)
        // For now, filter by checking if the search term matches the category name
        const matchingCats = EMOJI_DATA.filter((cat) =>
            cat.name.toLowerCase().includes(search.toLowerCase())
        );
        if (matchingCats.length > 0) {
            return matchingCats.flatMap((cat) => cat.emojis);
        }
        return all;
    }, [search]);

    const handleInsert = (emoji: string) => {
        editor.chain().focus().insertContent(emoji).run();
    };

    const displayEmojis = filteredEmojis || EMOJI_DATA[activeCategory].emojis;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-modal-in max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                            <Smile className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Emoji Picker</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 pt-4 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by category..."
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                {!search && (
                    <div className="flex gap-1 px-6 pt-3 overflow-x-auto shrink-0">
                        {EMOJI_DATA.map((cat, idx) => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(idx)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${idx === activeCategory
                                        ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span className="hidden sm:inline">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Emoji Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    {!filteredEmojis && (
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                            {EMOJI_DATA[activeCategory].icon} {EMOJI_DATA[activeCategory].name}
                        </p>
                    )}
                    <div className="grid grid-cols-8 gap-1">
                        {displayEmojis.map((emoji, idx) => (
                            <button
                                key={`${emoji}-${idx}`}
                                onClick={() => handleInsert(emoji)}
                                className="w-10 h-10 flex items-center justify-center text-xl rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-90"
                                title={emoji}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmojiPickerModal;
