import React from 'react';
import { Target, Flame, Settings, Calendar, BookOpen, Sparkles, Sun, Moon } from 'lucide-react';

export default function Header({ 
  targetSettings, 
  onOpenSettings, 
  onOpenCambridgeTracker,
  onOpenMistakeDiary,
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
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 ring-1 ring-white/20 dark:ring-slate-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-600/35">
                <BookOpen className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                  IELTS Routine<span className="text-indigo-600 dark:text-indigo-400">Master</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400" />
                  {targetSettings.examType}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali flex items-center gap-1.5">
                <span>৪-স্লট প্রিপারেশন ফ্লো</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">Day {currentDay} of {targetSettings.totalDays}</span>
              </p>
            </div>
          </div>

          {/* Premium Right Badges & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Target Band Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200">
              <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Target: <strong className="text-slate-900 dark:text-white font-semibold font-mono">Band {targetSettings.targetBand}</strong></span>
            </div>

            {/* Date Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">{today}</span>
            </div>

            {/* Streak Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs font-semibold text-amber-900 dark:text-amber-200">
              <div className="p-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <span className="font-bold text-amber-900 dark:text-amber-300 font-mono">{streak}</span>
              <span className="text-amber-700 dark:text-amber-400 font-bengali text-[11px] hidden sm:inline">দিন স্ট্রিক</span>
            </div>

            {/* Dark / Light Theme Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all duration-200 active:scale-95 cursor-pointer"
              title={isDarkMode ? 'Light Mode এ পরিবর্তন করুন' : 'Dark Mode এ পরিবর্তন করুন'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Premium Settings / Target Edit Button */}
            <button
              onClick={onOpenSettings}
              className="relative group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors group-hover:rotate-45 duration-300" />
              <span className="font-bengali hidden sm:inline">টার্গেট সেটিংস</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

