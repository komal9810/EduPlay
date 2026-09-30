import React from 'react';
import { Lesson } from '../types';
import { ProgressBar } from './ProgressBar';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  progressPercent: number;
  isCompleted?: boolean;
  onOpen: (lesson: Lesson) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  progressPercent,
  isCompleted = false,
  onOpen,
}) => {
  const subjectThemes = {
    'Machine Learning': {
      cardClass: 'clay-card-blue',
      badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
      btnClass: 'clay-btn-primary',
      iconColor: 'text-blue-600',
    },
    'DBMS': {
      cardClass: 'clay-card-green',
      badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      btnClass: 'clay-btn-green',
      iconColor: 'text-emerald-600',
    },
    'Data Structures': {
      cardClass: 'clay-card-lavender',
      badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
      btnClass: 'clay-btn-primary bg-purple-600',
      iconColor: 'text-purple-600',
    },
    'Web Technology': {
      cardClass: 'clay-card-peach',
      badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
      btnClass: 'clay-btn-peach',
      iconColor: 'text-orange-600',
    },
  }[lesson.subject] || {
    cardClass: 'clay-card',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    btnClass: 'clay-btn-primary',
    iconColor: 'text-blue-600',
  };

  return (
    <div className={`${subjectThemes.cardClass} p-5 sm:p-6 flex flex-col justify-between transition-all duration-200`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${subjectThemes.badgeClass}`}>
            {lesson.subject}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-white/70 px-2 py-0.5 rounded-lg border border-slate-200/60">
            {lesson.difficulty}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5 leading-snug">
          {lesson.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {lesson.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-5">
          <div className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{lesson.duration} mins</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-amber-600">
            <Award className="w-3.5 h-3.5" />
            <span>+{lesson.xpReward} XP</span>
          </div>
          {isCompleted && (
            <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
              ✓ Completed
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4">
          <ProgressBar
            progress={progressPercent}
            label="Module Progress"
            colorScheme={
              lesson.subject === 'DBMS'
                ? 'green'
                : lesson.subject === 'Web Technology'
                ? 'peach'
                : lesson.subject === 'Data Structures'
                ? 'lavender'
                : 'blue'
            }
            height="sm"
          />
        </div>

        <button
          onClick={() => onOpen(lesson)}
          className={`w-full clay-btn ${subjectThemes.btnClass} py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2`}
        >
          <span>{isCompleted ? 'Review Lesson' : 'Continue Learning'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
