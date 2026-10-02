import React from 'react';
import { Target, Flame, Settings, Calendar, BookOpen, Sparkles, ChevronRight } from 'lucide-react';

export default function Header({ 
  targetSettings, 
  onOpenSettings, 
  onOpenCambridgeTracker,
  onOpenMistakeDiary,
  streak = 1, 
  currentDay = 1 
}) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-600/35">
                <BookOpen className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-sans">
                  IELTS Routine<span className="text-indigo-600">Master</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50/80 text-indigo-700 border border-indigo-200/70 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                  {targetSettings.examType}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bengali flex items-center gap-1.5">
                <span>৪-স্লট প্রিপারেশন ফ্লো</span>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-600 font-semibold font-mono">Day {currentDay} of {targetSettings.totalDays}</span>
              </p>
            </div>
          </div>

          {/* Premium Right Badges & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Cambridge Master Tracker Button */}
            <button
              onClick={onOpenCambridgeTracker}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-bold font-bengali transition-all shadow-xs active:scale-95"
              title="Cambridge 10-19 Master Progress Matrix"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-700" />
              <span>কেমব্রিজ ট্র্যাকার (১০-১৯)</span>
            </button>

            {/* Mistake Log Diary Button */}
            <button
              onClick={onOpenMistakeDiary}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 text-xs font-bold font-bengali transition-all shadow-xs active:scale-95"
              title="ভুল বিশ্লেষণের বিশেষ ডায়েরি"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>ভুল ডায়েরি (Mistake Log)</span>
            </button>

            {/* Streak Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-xs font-semibold text-amber-900">
              <div className="p-1 rounded-full bg-amber-100 text-amber-600">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <span className="font-bold text-amber-900 font-mono">{streak}</span>
              <span className="text-amber-700 font-bengali text-[11px] hidden sm:inline">দিন স্ট্রিক</span>
            </div>

            {/* Premium Settings / Target Edit Button */}
            <button
              onClick={onOpenSettings}
              className="relative group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all duration-200 active:scale-95"
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
