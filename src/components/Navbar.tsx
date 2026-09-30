import React from 'react';
import { UserProfile } from '../types';
import { Flame, Award, Zap, Compass, LogOut } from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  onOpenFutureScope: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenFutureScope,
  onLogout,
}) => {
  return (
    <header className="w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Brand indicator */}
      <div className="flex md:hidden items-center gap-1.5 shrink-0">
        <span className="text-lg">🎓</span>
        <span className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight">EduPlay</span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span>Firebase Cloud Connected</span>
      </div>

      {/* Gamification Status Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
        {user && (
          <>
            {/* Level Pill */}
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold shadow-sm shrink-0">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
              <span>Lvl {user.level}</span>
            </div>

            {/* XP Pill */}
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold shadow-sm shrink-0">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-600" />
              <span>{user.xp.toLocaleString()} XP</span>
            </div>

            {/* Streak Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/80 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-sm shrink-0">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
              <span>{user.streak}d Streak</span>
            </div>
          </>
        )}

        {/* Future Scope roadmap trigger */}
        <button
          onClick={onOpenFutureScope}
          className="clay-btn bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 shrink-0"
          title="College Project Future Scope"
        >
          <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
          <span className="hidden sm:inline">Future Scope</span>
        </button>

        {/* Mobile logout */}
        <button
          onClick={onLogout}
          className="md:hidden p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
