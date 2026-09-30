import React, { useState, useEffect, useCallback } from 'react';
import { auth } from './firebase/firebaseConfig';
import {
  subscribeToAuthChanges,
  logOut,
  loginAsDemoStudent,
  AuthSessionUser
} from './services/authService';
import {
  getUserProfile,
  createUserProfile,
  getLessons,
  getUserProgress,
  getUserGameResults,
  INITIAL_LESSONS
} from './services/firestoreService';
import { UserProfile, Lesson, ProgressRecord, GameResult } from './types';

import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { FutureScopeModal } from './components/FutureScopeModal';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Learn } from './pages/Learn';
import { LessonView } from './pages/Lesson';
import { Games } from './pages/Games';
import { BananaCatch } from './pages/BananaCatch';
import { ProgressView } from './pages/Progress';
import { Profile } from './pages/Profile';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [userProgress, setUserProgress] = useState<ProgressRecord[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [isFutureScopeOpen, setIsFutureScopeOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Reload student telemetry and progress from Firestore
  const reloadUserData = useCallback(async (uid: string) => {
    try {
      let profile = await getUserProfile(uid);
      if (!profile) {
        // Fallback create initial user document
        profile = {
          uid,
          name: auth.currentUser?.displayName || 'Komal',
          email: auth.currentUser?.email || 'student@example.com',
          level: 1,
          xp: 0,
          streak: 1,
          completedLessons: 0,
          gamesPlayed: 0,
          quizAccuracy: 0,
        };
        await createUserProfile(profile);
      }
      setUserProfile(profile);

      // Fetch progress and game results in parallel
      const [prog, results] = await Promise.all([
        getUserProgress(uid),
        getUserGameResults(uid)
      ]);
      setUserProgress(prog);
      setGameResults(results);
    } catch (err) {
      console.error('Error fetching student profile from Firestore:', err);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        setIsLoadingData(true);
        await reloadUserData(fbUser.uid);
        setIsLoadingData(false);
      } else {
        setUserProfile(null);
        setUserProgress([]);
        setGameResults([]);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [reloadUserData]);

  // Load curriculum lessons on initial app mount
  useEffect(() => {
    getLessons()
      .then(fetchedLessons => {
        if (fetchedLessons && fetchedLessons.length > 0) {
          setLessons(fetchedLessons);
        }
      })
      .catch(err => {
        console.warn('Using default lessons:', err);
      });
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logOut();
      setActiveLesson(null);
      setActiveGameId(null);
      setCurrentTab('dashboard');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Called after completing a lesson or playing a game to refresh stats
  const handleMilestoneUpdated = async () => {
    if (currentUser) {
      await reloadUserData(currentUser.uid);
    }
  };

  // Initial loading state per Section 24
  if (!authChecked || (currentUser && !userProfile && isLoadingData)) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <div className="clay-card p-8 flex flex-col items-center text-center max-w-sm w-full space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-500 text-white text-3xl flex items-center justify-center animate-bounce shadow-lg shadow-blue-200">
            🎓
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">EduPlay – UnityLearn</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Loading your learning journey...
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden clay-inset">
            <div className="h-full bg-blue-500 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated: Show Login or Signup (Protected routes per Section 3)
  if (!currentUser || !userProfile) {
    if (authView === 'signup') {
      return (
        <Signup
          onSuccess={() => setAuthView('login')}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onSuccess={() => {}}
        onNavigateToSignup={() => setAuthView('signup')}
      />
    );
  }

  // Main Authenticated Application
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-slate-800">
      {/* Sidebar for Desktop & Mobile Bottom Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveLesson(null);
          setActiveGameId(null);
          setCurrentTab(tab);
        }}
        user={userProfile}
        onLogout={handleLogout}
        onOpenFutureScope={() => setIsFutureScopeOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          user={userProfile}
          onOpenFutureScope={() => setIsFutureScopeOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {/* Active Lesson Modal / View */}
          {activeLesson ? (
            <LessonView
              lesson={activeLesson}
              user={userProfile}
              isAlreadyCompleted={userProgress.some(p => p.lessonId === activeLesson.id && p.completed)}
              onBack={() => setActiveLesson(null)}
              onLessonFinished={handleMilestoneUpdated}
            />
          ) : activeGameId === 'banana-catch' ? (
            /* Active Game View */
            <BananaCatch
              user={userProfile}
              onBack={() => setActiveGameId(null)}
              onGameSaved={handleMilestoneUpdated}
            />
          ) : (
            /* Tab Views */
            <>
              {currentTab === 'dashboard' && (
                <Dashboard
                  user={userProfile}
                  lessons={lessons}
                  onNavigateToTab={(tab) => setCurrentTab(tab)}
                  onOpenLesson={(lesson) => setActiveLesson(lesson)}
                  onPlayGame={() => setActiveGameId('banana-catch')}
                />
              )}

              {currentTab === 'learn' && (
                <Learn
                  lessons={lessons}
                  userProgress={userProgress}
                  onOpenLesson={(lesson) => setActiveLesson(lesson)}
                />
              )}

              {currentTab === 'games' && (
                <Games
                  onPlayGame={(gameId) => setActiveGameId(gameId)}
                />
              )}

              {currentTab === 'progress' && (
                <ProgressView
                  user={userProfile}
                  gameResults={gameResults}
                  userProgress={userProgress}
                />
              )}

              {currentTab === 'profile' && (
                <Profile
                  user={userProfile}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Future Scope Modal */}
      <FutureScopeModal
        isOpen={isFutureScopeOpen}
        onClose={() => setIsFutureScopeOpen(false)}
      />
    </div>
  );
}
