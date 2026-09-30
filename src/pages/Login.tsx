import React, { useState } from 'react';
import {
  logInWithEmail,
  signInWithGoogle,
  loginAsDemoStudent,
  getFriendlyErrorMessage,
  isGoogleAuthSupportedOnCurrentDomain
} from '../services/authService';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  onNavigateToSignup: () => void;
  onBackToHome?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onNavigateToSignup, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGoogleSupported = isGoogleAuthSupportedOnCurrentDomain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in both your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await logInWithEmail(email.trim(), password);
      onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsDemoStudent(true);
      onSuccess();
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isGoogleSupported) {
      setError('Google Sign-In is restricted to the development/AI Studio domain on the Starter tier. Please use Email/Password or click "Instant Demo Student" to log in immediately!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = () => {
    setEmail('student@example.com');
    setPassword('student123');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-3.5 sm:p-4 py-6 sm:py-10 relative">
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 clay-btn bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
        >
          <span>← Back to Home</span>
        </button>
      )}

      {/* Platform Branding */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-blue-500 text-white text-2xl sm:text-3xl shadow-lg shadow-blue-200 mb-3 sm:mb-4">
          🎓
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          EduPlay – UnityLearn
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Gamified Learning & Adaptive Skill Engine
        </p>
      </div>

      {/* Main Login Clay Card */}
      <div className="clay-card w-full max-w-md p-5 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Log in to continue your learning journey and game streak
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner (Perfect for Vercel) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/40 border border-amber-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Instant 1-Click Demo Login
            </span>
            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              Works on Vercel
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Open the full student platform as <strong>Komal</strong> with active levels, Firestore syncing, and lessons loaded.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full clay-btn clay-btn-peach py-2.5 px-4 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>Launch as Komal (No Password Needed)</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="clay-btn bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-xl font-bold text-xs border border-rose-200 w-full text-center"
            >
              Click here to Enter as Demo Student Instead →
            </button>
          </div>
        )}

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
            OR SIGN IN WITH EMAIL
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
              >
                Auto-fill Sample
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full clay-input pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full clay-input pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full clay-btn clay-btn-primary py-3 px-4 text-sm text-white flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Sign In with Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="space-y-2.5 mt-5">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full clay-btn py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 ${
              isGoogleSupported
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                : 'bg-slate-50 text-slate-500 border border-slate-200'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isGoogleSupported
                ? 'Sign In with Google'
                : 'Google Sign-In (AI Studio Preview Only)'}
            </span>
          </button>
          {!isGoogleSupported && (
            <p className="text-[10px] text-slate-400 text-center">
              Google OAuth is disabled on Vercel by AI Studio Starter tier. Use 1-Click Demo or Email above.
            </p>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <button
            onClick={onNavigateToSignup}
            className="font-bold text-blue-600 hover:text-blue-700 underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
