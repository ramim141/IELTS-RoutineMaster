import React, { useState } from 'react';
import { 
  Sun, 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Check, 
  Wand2, 
  FastForward, 
  X, 
  CheckCircle, 
  Search 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import TaskAccordionItem from './TaskAccordionItem';
import { GRANULAR_IELTS_PRESETS } from '../data/granularPresets';

export default function MorningSlotPlanner({ 
  currentDay, 
  dailyTasks = [], 
  onUpdateTasks, 
  onShiftTaskToNextDay,
  onShiftAllIncompleteToNextDay,
  targetSettings 
}) {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activePresetTab, setActivePresetTab] = useState('All');
  const [presetSearch, setPresetSearch] = useState('');
  const [notification, setNotification] = useState(null);

  // Custom task form state
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customModule, setCustomModule] = useState('Listening');
  const [customTime, setCustomTime] = useState(25);
  const [customPriority, setCustomPriority] = useState('high');

  // Filter tasks belonging specifically to the MORNING slot
  const morningTasks = dailyTasks.filter(t => t.targetSlot === 'morning');
  const completedMorningCount = morningTasks.filter(t => t.completed).length;
  const incompleteMorningCount = morningTasks.length - completedMorningCount;
  const morningPlannedMinutes = morningTasks.reduce((acc, t) => acc + (parseInt(t.estimatedTime, 10) || 0), 0);
  const morningPlannedHours = (morningPlannedMinutes / 60).toFixed(1);

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
      showToast('🎉 সকালের টাস্ক সম্পন্ন হয়েছে!');
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

  // Add a task from presets to morning slot
  const handleAddPreset = (presetTask, moduleName) => {
    const isAlreadyAdded = morningTasks.some(t => t.presetId === presetTask.id);
    if (isAlreadyAdded) return;

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      presetId: presetTask.id,
      module: moduleName,
      title: presetTask.title,
      desc: presetTask.desc,
      estimatedTime: presetTask.defaultTime,
      targetSlot: 'morning',
      priority: presetTask.priority,
      completed: false,
      day: currentDay
    };

    onUpdateTasks([...dailyTasks, newTask]);
    showToast(`✅ সকালের স্লটে যোগ হয়েছে!`);
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
      desc: customDesc.trim() || 'সকালের সেশনের নির্ধারিত টাস্ক',
      estimatedTime: parseInt(customTime, 10) || 25,
      targetSlot: 'morning',
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

  // Auto-suggest morning session routine
  const handleAutoSuggestMorning = () => {
    const existingOtherSlotTasks = dailyTasks.filter(t => t.targetSlot !== 'morning');
    
    const suggestedMorning = [
      {
        id: 'task_morn_1_' + Date.now(),
        module: 'Listening',
        title: 'Listening Section 1: Form & Table Filling (Names & Numbers)',
        desc: 'ফোন নম্বর, পোস্টকোড, তারিখ ও নামের বানান নিখুঁত করার প্র্যাকটিস',
        estimatedTime: 20,
        targetSlot: 'morning',
        priority: 'high',
        completed: false,
        day: currentDay
      },
      {
        id: 'task_morn_2_' + Date.now(),
        module: 'Vocabulary & Grammar',
        title: 'Vocabulary: 15 Band 7+ Collocations on Environment',
        desc: 'শব্দগুলো দিয়ে বাক্য তৈরি করা ও সকালের রিভিশন',
        estimatedTime: 20,
        targetSlot: 'morning',
        priority: 'medium',
        completed: false,
        day: currentDay
      }
    ];

    onUpdateTasks([...existingOtherSlotTasks, ...suggestedMorning]);
    showToast('✨ সকালের ফ্রেশ রুটিন সাজানো হয়েছে!');
  };

  const getModuleBadgeColor = (mod) => {
    switch (mod) {
      case 'Listening': return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      case 'Reading': return 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60';
      case 'Writing': return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
      case 'Speaking': return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      default: return 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 right-6 z-30 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold font-bengali shadow-xl flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/40 via-white to-orange-50/20 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/25 shrink-0">
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-bengali text-slate-900 dark:text-white">
                ১. সকালের স্লট (Morning Slot)
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-mono">
                Morning
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">
              সকালে ফ্রেশ মাথায় পড়ার টাস্ক নির্বাচন ও অ্যাকর্ডিয়ান ভুল বিশ্লেষণ নোট
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAutoSuggestMorning}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
            title="সকালের জন্য সাজানো রুটিন নিন"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>রুটিন সাজান</span>
          </button>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>কাস্টম টাস্ক</span>
          </button>

          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold font-bengali flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>প্রিসেট লাইব্রেরি</span>
          </button>
        </div>
      </div>

      {/* 2. Morning Completion Status Bar */}
      <div className="px-6 py-3.5 bg-amber-50/40 dark:bg-amber-950/20 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              সকালের অগ্রগতি:
            </span>
            <span className="text-xs font-extrabold font-mono text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
              {completedMorningCount} / {morningTasks.length} সম্পন্ন
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-bengali">
            সকালের মোট সময়: <strong className="text-slate-900 dark:text-white font-mono font-bold">{morningPlannedMinutes} মিনিট</strong> ({morningPlannedHours}h)
          </div>
        </div>

        {/* Shift remaining morning tasks to next day */}
        {incompleteMorningCount > 0 && morningTasks.length > 0 && (
          <button
            onClick={() => onShiftAllIncompleteToNextDay()}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 self-start sm:self-auto cursor-pointer"
            title="সকালের বাকি কাজ পরের দিনে নিয়ে যান"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>বাকি {incompleteMorningCount}টি কাজ Day {currentDay + 1} এ শিফট করুন</span>
          </button>
        )}
      </div>

      {/* 3. Morning Task List with Accordion */}
      <div className="p-6">
        {morningTasks.length === 0 ? (
          <div className="text-center py-10 px-4 border-2 border-dashed border-amber-200/80 dark:border-amber-800/40 rounded-2xl bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white font-bengali">
              সকালের স্লটে এখনো কোনো টাস্ক যোগ করা হয়নি!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-bengali">
              সকালে পড়ার জন্য <strong>সকালের প্রিসেট লাইব্রেরি</strong> অথবা <strong>সকালের রুটিন সাজান</strong> বাটনে ক্লিক করুন।
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-bengali flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                সকালের টাস্ক সিলেক্ট করুন
              </button>
              <button
                onClick={handleAutoSuggestMorning}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                কুইক সকালের রুটিন
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-bold px-1 uppercase font-bengali">
              <span>সকালের সেশনের টাস্ক তালিকা ({morningTasks.length})</span>
              <span>সময় ও বিস্তারিত নোট</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {morningTasks.map((task) => (
                <TaskAccordionItem
                  key={task.id}
                  task={task}
                  currentDay={currentDay}
                  onToggleComplete={handleToggleComplete}
                  onShiftToNextDay={onShiftTaskToNextDay}
                  onDelete={handleRemoveTask}
                  onUpdateTaskDetails={handleUpdateTaskDetails}
                  slotColor="amber"
                />
              ))}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bengali flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                সকালের স্লটে আরো টাস্ক যুক্ত করুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. PRESET MODAL WITH INSTANT SEARCH */}
      {/* ======================================================== */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 shadow-xs">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold font-bengali text-slate-900 dark:text-white">
                    IELTS মাইক্রো-টাস্ক প্রিসেট লাইব্রেরি (সকাল)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                    ৫০টিরও বেশি নির্দিষ্ট সেকশন ও টপিক থেকে ১-ক্লিকে সকালের রুটিনে নিন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                  placeholder="টাস্ক সার্চ করুন (যেমন: Section 1, True/False, Cause/Effect, Overview, Collocations, Cue Card)..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'Listening', 'Reading', 'Writing', 'Speaking', 'Vocabulary & Grammar'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePresetTab(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activePresetTab === tab
                        ? 'bg-amber-500 text-white shadow-xs'
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
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {group.module} ড্রিল ({filteredTasks.length})
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredTasks.map((preset) => {
                          const isAdded = morningTasks.some(t => t.presetId === preset.id);

                          return (
                            <div
                              key={preset.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                isAdded
                                  ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-xs'
                                  : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
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

                                <h5 className="text-sm font-bold text-slate-900 dark:text-white font-bengali leading-snug">
                                  {preset.title}
                                </h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali leading-relaxed">
                                  {preset.desc}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end">
                                <button
                                  onClick={() => handleAddPreset(preset, group.module)}
                                  disabled={isAdded}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-bengali flex items-center gap-1.5 transition-all cursor-pointer ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white cursor-default'
                                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>সকালে যুক্ত আছে</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>সকালের রুটিনে নিন</span>
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
                সকালে নির্বাচিত: <strong className="text-amber-600 dark:text-amber-400 font-mono">{morningTasks.length}টি টাস্ক</strong>
              </span>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold font-bengali transition-all shadow-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-slate-900 dark:text-white">
                  সকালের কাস্টম টাস্ক তৈরি করুন
                </h3>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        customModule === m
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
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
                  placeholder="যেমন: Listening Section 1 & 2 স্পেলিং ড্রিল"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block font-bengali">
                  বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Cambridge 18 Test 1"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors"
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
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bengali cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold font-bengali shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  সকালের স্লটে যোগ করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
