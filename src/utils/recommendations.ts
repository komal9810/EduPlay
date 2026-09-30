import { Recommendation, UserProfile } from '../types';

export function getRecommendations(
  user: UserProfile | null,
  recentAccuracy: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const accuracy = user ? (recentAccuracy > 0 ? recentAccuracy : user.quizAccuracy) : 0;

  if (accuracy < 60 && accuracy > 0) {
    recommendations.push({
      id: 'rec-math-practice',
      subject: 'Mathematics',
      title: 'Mathematics Practice Challenge',
      description: 'Your recent performance shows that you can improve your accuracy with a little more practice in speed calculations.',
      actionText: 'Practice Now',
      actionType: 'game',
      targetId: 'banana-catch',
      reason: `Current accuracy is ${Math.round(accuracy)}% (Target: ≥ 60%)`,
      levelBadge: 'Review Needed'
    });
  } else if (accuracy >= 60) {
    recommendations.push({
      id: 'rec-math-advanced',
      subject: 'Mathematics',
      title: 'Advanced Mathematics Challenge',
      description: "You're performing well! Level up your mental math and aim for a high combo score in Banana Catch.",
      actionText: 'Accept Challenge',
      actionType: 'game',
      targetId: 'banana-catch',
      reason: `High accuracy of ${Math.round(accuracy)}% demonstrated`,
      levelBadge: 'Next Challenge'
    });
  } else {
    // New user with 0 accuracy
    recommendations.push({
      id: 'rec-start-game',
      subject: 'Mathematics',
      title: 'Play Banana Catch Warmup',
      description: 'Test your quick reflexes and basic arithmetic to establish your starting accuracy score.',
      actionText: 'Start Playing',
      actionType: 'game',
      targetId: 'banana-catch',
      reason: 'Calibrate your initial performance index',
      levelBadge: 'Skill Boost'
    });
  }

  // Also recommend lesson based on completedLessons count
  const completed = user?.completedLessons ?? 0;
  if (completed === 0) {
    recommendations.push({
      id: 'rec-ml-intro',
      subject: 'Machine Learning',
      title: 'Introduction to Machine Learning',
      description: 'Build your foundational understanding of AI models, supervised learning, and real-world predictions.',
      actionText: 'Start Lesson',
      actionType: 'lesson',
      targetId: 'lesson-ml',
      reason: 'Recommended starting point in your curriculum',
      levelBadge: 'Next Challenge'
    });
  } else if (completed === 1) {
    recommendations.push({
      id: 'rec-dbms',
      subject: 'DBMS',
      title: 'Relational Database Concepts',
      description: 'Understand tables, primary keys, relationships, and basic SQL query architecture.',
      actionText: 'Continue Learning',
      actionType: 'lesson',
      targetId: 'lesson-dbms',
      reason: 'Next core computer science milestone',
      levelBadge: 'Next Challenge'
    });
  } else if (completed === 2) {
    recommendations.push({
      id: 'rec-ds',
      subject: 'Data Structures',
      title: 'Arrays and Linked Lists',
      description: 'Explore memory layouts, traversal time complexity, and dynamic pointer manipulation.',
      actionText: 'Continue Learning',
      actionType: 'lesson',
      targetId: 'lesson-ds',
      reason: 'Core foundational data structures',
      levelBadge: 'Next Challenge'
    });
  } else {
    recommendations.push({
      id: 'rec-web',
      subject: 'Web Technology',
      title: 'HTML & CSS Fundamentals',
      description: 'Master semantic web elements, responsive layouts, and modern front-end styling techniques.',
      actionText: 'Master Topic',
      actionType: 'lesson',
      targetId: 'lesson-web',
      reason: 'Complete the web development tier',
      levelBadge: 'Next Challenge'
    });
  }

  return recommendations;
}
