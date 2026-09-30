export interface GameQuestion {
  id: number;
  question: string;
  correctAnswer: number;
  options: number[];
  subject: string;
}

export const BANANA_QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    question: "8 × 7 = ?",
    correctAnswer: 56,
    options: [42, 56, 64, 48],
    subject: "Mathematics"
  },
  {
    id: 2,
    question: "12 + 15 = ?",
    correctAnswer: 27,
    options: [25, 27, 29, 30],
    subject: "Mathematics"
  },
  {
    id: 3,
    question: "9 × 6 = ?",
    correctAnswer: 54,
    options: [45, 54, 63, 56],
    subject: "Mathematics"
  },
  {
    id: 4,
    question: "100 ÷ 10 = ?",
    correctAnswer: 10,
    options: [5, 10, 15, 20],
    subject: "Mathematics"
  },
  {
    id: 5,
    question: "25 + 25 = ?",
    correctAnswer: 50,
    options: [40, 45, 50, 55],
    subject: "Mathematics"
  },
  {
    id: 6,
    question: "7 × 6 = ?",
    correctAnswer: 42,
    options: [36, 42, 48, 40],
    subject: "Mathematics"
  },
  {
    id: 7,
    question: "64 ÷ 8 = ?",
    correctAnswer: 8,
    options: [6, 7, 8, 9],
    subject: "Mathematics"
  },
  {
    id: 8,
    question: "45 − 18 = ?",
    correctAnswer: 27,
    options: [25, 27, 28, 30],
    subject: "Mathematics"
  }
];

export function getRandomQuestions(count: number = 5): GameQuestion[] {
  // Shuffle array
  const shuffled = [...BANANA_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(q => ({
    ...q,
    // Also randomize the options order
    options: [...q.options].sort(() => 0.5 - Math.random())
  }));
}
