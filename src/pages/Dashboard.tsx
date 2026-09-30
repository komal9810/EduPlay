import React from 'react';
import { UserProfile, Lesson, Game, Recommendation } from '../types';
import { StatCard } from '../components/StatCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { ProgressBar } from '../components/ProgressBar';
import { Zap, Award, BookCheck, Crosshair, ArrowRight, Play, Flame, Sparkles } from 'lucide-react';
import { getRecommendations } from '../utils/recommendations';

interface DashboardProps {
  user: UserProfile;
  lessons: Lesson[];
  onNavigateToTab: (tab: 'learn' | 'games' | 'progress' | 'profile') => void;
  onOpenLesson: (lesson: Lesson) => void;
  onPlayGame: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  lessons,
  onNavigateToTab,
  onOpenLesson,
  onPlayGame,
}) => {
  // Determine dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recommendations = getRecommendations(user, user.quizAccuracy);
  const primaryRec = recommendations[0];

  // Calculate overall level XP progress (each level is 200 XP)
  const currentLevelBaseXP = (user.level - 1) * 200;
  const nextLevelXP = user.level * 200;
  const xpIntoCurrentLevel = Math.max(0, user.xp - currentLevelBaseXP);
  const xpLevelPercent = Math.min(100, Math.round((xpIntoCurrentLevel / 200) * 100));

  const handleRecommendationAction = (rec: Recommendation) => {
    if (rec.actionType === 'game') {
      onPlayGame();
    } else {
      const targetLesson = lessons.find(l => l.id === rec.targetId) || lessons[0];
      if (targetLesson) {
        onOpenLesson(targetLesson);
      } else {
        onNavigateToTab('learn');
      }
    }
  };

  // Next recommended lesson to display on dashboard
  const nextLesson = lessons[user.completedLessons % lessons.length] || lessons[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="clay-card-blue p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduPlay Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {getGreeting()}, <span className="text-blue-600">{user.name}!</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
            “Ready to continue your learning journey?”
          </p>

          <div className="mt-5 max-w-sm">
            <ProgressBar
              progress={xpLevelPercent}
              label={`Level ${user.level} Progress`}
              sublabel={`${xpIntoCurrentLevel} / 200 XP to Level ${user.level + 1}`}
              colorScheme="blue"
              height="sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateToTab('learn')}
            className="w-full sm:w-auto clay-btn clay-btn-primary px-5 py-3 text-sm text-white flex items-center justify-center gap-2"
          >
            <span>Continue Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onPlayGame}
            className="w-full sm:w-auto clay-btn clay-btn-peach px-5 py-3 text-sm text-white flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Quick Math Game</span>
          </button>
        </div>
      </div>

      {/* 4 Firebase-Powered Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Total XP"
          value={`${user.xp.toLocaleString()} XP`}
          icon={Zap}
          colorScheme="peach"
          trend="Earned from games & lessons"
        />
        <StatCard
          label="Student Level"
          value={`Level ${user.level}`}
          icon={Award}
          colorScheme="blue"
          trend="Next perk unlocked at Lvl 5"
        />
        <StatCard
          label="Lessons Completed"
          value={user.completedLessons}
          icon={BookCheck}
          colorScheme="green"
          trend="Verified on Firestore"
        />
        <StatCard
          label="Game Accuracy"
          value={`${Math.round(user.quizAccuracy)}%`}
          icon={Crosshair}
          colorScheme="lavender"
          trend={user.quizAccuracy >= 60 ? 'Passing threshold met' : 'Practice recommended'}
        />
      </div>

      {/* Personalized Adaptive Recommendation & Quick Jump */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommendation Engine Output */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Adaptive Recommendation
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Based on your accuracy score
            </span>
          </div>
          {primaryRec && (
            <RecommendationCard
              recommendation={primaryRec}
              onAction={handleRecommendationAction}
            />
          )}
        </div>

        {/* Next Quick Activity */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Next Up in Curriculum
            </h2>
            <button
              onClick={() => onNavigateToTab('learn')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All (4)
            </button>
          </div>

          {nextLesson && (
            <div className="clay-card p-5 sm:p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {nextLesson.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {nextLesson.duration} mins
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                  {nextLesson.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-3">
                  {nextLesson.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600">
                  +{nextLesson.xpReward} XP Reward
                </span>
                <button
                  onClick={() => onOpenLesson(nextLesson)}
                  className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <span>Open Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
