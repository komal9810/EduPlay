import React from 'react';
import { Recommendation } from '../types';
import { Sparkles, ArrowRight, Target, Flame } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction: (rec: Recommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAction,
}) => {
  const badgeColors = {
    'Review Needed': 'bg-amber-100 text-amber-800 border-amber-200',
    'Next Challenge': 'bg-blue-100 text-blue-800 border-blue-200',
    'Skill Boost': 'bg-purple-100 text-purple-800 border-purple-200',
  }[recommendation.levelBadge];

  return (
    <div className="clay-card-peach p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-950/70">
              Personalized Recommendation
            </span>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeColors}`}>
            {recommendation.levelBadge}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
          {recommendation.title}
        </h3>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {recommendation.description}
        </p>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/70 px-3 py-1.5 rounded-xl border border-orange-100 mb-5">
          <Target className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span>{recommendation.reason}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-slate-400">
          Subject: <strong className="text-slate-700">{recommendation.subject}</strong>
        </span>
        <button
          onClick={() => onAction(recommendation)}
          className="clay-btn clay-btn-peach px-4 py-2 text-xs sm:text-sm text-white flex items-center gap-2"
        >
          <span>{recommendation.actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
