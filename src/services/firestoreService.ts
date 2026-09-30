import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/firebaseConfig';
import { UserProfile, Lesson, ProgressRecord, GameResult } from '../types';

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-ml',
    title: 'Introduction to Machine Learning',
    subject: 'Machine Learning',
    description: 'Learn the basic concepts of machine learning, features, labels, and model training.',
    difficulty: 'Beginner',
    duration: 15,
    content: `Machine Learning (ML) is a branch of Artificial Intelligence that allows computers to learn patterns from historical data and make accurate decisions without being explicitly programmed.

Core Categories:
1. Supervised Learning: Models train on labeled inputs and known answers (e.g., classifying emails as spam or inbox).
2. Unsupervised Learning: Finds hidden clusters and associations in unlabeled data (e.g., customer segmentation).
3. Reinforcement Learning: Agents learn optimal behaviors through trial, errors, rewards, and penalties.`,
    example: `Scenario: An image classifier is fed 10,000 photos of cats and dogs marked with correct labels. The neural network adjusts weights until it predicts unseen pet photos with 96% accuracy.`,
    quizQuestion: 'Which type of machine learning uses labeled training datasets to train models?',
    quizOptions: [
      'Supervised Learning',
      'Unsupervised Learning',
      'Reinforcement Learning',
      'Random Search'
    ],
    quizAnswer: 0,
    xpReward: 50
  },
  {
    id: 'lesson-dbms',
    title: 'Relational Database Concepts',
    subject: 'DBMS',
    description: 'Understand tables, primary keys, relationships, and structured query architecture.',
    difficulty: 'Beginner',
    duration: 15,
    content: `A Relational Database Management System (RDBMS) stores structured data into organized two-dimensional tables consisting of rows (tuples) and columns (attributes).

Key Principles:
• Entity Integrity: Enforced through Primary Keys, which guarantee uniqueness for each entity record.
• Referential Integrity: Maintained through Foreign Keys, connecting related records across separate tables safely.
• ACID Properties: Atomicity, Consistency, Isolation, and Durability ensure reliable transactions.`,
    example: `A "Students" table with a unique Primary Key (student_id: 101) joins with an "Enrollments" table via Foreign Key (student_id: 101) to fetch all enrolled courses safely.`,
    quizQuestion: 'What is the primary role of a Primary Key in a relational database table?',
    quizOptions: [
      'To encrypt table columns securely',
      'To uniquely identify each record in a table',
      'To sort database records alphabetically',
      'To connect the database to a web domain'
    ],
    quizAnswer: 1,
    xpReward: 50
  },
  {
    id: 'lesson-ds',
    title: 'Arrays and Linked Lists',
    subject: 'Data Structures',
    description: 'Explore sequential memory layouts, dynamic pointers, and Big-O time complexity.',
    difficulty: 'Medium',
    duration: 20,
    content: `Data structures organize computer memory so operations can run efficiently.

Arrays vs. Linked Lists:
• Arrays: Continuous blocks of memory. Offer rapid O(1) random index lookups, but fixed capacity and costly O(n) middle insertions/deletions.
• Singly Linked Lists: Nodes scattered across heap memory, each holding data and a pointer to the next node. Insertion at head is O(1), but searching requires O(n) traversal.`,
    example: `In an array [10, 20, 30], accessing array[2] computes the exact memory address instantly in O(1) time. In a linked list, following pointers node.next takes linear O(n) steps.`,
    quizQuestion: 'What is the theoretical time complexity to access an element by index in an Array?',
    quizOptions: [
      'O(n)',
      'O(log n)',
      'O(1)',
      'O(n²)'
    ],
    quizAnswer: 2,
    xpReward: 60
  },
  {
    id: 'lesson-web',
    title: 'HTML & CSS Fundamentals',
    subject: 'Web Technology',
    description: 'Learn semantic page structure, elements, selectors, and the CSS box model.',
    difficulty: 'Beginner',
    duration: 10,
    content: `The World Wide Web relies on standard languages:
• HTML (HyperText Markup Language): Provides semantic structural hierarchy with tags such as <header>, <main>, <article>, and <footer> for accessible markup.
• CSS (Cascading Style Sheets): Controls presentation, layout grids, responsive viewports, typography, and interactive animations.

The CSS Box Model:
Every rendered element consists of Content, Padding (inner space), Border, and Margin (outer clearance).`,
    example: `.card { margin: 16px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; } creates clear inner breathing room without disturbing sibling flow.`,
    quizQuestion: 'Which CSS property defines the space between the content and the border of an element?',
    quizOptions: [
      'margin',
      'padding',
      'border-spacing',
      'outline'
    ],
    quizAnswer: 1,
    xpReward: 40
  }
];

// Fallback in-memory storage cache
const localFallbackProgress: Record<string, ProgressRecord[]> = {};
const localFallbackResults: Record<string, GameResult[]> = {};
const localFallbackUsers: Record<string, UserProfile> = {
  demo_komal_student: {
    uid: 'demo_komal_student',
    name: 'Komal',
    email: 'student@example.com',
    level: 1,
    xp: 0,
    streak: 1,
    completedLessons: 0,
    gamesPlayed: 0,
    quizAccuracy: 0,
    createdAt: new Date().toISOString()
  }
};

// Fetch user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return { uid: userId, ...snap.data() } as UserProfile;
    }
    return localFallbackUsers[userId] || null;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (e) {
      console.warn('Handled Firestore get error:', e);
    }
    return localFallbackUsers[userId] || {
      uid: userId,
      name: userId === 'demo_komal_student' ? 'Komal' : 'Student',
      email: 'student@example.com',
      level: 1,
      xp: 0,
      streak: 1,
      completedLessons: 0,
      gamesPlayed: 0,
      quizAccuracy: 0,
      createdAt: new Date().toISOString()
    };
  }
}

export async function createUserProfile(user: UserProfile): Promise<void> {
  const path = `users/${user.uid}`;
  const dataToSave = {
    name: user.name,
    email: user.email,
    level: user.level || 1,
    xp: user.xp || 0,
    streak: user.streak || 1,
    completedLessons: user.completedLessons || 0,
    gamesPlayed: user.gamesPlayed || 0,
    quizAccuracy: user.quizAccuracy || 0,
    createdAt: new Date().toISOString()
  };

  localFallbackUsers[user.uid] = { ...dataToSave, uid: user.uid };

  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, dataToSave);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch (e) {
      console.warn('Handled Firestore create error:', e);
    }
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const path = `users/${userId}`;
  if (localFallbackUsers[userId]) {
    localFallbackUsers[userId] = { ...localFallbackUsers[userId], ...data };
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const cleanData: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined && key !== 'uid') {
        cleanData[key] = val;
      }
    }
    cleanData.updatedAt = new Date().toISOString();
    await updateDoc(userDocRef, cleanData);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } catch (e) {
      console.warn('Handled Firestore update error:', e);
    }
  }
}

// Fetch all lessons (with fallback seed)
export async function getLessons(): Promise<Lesson[]> {
  const path = 'lessons';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      seedLessons().catch(err => console.warn('Could not seed lessons:', err));
      return INITIAL_LESSONS;
    }
    const lessons: Lesson[] = [];
    snap.forEach(d => {
      lessons.push({ id: d.id, ...d.data() } as Lesson);
    });
    return lessons.length > 0 ? lessons : INITIAL_LESSONS;
  } catch (error) {
    console.warn('Using fallback lessons due to Firestore fetch error:', error);
    return INITIAL_LESSONS;
  }
}

export async function seedLessons(): Promise<void> {
  for (const lesson of INITIAL_LESSONS) {
    try {
      const lessonRef = doc(db, 'lessons', lesson.id);
      await setDoc(lessonRef, lesson);
    } catch {
      // Ignore seeding errors in locked rule mode
    }
  }
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  try {
    const snap = await getDoc(doc(db, 'lessons', lessonId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Lesson;
    }
    return INITIAL_LESSONS.find(l => l.id === lessonId) || null;
  } catch (error) {
    return INITIAL_LESSONS.find(l => l.id === lessonId) || null;
  }
}

// Student progress
export async function getUserProgress(userId: string): Promise<ProgressRecord[]> {
  const path = 'progress';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    const list: ProgressRecord[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as ProgressRecord);
    });
    return list.length > 0 ? list : (localFallbackProgress[userId] || []);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (e) {
      console.warn('Handled Firestore list error:', e);
    }
    return localFallbackProgress[userId] || [];
  }
}

export async function recordLessonCompletion(
  userId: string,
  lessonId: string,
  score: number,
  xpEarned: number,
  currentProfile: UserProfile
): Promise<void> {
  const progressId = `${userId}_${lessonId}`;
  const progressPath = `progress/${progressId}`;

  const record: ProgressRecord = {
    userId,
    lessonId,
    completed: true,
    score,
    completedAt: new Date().toISOString()
  };

  if (!localFallbackProgress[userId]) localFallbackProgress[userId] = [];
  localFallbackProgress[userId] = [
    ...localFallbackProgress[userId].filter(p => p.lessonId !== lessonId),
    record
  ];

  // 1. Calculate updated user profile stats
  const newXP = currentProfile.xp + xpEarned;
  const newLevel = Math.max(1, Math.floor(newXP / 200) + 1);
  const newCompletedLessons = currentProfile.completedLessons + 1;
  const updatedAccuracy = currentProfile.quizAccuracy > 0
    ? Math.round((currentProfile.quizAccuracy + score) / 2)
    : score;

  await updateUserProfile(userId, {
    xp: newXP,
    level: newLevel,
    completedLessons: newCompletedLessons,
    quizAccuracy: updatedAccuracy,
    streak: Math.max(1, currentProfile.streak)
  });

  try {
    const progressDocRef = doc(db, 'progress', progressId);
    await setDoc(progressDocRef, record);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, progressPath);
    } catch (e) {
      console.warn('Handled Firestore write error:', e);
    }
  }
}

// Game results
export async function saveGameResult(
  result: Omit<GameResult, 'id'>,
  currentProfile: UserProfile
): Promise<void> {
  const resultId = `result_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `gameResults/${resultId}`;

  const newGamesPlayed = currentProfile.gamesPlayed + 1;
  const newXP = currentProfile.xp + result.xpEarned;
  const newLevel = Math.max(1, Math.floor(newXP / 200) + 1);
  const previousTotalAcc = (currentProfile.quizAccuracy || 0) * (currentProfile.gamesPlayed || 0);
  const newAccuracy = Math.round((previousTotalAcc + result.accuracy) / newGamesPlayed);

  const fullResult: GameResult = {
    id: resultId,
    userId: result.userId,
    gameId: result.gameId,
    score: result.score,
    correctAnswers: result.correctAnswers,
    totalQuestions: result.totalQuestions,
    accuracy: result.accuracy,
    xpEarned: result.xpEarned,
    playedAt: new Date().toISOString()
  };

  if (!localFallbackResults[result.userId]) localFallbackResults[result.userId] = [];
  localFallbackResults[result.userId].unshift(fullResult);

  await updateUserProfile(result.userId, {
    xp: newXP,
    level: newLevel,
    gamesPlayed: newGamesPlayed,
    quizAccuracy: Math.min(100, Math.max(0, newAccuracy))
  });

  try {
    await setDoc(doc(db, 'gameResults', resultId), {
      userId: fullResult.userId,
      gameId: fullResult.gameId,
      score: fullResult.score,
      correctAnswers: fullResult.correctAnswers,
      totalQuestions: fullResult.totalQuestions,
      accuracy: fullResult.accuracy,
      xpEarned: fullResult.xpEarned,
      playedAt: fullResult.playedAt
    });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch (e) {
      console.warn('Handled Firestore create error:', e);
    }
  }
}

export async function getUserGameResults(userId: string): Promise<GameResult[]> {
  const path = 'gameResults';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      limit(10)
    );
    const snap = await getDocs(q);
    const results: GameResult[] = [];
    snap.forEach(d => {
      results.push({ id: d.id, ...d.data() } as GameResult);
    });
    const sorted = results.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
    return sorted.length > 0 ? sorted : (localFallbackResults[userId] || []);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (e) {
      console.warn('Handled Firestore list error:', e);
    }
    return localFallbackResults[userId] || [];
  }
}
