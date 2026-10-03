import React, { useState, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Headphones, 
  BookText, 
  PenTool, 
  Mic2, 
  TrendingUp, 
  Award, 
  Filter, 
  Search, 
  Calendar, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  ArrowUpRight,
  ChevronRight,
  Flame,
  Zap,
  Layers,
  Brain,
  ArrowLeft
} from 'lucide-react';

export default function ModuleMasteryAnalyticsModal({
  isOpen = true,
  onClose,
  isPageView = false,
  onBack,
  tasksByDay = {},
  targetSettings = {},
  currentDay = 1,
  streak = 1
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'modules' | 'history'
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('All');
  const [selectedDayFilter, setSelectedDayFilter] = useState('All');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'duration'
  const [copied, setCopied] = useState(false);

  // Load Cambridge test tracker data from localStorage
  const cambridgeData = useMemo(() => {
    try {
      const saved = localStorage.getItem('ielts_cambridge_master_tracker');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }, [isOpen]);

  // Load Mastered Vocab count from localStorage
  const vocabMasteredCount = useMemo(() => {
    try {
      const saved = localStorage.getItem('ielts_vocab_mastered_ids');
      return saved ? JSON.parse(saved).length : 0;
    } catch (e) {
      return 0;
    }
  }, [isOpen]);

  // Aggregate all tasks across all days
  const { allTasks, completedTasks, moduleStats, totalStudyMinutes } = useMemo(() => {
    const all = [];
    const completed = [];
    let totalMinutes = 0;

    const stats = {
      Listening: { total: 0, completed: 0, minutes: 0, cambridgeCount: 0, avgBand: null },
      Reading: { total: 0, completed: 0, minutes: 0, cambridgeCount: 0, avgBand: null },
      Writing: { total: 0, completed: 0, minutes: 0, cambridgeCount: 0, avgBand: null },
      Speaking: { total: 0, completed: 0, minutes: 0, cambridgeCount: 0, avgBand: null },
      General: { total: 0, completed: 0, minutes: 0 }
    };

    Object.entries(tasksByDay).forEach(([dayKey, dayTasks]) => {
      if (Array.isArray(dayTasks)) {
        dayTasks.forEach(task => {
          const mod = task.module || 'General';
          const validMod = stats[mod] ? mod : 'General';
          const time = parseInt(task.estimatedTime, 10) || 0;

          const taskWithDay = {
            ...task,
            day: task.day || parseInt(dayKey, 10) || 1
          };

          all.push(taskWithDay);
          stats[validMod].total += 1;

          if (task.completed) {
            completed.push(taskWithDay);
            stats[validMod].completed += 1;
            stats[validMod].minutes += time;
            totalMinutes += time;
          }
        });
      }
    });

    // Compute Cambridge test metrics per module
    if (cambridgeData && typeof cambridgeData === 'object') {
      const scores = { Listening: [], Reading: [], Writing: [], Speaking: [] };
      const sectionSums = {
        Listening: { s1: [], s2: [], s3: [], s4: [] },
        Reading: { s1: [], s2: [], s3: [] },
        Writing: { s1: [], s2: [] },
        Speaking: { s1: [], s2: [], s3: [] }
      };

      Object.entries(cambridgeData).forEach(([key, entry]) => {
        if (!entry || !entry.done) return;
        const parts = key.split('_');
        const mod = entry.module || parts[2];
        if (!scores[mod]) return;

        // Band / raw score
        if (entry.calculatedBand) {
          const b = parseFloat(entry.calculatedBand);
          if (!isNaN(b)) scores[mod].push(b);
        } else if (entry.score) {
          const match = String(entry.score).match(/(\d+(\.\d+)?)/);
          if (match) {
            const raw = parseFloat(match[1]);
            const bandVal = (mod === 'Listening' || mod === 'Reading') && raw > 9
              ? (raw >= 39 ? 9.0 : raw >= 37 ? 8.5 : raw >= 35 ? 8.0 : raw >= 32 ? 7.5 : raw >= 30 ? 7.0 : raw >= 26 ? 6.5 : raw >= 23 ? 6.0 : 5.5)
              : raw;
            scores[mod].push(bandVal);
          }
        }

        // Section breakdown
        if (entry.sections && typeof entry.sections === 'object') {
          Object.entries(entry.sections).forEach(([secK, secV]) => {
            const num = parseFloat(secV);
            if (!isNaN(num) && sectionSums[mod]?.[secK]) {
              sectionSums[mod][secK].push(num);
            }
          });
        }
      });

      ['Listening', 'Reading', 'Writing', 'Speaking'].forEach(mod => {
        const modScores = scores[mod];
        stats[mod].cambridgeCount = modScores.length;
        if (modScores.length > 0) {
          const sum = modScores.reduce((a, b) => a + b, 0);
          stats[mod].avgBand = (sum / modScores.length).toFixed(1);
        }
        stats[mod].sectionAverages = sectionSums[mod];
      });
    }

    return {
      allTasks: all,
      completedTasks: completed,
      moduleStats: stats,
      totalStudyMinutes: totalMinutes
    };
  }, [tasksByDay, cambridgeData, isOpen]);

  // Total completed hours and minutes
  const totalHours = Math.floor(totalStudyMinutes / 60);
  const remainingMins = totalStudyMinutes % 60;
  const overallTaskCompletionRate = allTasks.length > 0 
    ? Math.round((completedTasks.length / allTasks.length) * 100) 
    : 0;

  // Calculate Readiness Percentage per module
  const calculateModuleReadiness = (mod) => {
    const s = moduleStats[mod] || { completed: 0, minutes: 0, cambridgeCount: 0 };
    // Readiness factors: Completed micro-tasks (up to 40%), Study Hours (up to 40%), Cambridge Mocks (up to 20%)
    const taskScore = Math.min(40, (s.completed / 6) * 40);
    const hourScore = Math.min(40, (s.minutes / 240) * 40); // 4 hours benchmark
    const cambridgeScore = Math.min(20, (s.cambridgeCount / 2) * 20); // 2 mocks benchmark
    
    // Baseline minimum if user has completed any work
    const combined = Math.round(taskScore + hourScore + cambridgeScore);
    return Math.min(100, Math.max(0, combined));
  };

  const moduleReadiness = {
    Listening: calculateModuleReadiness('Listening'),
    Reading: calculateModuleReadiness('Reading'),
    Writing: calculateModuleReadiness('Writing'),
    Speaking: calculateModuleReadiness('Speaking')
  };

  const overallReadiness = Math.round(
    (moduleReadiness.Listening + moduleReadiness.Reading + moduleReadiness.Writing + moduleReadiness.Speaking) / 4
  );

  // Filter and Sort Completed Tasks for the Log
  const filteredCompletedTasks = useMemo(() => {
    return completedTasks
      .filter(task => {
        // Module filter
        if (selectedModuleFilter !== 'All' && task.module !== selectedModuleFilter) {
          return false;
        }
        // Day filter
        if (selectedDayFilter !== 'All' && String(task.day) !== String(selectedDayFilter)) {
          return false;
        }
        // Slot filter
        if (selectedSlotFilter !== 'All' && task.targetSlot !== selectedSlotFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (task.title || '').toLowerCase().includes(q);
          const matchDesc = (task.desc || '').toLowerCase().includes(q);
          const matchTopic = (task.topicRef || '').toLowerCase().includes(q);
          const matchMistake = (task.mistakeLog || '').toLowerCase().includes(q);
          const matchLearnings = (task.keyLearnings || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTopic && !matchMistake && !matchLearnings) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          if (a.completedAt && b.completedAt) {
            return new Date(b.completedAt) - new Date(a.completedAt);
          }
          return (b.day || 1) - (a.day || 1);
        }
        if (sortBy === 'oldest') {
          if (a.completedAt && b.completedAt) {
            return new Date(a.completedAt) - new Date(b.completedAt);
          }
          return (a.day || 1) - (b.day || 1);
        }
        if (sortBy === 'duration') {
          return (parseInt(b.estimatedTime, 10) || 0) - (parseInt(a.estimatedTime, 10) || 0);
        }
        return 0;
      });
  }, [completedTasks, selectedModuleFilter, selectedDayFilter, selectedSlotFilter, searchQuery, sortBy]);

  // Unique list of days present in tasks
  const availableDays = useMemo(() => {
    const daysSet = new Set(allTasks.map(t => t.day || 1));
    return Array.from(daysSet).sort((a, b) => a - b);
  }, [allTasks]);

  // Copy Summary to Clipboard
  const handleCopyReport = () => {
    const report = `📊 IELTS Routine Master - প্রস্তুতি ও সম্পন্ন কাজের হিসাব রিপোর্ট
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Target: Band ${targetSettings.targetBand || 7.5} (${targetSettings.examType || 'Academic'})
📅 Active Day: Day ${currentDay} of ${targetSettings.totalDays || 60}
🔥 Current Streak: ${streak} Days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 ওভারঅল প্রিপারেশন স্কোর: ${overallReadiness}%
✅ মোট সম্পন্ন টাস্ক: ${completedTasks.length} টি / ${allTasks.length} টি (${overallTaskCompletionRate}%)
⏱️ মোট স্টাডি টাইম: ${totalHours} ঘণ্টা ${remainingMins} মিনিট
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 মডিউল-ভিত্তিক প্রস্তুতি স্ট্যাটাস:
• 🎧 Listening: ${moduleReadiness.Listening}% Ready | ${moduleStats.Listening.completed} Tasks | ${Math.round(moduleStats.Listening.minutes / 60 * 10) / 10}h studied
• 📖 Reading: ${moduleReadiness.Reading}% Ready | ${moduleStats.Reading.completed} Tasks | ${Math.round(moduleStats.Reading.minutes / 60 * 10) / 10}h studied
• ✍️ Writing: ${moduleReadiness.Writing}% Ready | ${moduleStats.Writing.completed} Tasks | ${Math.round(moduleStats.Writing.minutes / 60 * 10) / 10}h studied
• 🗣️ Speaking: ${moduleReadiness.Speaking}% Ready | ${moduleStats.Speaking.completed} Tasks | ${Math.round(moduleStats.Speaking.minutes / 60 * 10) / 10}h studied
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 জেনারেট হয়েছে IELTS Routine Master অ্যাপ থেকে।`;

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const moduleDefinitions = [
    {
      id: 'Listening',
      name: 'Listening (লিসেনিং)',
      icon: Headphones,
      color: 'amber',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40',
      borderLight: 'border-amber-200/80 dark:border-amber-800/60',
      textAccent: 'text-amber-600 dark:text-amber-400',
      barColor: 'bg-amber-500',
      badge: 'Sec 1 to 4',
      skills: [
        'Section 1: Form & Table (Names/Spelling/Dates)',
        'Section 2: Maps & Direction Labeling',
        'Section 3: Academic Discussion & MCQs',
        'Section 4: Fast Lecture & Flowcharts',
        'Distractor Elimination & Accent Training'
      ]
    },
    {
      id: 'Reading',
      name: 'Reading (রিডিং)',
      icon: BookText,
      color: 'sky',
      bgLight: 'bg-sky-50 dark:bg-sky-950/40',
      borderLight: 'border-sky-200/80 dark:border-sky-800/60',
      textAccent: 'text-sky-600 dark:text-sky-400',
      barColor: 'bg-sky-500',
      badge: 'Passages 1 to 3',
      skills: [
        'True / False / Not Given & Yes/No/NG',
        'Matching Headings & Information',
        'Summary & Sentence Completion',
        'Keywords Skimming & Rapid Scanning',
        'Time Management (20 mins per passage)'
      ]
    },
    {
      id: 'Writing',
      name: 'Writing (রাইটিং)',
      icon: PenTool,
      color: 'purple',
      bgLight: 'bg-purple-50 dark:bg-purple-950/40',
      borderLight: 'border-purple-200/80 dark:border-purple-800/60',
      textAccent: 'text-purple-600 dark:text-purple-400',
      barColor: 'bg-purple-500',
      badge: 'Task 1 & Task 2',
      skills: [
        'Task 1: Overview & Trend Comparison (150 words)',
        'Task 2: Opinion / Discussion Essay (250 words)',
        'Paraphrasing & Academic Lexical Resource',
        'Cohesive Devices & Logical Flow',
        'Self-Proofreading for Grammar & Spelling'
      ]
    },
    {
      id: 'Speaking',
      name: 'Speaking (স্পিকিং)',
      icon: Mic2,
      color: 'emerald',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderLight: 'border-emerald-200/80 dark:border-emerald-800/60',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      barColor: 'bg-emerald-500',
      badge: 'Part 1, 2 & 3',
      skills: [
        'Part 1: Quick Fluency on Familiar Topics',
        'Part 2: 1-Min Note Taking & 2-Min Cue Card Speech',
        'Part 3: Abstract Analysis & Opinion Giving',
        'Natural Idiomatic Expressions & Connectors',
        'Pronunciation, Intonation & Voice Clarity'
      ]
    }
  ];

  if (!isOpen && !isPageView) return null;

  const contentMarkup = (
    <div 
      className={`relative w-full ${isPageView ? 'bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm' : 'max-w-5xl my-auto bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-h-[92vh]'} overflow-hidden flex flex-col text-slate-900 dark:text-white transition-all duration-200`}
      role="dialog"
      aria-modal="true"
    >
      {/* ========================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================= */}
      <div className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/90 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {isPageView && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer shadow-xs border border-slate-200/80 dark:border-slate-700/80 shrink-0 mr-1"
              title="রুটিনে ফিরে যান"
              aria-label="রুটিনে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black font-bengali tracking-tight text-slate-900 dark:text-white">
                মডিউল প্রস্তুতি ও সম্পন্ন কাজের হিসাব
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
              কোন পার্টে কতটুকু অগ্রগতি হয়েছে এবং বিস্তারিত সম্পন্ন টাস্কের লগ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Report Button */}
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold font-bengali transition-colors cursor-pointer"
            title="রিপোর্ট কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'কপি হয়েছে!' : 'রিপোর্ট কপি'}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold font-bengali transition-colors cursor-pointer"
            title="প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">প্রিন্ট</span>
          </button>

          {!isPageView && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

        {/* ========================================================= */}
        {/* NAVIGATION TABS */}
        {/* ========================================================= */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-bengali transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>প্রস্তুতি সামারি (Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-bengali transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>মডিউল বিশ্লেষণ (৪ পার্ট)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-bengali transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>সম্পন্ন টাস্ক হিস্ট্রি ({completedTasks.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY (SCROLLABLE) */}
        {/* ========================================================= */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW SUMMARY */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 4 High-Impact KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Overall Readiness */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-bengali text-indigo-700 dark:text-indigo-300">প্রস্তুতি রেডিনেস</span>
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-mono text-indigo-950 dark:text-indigo-100">{overallReadiness}%</span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-bengali">
                        {overallReadiness >= 80 ? 'অসাধারণ গতি' : overallReadiness >= 50 ? 'ভালো অগ্রগতি' : 'শুরু হয়েছে'}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-indigo-200/60 dark:bg-indigo-950 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${overallReadiness}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali">
                    টার্গেট Band {targetSettings.targetBand || 7.5} অর্জনের প্রস্তুতি
                  </span>
                </div>

                {/* 2. Total Completed Tasks */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-bengali text-emerald-700 dark:text-emerald-300">সম্পন্ন টাস্ক সংখ্যা</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-mono text-emerald-950 dark:text-emerald-100">{completedTasks.length}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/ {allTasks.length} টাস্ক</span>
                    </div>
                    <div className="w-full h-2 bg-emerald-200/60 dark:bg-emerald-950 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${overallTaskCompletionRate}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bengali">
                    {overallTaskCompletionRate}% কাজ সম্পন্ন হয়েছে
                  </span>
                </div>

                {/* 3. Total Study Time */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200/80 dark:border-amber-800/60 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-bengali text-amber-700 dark:text-amber-300">মোট স্টাডি টাইম</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black font-mono text-amber-950 dark:text-amber-100">{totalHours}h</span>
                      <span className="text-lg font-bold font-mono text-amber-800 dark:text-amber-300">{remainingMins}m</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali mt-1 block">
                      দৈনিক গড় লক্ষ্য: {targetSettings.dailyHoursGoal || 4} ঘণ্টা
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 dark:text-amber-400 font-bengali">
                    সফলভাবে রেকর্ডকৃত সময়
                  </span>
                </div>

                {/* 4. Streak & Vocab Balance */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-bengali text-purple-700 dark:text-purple-300">কনসিস্টেন্সি ও ভোকাব</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-mono text-purple-950 dark:text-purple-100">{streak}</span>
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-bengali">দিন একটানা স্ট্রিক</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali mt-1 block">
                      ভোকাবুলারি মাস্টার্ড: <strong className="font-mono text-purple-700 dark:text-purple-300">{vocabMasteredCount}</strong> টি শব্দ
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-700 dark:text-purple-400 font-bengali">
                    Day {currentDay} of {targetSettings.totalDays || 60}
                  </span>
                </div>

              </div>

              {/* 4 Modules Quick Progress Bars (Kun Part Koto Tuk) */}
              <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-extrabold font-bengali text-slate-900 dark:text-white flex items-center gap-2">
                      <span>মডিউল অনুযায়ী প্রস্তুতি বনাম ব্যালেন্স</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                      ৪টি পার্টেই সমান প্রস্তুতি বজায় রাখা টার্গেট ব্যান্ডের জন্য অত্যন্ত জরুরি
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('modules')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bengali cursor-pointer"
                  >
                    <span>বিস্তারিত স্কিল চেক দেখুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {moduleDefinitions.map(modDef => {
                    const stats = moduleStats[modDef.id] || { completed: 0, minutes: 0 };
                    const readiness = moduleReadiness[modDef.id];
                    const hours = (stats.minutes / 60).toFixed(1);
                    const Icon = modDef.icon;

                    return (
                      <div 
                        key={modDef.id} 
                        className={`p-4 rounded-2xl border transition-all ${modDef.bgLight} ${modDef.borderLight}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 ${modDef.textAccent} shadow-xs`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-bengali">
                                {modDef.name}
                              </h4>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                {stats.completed} Tasks Done • {hours} Hours
                              </span>
                            </div>
                          </div>
                          <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                            {readiness}%
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2.5 bg-white/70 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${modDef.barColor} rounded-full transition-all duration-500`}
                            style={{ width: `${readiness}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-600 dark:text-slate-400 font-bengali">
                          <span>Cambridge Mock: <strong className="font-mono">{stats.cambridgeCount} টি</strong></span>
                          <span>{readiness >= 75 ? '🔥 দুর্দান্ত প্রস্তুতি' : readiness >= 40 ? '⚡ রানিং প্র্যাকটিস' : '⚠️ আরও ফোকাস প্রয়োজন'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actionable Insights Box */}
              <div className="p-5 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shrink-0 shadow-md">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-bengali text-indigo-950 dark:text-indigo-200">
                      IELTS Routine Master ডায়াগনস্টিক টিপস
                    </h4>
                    <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80 font-bengali mt-0.5">
                      {moduleReadiness.Writing < 50 
                        ? 'রাইটিংয়ে টাস্ক ২ (Opinion/Discussion) এর নিয়মিত প্র্যাকটিস ও স্পেলিং চেকের ওপর জোর দিন।' 
                        : moduleReadiness.Listening < 50 
                          ? 'লিসেনিং সেকশন ২ ও ৩ এর ডিস্ট্রাক্টর এলিমিনেশন ড্রিল সম্পন্ন করুন।'
                          : 'আপনার প্রস্তুতি সঠিক ছন্দে চলছে! প্রতিদিন ক্যামব্রিজ ফুল মক ও ভুল সংশোধন ডায়েরিতে নোট রাখুন।'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-bengali shrink-0 shadow-sm transition-all cursor-pointer"
                >
                  সব সম্পন্ন কাজের তালিকা দেখুন
                </button>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: DEEP MODULE PREPARATION DRILLDOWN */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'modules' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold font-bengali text-slate-900 dark:text-white">
                    ৪টি মডিউলের বিস্তারিত পারফরম্যান্স ও স্কিল চেকলিস্ট
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                    কোন পার্টে কী কী টাস্ক সম্পন্ন হয়েছে এবং আর কী কী বাকি রয়েছে
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {moduleDefinitions.map(modDef => {
                  const stats = moduleStats[modDef.id] || { completed: 0, total: 0, minutes: 0, cambridgeCount: 0, avgBand: null };
                  const readiness = moduleReadiness[modDef.id];
                  const Icon = modDef.icon;
                  const hours = (stats.minutes / 60).toFixed(1);

                  // Filter tasks done specifically for this module
                  const completedForMod = completedTasks.filter(t => t.module === modDef.id);

                  return (
                    <div 
                      key={modDef.id}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      {/* Top Header of Card */}
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-2xl ${modDef.bgLight} ${modDef.textAccent} border ${modDef.borderLight}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold font-bengali text-slate-900 dark:text-white">
                                {modDef.name}
                              </h4>
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                {modDef.badge}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                              {readiness}%
                            </span>
                            <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-bengali">
                              প্রস্তুতি রেডিনেস
                            </span>
                          </div>
                        </div>

                        {/* Readiness Progress Meter */}
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                          <div 
                            className={`h-full ${modDef.barColor} rounded-full transition-all duration-500`}
                            style={{ width: `${readiness}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats Pills Row */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bengali block">সম্পন্ন টাস্ক</span>
                          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.completed} টি</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bengali block">স্টাডি টাইম</span>
                          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{hours}h</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bengali block">Cambridge Mock</span>
                          <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                            {stats.cambridgeCount > 0 ? `${stats.cambridgeCount} টেস্ট (${stats.avgBand ? 'Avg ' + stats.avgBand : 'Logged'})` : '০ টি'}
                          </span>
                        </div>
                      </div>

                      {/* Core Skills Checklist */}
                      <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali block">
                          মূল প্রশ্ন টাইপ ও প্র্যাকটিস কম্পোনেন্ট:
                        </span>
                        <div className="space-y-1.5">
                          {modDef.skills.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${modDef.textAccent} shrink-0`} />
                              <span className="truncate">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Completed Tasks for this Module */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-bengali block mb-1">
                          সাম্প্রতিক সম্পন্ন কাজ ({completedForMod.length} টি):
                        </span>
                        {completedForMod.length === 0 ? (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic font-bengali block">
                            এই মডিউলে এখনও কোনো টাস্ক সম্পন্ন মার্ক করা হয়নি।
                          </span>
                        ) : (
                          <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                            {completedForMod.slice(0, 3).map((t) => (
                              <div key={t.id} className="text-xs font-bengali text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                <span className="truncate">✓ {t.title}</span>
                                <span className="text-[10px] font-mono text-slate-400 shrink-0">{t.estimatedTime}m (Day {t.day})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: COMPLETED TASK HISTORY & ACCOUNTING LOG */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'history' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Filter and Search Bar Row */}
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="টাস্কের নাম, নোট বা ভুল দিয়ে খুঁজুন..."
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-bengali whitespace-nowrap">
                      সর্ট:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bengali focus:outline-hidden"
                    >
                      <option value="newest">নতুন সম্পন্ন আগে</option>
                      <option value="oldest">পুরাতন সম্পন্ন আগে</option>
                      <option value="duration">বেশি সময় সম্পন্ন আগে</option>
                    </select>
                  </div>
                </div>

                {/* Filter Pills: Module, Day, Slot */}
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 mr-2">
                    <Filter className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-bengali">ফিল্টার:</span>
                  </div>

                  {/* Module Filter Pills */}
                  {['All', 'Listening', 'Reading', 'Writing', 'Speaking'].map(mod => (
                    <button
                      key={mod}
                      onClick={() => setSelectedModuleFilter(mod)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-bengali transition-colors cursor-pointer ${
                        selectedModuleFilter === mod
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {mod === 'All' ? 'সব মডিউল' : mod}
                    </button>
                  ))}

                  {/* Slot Filter Pills */}
                  <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />
                  
                  <select
                    value={selectedSlotFilter}
                    onChange={(e) => setSelectedSlotFilter(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bengali focus:outline-hidden"
                  >
                    <option value="All">সব স্লট</option>
                    <option value="morning">সকাল (Morning)</option>
                    <option value="afternoon">দুপুর (Afternoon)</option>
                    <option value="practice">প্র্যাকটিস ট্র্যাক</option>
                    <option value="night">রাত (Night Review)</option>
                  </select>

                  {/* Day Filter */}
                  {availableDays.length > 1 && (
                    <select
                      value={selectedDayFilter}
                      onChange={(e) => setSelectedDayFilter(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-mono focus:outline-hidden"
                    >
                      <option value="All">All Days</option>
                      {availableDays.map(d => (
                        <option key={d} value={d}>Day {d}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Total Filtered Count Banner */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bengali px-1">
                <span>
                  প্রদর্শিত হচ্ছে: <strong className="text-slate-900 dark:text-white font-mono">{filteredCompletedTasks.length}</strong> টি সম্পন্ন টাস্ক
                </span>
                <span>
                  মোট সময়: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {Math.floor(filteredCompletedTasks.reduce((acc, t) => acc + (parseInt(t.estimatedTime, 10) || 0), 0) / 60)}h {filteredCompletedTasks.reduce((acc, t) => acc + (parseInt(t.estimatedTime, 10) || 0), 0) % 60}m
                  </strong>
                </span>
              </div>

              {/* Completed Task Cards Feed */}
              {filteredCompletedTasks.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold font-bengali text-slate-700 dark:text-slate-300">
                    কোনো সম্পন্ন টাস্ক পাওয়া যায়নি
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali max-w-sm mx-auto">
                    ফিল্টার পরিবর্তন করুন অথবা ডেইলি রুটিনে টাস্ক কমপ্লিট করে টিক দিন। সম্পন্ন কাজের হিসাব এখানে স্বয়ংক্রিয়ভাবে জমা হবে।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCompletedTasks.map((task) => {
                    const hasNotes = Boolean(task.topicRef || task.mistakeLog || task.keyLearnings);
                    const completedDateStr = task.completedAt 
                      ? new Date(task.completedAt).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : `Day ${task.day || 1}`;

                    return (
                      <div 
                        key={task.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="p-1 rounded-md bg-emerald-600 text-white shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>

                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 font-mono">
                              {task.module}
                            </span>

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                              Day {task.day || 1}
                            </span>

                            <h4 className="text-sm font-bold font-bengali text-slate-900 dark:text-white">
                              {task.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              {task.estimatedTime}m
                            </span>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bengali">
                              ✓ {completedDateStr}
                            </span>
                          </div>
                        </div>

                        {task.desc && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-bengali pl-6">
                            {task.desc}
                          </p>
                        )}

                        {/* Extra Notes & Mistake Logs if recorded */}
                        {hasNotes && (
                          <div className="ml-6 mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 font-bengali">
                            {task.topicRef && (
                              <div className="text-slate-700 dark:text-slate-300">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">টপিক/বই রেফারেন্স: </span>
                                {task.topicRef}
                              </div>
                            )}
                            {task.mistakeLog && (
                              <div className="text-rose-700 dark:text-rose-300 flex items-start gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold">ভুল ও সংশোধন: </span>
                                  {task.mistakeLog}
                                </div>
                              </div>
                            )}
                            {task.keyLearnings && (
                              <div className="text-emerald-700 dark:text-emerald-300 flex items-start gap-1">
                                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold">মূল শিক্ষা / টেকঅ্যাওয়ে: </span>
                                  {task.keyLearnings}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* FOOTER */}
        {/* ========================================================= */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bengali">
            <Award className="w-4 h-4 text-amber-500" />
            <span>IELTS Routine Master • মডিউল প্রিপারেশন ও টাস্ক কমপ্লিশন মেজারমেন্ট</span>
          </div>

          <button
            onClick={isPageView ? onBack : onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold font-bengali shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {isPageView ? 'রুটিনে ফিরে যান' : 'বন্ধ করুন'}
          </button>
        </div>

      </div>
  );

  if (isPageView) {
    return contentMarkup;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {contentMarkup}
    </div>
  );
}
