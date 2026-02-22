import { create } from 'zustand';
import { auth, onAuthStateChanged, isConfigured, type User } from '../lib/firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: isConfigured,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
}));

// Listen for auth state changes (only if Firebase is configured)
if (auth) {
    onAuthStateChanged(auth, (user) => {
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setLoading(false);
    });
}
