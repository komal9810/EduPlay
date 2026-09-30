import React from 'react';
import { UserProfile, GameResult, ProgressRecord } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { StatCard } from '../components/StatCard';
import {
  BarChart3,
  Zap,
  Gamepad2,
  BookCheck,
  Crosshair,
  TrendingUp,
  Calendar,
  Award,
  Sparkles
} from 'lucide-react';

interface ProgressProps {
  user: UserProfile;
  gameResults: GameResult[];
  userProgress: ProgressRecord[];
}

export const ProgressView: React.FC<ProgressProps> = ({
  user,
  gameResults,
  userProgress,
}) => {
  // Overall academic progress calculation (lessons completed out of 4 modules, plus accuracy weighting)
  const curriculumPercentage = Math.min(100, Math.round((user.completedLessons / 4) * 100));

  // Recent game performance scores for the chart
  const recentGames = gameResults.slice(0, 6).reverse();
  const maxScore = Math.max(50, ...recentGames.map(g => g.score));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Learning Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            My Progress & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your skill growth, accuracy trends, and recent educational game outcomes
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-2xl border border-emerald-200 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Real-Time Firestore Sync</span>
        </div>
      </div>

      {/* Overall Progress Banner */}
      <div className="clay-card-cream p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Curriculum Mastery
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">
              Overall Academic Progress
            </h2>
          </div>
          <div className="text-2xl font-black text-amber-900 bg-amber-100/70 px-4 py-1.5 rounded-2xl border border-amber-200">
            {curriculumPercentage}% Complete
          </div>
        </div>

        <ProgressBar
          progress={curriculumPercentage}
          label="Core Topics Completed"
          sublabel={`${user.completedLessons} of 4 lessons`}
          colorScheme="peach"
          height="lg"
        />
      </div>

      {/* 4 Core Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Total XP"
          value={`${user.xp.toLocaleString()} XP`}
          icon={Zap}
          colorScheme="peach"
        />
        <StatCard
          label="Games Played"
          value={user.gamesPlayed}
          icon={Gamepad2}
          colorScheme="blue"
        />
        <StatCard
          label="Lessons Completed"
          value={user.completedLessons}
          icon={BookCheck}
          colorScheme="green"
        />
        <StatCard
          label="Overall Accuracy"
          value={`${Math.round(user.quizAccuracy)}%`}
          icon={Crosshair}
          colorScheme="lavender"
        />
      </div>

      {/* Game Performance Chart */}
      <div className="clay-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Game Performance
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Recent Banana Catch scores and answering accuracy trend
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
            Target Passing Score: 30 / 50 (60%)
          </span>
        </div>

        {recentGames.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
            <Gamepad2 className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No game sessions logged yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Play a round of Banana Catch to generate your performance telemetry chart!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Custom SVG Bar Chart */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
              <div className="h-52 flex items-end justify-around gap-2 sm:gap-6 pt-6 pb-2 px-2">
                {recentGames.map((game, index) => {
                  const heightPercent = Math.max(15, Math.round((game.score / maxScore) * 100));
                  const isPassing = game.accuracy >= 60;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {game.score} pts
                      </span>
                      <div className="w-full max-w-[48px] bg-slate-200 rounded-t-xl overflow-hidden clay-inset relative">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                            isPassing
                              ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                              : 'bg-gradient-to-t from-amber-500 to-orange-400'
                          }`}
                          style={{ height: `${heightPercent * 1.8}px` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[60px]">
                        Session {index + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {game.accuracy}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Legend */}
            <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-500 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Proficient (≥ 60% Accuracy)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Practice Recommended (&lt; 60%)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Game History Log */}
      {gameResults.length > 0 && (
        <div className="clay-card p-6 sm:p-8 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Recent Activity History
          </h3>
          <div className="divide-y divide-slate-100">
            {gameResults.slice(0, 5).map((res, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
                    🍌
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      Banana Catch Math Session
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(res.playedAt).toLocaleDateString()} at {new Date(res.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 text-right">
                  <div>
                    <span className="text-xs font-black text-slate-800">
                      {res.score} pts
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {res.correctAnswers} / {res.totalQuestions} correct
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    res.accuracy >= 60
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {res.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
