export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  completedLessons: number;
  gamesPlayed: number;
  quizAccuracy: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: 'Machine Learning' | 'DBMS' | 'Data Structures' | 'Web Technology' | string;
  description: string;
  difficulty: 'Beginner' | 'Medium' | 'Advanced';
  duration: number; // in minutes
  content: string;
  example: string;
  quizQuestion: string;
  quizOptions: string[];
  quizAnswer: number; // 0-indexed correct option
  xpReward: number;
}

export interface ProgressRecord {
  id?: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt: string;
}

export interface Game {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  description?: string;
}

export interface GameResult {
  id?: string;
  userId: string;
  gameId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number; // percentage e.g. 80
  xpEarned: number;
  playedAt: string;
}

export interface Recommendation {
  id: string;
  subject: string;
  title: string;
  description: string;
  actionText: string;
  actionType: 'game' | 'lesson';
  targetId: string;
  reason: string;
  levelBadge: 'Review Needed' | 'Next Challenge' | 'Skill Boost';
}
