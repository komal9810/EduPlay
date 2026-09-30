import React from 'react';
import { UserProfile } from '../types';
import {
  User,
  Mail,
  Award,
  Zap,
  BookCheck,
  Gamepad2,
  Crosshair,
  LogOut,
  Flame,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Student Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          Student Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your enrolled student credentials and gamified milestone records
        </p>
      </div>

      {/* Main Profile Clay Card */}
      <div className="clay-card p-6 sm:p-10 space-y-8">
        {/* User Identity Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                  {user.name}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Active Student
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-amber-50 text-amber-800 px-3.5 py-2 rounded-2xl border border-amber-200 text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>{user.streak} Day Streak</span>
            </div>
          </div>
        </div>

        {/* 6 Key Firebase Metrics Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Enrolled Academic Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="clay-card-flat p-4 bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Award className="w-4 h-4 text-blue-500" />
                <span>Student Level</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-800">
                Level {user.level}
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Total XP Earned</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-800">
                {user.xp.toLocaleString()} XP
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <BookCheck className="w-4 h-4 text-emerald-500" />
                <span>Lessons Completed</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-800">
                {user.completedLessons}
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Gamepad2 className="w-4 h-4 text-purple-500" />
                <span>Games Played</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-800">
                {user.gamesPlayed}
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Crosshair className="w-4 h-4 text-rose-500" />
                <span>Quiz Accuracy</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-800">
                {Math.round(user.quizAccuracy)}%
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Platform Tier</span>
              </div>
              <div className="text-sm font-bold text-slate-700 mt-1">
                UnityLearn College Prototype
              </div>
            </div>
          </div>
        </div>

        {/* Database backend note */}
        <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Firestore Database Identity:</strong> All student progression metrics, game logs, and lesson milestones are securely stored under collection <code className="bg-blue-100/70 px-1 py-0.5 rounded text-[11px] font-mono">users/{user.uid}</code>.
          </div>
        </div>

        {/* Sign Out Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            EduPlay – UnityLearn MVP
          </span>
          <button
            onClick={onLogout}
            className="clay-btn bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-5 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
