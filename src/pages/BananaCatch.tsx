import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProfile, GameResult } from '../types';
import { getRandomQuestions, GameQuestion } from '../utils/gameQuestions';
import { saveGameResult } from '../services/firestoreService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Heart,
  Timer,
  Trophy,
  Zap,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BananaCatchProps {
  user: UserProfile;
  onBack: () => void;
  onGameSaved: () => void;
}

interface FallingBanana {
  id: number;
  value: number;
  isCorrect: boolean;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  speed: number;
  caught: boolean;
}

export const BananaCatch: React.FC<BananaCatchProps> = ({
  user,
  onBack,
  onGameSaved,
}) => {
  const [questions, setQuestions] = useState<GameQuestion[]>(() => getRandomQuestions(5));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [monkeyX, setMonkeyX] = useState(50); // percentage 0 - 100
  const [bananas, setBananas] = useState<FallingBanana[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string; id: number } | null>(null);
  const [gameTimeLeft, setGameTimeLeft] = useState(20); // 20s per question

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const monkeyXRef = useRef(50);
  const activeQuestionRef = useRef<GameQuestion | null>(null);

  monkeyXRef.current = monkeyX;
  const currentQuestion = questions[currentQIndex];
  activeQuestionRef.current = currentQuestion;

  // Initialize bananas for the current question
  const spawnBananasForQuestion = useCallback((q: GameQuestion) => {
    // Generate 4 distinct columns
    const columns = [15, 38, 62, 85];
    // Shuffle columns
    const shuffledCols = [...columns].sort(() => 0.5 - Math.random());

    const newBananas: FallingBanana[] = q.options.map((opt, idx) => ({
      id: Date.now() + idx,
      value: opt,
      isCorrect: opt === q.correctAnswer,
      x: shuffledCols[idx],
      y: -5 - (idx * 3), // slight staggering
      speed: 0.28 + Math.random() * 0.08, // falling speed percentage per frame
      caught: false,
    }));

    setBananas(newBananas);
    setGameTimeLeft(20);
  }, []);

  // Start current question
  useEffect(() => {
    if (!isGameOver && currentQuestion) {
      spawnBananasForQuestion(currentQuestion);
    }
  }, [currentQIndex, isGameOver, currentQuestion, spawnBananasForQuestion]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setMonkeyX(prev => Math.max(8, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setMonkeyX(prev => Math.min(92, prev + 7));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  // Question Timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) {
          // Time expired for this question: lose life
          handleMissedCorrect();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, currentQIndex]);

  // Missed correct banana handler
  const handleMissedCorrect = useCallback(() => {
    setFeedbackText({ text: 'Missed! -1 Life', color: 'text-rose-600', id: Date.now() });
    setLives(prevLives => {
      const nextLives = prevLives - 1;
      if (nextLives <= 0) {
        finishGame(score, correctAnswersCount);
      } else {
        advanceQuestion();
      }
      return Math.max(0, nextLives);
    });
  }, [score, correctAnswersCount]);

  const advanceQuestion = useCallback(() => {
    setCurrentQIndex(prev => {
      const next = prev + 1;
      if (next >= questions.length) {
        finishGame(score, correctAnswersCount);
        return prev;
      }
      return next;
    });
  }, [questions.length, score, correctAnswersCount]);

  const finishGame = useCallback((finalScore: number, finalCorrect: number) => {
    setIsGameOver(true);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const safeScore = Math.max(0, finalScore);
    const accuracy = Math.round((finalCorrect / 5) * 100);
    const xpEarned = Math.max(10, finalCorrect * 10);

    // Save result to Firebase
    setIsSaving(true);
    saveGameResult(
      {
        userId: user.uid,
        gameId: 'banana-catch',
        score: safeScore,
        correctAnswers: finalCorrect,
        totalQuestions: 5,
        accuracy,
        xpEarned,
        playedAt: new Date().toISOString()
      },
      user
    )
      .then(() => {
        onGameSaved();
      })
      .catch(err => {
        console.error('Failed to save game result:', err);
      })
      .finally(() => {
        setIsSaving(false);
      });

    // Celebratory confetti if passed
    if (accuracy >= 60) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  }, [user, onGameSaved]);

  // Main game animation loop
  useEffect(() => {
    if (isGameOver) return;

    let localBananas = [...bananas];

    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 16.66; // normalize to ~60fps
      lastTimeRef.current = time;

      let correctMissed = false;
      let questionCompleted = false;

      setBananas(prevBananas => {
        const updated = prevBananas.map(b => {
          if (b.caught) return b;

          const newY = b.y + b.speed * delta;
          const currentMonkey = monkeyXRef.current;

          // Collision detection with monkey basket
          // Monkey is located around y = 84% - 92%, width around 14%
          const isAtBasketY = newY >= 78 && newY <= 90;
          const isAtBasketX = Math.abs(b.x - currentMonkey) < 9;

          if (isAtBasketY && isAtBasketX && !b.caught) {
            b.caught = true;

            if (b.isCorrect) {
              setScore(s => s + 10);
              setCorrectAnswersCount(c => c + 1);
              setFeedbackText({ text: 'CORRECT! +10 XP', color: 'text-emerald-600', id: Date.now() });
              questionCompleted = true;
            } else {
              setScore(s => Math.max(0, s - 5));
              setFeedbackText({ text: 'WRONG! -5 Score', color: 'text-rose-500', id: Date.now() });
            }
          }

          // Off screen check
          if (newY > 96 && !b.caught) {
            b.caught = true;
            if (b.isCorrect) {
              correctMissed = true;
            }
          }

          return { ...b, y: newY };
        });

        return updated;
      });

      if (correctMissed) {
        handleMissedCorrect();
      } else if (questionCompleted) {
        advanceQuestion();
      } else {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [bananas, isGameOver, advanceQuestion, handleMissedCorrect]);

  const handleRestart = () => {
    const newQs = getRandomQuestions(5);
    setQuestions(newQs);
    setCurrentQIndex(0);
    setScore(0);
    setLives(3);
    setCorrectAnswersCount(0);
    setMonkeyX(50);
    setIsGameOver(false);
    lastTimeRef.current = performance.now();
  };

  // Touch / Mouse dragging across the playing area
  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relX = ((clientX - rect.left) / rect.width) * 100;
    setMonkeyX(Math.min(92, Math.max(8, relX)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Top Bar Navigation & Info */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="clay-btn bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-bold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Game</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-xl">
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span>Lives</span>
          </div>

          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-xl">
            <Timer className="w-4 h-4 text-blue-600" />
            <span>{gameTimeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>{score} Score</span>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="clay-card-cream p-4 sm:p-6 space-y-4">
          {/* Question Banner */}
          <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {currentQuestion?.question}
              </h2>
            </div>
            <div className="text-xs text-slate-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              Catch the banana with the <strong>correct answer</strong>!
            </div>
          </div>

          {/* Interactive Game Canvas / Field */}
          <div
            ref={containerRef}
            onPointerMove={handleContainerPointerMove}
            className="relative w-full h-[380px] sm:h-[420px] bg-gradient-to-b from-sky-100 via-amber-50/50 to-emerald-100 rounded-3xl overflow-hidden border-2 border-amber-200/70 clay-inset cursor-ew-resize select-none"
          >
            {/* Background elements */}
            <div className="absolute top-4 left-6 text-2xl opacity-40">☁️</div>
            <div className="absolute top-8 right-10 text-2xl opacity-40">☁️</div>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-emerald-200/60 border-t border-emerald-300/60 flex items-center justify-around text-lg opacity-60">
              <span>🌿</span>
              <span>🌴</span>
              <span>🌱</span>
              <span>🌿</span>
              <span>🌴</span>
            </div>

            {/* Falling Bananas */}
            {bananas.map(banana => {
              if (banana.caught) return null;
              return (
                <div
                  key={banana.id}
                  className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform"
                  style={{
                    left: `${banana.x}%`,
                    top: `${banana.y}%`,
                  }}
                >
                  <div className="text-3xl animate-bounce drop-shadow-md">
                    🍌
                  </div>
                  <div className="bg-amber-400 text-amber-950 font-black text-xs px-2 py-0.5 rounded-lg shadow-sm border border-amber-500 -mt-1">
                    {banana.value}
                  </div>
                </div>
              );
            })}

            {/* Monkey with Catch Basket */}
            <div
              className="absolute bottom-4 -translate-x-1/2 flex flex-col items-center transition-all duration-75 pointer-events-none"
              style={{ left: `${monkeyX}%` }}
            >
              {/* Basket */}
              <div className="w-16 h-6 bg-amber-700 text-white rounded-t-xl border-2 border-amber-900 shadow-md flex items-center justify-center text-[10px] font-black uppercase tracking-wider mb-0.5">
                🧺 Basket
              </div>
              {/* Monkey */}
              <div className="text-4xl filter drop-shadow">
                🐒
              </div>
            </div>

            {/* Floating Live Feedback Pop-up */}
            {feedbackText && (
              <div
                key={feedbackText.id}
                className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg font-black bg-white/95 px-4 py-2 rounded-2xl shadow-xl border border-slate-200 ${feedbackText.color} animate-out fade-out zoom-out duration-700`}
              >
                {feedbackText.text}
              </div>
            )}
          </div>

          {/* On-Screen Mobile / Click Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setMonkeyX(prev => Math.max(8, prev - 12))}
              className="clay-btn bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 text-xs sm:text-sm font-bold flex-1 flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Move Left (← / A)</span>
            </button>

            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Drag mouse or press Arrow Keys
            </span>

            <button
              onClick={() => setMonkeyX(prev => Math.min(92, prev + 12))}
              className="clay-btn bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 text-xs sm:text-sm font-bold flex-1 flex items-center justify-center gap-1.5"
            >
              <span>Move Right (→ / D)</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Game Complete Screen */
        <div className="clay-card p-6 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 text-4xl shadow-md mb-2">
            🏆
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Game Complete!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your results have been synchronized with your Firestore student profile
            </p>
          </div>

          {/* Stats breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            <div className="clay-card-flat p-4 bg-amber-50/70 border border-amber-100">
              <span className="text-[11px] font-bold uppercase text-amber-800">Score</span>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {score} / 50
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-blue-50/70 border border-blue-100">
              <span className="text-[11px] font-bold uppercase text-blue-800">Accuracy</span>
              <div className="text-2xl font-black text-blue-900 mt-1">
                {Math.round((correctAnswersCount / 5) * 100)}%
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-purple-50/70 border border-purple-100">
              <span className="text-[11px] font-bold uppercase text-purple-800">XP Earned</span>
              <div className="text-2xl font-black text-purple-900 mt-1">
                +{Math.max(10, correctAnswersCount * 10)} XP
              </div>
            </div>

            <div className="clay-card-flat p-4 bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] font-bold uppercase text-emerald-800">Correct</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {correctAnswersCount} / 5
              </div>
            </div>
          </div>

          {isSaving && (
            <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Saving results to Firebase Firestore...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto clay-btn clay-btn-primary px-6 py-3 text-xs sm:text-sm text-white flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <button
              onClick={onBack}
              className="w-full sm:w-auto clay-btn bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
