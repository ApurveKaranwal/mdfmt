import { create } from 'zustand';

interface ThemeState {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    isDarkMode: false,
    toggleDarkMode: () => {
        set((state) => {
            const newMode = !state.isDarkMode;
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return { isDarkMode: newMode };
        });
    },
}));
