import React, { useState } from 'react';
import { signUpWithEmail, signInWithGoogle, loginAsDemoStudent, getFriendlyErrorMessage } from '../services/authService';
import { User, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface SignupProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToHome?: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSuccess, onNavigateToLogin, onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUpWithEmail(name.trim(), email.trim(), password);
      onSuccess();
    } catch (err: any) {
      console.error('Signup error:', err);
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
      console.error('Demo error:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
          Create your student account to start learning & playing
        </p>
      </div>

      {/* Main Signup Clay Card */}
      <div className="clay-card w-full max-w-md p-5 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Student Registration</h2>
          <p className="text-xs text-slate-500 mt-1">
            Build your personalized learning path and earn XP
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner (Perfect for Vercel) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/40 border border-amber-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Instant 1-Click Demo Access
            </span>
            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              Works on Vercel
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Skip registration and immediately launch as student <strong>Komal</strong> with active levels and games ready.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full clay-btn clay-btn-peach py-2.5 px-4 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>Launch as Komal (Instant Access)</span>
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
              Enter as Demo Student Instead →
            </button>
          </div>
        )}

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
            OR REGISTER NEW STUDENT
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Komal"
                className="w-full clay-input pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
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
                placeholder="Min 6 characters"
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
              <span>Creating your profile in Firestore...</span>
            ) : (
              <>
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
            OR TEST PRELOADED STUDENT
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full clay-btn bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Quick Demo Student ("Komal")</span>
        </button>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-bold text-blue-600 hover:text-blue-700 underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
