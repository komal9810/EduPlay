import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorScheme?: 'blue' | 'green' | 'peach' | 'lavender';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  colorScheme = 'blue',
  trend,
}) => {
  const schemeStyles = {
    blue: {
      bg: 'bg-blue-50/70',
      iconBg: 'bg-blue-500 text-white shadow-blue-200',
      text: 'text-blue-900',
      accent: 'border-blue-100',
    },
    green: {
      bg: 'bg-emerald-50/70',
      iconBg: 'bg-emerald-500 text-white shadow-emerald-200',
      text: 'text-emerald-900',
      accent: 'border-emerald-100',
    },
    peach: {
      bg: 'bg-amber-50/70',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
      text: 'text-amber-900',
      accent: 'border-amber-100',
    },
    lavender: {
      bg: 'bg-purple-50/70',
      iconBg: 'bg-purple-500 text-white shadow-purple-200',
      text: 'text-purple-900',
      accent: 'border-purple-100',
    },
  }[colorScheme];

  return (
    <div className="clay-card p-5 relative overflow-hidden flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${schemeStyles.iconBg}`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {value}
        </div>
        {trend && (
          <div className="mt-1.5 flex items-center text-xs font-semibold text-slate-500">
            <span className="text-emerald-600 font-bold mr-1">✦</span>
            {trend}
          </div>
        )}
      </div>

      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-slate-100/40 pointer-events-none blur-xl group-hover:scale-125 transition-transform" />
    </div>
  );
};
