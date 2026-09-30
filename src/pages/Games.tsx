import React from 'react';
import { Game } from '../types';
import { GameCard } from '../components/GameCard';
import { Gamepad2, Sparkles, Trophy } from 'lucide-react';

interface GamesProps {
  onPlayGame: (gameId: string) => void;
}

export const Games: React.FC<GamesProps> = ({ onPlayGame }) => {
  const games: Game[] = [
    {
      id: 'banana-catch',
      title: 'Banana Catch',
      subject: 'Mathematics',
      difficulty: 'Easy',
      xpReward: 50,
      description: 'Help the monkey catch falling bananas displaying the correct answer to speed arithmetic problems! Watch out for distractors and maintain your lives.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Arcade Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Educational Games
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reinforce key academic skills with real-time gamified challenges
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3.5 py-2 rounded-2xl border border-amber-200 text-xs font-bold">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>Earn XP & Boost Accuracy</span>
        </div>
      </div>

      {/* Game Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onPlay={() => onPlayGame(game.id)}
          />
        ))}

        {/* Placeholder Preview for Future Games */}
        <div className="clay-card-flat p-6 rounded-3xl border border-dashed border-slate-300 flex flex-col justify-center items-center text-center text-slate-400 min-h-[260px]">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-3">
            🧪
          </div>
          <h4 className="text-sm font-bold text-slate-600">Science Lab 3D (Coming Soon)</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Chemical reaction matching and elemental balancing simulation (Part of Future Scope).
          </p>
        </div>
      </div>
    </div>
  );
};
