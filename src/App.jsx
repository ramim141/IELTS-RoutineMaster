import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TargetSetupModal from './components/TargetSetupModal';
import TargetProgressHero from './components/TargetProgressHero';
import DailyTimeBreakdownChart from './components/DailyTimeBreakdownChart';
import MorningSlotPlanner from './components/MorningSlotPlanner';
import AfternoonSlotPractice from './components/AfternoonSlotPractice';
import PracticeTrackSlot from './components/PracticeTrackSlot';
import NightSlotReview from './components/NightSlotReview';
import CambridgeMasterTracker from './components/CambridgeMasterTracker';
import MistakeLogDiary from './components/MistakeLogDiary';
import IeltsVocabVault from './components/IeltsVocabVault';
import FloatingQuickActionDock from './components/FloatingQuickActionDock';
import { 
  Sun, 
  CloudSun, 
  Moon, 
  Target, 
  Sparkles, 
  Sliders, 
  ListTodo,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  BookMarked,
  Zap
} from 'lucide-react';

const DEFAULT_TARGET_SETTINGS = {
  examType: 'Academic',
  targetBand: 7.5,
  planType: 'days',
  totalDays: 60,
  startDate: new Date().toISOString().split('T')[0],
  examDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  })(),
  dailyHoursGoal: 4,
  isConfigured: true
};

export default function App() {
  // 1. Target Settings state with LocalStorage
  const [targetSettings, setTargetSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_target_settings');
      return saved ? JSON.parse(saved) : DEFAULT_TARGET_SETTINGS;
    } catch (e) {
      return DEFAULT_TARGET_SETTINGS;
    }
  });

  // Theme mode state (light / dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('ielts_theme_mode');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  // Apply dark class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ielts_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ielts_theme_mode', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_target_settings');
      return !saved;
    } catch (e) {
      return false;
    }
  });

  // Modal states for Cambridge Master Tracker, Mistake Log Diary, and Vocab Vault
  const [isCambridgeTrackerOpen, setIsCambridgeTrackerOpen] = useState(false);
  const [isMistakeDiaryOpen, setIsMistakeDiaryOpen] = useState(false);
  const [isVocabVaultOpen, setIsVocabVaultOpen] = useState(false);

  // 2. Active Day tracker
  const [currentDay, setCurrentDay] = useState(() => {
    try {
      const savedDay = localStorage.getItem('ielts_current_active_day');
      if (savedDay) return parseInt(savedDay, 10);
      
      const start = new Date(targetSettings.startDate || new Date());
      const now = new Date();
      const diffTime = Math.max(0, now - start);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return Math.min(targetSettings.totalDays || 60, Math.max(1, diffDays));
    } catch (e) {
      return 1;
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_streak_count');
      return saved ? parseInt(saved, 10) : 1;
    } catch (e) {
      return 1;
    }
  });

  // 3. Daily Tasks state mapped per day
  const [tasksByDay, setTasksByDay] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_routine_tasks_store');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Current day's specific tasks
  const currentDailyTasks = tasksByDay[currentDay] || [];

  // Update tasks for active day and persist
  const handleUpdateCurrentDayTasks = (newTasks) => {
    const updated = {
      ...tasksByDay,
      [currentDay]: newTasks
    };
    setTasksByDay(updated);
    try {
      localStorage.setItem('ielts_routine_tasks_store', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Shift single incomplete task to next day (currentDay + 1)
  const handleShiftTaskToNextDay = (taskToShift) => {
    const nextDay = currentDay + 1;
    if (nextDay > targetSettings.totalDays) return;

    const updatedCurrentDayTasks = currentDailyTasks.filter(t => t.id !== taskToShift.id);
    const nextDayExistingTasks = tasksByDay[nextDay] || [];
    const shiftedTask = {
      ...taskToShift,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      day: nextDay,
      completed: false,
      completedAt: null
    };

    const updated = {
      ...tasksByDay,
      [currentDay]: updatedCurrentDayTasks,
      [nextDay]: [...nextDayExistingTasks, shiftedTask]
    };

    setTasksByDay(updated);
    try {
      localStorage.setItem('ielts_routine_tasks_store', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Shift ALL incomplete tasks from current day to next day
  const handleShiftAllIncompleteToNextDay = () => {
    const nextDay = currentDay + 1;
    if (nextDay > targetSettings.totalDays) return;

    const completedTasks = currentDailyTasks.filter(t => t.completed);
    const incompleteTasks = currentDailyTasks.filter(t => !t.completed);

    if (incompleteTasks.length === 0) return;

    const nextDayExistingTasks = tasksByDay[nextDay] || [];
    const shiftedTasks = incompleteTasks.map(t => ({
      ...t,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      day: nextDay,
      completed: false,
      completedAt: null
    }));

    const updated = {
      ...tasksByDay,
      [currentDay]: completedTasks,
      [nextDay]: [...nextDayExistingTasks, ...shiftedTasks]
    };

    setTasksByDay(updated);
    try {
      localStorage.setItem('ielts_routine_tasks_store', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Increment Streak & Save
  const handleIncrementStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    try {
      localStorage.setItem('ielts_streak_count', newStreak.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Save Target Settings to localStorage
  const handleSaveTargetSettings = (newSettings) => {
    setTargetSettings(newSettings);
    try {
      localStorage.setItem('ielts_target_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  // Save current active day to localStorage
  const handleDayChange = (newDay) => {
    setCurrentDay(newDay);
    try {
      localStorage.setItem('ielts_current_active_day', newDay.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Daily Step Wizard State ('morning' | 'afternoon' | 'practice' | 'night' | 'all')
  const [activeSlotStep, setActiveSlotStep] = useState('morning');

  // Counts for step indicators
  const morningTasks = currentDailyTasks.filter(t => t.targetSlot === 'morning');
  const afternoonTasks = currentDailyTasks.filter(t => t.targetSlot === 'afternoon');
  const practiceTasks = currentDailyTasks.filter(t => t.targetSlot === 'practice');
  const nightTasks = currentDailyTasks.filter(t => t.targetSlot === 'night');

  const completedMorning = morningTasks.filter(t => t.completed).length;
  const completedAfternoon = afternoonTasks.filter(t => t.completed).length;
  const completedPractice = practiceTasks.filter(t => t.completed).length;
  const completedNight = nightTasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-950 dark:selection:text-indigo-200 relative transition-colors duration-200">
      {/* Floating Quick Action Dock on the Left */}
      <FloatingQuickActionDock
        onOpenVocabVault={() => setIsVocabVaultOpen(true)}
        onOpenCambridgeTracker={() => setIsCambridgeTrackerOpen(true)}
        onOpenMistakeDiary={() => setIsMistakeDiaryOpen(true)}
        onOpenSettings={() => setIsSetupModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentDay={currentDay}
        streak={streak}
      />

      {/* Top Navigation */}
      <Header
        targetSettings={targetSettings}
        onOpenSettings={() => setIsSetupModalOpen(true)}
        onOpenCambridgeTracker={() => setIsCambridgeTrackerOpen(true)}
        onOpenMistakeDiary={() => setIsMistakeDiaryOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        streak={streak}
        currentDay={currentDay}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8">
        
        {/* ======================================================== */}
        {/* FEATURE 1: Target Timeline & Preparation Roadmap Hero */}
        {/* ======================================================== */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h2 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-mono">
                Feature 1 • Preparation Target & Timeline
              </h2>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap sm:nowrap">
              <button
                onClick={() => setIsVocabVaultOpen(true)}
                className="text-xs text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200 flex items-center gap-1.5 font-bengali font-bold transition-colors px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>ভোকাবুলারি ব্যাংক</span>
              </button>

              <button
                onClick={() => setIsCambridgeTrackerOpen(true)}
                className="text-xs text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 flex items-center gap-1.5 font-bengali font-bold transition-colors px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200/80 dark:border-teal-800 shadow-2xs active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cambridge Tracker</span>
              </button>

              <button
                onClick={() => setIsMistakeDiaryOpen(true)}
                className="text-xs text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-200 flex items-center gap-1.5 font-bengali font-bold transition-colors px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800 shadow-2xs active:scale-95"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>ভুল ডায়েরি</span>
              </button>

              <button
                onClick={() => setIsSetupModalOpen(true)}
                className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1.5 font-bengali font-semibold transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                টার্গেট পরিবর্তন
              </button>
            </div>
          </div>

          <TargetProgressHero
            targetSettings={targetSettings}
            currentDay={currentDay}
            onDayChange={handleDayChange}
            onOpenSettings={() => setIsSetupModalOpen(true)}
          />
        </section>

        {/* ======================================================== */}
        {/* DAILY TIME BREAKDOWN & BALANCE CHART */}
        {/* ======================================================== */}
        <section className="space-y-2">
          <DailyTimeBreakdownChart
            dailyTasks={currentDailyTasks}
            targetSettings={targetSettings}
          />
        </section>

        {/* ======================================================== */}
        {/* STEP-BY-STEP DAILY WIZARD NAVIGATION BAR (4 STEPS) */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-mono">
                  Daily Step Flow • Day {currentDay} Routine
                </h2>
              </div>
              <h3 className="text-base font-extrabold font-bengali text-slate-900 dark:text-slate-100 mt-0.5">
                আজকের দিনের ৪-ধাপের প্রিপারেশন ফ্লো (Daily 4-Step Wizard)
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs self-start sm:self-auto">
              <button
                onClick={() => setActiveSlotStep('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-bengali transition-all flex items-center gap-1.5 ${
                  activeSlotStep === 'all'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>সব স্লট একসাথে</span>
              </button>
            </div>
          </div>

          {/* 4 Stepper Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Step 1: Morning */}
            <button
              onClick={() => setActiveSlotStep('morning')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between gap-3 ${
                activeSlotStep === 'morning'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40'
                  : 'bg-white dark:bg-slate-900 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 text-slate-900 dark:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl transition-colors ${
                  activeSlotStep === 'morning' ? 'bg-amber-600 text-white' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                }`}>
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider font-mono block ${
                    activeSlotStep === 'morning' ? 'text-amber-100' : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    Step 1
                  </span>
                  <h4 className="text-sm font-bold font-bengali leading-tight">১. সকালের স্লট</h4>
                  <span className={`text-[11px] font-bengali block ${
                    activeSlotStep === 'morning' ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    মর্নিং ফোকাস
                  </span>
                </div>
              </div>

              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border shrink-0 ${
                activeSlotStep === 'morning' 
                  ? 'bg-amber-600/80 border-amber-400/50 text-white' 
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}>
                {completedMorning}/{morningTasks.length}
              </span>
            </button>

            {/* Step 2: Afternoon */}
            <button
              onClick={() => setActiveSlotStep('afternoon')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between gap-3 ${
                activeSlotStep === 'afternoon'
                  ? 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20 ring-2 ring-sky-400/40'
                  : 'bg-white dark:bg-slate-900 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 text-slate-900 dark:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl transition-colors ${
                  activeSlotStep === 'afternoon' ? 'bg-sky-600 text-white' : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50'
                }`}>
                  <CloudSun className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider font-mono block ${
                    activeSlotStep === 'afternoon' ? 'text-sky-100' : 'text-sky-700 dark:text-sky-400'
                  }`}>
                    Step 2
                  </span>
                  <h4 className="text-sm font-bold font-bengali leading-tight">২. দুপুরের স্লট</h4>
                  <span className={`text-[11px] font-bengali block ${
                    activeSlotStep === 'afternoon' ? 'text-sky-100' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    ইনটেনসিভ ড্রিল
                  </span>
                </div>
              </div>

              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border shrink-0 ${
                activeSlotStep === 'afternoon' 
                  ? 'bg-sky-600/80 border-sky-400/50 text-white' 
                  : 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300'
              }`}>
                {completedAfternoon}/{afternoonTasks.length}
              </span>
            </button>

            {/* Step 3: Practice Track */}
            <button
              onClick={() => setActiveSlotStep('practice')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between gap-3 ${
                activeSlotStep === 'practice'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md shadow-teal-600/20 ring-2 ring-teal-400/40'
                  : 'bg-white dark:bg-slate-900 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 text-slate-900 dark:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl transition-colors ${
                  activeSlotStep === 'practice' ? 'bg-teal-700 text-white' : 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50'
                }`}>
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider font-mono block ${
                    activeSlotStep === 'practice' ? 'text-teal-100' : 'text-teal-700 dark:text-teal-400'
                  }`}>
                    Step 3
                  </span>
                  <h4 className="text-sm font-bold font-bengali leading-tight">৩. প্র্যাকটিস ট্র্যাক</h4>
                  <span className={`text-[11px] font-bengali block ${
                    activeSlotStep === 'practice' ? 'text-teal-100' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    Cambridge ও টেস্ট
                  </span>
                </div>
              </div>

              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border shrink-0 ${
                activeSlotStep === 'practice' 
                  ? 'bg-teal-700/80 border-teal-400/50 text-white' 
                  : 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300'
              }`}>
                {completedPractice}/{practiceTasks.length}
              </span>
            </button>

            {/* Step 4: Night */}
            <button
              onClick={() => setActiveSlotStep('night')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between gap-3 ${
                activeSlotStep === 'night'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-600/20 ring-2 ring-indigo-400/40'
                  : 'bg-white dark:bg-slate-900 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-900 dark:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl transition-colors ${
                  activeSlotStep === 'night' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50'
                }`}>
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider font-mono block ${
                    activeSlotStep === 'night' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-400'
                  }`}>
                    Step 4
                  </span>
                  <h4 className="text-sm font-bold font-bengali leading-tight">৪. রাতের স্লট</h4>
                  <span className={`text-[11px] font-bengali block ${
                    activeSlotStep === 'night' ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    স্কোর ও ডে লক
                  </span>
                </div>
              </div>

              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border shrink-0 ${
                activeSlotStep === 'night' 
                  ? 'bg-indigo-700/80 border-indigo-400/50 text-white' 
                  : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300'
              }`}>
                {completedNight}/{nightTasks.length}
              </span>
            </button>

          </div>
        </section>

        {/* ======================================================== */}
        {/* ACTIVE SLOT PAGE RENDER (Step Wizard) */}
        {/* ======================================================== */}

        {/* 1. MORNING SLOT PAGE */}
        {(activeSlotStep === 'morning' || activeSlotStep === 'all') && (
          <section id="morning-planner" className="space-y-4 animate-fadeIn scroll-mt-20">
            <MorningSlotPlanner
              currentDay={currentDay}
              dailyTasks={currentDailyTasks}
              onUpdateTasks={handleUpdateCurrentDayTasks}
              onShiftTaskToNextDay={handleShiftTaskToNextDay}
              onShiftAllIncompleteToNextDay={handleShiftAllIncompleteToNextDay}
              targetSettings={targetSettings}
            />

            {/* Bottom Next Step Bar (when in step mode) */}
            {activeSlotStep === 'morning' && (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                  সকালের সেশন শেষ করে দুপুরের অনুশীলনে এগিয়ে যান:
                </span>
                <button
                  onClick={() => {
                    setActiveSlotStep('afternoon');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold font-bengali flex items-center gap-2 shadow-sm shadow-sky-500/20 transition-all active:scale-95"
                >
                  <span>দুপুরের সেশনে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* 2. AFTERNOON SLOT PAGE */}
        {(activeSlotStep === 'afternoon' || activeSlotStep === 'all') && (
          <section id="afternoon-slot" className="space-y-4 animate-fadeIn scroll-mt-20">
            <AfternoonSlotPractice
              currentDay={currentDay}
              dailyTasks={currentDailyTasks}
              onUpdateTasks={handleUpdateCurrentDayTasks}
              onShiftTaskToNextDay={handleShiftTaskToNextDay}
              onShiftAllIncompleteToNextDay={handleShiftAllIncompleteToNextDay}
              targetSettings={targetSettings}
            />

            {/* Bottom Prev & Next Step Bar (when in step mode) */}
            {activeSlotStep === 'afternoon' && (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => {
                    setActiveSlotStep('morning');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all"
                >
                  <span>⬅ সকালের স্লট</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSlotStep('practice');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold font-bengali flex items-center gap-2 shadow-sm shadow-teal-600/20 transition-all active:scale-95"
                >
                  <span>প্র্যাকটিস ট্র্যাকে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* 3. PRACTICE TRACK SLOT PAGE */}
        {(activeSlotStep === 'practice' || activeSlotStep === 'all') && (
          <section id="practice-slots" className="space-y-4 animate-fadeIn scroll-mt-20">
            <PracticeTrackSlot
              currentDay={currentDay}
              dailyTasks={currentDailyTasks}
              onUpdateTasks={handleUpdateCurrentDayTasks}
              onShiftTaskToNextDay={handleShiftTaskToNextDay}
              onShiftAllIncompleteToNextDay={handleShiftAllIncompleteToNextDay}
              targetSettings={targetSettings}
            />

            {/* Bottom Prev & Next Step Bar (when in step mode) */}
            {activeSlotStep === 'practice' && (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => {
                    setActiveSlotStep('afternoon');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all"
                >
                  <span>⬅ দুপুরের স্লট</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSlotStep('night');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-bengali flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
                >
                  <span>রাতের সেশনে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* 4. NIGHT SLOT PAGE */}
        {(activeSlotStep === 'night' || activeSlotStep === 'all') && (
          <section id="night-review" className="space-y-4 animate-fadeIn scroll-mt-20">
            <NightSlotReview
              currentDay={currentDay}
              dailyTasks={currentDailyTasks}
              onUpdateTasks={handleUpdateCurrentDayTasks}
              onShiftTaskToNextDay={handleShiftTaskToNextDay}
              onShiftAllIncompleteToNextDay={handleShiftAllIncompleteToNextDay}
              targetSettings={targetSettings}
              streak={streak}
              onIncrementStreak={handleIncrementStreak}
            />

            {/* Bottom Prev Step Bar (when in step mode) */}
            {activeSlotStep === 'night' && (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => {
                    setActiveSlotStep('practice');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all"
                >
                  <span>⬅ প্র্যাকটিস ট্র্যাক</span>
                </button>

                <span className="text-xs text-slate-400 dark:text-slate-500 font-bengali">
                  ✓ রাতের রিভিউ ও ডে লক সম্পন্ন হলে দিনের প্রস্তুতি সমাপ্ত হবে
                </span>
              </div>
            )}
          </section>
        )}

      </main>

      {/* Cambridge Master Book Tracker Modal */}
      <CambridgeMasterTracker
        isOpen={isCambridgeTrackerOpen}
        onClose={() => setIsCambridgeTrackerOpen(false)}
      />

      {/* Mistake Log Diary Modal */}
      <MistakeLogDiary
        isOpen={isMistakeDiaryOpen}
        onClose={() => setIsMistakeDiaryOpen(false)}
        tasksByDay={tasksByDay}
        currentDay={currentDay}
      />

      {/* IELTS Smart Vocab Bank & Flashcard Vault Modal */}
      <IeltsVocabVault
        isOpen={isVocabVaultOpen}
        onClose={() => setIsVocabVaultOpen(false)}
      />

      {/* Target Setup Modal */}
      <TargetSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        targetSettings={targetSettings}
        onSave={handleSaveTargetSettings}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400 font-bengali bg-white dark:bg-slate-900 transition-colors">
        IELTS Routine Master • Light & Dark Mode Supported • LocalStorage Enabled
      </footer>
    </div>
  );
}
