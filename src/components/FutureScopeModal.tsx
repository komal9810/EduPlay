import React from 'react';
import {
  X,
  Compass,
  Boxes,
  Cpu,
  Gamepad2,
  Users2,
  LineChart,
  Smartphone,
  Trophy,
  GraduationCap
} from 'lucide-react';

interface FutureScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureScopeModal: React.FC<FutureScopeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const roadmapItems = [
    {
      title: 'Full Unity 3D Game Integration',
      description: 'Embedding compiled WebGL Unity builds for immersive physics-driven simulations and 3D spatial mini-games.',
      icon: Boxes,
      tag: 'Graphics & Engine',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Expanded Game Library',
      description: 'Adding Science Lab chemistry simulations, Data Structure maze runners, and SQL query puzzle adventures.',
      icon: Gamepad2,
      tag: 'Content',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'AI-Based Adaptive Learning',
      description: 'Machine learning models generating personalized question difficulty curves based on individual student error rates.',
      icon: Cpu,
      tag: 'AI & Intelligence',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Advanced Recommendation Engine',
      description: 'Collaborative filtering and knowledge-graph mastery tracking to suggest targeted remedial modules.',
      icon: GraduationCap,
      tag: 'Analytics',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Teacher & Instructor Dashboard',
      description: 'Classroom curriculum assignment, student cohort analytics, real-time quiz results, and automated grading.',
      icon: Users2,
      tag: 'Role Management',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
      title: 'Real-Time Multiplayer Learning',
      description: 'Live competitive quiz battles, team challenges, and peer-to-peer educational room matches.',
      icon: Trophy,
      tag: 'Social',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Deep Analytics & Learning Retention',
      description: 'Forgetting curve tracking, spaced repetition reminders, and topic weakness heatmaps.',
      icon: LineChart,
      tag: 'Telemetry',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: 'Native Mobile Applications (iOS / Android)',
      description: 'React Native / Flutter offline caching and haptic feedback for game mechanics on touchscreens.',
      icon: Smartphone,
      tag: 'Platforms',
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="clay-card w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Future Scope & Academic Roadmap
              </h2>
              <p className="text-xs text-slate-500">
                EduPlay – UnityLearn Planned Extensions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 mb-6 text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          This prototype demonstrates the core academic flow: <strong>Learning → Game → Score → Progress → Personalized Recommendation</strong>.
          The features below represent the planned engineering roadmap for future iterations.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roadmapItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="clay-card-flat p-4 flex flex-col justify-between border border-slate-100"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="clay-btn clay-btn-primary px-5 py-2.5 text-xs font-bold text-white"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
