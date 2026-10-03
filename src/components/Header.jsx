import React from 'react';
import { 
  Target, 
  Flame, 
  Settings, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Sun, 
  Moon, 
  BarChart3
} from 'lucide-react';

export default function Header({ 
  targetSettings, 
  activePage = 'routine',
  onNavigate,
  onOpenSettings, 
  isDarkMode,
  onToggleDarkMode,
  streak = 1, 
  currentDay = 1 
}) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left Side: Brand Logo, Exam Badge & Day Subtitle */}
        <div 
          onClick={() => onNavigate && onNavigate('routine')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Logo with Status Indicator */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 ring-1 ring-white/20 dark:ring-slate-800 transition-all duration-300 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Title and Meta */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                IELTS Routine<span className="text-indigo-600 dark:text-indigo-400">Master</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/70">
                <Sparkles className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400" />
                {targetSettings?.examType || 'ACADEMIC'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali flex items-center gap-1.5">
              <span>৪-স্লট প্রিপারেশন ফ্লো</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                Day {currentDay} of {targetSettings?.totalDays || 60}
              </span>
            </p>
          </div>
        </div>

        {/* Right Side Controls (Exact Layout Matching Screenshot) */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          
          {/* Target Band Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200">
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Target: <strong className="text-slate-900 dark:text-white font-semibold font-mono">Band {targetSettings?.targetBand || '8'}</strong></span>
          </div>

          {/* Date Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{today}</span>
          </div>

          {/* Streak Counter Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs font-semibold text-amber-900 dark:text-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold font-mono">{streak}</span>
            <span className="text-amber-700 dark:text-amber-400 font-bengali text-[11px] hidden md:inline">দিন স্ট্রিক</span>
          </div>

          {/* কাজের হিসাব Quick Pill Button */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold font-bengali transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
              activePage === 'analytics'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                : 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border-indigo-200/80 dark:border-indigo-800/70'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">কাজের হিসাব</span>
          </button>

          {/* Dark / Light Theme Mode Toggle Button */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all duration-200 active:scale-95 cursor-pointer"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}

          {/* Target Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold font-bengali shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">টার্গেট</span>
          </button>
        </div>

      </div>
    </header>
  );
}
