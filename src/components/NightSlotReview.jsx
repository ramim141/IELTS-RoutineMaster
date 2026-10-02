import React, { useState } from 'react';
import { 
  Moon, 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Check, 
  Wand2, 
  FastForward, 
  X, 
  CheckCircle, 
  Search,
  Calculator,
  Flame,
  Award,
  Lock,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import TaskAccordionItem from './TaskAccordionItem';
import { GRANULAR_IELTS_PRESETS } from '../data/granularPresets';

// Band score conversion tables
const convertRawToBandListening = (raw) => {
  const r = parseInt(raw, 10);
  if (isNaN(r) || r <= 0) return 0;
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 32) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 26) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 18) return 5.5;
  if (r >= 16) return 5.0;
  return 4.5;
};

const convertRawToBandReadingAcademic = (raw) => {
  const r = parseInt(raw, 10);
  if (isNaN(r) || r <= 0) return 0;
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 33) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 27) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 19) return 5.5;
  if (r >= 15) return 5.0;
  return 4.5;
};

export default function NightSlotReview({ 
  currentDay, 
  dailyTasks = [], 
  onUpdateTasks, 
  onShiftTaskToNextDay,
  onShiftAllIncompleteToNextDay,
  targetSettings,
  streak = 1,
  onIncrementStreak
}) {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activePresetTab, setActivePresetTab] = useState('All');
  const [presetSearch, setPresetSearch] = useState('');
  const [notification, setNotification] = useState(null);

  // Custom task form state
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customModule, setCustomModule] = useState('Writing');
  const [customTime, setCustomTime] = useState(35);
  const [customPriority, setCustomPriority] = useState('high');

  // Band Calculator state
  const [rawListening, setRawListening] = useState('');
  const [rawReading, setRawReading] = useState('');
  const [writingBand, setWritingBand] = useState('7.0');
  const [speakingBand, setSpeakingBand] = useState('7.0');

  // Filter tasks belonging specifically to the NIGHT slot
  const nightTasks = dailyTasks.filter(t => t.targetSlot === 'night');
  const completedNightCount = nightTasks.filter(t => t.completed).length;
  const incompleteNightCount = nightTasks.length - completedNightCount;
  const nightPlannedMinutes = nightTasks.reduce((acc, t) => acc + (parseInt(t.estimatedTime, 10) || 0), 0);
  const nightPlannedHours = (nightPlannedMinutes / 60).toFixed(1);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle Task Completion
  const handleToggleComplete = (taskId) => {
    const updated = dailyTasks.map(t => {
      if (t.id === taskId) {
        const isNowComplete = !t.completed;
        return {
          ...t,
          completed: isNowComplete,
          completedAt: isNowComplete ? new Date().toISOString() : null
        };
      }
      return t;
    });

    onUpdateTasks(updated);

    const target = updated.find(t => t.id === taskId);
    if (target && target.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast('🎉 রাতের টাস্ক সম্পন্ন হয়েছে!');
    }
  };

  // Update task extra notes (Topic, Mistake Log, Vocabulary)
  const handleUpdateTaskDetails = (taskId, newFields) => {
    const updated = dailyTasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          ...newFields
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    showToast('💾 অ্যানালাইসিস নোট সেভ হয়েছে!');
  };

  // Add a task from presets to night slot
  const handleAddPreset = (presetTask, moduleName) => {
    const isAlreadyAdded = nightTasks.some(t => t.presetId === presetTask.id);
    if (isAlreadyAdded) return;

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      presetId: presetTask.id,
      module: moduleName,
      title: presetTask.title,
      desc: presetTask.desc,
      estimatedTime: presetTask.defaultTime,
      targetSlot: 'night',
      priority: presetTask.priority,
      completed: false,
      day: currentDay
    };

    onUpdateTasks([...dailyTasks, newTask]);
    showToast(`✅ রাতের স্লটে যোগ হয়েছে!`);
  };

  // Add custom micro-task
  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      presetId: null,
      module: customModule,
      title: customTitle.trim(),
      desc: customDesc.trim() || 'রাতের সেশনের নির্ধারিত টাস্ক',
      estimatedTime: parseInt(customTime, 10) || 35,
      targetSlot: 'night',
      priority: customPriority,
      completed: false,
      day: currentDay
    };

    onUpdateTasks([...dailyTasks, newTask]);
    setCustomTitle('');
    setCustomDesc('');
    setIsCustomModalOpen(false);
    showToast('✅ নতুন টাস্ক যোগ হয়েছে!');
  };

  // Remove a task
  const handleRemoveTask = (taskId) => {
    onUpdateTasks(dailyTasks.filter(t => t.id !== taskId));
  };

  // Auto-suggest night session routine
  const handleAutoSuggestNight = () => {
    const existingOtherSlotTasks = dailyTasks.filter(t => t.targetSlot !== 'night');
    
    const suggestedNight = [
      {
        id: 'task_nit_1_' + Date.now(),
        module: 'Writing',
        title: 'Writing Task 2: Cause/Effect 10 Topic Introductions & Thesis',
        desc: 'প্রম্পট প্যারাফ্রেজিং + স্ট্রং কারণ ও প্রভাবের থিসিস স্টেটমেন্ট লেখার ড্রিল',
        estimatedTime: 30,
        targetSlot: 'night',
        priority: 'high',
        completed: false,
        day: currentDay
      },
      {
        id: 'task_nit_2_' + Date.now(),
        module: 'Speaking',
        title: 'Speaking Part 3: Abstract Discussion & Society Issues Reasoning',
        desc: 'In-depth মতামত, Pros/Cons ও ভবিষ্যৎ প্রেডিকশন প্রকাশ করার ড্রিল',
        estimatedTime: 25,
        targetSlot: 'night',
        priority: 'high',
        completed: false,
        day: currentDay
      }
    ];

    onUpdateTasks([...existingOtherSlotTasks, ...suggestedNight]);
    showToast('✨ রাতের ফ্রেশ রুটিন সাজানো হয়েছে!');
  };

  // Calculate overall IELTS Band Score
  const lBand = convertRawToBandListening(rawListening) || 0;
  const rBand = convertRawToBandReadingAcademic(rawReading) || 0;
  const wBand = parseFloat(writingBand) || 0;
  const sBand = parseFloat(speakingBand) || 0;

  const activeModulesCount = [lBand > 0, rBand > 0, wBand > 0, sBand > 0].filter(Boolean).length;
  const rawAverage = activeModulesCount > 0 ? (lBand + rBand + wBand + sBand) / 4 : 0;
  
  // Official IELTS Rounding Rules (.25 -> .5, .75 -> 1.0)
  const calculateOfficialIELTSOverall = (avg) => {
    if (avg <= 0) return 0;
    const decimal = avg - Math.floor(avg);
    if (decimal < 0.25) return Math.floor(avg);
    if (decimal < 0.75) return Math.floor(avg) + 0.5;
    return Math.ceil(avg);
  };

  const overallCalculatedBand = calculateOfficialIELTSOverall(rawAverage);

  // Lock Day & Increment Streak
  const handleLockDay = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
    if (onIncrementStreak) onIncrementStreak();
    showToast(`🏆 Day ${currentDay} সফলভাবে লক হয়েছে! স্ট্রিক বেড়ে ${streak + 1} দিন হলো! 🔥`);
  };

  const getModuleBadgeColor = (mod) => {
    switch (mod) {
      case 'Listening': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Reading': return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800';
      case 'Writing': return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Speaking': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default: return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] overflow-hidden transition-all relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 right-6 z-30 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold font-bengali shadow-xl flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/20 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/25 shrink-0">
            <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-bengali text-slate-900 dark:text-slate-100">
                ৪. রাতের স্লট (Night Slot)
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono">
                Night
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">
              রাতের টাস্ক, মক ব্যান্ড ক্যালকুলেশন ও স্ট্রিক বাড়িয়ে ডে ফাইনাল লক
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAutoSuggestNight}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap border border-transparent dark:border-slate-700"
            title="রাতের জন্য সাজানো রুটিন নিন"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>রুটিন সাজান</span>
          </button>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap border border-transparent dark:border-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>কাস্টম টাস্ক</span>
          </button>

          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold font-bengali flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>প্রিসেট লাইব্রেরি</span>
          </button>
        </div>
      </div>

      {/* 2. Night Completion Status Bar */}
      <div className="px-6 py-3.5 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              রাতের অগ্রগতি:
            </span>
            <span className="text-xs font-extrabold font-mono text-indigo-800 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-900/50 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
              {completedNightCount} / {nightTasks.length} সম্পন্ন
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-bengali">
            রাতের মোট সময়: <strong className="text-slate-900 dark:text-slate-200 font-mono font-bold">{nightPlannedMinutes} মিনিট</strong> ({nightPlannedHours}h)
          </div>
        </div>

        {/* Shift remaining night tasks to next day */}
        {incompleteNightCount > 0 && nightTasks.length > 0 && (
          <button
            onClick={() => onShiftAllIncompleteToNextDay()}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 self-start sm:self-auto"
            title="রাতের বাকি কাজ পরের দিনে নিয়ে যান"
          >
            <FastForward className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>বাকি {incompleteNightCount}টি কাজ Day {currentDay + 1} এ শিফট করুন</span>
          </button>
        )}
      </div>

      {/* 3. Night Task List with Accordion */}
      <div className="p-6 space-y-6">
        {nightTasks.length === 0 ? (
          <div className="text-center py-10 px-4 border-2 border-dashed border-indigo-200/80 dark:border-indigo-900/50 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-bengali">
              রাতের স্লটে এখনো কোনো টাস্ক যোগ করা হয়নি!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-bengali">
              রাতে রিভিউ ও পড়ার জন্য <strong>রাতের প্রিসেট লাইব্রেরি</strong> অথবা <strong>রাতের রুটিন সাজান</strong> বাটনে ক্লিক করুন।
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-bengali flex items-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                রাতের টাস্ক সিলেক্ট করুন
              </button>
              <button
                onClick={handleAutoSuggestNight}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                কুইক রাতের রুটিন
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-bold px-1 uppercase font-bengali">
              <span>রাতের সেশনের টাস্ক তালিকা ({nightTasks.length})</span>
              <span>সময় ও বিস্তারিত নোট</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {nightTasks.map((task) => (
                <TaskAccordionItem
                  key={task.id}
                  task={task}
                  currentDay={currentDay}
                  onToggleComplete={handleToggleComplete}
                  onShiftToNextDay={onShiftTaskToNextDay}
                  onDelete={handleRemoveTask}
                  onUpdateTaskDetails={handleUpdateTaskDetails}
                  slotColor="indigo"
                />
              ))}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bengali flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                রাতের স্লটে আরো টাস্ক যুক্ত করুন
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EXTRA NIGHT TOOL: Official IELTS Band Score Calculator */}
        {/* ======================================================== */}
        <div className="p-6 rounded-3xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold font-bengali text-slate-900 dark:text-slate-100">
                  IELTS Band Score Calculator (আজকের মক টেস্ট স্কোর)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali">
                  ৪০ এ প্রাপ্ত সঠিক মার্কস লিখুন; স্বয়ংক্রিয়ভাবে অফিসিয়াল ব্যান্ড স্কোর হিসাব হবে
                </p>
              </div>
            </div>

            {/* Calculated Overall Band Badge */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 px-3.5 py-1.5 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-bengali">Overall Score:</span>
              <span className="text-sm font-black text-indigo-700 dark:text-indigo-400 font-mono">
                Band {overallCalculatedBand > 0 ? overallCalculatedBand : targetSettings.targetBand}
              </span>
            </div>
          </div>

          {/* 4 Modules Input Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Listening */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-700 dark:text-amber-400 font-bengali">Listening (৪০ এ)</label>
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {lBand > 0 ? `Band ${lBand}` : '-'}
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="40"
                placeholder="যেমন: 34"
                value={rawListening}
                onChange={(e) => setRawListening(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">32-34 = Band 7.5</span>
            </div>

            {/* 2. Reading */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-700 dark:text-sky-400 font-bengali">Reading (৪০ এ)</label>
                <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 font-mono">
                  {rBand > 0 ? `Band ${rBand}` : '-'}
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="40"
                placeholder="যেমন: 33"
                value={rawReading}
                onChange={(e) => setRawReading(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">33-34 = Band 7.5</span>
            </div>

            {/* 3. Writing */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-700 dark:text-purple-400 font-bengali">Writing Band</label>
                <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 font-mono">Band {writingBand}</span>
              </div>
              <select
                value={writingBand}
                onChange={(e) => setWritingBand(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(s => (
                  <option key={s} value={s}>Band {s}</option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bengali">Task 1 + Task 2</span>
            </div>

            {/* 4. Speaking */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-bengali">Speaking Band</label>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">Band {speakingBand}</span>
              </div>
              <select
                value={speakingBand}
                onChange={(e) => setSpeakingBand(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(s => (
                  <option key={s} value={s}>Band {s}</option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bengali">Part 1, 2, 3 Mock</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FINAL DAY LOCK & CELEBRATION BAR */}
        {/* ======================================================== */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-800 dark:via-indigo-950 dark:to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-indigo-900/50">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Flame className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <h4 className="text-base font-extrabold font-bengali text-white">
                Day {currentDay} এর প্রস্তুতি সম্পন্ন হয়েছে?
              </h4>
              <p className="text-xs text-indigo-200 font-bengali">
                আজকের দিনের সমস্ত পড়া ও ভুল বিশ্লেষণ শেষ করে স্ট্রিক লক করুন
              </p>
            </div>
          </div>

          <button
            onClick={handleLockDay}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs font-bengali shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <Lock className="w-4 h-4" />
            <span>Day {currentDay} সম্পন্ন ও লক করুন (🔥 Streak +1)</span>
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. PRESET MODAL WITH INSTANT SEARCH */}
      {/* ======================================================== */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shadow-xs">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold font-bengali text-slate-900 dark:text-slate-100">
                    IELTS মাইক্রো-টাস্ক প্রিসেট লাইব্রেরি (রাত)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                    ৫০টিরও বেশি নির্দিষ্ট সেকশন ও টপিক থেকে ১-ক্লিকে রাতের রুটিনে নিন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar & Filter Tabs */}
            <div className="py-3 space-y-2.5 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="টাস্ক সার্চ করুন (যেমন: Cause/Effect, Intro, PEEL, Grammar, Speaking Part 3, Collocations)..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'Listening', 'Reading', 'Writing', 'Speaking', 'Vocabulary & Grammar'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePresetTab(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activePresetTab === tab
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Grid */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {GRANULAR_IELTS_PRESETS
                .filter(group => activePresetTab === 'All' || group.module === activePresetTab)
                .map((group) => {
                  const filteredTasks = group.tasks.filter(t => 
                    !presetSearch || 
                    t.title.toLowerCase().includes(presetSearch.toLowerCase()) || 
                    t.desc.toLowerCase().includes(presetSearch.toLowerCase())
                  );

                  if (filteredTasks.length === 0) return null;

                  return (
                    <div key={group.module} className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bengali flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        {group.module} ড্রিল ({filteredTasks.length})
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredTasks.map((preset) => {
                          const isAdded = nightTasks.some(t => t.presetId === preset.id);

                          return (
                            <div
                              key={preset.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                isAdded
                                  ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 shadow-xs'
                                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${getModuleBadgeColor(group.module)}`}>
                                    {group.module}
                                  </span>
                                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{preset.defaultTime} min</span>
                                  </div>
                                </div>

                                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-bengali leading-snug">
                                  {preset.title}
                                </h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali leading-relaxed">
                                  {preset.desc}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end">
                                <button
                                  onClick={() => handleAddPreset(preset, group.module)}
                                  disabled={isAdded}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-bengali flex items-center gap-1.5 transition-all ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white cursor-default'
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>রাতে যুক্ত আছে</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>রাতের রুটিনে নিন</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                রাতে নির্বাচিত: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{nightTasks.length}টি টাস্ক</strong>
              </span>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-bold font-bengali transition-all shadow-xs"
              >
                সম্পন্ন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CUSTOM TASK CREATOR */}
      {/* ======================================================== */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-slate-900 dark:text-slate-100">
                  রাতের কাস্টম টাস্ক তৈরি করুন
                </h3>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomTask} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block font-bengali">
                  মডিউল বাছাই করুন
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Listening', 'Reading', 'Writing', 'Speaking'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setCustomModule(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        customModule === m
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-800 dark:text-indigo-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block font-bengali">
                  টাস্কের নাম (Micro-task)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Writing Task 2 Cause/Effect 10 Intro + AI Feedback"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block font-bengali">
                  বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Cambridge 18 Test 2 Essay"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block font-bengali">
                  সময় (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  step="5"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bengali"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold font-bengali shadow-md shadow-indigo-600/20"
                >
                  রাতের স্লটে যোগ করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
