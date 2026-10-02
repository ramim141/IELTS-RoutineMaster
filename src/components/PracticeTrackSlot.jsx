import React, { useState } from 'react';
import { 
  Target, 
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
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import TaskAccordionItem from './TaskAccordionItem';
import { GRANULAR_IELTS_PRESETS } from '../data/granularPresets';

export default function PracticeTrackSlot({ 
  currentDay, 
  dailyTasks = [], 
  onUpdateTasks, 
  onShiftTaskToNextDay,
  onShiftAllIncompleteToNextDay,
  targetSettings 
}) {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isCambridgeModalOpen, setIsCambridgeModalOpen] = useState(false);
  const [activePresetTab, setActivePresetTab] = useState('All');
  const [presetSearch, setPresetSearch] = useState('');
  const [notification, setNotification] = useState(null);

  // Cambridge Test Quick Log State
  const [cambridgeBook, setCambridgeBook] = useState('Cambridge 18');
  const [cambridgeTest, setCambridgeTest] = useState('Test 1');
  const [cambridgeModule, setCambridgeModule] = useState('Listening');
  const [testScore, setTestScore] = useState('');
  const [testTimeTaken, setTestTimeTaken] = useState(30);

  // Custom task form state
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customModule, setCustomModule] = useState('Listening');
  const [customTime, setCustomTime] = useState(40);
  const [customPriority, setCustomPriority] = useState('high');

  // Filter tasks belonging specifically to the PRACTICE slot
  const practiceTasks = dailyTasks.filter(t => t.targetSlot === 'practice');
  const completedPracticeCount = practiceTasks.filter(t => t.completed).length;
  const incompletePracticeCount = practiceTasks.length - completedPracticeCount;
  const practicePlannedMinutes = practiceTasks.reduce((acc, t) => acc + (parseInt(t.estimatedTime, 10) || 0), 0);
  const practicePlannedHours = (practicePlannedMinutes / 60).toFixed(1);

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
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('🎉 প্র্যাকটিস টাস্ক সম্পন্ন হয়েছে!');
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
    showToast('💾 প্র্যাকটিস নোট সেভ হয়েছে!');
  };

  // Add a task from presets to practice slot
  const handleAddPreset = (presetTask, moduleName) => {
    const isAlreadyAdded = practiceTasks.some(t => t.presetId === presetTask.id);
    if (isAlreadyAdded) return;

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      presetId: presetTask.id,
      module: moduleName,
      title: presetTask.title,
      desc: presetTask.desc,
      estimatedTime: presetTask.defaultTime,
      targetSlot: 'practice',
      priority: presetTask.priority,
      completed: false,
      day: currentDay
    };

    onUpdateTasks([...dailyTasks, newTask]);
    showToast(`✅ প্র্যাকটিস ট্র্যাকে যোগ হয়েছে!`);
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
      desc: customDesc.trim() || 'প্র্যাকটিস সেশনের নির্ধারিত টেস্ট ও ড্রিল',
      estimatedTime: parseInt(customTime, 10) || 35,
      targetSlot: 'practice',
      priority: customPriority,
      completed: false,
      day: currentDay
    };

    onUpdateTasks([...dailyTasks, newTask]);
    setCustomTitle('');
    setCustomDesc('');
    setIsCustomModalOpen(false);
    showToast('✅ নতুন প্র্যাকটিস টাস্ক যোগ হয়েছে!');
  };

  // Add quick Cambridge Test practice entry
  const handleAddCambridgeTestTask = (e) => {
    e?.preventDefault();
    const title = `${cambridgeBook} - ${cambridgeTest} (${cambridgeModule} Practice)`;
    const desc = testScore ? `প্রাপ্ত স্কোর: ${testScore}/40 | নির্ধারিত সময়: ${testTimeTaken} মিনিট` : `ফুল মক টেস্ট ও মিস্টেক নোট ড্রিল`;

    const newTask = {
      id: 'task_cam_' + Date.now(),
      presetId: null,
      module: cambridgeModule,
      title: title,
      desc: desc,
      topicRef: `${cambridgeBook} > ${cambridgeTest} > ${cambridgeModule}`,
      mistakeLog: testScore ? `স্কোর: ${testScore}/40` : '',
      estimatedTime: parseInt(testTimeTaken, 10) || 40,
      targetSlot: 'practice',
      priority: 'high',
      completed: false,
      day: currentDay
    };

    onUpdateTasks([...dailyTasks, newTask]);
    setTestScore('');
    setIsCambridgeModalOpen(false);
    showToast(`🎯 ${cambridgeBook} টেস্ট প্র্যাকটিস ট্র্যাকে যোগ হয়েছে!`);
  };

  // Remove a task
  const handleRemoveTask = (taskId) => {
    onUpdateTasks(dailyTasks.filter(t => t.id !== taskId));
  };

  // Auto-suggest practice session routine
  const handleAutoSuggestPractice = () => {
    const existingOtherSlotTasks = dailyTasks.filter(t => t.targetSlot !== 'practice');
    
    const suggestedPractice = [
      {
        id: 'task_prac_1_' + Date.now(),
        module: 'Listening',
        title: 'Cambridge 18: Full Listening Test 1 (Audio 30m + Transfer 10m)',
        desc: 'হেডফোন দিয়ে অফিশিয়াল টাইমে ৪০টি প্রশ্নের উত্তর দেওয়া ও স্কোর এন্ট্রি',
        topicRef: 'Cambridge 18 > Test 1 Listening',
        estimatedTime: 40,
        targetSlot: 'practice',
        priority: 'high',
        completed: false,
        day: currentDay
      },
      {
        id: 'task_prac_2_' + Date.now(),
        module: 'Reading',
        title: 'Cambridge 18: Reading Passage 1 & 2 Timed Practice (40 min)',
        desc: 'টাইমার ধরে স্কিমিং, স্ক্যানিং এবং কি-ওয়ার্ড আন্ডারলাইন করে সলভ করা',
        topicRef: 'Cambridge 18 > Test 1 Reading Passage 1-2',
        estimatedTime: 40,
        targetSlot: 'practice',
        priority: 'high',
        completed: false,
        day: currentDay
      }
    ];

    onUpdateTasks([...existingOtherSlotTasks, ...suggestedPractice]);
    showToast('✨ প্র্যাকটিস ট্র্যাকের স্পেশাল রুটিন সাজানো হয়েছে!');
  };

  const getModuleBadgeColor = (mod) => {
    switch (mod) {
      case 'Listening': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Reading': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Writing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Speaking': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] overflow-hidden transition-all relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 right-6 z-30 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold font-bengali shadow-xl flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-50/40 via-white to-emerald-50/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/25 shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-bengali text-slate-900">
                ৩. প্র্যাকটিস ট্র্যাক (Practice Track)
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200 font-mono">
                Practice
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bengali mt-0.5">
              কেমব্রিজ টেস্ট ও মক ড্রিল ট্র্যাক করুন, স্কোর সংরক্ষণ ও ভুল বিশ্লেষণ করুন
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsCambridgeModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap"
            title="Cambridge Test Log Popup"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>Cambridge টেস্ট এন্ট্রি</span>
          </button>

          <button
            onClick={handleAutoSuggestPractice}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap"
            title="প্র্যাকটিসের জন্য সাজানো রুটিন নিন"
          >
            <Wand2 className="w-3.5 h-3.5 text-teal-600" />
            <span>রুটিন সাজান</span>
          </button>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-slate-700" />
            <span>কাস্টম টাস্ক</span>
          </button>

          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold font-bengali flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>প্রিসেট লাইব্রেরি</span>
          </button>
        </div>
      </div>

      {/* 2. Practice Completion Status Bar */}
      <div className="px-6 py-3.5 bg-teal-50/40 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 font-bengali flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              প্র্যাকটিস অগ্রগতি:
            </span>
            <span className="text-xs font-extrabold font-mono text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-lg border border-teal-200">
              {completedPracticeCount} / {practiceTasks.length} সম্পন্ন
            </span>
          </div>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <div className="text-xs text-slate-600 font-bengali">
            মোট প্র্যাকটিস সময়: <strong className="text-slate-900 font-mono font-bold">{practicePlannedMinutes} মিনিট</strong> ({practicePlannedHours}h)
          </div>
        </div>

        {/* Shift remaining practice tasks to next day */}
        {incompletePracticeCount > 0 && practiceTasks.length > 0 && (
          <button
            onClick={() => onShiftAllIncompleteToNextDay()}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs active:scale-95 self-start sm:self-auto"
            title="প্র্যাকটিসের বাকি কাজ পরের দিনে নিয়ে যান"
          >
            <FastForward className="w-3.5 h-3.5 text-teal-600" />
            <span>বাকি {incompletePracticeCount}টি প্র্যাকটিস Day {currentDay + 1} এ শিফট</span>
          </button>
        )}
      </div>

      {/* 3. Practice Task List with Accordion */}
      <div className="p-6">
        {practiceTasks.length === 0 ? (
          <div className="text-center py-10 px-4 border-2 border-dashed border-teal-200/80 rounded-2xl bg-teal-50/20 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-bengali">
              প্র্যাকটিস ট্র্যাক স্লটে এখনো কোনো টেস্ট বা ড্রিল যোগ করা হয়নি!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-bengali">
              কেমব্রিজ টেস্ট বা নির্দিষ্ট প্রশ্ন প্র্যাকটিস করতে উপরের <strong>Cambridge টেস্ট এন্ট্রি</strong> অথবা <strong>প্রিসেট লাইব্রেরি</strong> ব্যবহার করুন।
            </p>
            <div className="flex justify-center flex-wrap gap-3 pt-2">
              <button
                onClick={() => setIsCambridgeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold font-bengali flex items-center gap-2 shadow-sm transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Cambridge টেস্ট যোগ করুন
              </button>
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold font-bengali flex items-center gap-2 shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                প্র্যাকটিস প্রিসেট
              </button>
              <button
                onClick={handleAutoSuggestPractice}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold font-bengali flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-teal-600" />
                কুইক প্র্যাকটিস রুটিন
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1 uppercase font-bengali">
              <span>প্র্যাকটিস ট্র্যাকের টাস্ক তালিকা ({practiceTasks.length})</span>
              <span>সময় ও বিস্তারিত নোট</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {practiceTasks.map((task) => (
                <TaskAccordionItem
                  key={task.id}
                  task={task}
                  currentDay={currentDay}
                  onToggleComplete={handleToggleComplete}
                  onShiftToNextDay={onShiftTaskToNextDay}
                  onDelete={handleRemoveTask}
                  onUpdateTaskDetails={handleUpdateTaskDetails}
                  slotColor="teal"
                />
              ))}
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setIsCambridgeModalOpen(true)}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 font-bengali flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-teal-50 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Cambridge টেস্ট যোগ করুন
              </button>
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="text-xs font-bold text-teal-600 hover:text-teal-800 font-bengali flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-teal-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                আরো প্রিসেট ড্রিল নিন
              </button>
            </div>
          </div>
        )}
      </div>



      {/* ======================================================== */}
      {/* 5. PRESET MODAL WITH INSTANT SEARCH */}
      {/* ======================================================== */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 shadow-xs">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold font-bengali text-slate-900">
                    IELTS মাইক্রো-টাস্ক প্রিসেট লাইব্রেরি (প্র্যাকটিস ট্র্যাক)
                  </h3>
                  <p className="text-xs text-slate-500 font-bengali">
                    ৫০টিরও বেশি নির্দিষ্ট সেকশন ও টেস্ট ড্রিল থেকে ১-ক্লিকে প্র্যাকটিস ট্র্যাকে নিন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar & Filter Tabs */}
            <div className="py-3 space-y-2.5 shrink-0 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="টাস্ক সার্চ করুন (যেমন: Section 1-4, True/False, Headings, Passage, Overview, Cue Card)..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white font-bengali transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'Listening', 'Reading', 'Writing', 'Speaking', 'Vocabulary & Grammar'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePresetTab(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activePresetTab === tab
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
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
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-bengali flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-600" />
                        {group.module} ড্রিল ({filteredTasks.length})
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredTasks.map((preset) => {
                          const isAdded = practiceTasks.some(t => t.presetId === preset.id);

                          return (
                            <div
                              key={preset.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                isAdded
                                  ? 'bg-teal-50/50 border-teal-300 shadow-xs'
                                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${getModuleBadgeColor(group.module)}`}>
                                    {group.module}
                                  </span>
                                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono font-bold">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{preset.defaultTime} min</span>
                                  </div>
                                </div>

                                <h5 className="text-sm font-bold text-slate-900 font-bengali leading-snug">
                                  {preset.title}
                                </h5>
                                <p className="text-xs text-slate-500 font-bengali leading-relaxed">
                                  {preset.desc}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                                <button
                                  onClick={() => handleAddPreset(preset, group.module)}
                                  disabled={isAdded}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-bengali flex items-center gap-1.5 transition-all ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white cursor-default'
                                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs active:scale-95'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>প্র্যাকটিসে যুক্ত আছে</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>প্র্যাকটিসে নিন</span>
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

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-bengali">
                প্র্যাকটিসে নির্বাচিত: <strong className="text-teal-600 font-mono">{practiceTasks.length}টি টাস্ক</strong>
              </span>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-bengali transition-all shadow-xs"
              >
                সম্পন্ন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CAMBRIDGE TEST QUICK LOGGER MODAL */}
      {/* ======================================================== */}
      {isCambridgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-bengali text-slate-900">
                    Cambridge Test Quick Logger
                  </h3>
                  <p className="text-xs text-slate-500 font-bengali">
                    কেমব্রিজ টেস্ট নম্বর ও স্কোর দিয়ে ১-ক্লিকে প্র্যাকটিস ট্র্যাকে এন্ট্রি করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCambridgeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCambridgeTestTask} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Book */}
                <div>
                  <label className="text-xs font-bold text-slate-700 font-bengali block mb-1.5">
                    কেমব্রিজ বুক
                  </label>
                  <select
                    value={cambridgeBook}
                    onChange={(e) => setCambridgeBook(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white font-mono shadow-xs transition-colors"
                  >
                    {[
                      'Cambridge 19', 
                      'Cambridge 18', 
                      'Cambridge 17', 
                      'Cambridge 16', 
                      'Cambridge 15', 
                      'Cambridge 14', 
                      'Cambridge 13', 
                      'Cambridge 12',
                      'Cambridge 11',
                      'Cambridge 10'
                    ].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Test */}
                <div>
                  <label className="text-xs font-bold text-slate-700 font-bengali block mb-1.5">
                    টেস্ট নম্বর
                  </label>
                  <select
                    value={cambridgeTest}
                    onChange={(e) => setCambridgeTest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white font-mono shadow-xs transition-colors"
                  >
                    {['Test 1', 'Test 2', 'Test 3', 'Test 4'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Module selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 font-bengali block mb-1.5">
                  মডিউল বাছাই করুন
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Listening', 'Reading', 'Writing', 'Speaking'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setCambridgeModule(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        cambridgeModule === m
                          ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Score */}
                <div>
                  <label className="text-xs font-bold text-slate-700 font-bengali block mb-1.5">
                    প্রাপ্ত স্কোর (৪০ এ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    placeholder="যেমন: 34"
                    value={testScore}
                    onChange={(e) => setTestScore(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white font-mono shadow-xs transition-colors"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-bold text-slate-700 font-bengali block mb-1.5">
                    নির্ধারিত সময় (মিনিট)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    step="5"
                    value={testTimeTaken}
                    onChange={(e) => setTestTimeTaken(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white font-mono shadow-xs transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCambridgeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 font-bengali"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold font-bengali shadow-md shadow-teal-600/20 active:scale-95"
                >
                  🎯 প্র্যাকটিস ট্র্যাকে যোগ করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. CUSTOM TASK CREATOR */}
      {/* ======================================================== */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-slate-900">
                  কাস্টম প্র্যাকটিস টাস্ক তৈরি করুন
                </h3>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomTask} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block font-bengali">
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
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block font-bengali">
                  টাস্কের নাম (Micro-task / Practice)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Cambridge 18 Test 2 Reading Passage 3"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-bengali transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block font-bengali">
                  বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 20 মিনিটের মধ্যে সমাধান ও ভুল অ্যানালাইসিস"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-bengali transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block font-bengali">
                  সময় (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  step="5"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 font-bengali"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold font-bengali shadow-md shadow-teal-600/20"
                >
                  প্র্যাকটিস ট্র্যাকে যোগ করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
