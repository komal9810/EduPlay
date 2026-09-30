import React, { useState } from 'react';
import { Lesson, UserProfile } from '../types';
import { recordLessonCompletion } from '../services/firestoreService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Clock,
  Award,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Code2,
  Check,
  X
} from 'lucide-react';

interface LessonProps {
  lesson: Lesson;
  user: UserProfile;
  isAlreadyCompleted?: boolean;
  onBack: () => void;
  onLessonFinished: () => void;
}

export const LessonView: React.FC<LessonProps> = ({
  lesson,
  user,
  isAlreadyCompleted = false,
  onBack,
  onLessonFinished,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(isAlreadyCompleted);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isCorrectAnswer = selectedOption === lesson.quizAnswer;

  const handleOptionSelect = (index: number) => {
    if (quizSubmitted) return;
    setSelectedOption(index);
  };

  const handleCompleteLesson = async () => {
    if (selectedOption === null) {
      setErrorNotice('Please select an answer for the mini quiz before completing.');
      return;
    }

    setQuizSubmitted(true);
    setErrorNotice(null);
    setIsSubmitting(true);

    try {
      const quizScore = isCorrectAnswer ? 100 : 50;
      await recordLessonCompletion(
        user.uid,
        lesson.id,
        quizScore,
        lesson.xpReward,
        user
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompletedSuccess(true);
      onLessonFinished();
    } catch (err: any) {
      console.error('Lesson completion update error:', err);
      setErrorNotice('Failed to record lesson progress to Firebase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <button
        onClick={onBack}
        className="clay-btn bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Curriculum</span>
      </button>

      {/* Main Lesson Clay Card */}
      <div className="clay-card p-6 sm:p-10 space-y-8">
        {/* Header Metadata */}
        <div className="border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              {lesson.subject}
            </span>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {lesson.duration} Minutes
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                <Award className="w-3.5 h-3.5" />
                +{lesson.xpReward} XP Reward
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {lesson.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            {lesson.description}
          </p>
        </div>

        {/* Section 1: Learning Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Learning Content</span>
          </div>
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 whitespace-pre-line font-normal">
            {lesson.content}
          </div>
        </div>

        {/* Section 2: Real-World Example */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>Practical Example & Application</span>
          </div>
          <div className="clay-card-green p-5 text-sm text-slate-700 leading-relaxed border border-emerald-100">
            {lesson.example}
          </div>
        </div>

        {/* Section 3: Mini Quiz */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Mini Quiz (Concept Check)</span>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
              Required to Complete
            </span>
          </div>

          <div className="clay-card-lavender p-5 sm:p-6 space-y-4 border border-purple-100">
            <p className="text-sm sm:text-base font-bold text-slate-800">
              {lesson.quizQuestion}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.quizOptions.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';

                if (quizSubmitted) {
                  if (idx === lesson.quizAnswer) {
                    optionStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-100 text-rose-900 border-rose-300 line-through';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-blue-100 text-blue-900 border-blue-400 font-bold shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={quizSubmitted}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {quizSubmitted && idx === lesson.quizAnswer && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {quizSubmitted && isSelected && idx !== lesson.quizAnswer && (
                      <X className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                isCorrectAnswer
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <Sparkles className="w-4 h-4" />
                <span>
                  {isCorrectAnswer
                    ? 'Correct! You understood the core concept thoroughly.'
                    : `Nice try! The correct concept was "${lesson.quizOptions[lesson.quizAnswer]}".`}
                </span>
              </div>
            )}
          </div>
        </div>

        {errorNotice && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {errorNotice}
          </div>
        )}

        {/* Completion Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Completing this lesson registers your progress and awards <strong>+{lesson.xpReward} XP</strong> to your Firestore student profile.
          </div>

          {completedSuccess ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Lesson Completed!
              </span>
              <button
                onClick={onBack}
                className="clay-btn clay-btn-primary px-5 py-2.5 text-xs font-bold text-white"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <button
              onClick={handleCompleteLesson}
              disabled={isSubmitting}
              className="w-full sm:w-auto clay-btn clay-btn-primary px-6 py-3 text-sm text-white flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Updating Firestore...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Lesson</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
