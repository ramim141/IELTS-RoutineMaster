import React, { useState } from 'react';
import { 
  Clock,
  Zap, 
  BookOpen, 
  BookMarked, 
  Sliders, 
  ArrowUp, 
  Sun, 
  CloudSun, 
  Moon, 
  Sparkles,
  BarChart3,
  X
} from 'lucide-react';

export default function FloatingQuickActionDock({
  activePage = 'routine',
  onNavigate,
  onOpenSettings,
  isDarkMode,
  onToggleDarkMode,
  currentDay = 1,
  streak = 1,
  onSelectSlotStep,
  onOpenMasteryAnalytics,
  onOpenVocabVault,
  onOpenCambridgeTracker,
  onOpenMistakeDiary
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleNavigateTo = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    } else {
      if (pageId === 'analytics' && onOpenMasteryAnalytics) onOpenMasteryAnalytics();
      if (pageId === 'vocab' && onOpenVocabVault) onOpenVocabVault();
      if (pageId === 'cambridge' && onOpenCambridgeTracker) onOpenCambridgeTracker();
      if (pageId === 'mistakes' && onOpenMistakeDiary) onOpenMistakeDiary();
    }
    setIsOpenMobile(false);
  };

  const handleSlotJump = (slotStep, elementId) => {
    if (onNavigate) onNavigate('routine');
    if (onSelectSlotStep) onSelectSlotStep(slotStep);
    
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    }, 150);
    setIsOpenMobile(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpenMobile(false);
  };

  const dockActions = [
    {
      id: 'analytics',
      name: 'কাজের হিসাব ও প্রস্তুতি',
      sub: 'Module Progress & Tasks',
      badge: 'Analytics',
      icon: BarChart3,
      color: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white border-indigo-200/80 dark:border-indigo-800/80',
      activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40',
      action: () => handleNavigateTo('analytics')
    },
    {
      id: 'vocab',
      name: 'ভোকাবুলারি ব্যাংক',
      sub: 'Band 8.0+ Flashcards',
      badge: 'Band 8+',
      icon: Zap,
      color: 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white border-amber-200/80 dark:border-amber-800/80',
      activeColor: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/40',
      action: () => handleNavigateTo('vocab')
    },
    {
      id: 'cambridge',
      name: 'Cambridge Tracker',
      sub: 'Books 10-19 Score Tracker',
      badge: 'B 10-19',
      icon: BookOpen,
      color: 'bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white border-teal-200/80 dark:border-teal-800/80',
      activeColor: 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/30 ring-2 ring-teal-400/40',
      action: () => handleNavigateTo('cambridge')
    },
    {
      id: 'mistakes',
      name: 'ভুল সংশোধনী ডায়েরি',
      sub: 'Log & Review Errors',
      badge: 'Diary',
      icon: BookMarked,
      color: 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white border-rose-200/80 dark:border-rose-800/80',
      activeColor: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30 ring-2 ring-rose-400/40',
      action: () => handleNavigateTo('mistakes')
    },
    {
      id: 'target',
      name: 'টার্গেট সেটিংস',
      sub: 'Score & Timeline',
      badge: 'Target',
      icon: Sliders,
      color: 'bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700',
      activeColor: 'bg-slate-800 text-white border-slate-800',
      action: () => {
        if (onOpenSettings) onOpenSettings();
        setIsOpenMobile(false);
      }
    }
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP FLOATING DOCK (Left Edge Fixed Capsule) */}
      {/* ========================================================= */}
      <aside 
        aria-label="Floating Quick Action Dock"
        className="fixed left-3.5 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-2 p-2 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl rounded-[28px] transition-all duration-300 animate-fadeIn select-none"
      >
        {/* Top Mini Brand Sparkle Pill (Returns to Routine) */}
        <button
          type="button"
          onClick={() => handleNavigateTo('routine')}
          className={`p-2 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs hover:scale-110 active:scale-95 ${
            activePage === 'routine'
              ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40 shadow-indigo-600/25'
              : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
          }`}
          title="রুটিন হোমপেইজ"
          aria-label="রুটিন হোমপেইজ"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Primary Action Buttons */}
        {dockActions.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={item.action}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer ${
                  isActive ? item.activeColor : item.color
                }`}
                aria-label={item.name}
              >
                <Icon className="w-4 h-4" />
              </button>

              {/* Hover Tooltip Popup on the Right */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col min-w-[150px] px-3 py-2 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white shadow-xl z-50 pointer-events-none transition-all duration-200 animate-fadeIn border border-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold font-bengali tracking-tight text-white whitespace-nowrap">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/20 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-300 dark:text-slate-400 font-mono mt-0.5">
                  {item.sub}
                </span>
                {/* Arrow Pointer */}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 border-l border-b border-slate-800 dark:border-slate-700" />
              </div>
            </div>
          );
        })}

        {/* Subtle Divider */}
        <div className="w-6 h-[1px] bg-slate-200/90 dark:bg-slate-800 my-1" />

        {/* Theme Toggle Button */}
        {onToggleDarkMode && (
          <div className="relative group">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 transition-all duration-200 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md border border-slate-700">
              {isDarkMode ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
            </div>
          </div>
        )}

        {/* Quick Routine Slot Shortcuts */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => handleSlotJump('morning', 'morning-planner')}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/70 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-200 border border-slate-100 dark:border-slate-700/60 hover:border-amber-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="মর্নিং স্লট"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md border border-slate-700">
            মর্নিং স্লটে যান
          </div>
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => handleSlotJump('practice', 'practice-slots')}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/70 hover:bg-teal-100 dark:hover:bg-teal-950/50 text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-200 border border-slate-100 dark:border-slate-700/60 hover:border-teal-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="প্র্যাকটিস স্লট"
          >
            <CloudSun className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md border border-slate-700">
            প্র্যাকটিস ট্র্যাকে যান
          </div>
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => handleSlotJump('night', 'night-review')}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 border border-slate-100 dark:border-slate-700/60 hover:border-indigo-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="নাইট স্লট"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md border border-slate-700">
            রাতের রিভিউ স্লটে যান
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="relative group mt-0.5">
          <button
            type="button"
            onClick={scrollToTop}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="উপরে স্ক্রোল করুন"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md border border-slate-700">
            উপরে স্ক্রোল করুন
          </div>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* MOBILE / TABLET FLOATING DOCK BUTTON & DRAWER */}
      {/* ========================================================= */}
      <div className="xl:hidden fixed left-4 bottom-6 z-50">
        {!isOpenMobile ? (
          <button
            type="button"
            onClick={() => setIsOpenMobile(true)}
            className="w-13 h-13 rounded-full bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl flex items-center justify-center border border-slate-700 dark:border-indigo-500 hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer ring-4 ring-indigo-500/20"
            aria-label="Open Floating Menu"
          >
            <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
          </button>
        ) : (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-3.5 flex flex-col gap-2 animate-fadeIn min-w-[240px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold font-bengali text-slate-800 dark:text-slate-200">কুইক অ্যাকশন মেনু</span>
              <button 
                type="button"
                onClick={() => setIsOpenMobile(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Routine Button */}
            <button
              type="button"
              onClick={() => handleNavigateTo('routine')}
              className={`flex items-center gap-2.5 p-2 rounded-2xl text-left transition-all cursor-pointer ${
                activePage === 'routine' ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                activePage === 'routine' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
              }`}>
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold font-bengali text-slate-900 dark:text-white block">দৈনিক রুটিন</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Day {currentDay} Routine</span>
              </div>
            </button>

            {dockActions.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className={`flex items-center gap-2.5 p-2 rounded-2xl text-left transition-all cursor-pointer ${
                    isActive ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-indigo-600 text-white' : item.color
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-bengali text-slate-900 dark:text-white block">{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{item.sub}</span>
                  </div>
                </button>
              );
            })}

            {/* Mobile Theme Toggle */}
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="flex items-center gap-2.5 p-2 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800 pt-2"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 shrink-0">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold font-bengali text-slate-900 dark:text-white block">
                    {isDarkMode ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                  </span>
                </div>
              </button>
            )}

            <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button 
                type="button"
                onClick={scrollToTop}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-bengali text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>উপরে স্ক্রোল করুন</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
