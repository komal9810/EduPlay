import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  sublabel?: string;
  colorScheme?: 'blue' | 'green' | 'peach' | 'lavender';
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  sublabel,
  colorScheme = 'blue',
  height = 'md',
  showPercentage = true,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    green: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    peach: 'bg-gradient-to-r from-amber-400 to-orange-400',
    lavender: 'bg-gradient-to-r from-purple-400 to-pink-400',
  }[colorScheme];

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  }[height];

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            {label && <span>{label}</span>}
            {sublabel && <span className="text-slate-400 text-[11px] font-normal">({sublabel})</span>}
          </div>
          {showPercentage && <span className="font-bold text-slate-800">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden clay-inset p-0.5 ${heightClasses}`}>
        <div
          className={`${heightClasses} rounded-full transition-all duration-500 ease-out ${colorClasses}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
