import React from 'react';
import { Game } from '../types';
import { Play, Sparkles, Flame, Trophy } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <div className="clay-card-cream p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            {game.subject}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-white/70 px-2 py-0.5 rounded-lg border border-slate-200">
            {game.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🍌</div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              {game.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Catch the correct mathematical answer
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-4 leading-relaxed">
          {game.description || 'Guide the monkey horizontally across the screen to catch falling bananas with the correct math answers. Boost your mental arithmetic and earn XP!'}
        </p>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-amber-50/80 p-3 rounded-xl border border-amber-100 mb-5">
          <div className="flex items-center gap-1.5 text-amber-700">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>+{game.xpReward} XP Reward</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>5 Dynamic Questions</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onPlay(game)}
        className="w-full clay-btn clay-btn-peach py-3 px-4 text-sm text-white flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Play Now</span>
      </button>
    </div>
  );
};
