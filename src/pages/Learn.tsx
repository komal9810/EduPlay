import React from 'react';
import { Lesson, ProgressRecord } from '../types';
import { LessonCard } from '../components/LessonCard';
import { BookOpen, Award, CheckCircle2 } from 'lucide-react';

interface LearnProps {
  lessons: Lesson[];
  userProgress: ProgressRecord[];
  onOpenLesson: (lesson: Lesson) => void;
}

export const Learn: React.FC<LearnProps> = ({
  lessons,
  userProgress,
  onOpenLesson,
}) => {
  // Preset default progresses mentioned in the specification (60%, 40%, 30%, 75%)
  const defaultProgressMap: Record<string, number> = {
    'lesson-ml': 60,
    'lesson-dbms': 40,
    'lesson-ds': 30,
    'lesson-web': 75,
  };

  const getLessonProgress = (lessonId: string): { percent: number; isCompleted: boolean } => {
    const record = userProgress.find(p => p.lessonId === lessonId);
    if (record && record.completed) {
      return { percent: 100, isCompleted: true };
    }
    const defaultVal = defaultProgressMap[lessonId] || 25;
    return { percent: defaultVal, isCompleted: false };
  };

  const completedCount = lessons.filter(l => getLessonProgress(l.id).isCompleted).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Learn Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Interactive Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Learning Modules
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Master core computer science subjects through concise lessons and mini-quizzes
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl clay-card-flat border border-slate-200/80">
          <Award className="w-5 h-5 text-amber-500" />
          <div className="text-xs">
            <span className="font-bold text-slate-800">{completedCount} of {lessons.length}</span>
            <span className="text-slate-500 block">Completed</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => {
          const { percent, isCompleted } = getLessonProgress(lesson.id);
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progressPercent={percent}
              isCompleted={isCompleted}
              onOpen={onOpenLesson}
            />
          );
        })}
      </div>
    </div>
  );
};
