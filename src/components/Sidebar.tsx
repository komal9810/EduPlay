import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  BarChart3,
  User,
  LogOut,
  Flame,
  Compass
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'dashboard' | 'learn' | 'games' | 'progress' | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenFutureScope: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  onOpenFutureScope,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop & Tablet Responsive Sidebar */}
      <aside className="hidden md:flex flex-col md:w-20 lg:w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200/80 p-3 lg:p-5 shrink-0 justify-between min-h-screen transition-all duration-300">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-1 lg:px-2 py-3 mb-6 justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-200 shrink-0">
              <span className="text-xl">🎓</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-1">
                EduPlay
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                  UnityLearn
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Gamified Learning Platform</p>
            </div>
          </div>

          {/* Student Quick Pill (Tablet: avatar only; Desktop: full card) */}
          {user && (
            <div className="clay-card-flat p-2.5 lg:p-3 mb-6 flex items-center justify-center lg:justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Level {user.level} Student
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{user.streak}d</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center justify-center lg:justify-start gap-3.5 px-3 lg:px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isActive
                      ? 'clay-btn-primary text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-5 h-5 lg:w-4 lg:h-4 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2 text-slate-400'}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={onOpenFutureScope}
            title="Future Scope Roadmap"
            className="w-full flex items-center justify-center lg:justify-between px-3 lg:px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200/60"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="hidden lg:inline">Future Scope</span>
            </div>
            <span className="hidden lg:inline text-[10px] bg-purple-200/70 text-purple-800 px-1.5 py-0.5 rounded font-bold">
              Roadmap
            </span>
          </button>

          <button
            onClick={onLogout}
            title="Logout"
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 stroke-2 shrink-0" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Floating Bottom Clay Navigation Dock */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-700 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
