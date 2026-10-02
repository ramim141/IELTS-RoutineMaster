import React, { useState } from 'react';
import { 
  Zap, 
  BookOpen, 
  BookMarked, 
  Sliders, 
  ArrowUp, 
  Sun, 
  CloudSun, 
  Moon, 
  Sparkles,
  Layers,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function FloatingQuickActionDock({
  onOpenVocabVault,
  onOpenCambridgeTracker,
  onOpenMistakeDiary,
  onOpenSettings,
  currentDay,
  streak
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpenMobile(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpenMobile(false);
  };

  const dockActions = [
    {
      id: 'vocab',
      name: 'ভোকাবুলারি ব্যাংক',
      sub: 'Band 8.0+ Flashcards',
      icon: Zap,
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-200/80',
      action: onOpenVocabVault
    },
    {
      id: 'cambridge',
      name: 'Cambridge Tracker',
      sub: 'Books 10-19 Score Tracker',
      icon: BookOpen,
      color: 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white border-teal-200/80',
      action: onOpenCambridgeTracker
    },
    {
      id: 'mistake',
      name: 'ভুল সংশোধনী ডায়েরি',
      sub: 'Log & Review Errors',
      icon: BookMarked,
      color: 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-200/80',
      action: onOpenMistakeDiary
    },
    {
      id: 'target',
      name: 'টার্গেট সেটিংস',
      sub: 'Score & Timeline',
      icon: Sliders,
      color: 'bg-slate-50 text-slate-700 hover:bg-slate-800 hover:text-white border-slate-200',
      action: onOpenSettings
    }
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP FLOATING DOCK (Left Edge Fixed) */}
      {/* ========================================================= */}
      <aside 
        aria-label="Quick Navigation Dock"
        className="fixed left-3.5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-2 p-2 bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl transition-all duration-300 animate-fadeIn"
      >
        {/* Top Mini Brand Pill */}
        <div className="p-1 rounded-lg bg-slate-100/80 text-slate-400 mb-0.5" title="Quick Actions">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        </div>

        {/* Primary Action Buttons */}
        {dockActions.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={item.action}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 cursor-pointer ${item.color}`}
                aria-label={item.name}
              >
                <Icon className="w-4 h-4" />
              </button>

              {/* Hover Tooltip Popup on the Right */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col min-w-[140px] px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-md text-white shadow-xl z-50 pointer-events-none transition-all duration-200 animate-fadeIn border border-slate-800">
                <span className="text-xs font-bold font-bengali tracking-tight text-white whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  {item.sub}
                </span>
                {/* Arrow Pointer */}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-800" />
              </div>
            </div>
          );
        })}

        {/* Subtle Divider */}
        <div className="w-6 h-[1px] bg-slate-200 my-1" />

        {/* Quick Section Shortcuts */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollToSection('morning-planner')}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 hover:bg-amber-100 text-slate-500 hover:text-amber-700 transition-colors border border-slate-100 hover:border-amber-200 cursor-pointer"
            title="মর্নিং স্লট"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md">
            মর্নিং স্লট
          </div>
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollToSection('practice-slots')}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 hover:bg-teal-100 text-slate-500 hover:text-teal-700 transition-colors border border-slate-100 hover:border-teal-200 cursor-pointer"
            title="প্র্যাকটিস স্লট"
          >
            <CloudSun className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md">
            প্র্যাকটিস স্লট
          </div>
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollToSection('night-review')}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 transition-colors border border-slate-100 hover:border-indigo-200 cursor-pointer"
            title="নাইট স্লট"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md">
            নাইট স্লট
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="relative group mt-0.5">
          <button
            type="button"
            onClick={scrollToTop}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="উপরে যান"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-bengali whitespace-nowrap z-50 pointer-events-none shadow-md">
            উপরে স্ক্রোল করুন
          </div>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* MOBILE / TABLET FLOATING BUTTON & DRAWER */}
      {/* ========================================================= */}
      <div className="xl:hidden fixed left-4 bottom-6 z-40">
        {!isOpenMobile ? (
          <button
            type="button"
            onClick={() => setIsOpenMobile(true)}
            className="w-12 h-12 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center border border-slate-700 hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
            aria-label="Open Quick Menu"
          >
            <Zap className="w-5 h-5 text-amber-300" />
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-3 flex flex-col gap-2 animate-fadeIn min-w-[200px]">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold font-bengali text-slate-800">কুইক অ্যাকশন মেনু</span>
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {dockActions.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsOpenMobile(false);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-bengali text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.sub}</span>
                  </div>
                </button>
              );
            })}

            <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={scrollToTop}
                className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium font-bengali text-slate-700 flex items-center justify-center gap-1"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>উপরে যান</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
