import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Gamepad2,
  BarChart3,
  Compass,
  Play,
  Award,
  Zap,
  Target,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ChevronRight
} from 'lucide-react';
import { INITIAL_LESSONS } from '../services/firestoreService';

interface HomeProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onQuickDemo: () => void;
  onOpenFutureScope: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onQuickDemo,
  onOpenFutureScope,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Interactive Learning',
      description: 'Bite-sized modules covering ML, DBMS, Data Structures, and Web Tech with practical code examples.',
      icon: BookOpen,
      color: 'bg-blue-500 text-white',
      badge: 'Curriculum'
    },
    {
      step: '02',
      title: 'Play Banana Catch',
      description: 'Reinforce math and logic skills with real-time horizontal reflex games and falling answer bananas.',
      icon: Gamepad2,
      color: 'bg-amber-500 text-white',
      badge: 'Gamification'
    },
    {
      step: '03',
      title: 'Earn XP & Level Up',
      description: 'Every completed quiz and game rewards XP and elevates your student level on Firebase Firestore.',
      icon: Zap,
      color: 'bg-purple-500 text-white',
      badge: 'Rewards'
    },
    {
      step: '04',
      title: 'Adaptive Learning',
      description: 'Smart rule-based recommendations automatically tailor challenges to strengthen topic weaknesses.',
      icon: Target,
      color: 'bg-emerald-500 text-white',
      badge: 'Intelligence'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col justify-between">
      {/* Top Landing Navigation */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-800 tracking-tight">EduPlay</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                  UnityLearn
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Gamified Learning Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenFutureScope}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl border border-purple-200 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span>Future Scope</span>
            </button>

            <button
              onClick={onQuickDemo}
              className="clay-btn bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-3 sm:px-4 py-2 text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo (Komal)</span>
            </button>

            <button
              onClick={onNavigateToLogin}
              className="clay-btn bg-white hover:bg-slate-50 text-slate-700 px-3 sm:px-4 py-2 text-xs font-bold"
            >
              Sign In
            </button>

            <button
              onClick={onNavigateToSignup}
              className="clay-btn clay-btn-primary px-3 sm:px-4 py-2 text-xs font-bold text-white flex items-center gap-1"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gamified EdTech Prototype • Academic MVP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-tight">
            Learn with Passion.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Play with Purpose.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            EduPlay – UnityLearn unites interactive academic curriculum with educational mini-games, real-time Firebase tracking, and adaptive performance recommendations.
          </p>

          {/* Core Formula Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white/90 p-3 sm:p-4 rounded-2xl clay-card-flat border border-slate-200/80 text-xs sm:text-sm font-extrabold text-slate-700">
            <span className="text-blue-600">Learning</span>
            <span className="text-slate-300">→</span>
            <span className="text-amber-600">Game</span>
            <span className="text-slate-300">→</span>
            <span className="text-purple-600">Score</span>
            <span className="text-slate-300">→</span>
            <span className="text-emerald-600">Progress</span>
            <span className="text-slate-300">→</span>
            <span className="text-orange-600">Adaptive Path</span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onNavigateToSignup}
              className="w-full sm:w-auto clay-btn clay-btn-primary px-6 py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onQuickDemo}
              className="w-full sm:w-auto clay-btn bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Launch Demo Student ("Komal")</span>
            </button>
          </div>
        </div>

        {/* Feature Preview Clay Board */}
        <div className="mt-12 sm:mt-16 clay-card p-6 sm:p-10 border border-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  The EduPlay Learning Loop
                </h3>
                <p className="text-xs text-slate-500">How students acquire and master academic concepts</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Firebase Synced</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="clay-card-flat p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.step}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-800 mb-1.5">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold text-blue-600">
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Showcase Section */}
      <section className="bg-white/60 border-t border-b border-slate-200/80 px-4 sm:px-8 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Computer Science Catalog
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 mt-1">
                Featured Learning Modules
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Concise theoretical lessons, real-world examples, and instant concept mini-quizzes
              </p>
            </div>

            <button
              onClick={onNavigateToSignup}
              className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold text-white self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore All Lessons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {INITIAL_LESSONS.map((lesson) => (
              <div key={lesson.id} className="clay-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {lesson.subject}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {lesson.duration}m
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 mb-1.5 leading-snug">
                    {lesson.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-4">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-600">+{lesson.xpReward} XP</span>
                  <button
                    onClick={onNavigateToSignup}
                    className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Start</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Educational Game Section */}
      <section className="px-4 sm:px-8 py-12 sm:py-20 max-w-7xl mx-auto w-full">
        <div className="clay-card-cream p-6 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border border-amber-200">
          <div className="max-w-xl space-y-4 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Featured Arcade Challenge
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800">
              Banana Catch: Math Blitz
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Control the monkey horizontally to catch bananas containing the correct arithmetic answers. Watch out for distractors, manage your 3 lives, and boost your quiz accuracy index!
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="clay-card-flat p-3 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Correct</span>
                <div className="text-base font-black text-emerald-600 mt-0.5">+10 XP</div>
              </div>
              <div className="clay-card-flat p-3 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Wrong</span>
                <div className="text-base font-black text-rose-500 mt-0.5">-5 Score</div>
              </div>
              <div className="clay-card-flat p-3 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Missed</span>
                <div className="text-base font-black text-amber-600 mt-0.5">-1 Life</div>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onQuickDemo}
                className="clay-btn clay-btn-peach px-6 py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2 mx-auto lg:mx-0 shadow-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Banana Catch Demo</span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm clay-card p-6 bg-gradient-to-b from-sky-50 to-amber-50/70 border-2 border-amber-200/80 text-center space-y-4">
            <div className="text-5xl animate-bounce">🍌</div>
            <div className="bg-white/90 p-4 rounded-2xl shadow-sm border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400">Sample Question</span>
              <div className="text-2xl font-black text-slate-800 mt-1">8 × 7 = ?</div>
              <div className="flex justify-center gap-2 mt-3">
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-500">42</span>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">56 ✓</span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-500">64</span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-500">48</span>
              </div>
            </div>
            <div className="text-4xl">🐒🧺</div>
            <p className="text-[11px] text-slate-500 font-semibold">Catch 56 to earn +10 score & XP</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <strong className="text-slate-800 font-bold">EduPlay – UnityLearn</strong>
            <span>• College Project Prototype</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenFutureScope} className="hover:text-purple-600 font-semibold">
              Future Scope
            </button>
            <button onClick={onNavigateToLogin} className="hover:text-blue-600 font-semibold">
              Student Login
            </button>
            <button onClick={onQuickDemo} className="hover:text-amber-600 font-semibold">
              Instant Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
