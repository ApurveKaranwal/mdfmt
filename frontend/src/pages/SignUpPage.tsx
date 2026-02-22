import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { signInWithGoogle, signInWithGithub, signUpWithEmail } from '../lib/firebase';

const SignUpPage = () => {
    const { isDarkMode } = useThemeStore();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const strength = (() => {
        if (!password) return null;
        if (password.length < 6) return { w: '25%', color: 'bg-red-500', label: 'Too short' };
        if (password.length < 8) return { w: '50%', color: 'bg-amber-500', label: 'Fair' };
        if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
            return { w: '100%', color: 'bg-emerald-500', label: 'Strong' };
        return { w: '75%', color: 'bg-blue-500', label: 'Good' };
    })();

    const handleEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading('email');
        try {
            await signUpWithEmail(email, password, name);
            navigate('/');
        } catch (err: any) {
            const code = err?.code || '';
            if (code === 'auth/email-already-in-use') setError('An account with this email already exists.');
            else if (code === 'auth/weak-password') setError('Password is too weak.');
            else if (code === 'auth/invalid-api-key' || code === 'auth/configuration-not-found')
                setError('Firebase not configured. Add your keys to .env file.');
            else setError('Something went wrong. Try again.');
        }
        setLoading(null);
    };

    const handleGoogle = async () => {
        setError('');
        setLoading('google');
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err: any) {
            if (err?.code !== 'auth/popup-closed-by-user') {
                if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/configuration-not-found')
                    setError('Firebase not configured. Add your keys to .env file.');
                else setError('Google sign-up failed.');
            }
        }
        setLoading(null);
    };

    const handleGithub = async () => {
        setError('');
        setLoading('github');
        try {
            await signInWithGithub();
            navigate('/');
        } catch (err: any) {
            if (err?.code !== 'auth/popup-closed-by-user') {
                if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/configuration-not-found')
                    setError('Firebase not configured. Add your keys to .env file.');
                else setError('GitHub sign-up failed.');
            }
        }
        setLoading(null);
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f10] px-4 transition-colors">
                <div className="w-full max-w-sm">
                    {/* Brand */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold mb-4 shadow-lg shadow-blue-500/20">
                            R
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-[13px] text-gray-500 dark:text-gray-500 mt-1">
                            Free forever. No credit card needed.
                        </p>
                    </div>

                    {/* OAuth */}
                    <div className="space-y-2.5 mb-6">
                        <button
                            onClick={handleGoogle}
                            disabled={loading !== null}
                            className="w-full flex items-center justify-center gap-2.5 h-10 text-[13px] font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2d] rounded-lg hover:bg-gray-50 dark:hover:bg-[#222224] transition-colors disabled:opacity-50"
                        >
                            {loading === 'google' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            Continue with Google
                        </button>

                        <button
                            onClick={handleGithub}
                            disabled={loading !== null}
                            className="w-full flex items-center justify-center gap-2.5 h-10 text-[13px] font-medium text-white bg-[#24292f] dark:bg-[#1a1a1c] border border-[#24292f] dark:border-[#2a2a2d] rounded-lg hover:bg-[#2f363d] dark:hover:bg-[#222224] transition-colors disabled:opacity-50"
                        >
                            {loading === 'github' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            )}
                            Continue with GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a2a2d]" />
                        <span className="text-[11px] text-gray-400 dark:text-gray-600 uppercase tracking-widest font-medium">or</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a2a2d]" />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-3 py-2 text-[13px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleEmail} className="space-y-3">
                        <div>
                            <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1 block">Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2d] rounded-lg text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2d] rounded-lg text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
                                    className="w-full h-10 pl-9 pr-10 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2d] rounded-lg text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                                </button>
                            </div>

                            {/* Strength Bar */}
                            {strength && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-gray-100 dark:bg-[#2a2a2d] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                                            style={{ width: strength.w }}
                                        />
                                    </div>
                                    <span className="text-[11px] text-gray-400 w-14 text-right">{strength.label}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading !== null}
                            className="w-full h-10 text-[13px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-5"
                        >
                            {loading === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center mt-4 leading-relaxed">
                        By signing up, you agree to our <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-400">Terms</a> and <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-400">Privacy Policy</a>.
                    </p>

                    {/* Footer */}
                    <p className="text-center text-[13px] text-gray-500 dark:text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
