import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Check, 
  Sparkles, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  X,
  Plus,
  RotateCcw,
  CheckCircle2,
  Circle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CAMBRIDGE_BOOKS = [
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
];

const TESTS = ['Test 1', 'Test 2', 'Test 3', 'Test 4'];
const MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'];

export default function CambridgeMasterTracker({ isOpen, onClose }) {
  const [trackerData, setTrackerData] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_cambridge_master_tracker');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [selectedBook, setSelectedBook] = useState('Cambridge 18');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('All');
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Save to LocalStorage whenever trackerData changes
  const saveTrackerData = (newData) => {
    setTrackerData(newData);
    try {
      localStorage.setItem('ielts_cambridge_master_tracker', JSON.stringify(newData));
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle module test status
  const handleToggleModule = (book, test, mod) => {
    const key = `${book}_${test}_${mod}`;
    const current = trackerData[key] || { done: false, score: '' };
    const nextDone = !current.done;

    const updated = {
      ...trackerData,
      [key]: {
        ...current,
        done: nextDone,
        completedAt: nextDone ? new Date().toISOString() : null
      }
    };

    saveTrackerData(updated);

    if (nextDone) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
      showToast(`✓ ${book} - ${test} (${mod}) সম্পন্ন মার্ক করা হয়েছে!`);
    }
  };

  // Update test score
  const handleScoreChange = (book, test, mod, scoreVal) => {
    const key = `${book}_${test}_${mod}`;
    const current = trackerData[key] || { done: false, score: '' };

    const updated = {
      ...trackerData,
      [key]: {
        ...current,
        score: scoreVal,
        done: scoreVal ? true : current.done
      }
    };

    saveTrackerData(updated);
  };

  // Calculate Overall Statistics
  const totalSlots = CAMBRIDGE_BOOKS.length * TESTS.length * MODULES.length; // 10 * 4 * 4 = 160 units
  const totalCompletedUnits = Object.values(trackerData).filter(item => item.done).length;
  const overallPercentage = Math.round((totalCompletedUnits / totalSlots) * 100);

  // Book Specific Progress
  const getBookProgress = (book) => {
    const bookTotal = TESTS.length * MODULES.length; // 16 units
    let done = 0;
    TESTS.forEach(t => {
      MODULES.forEach(m => {
        if (trackerData[`${book}_${t}_${m}`]?.done) done++;
      });
    });
    return { done, total: bookTotal, pct: Math.round((done / bookTotal) * 100) };
  };

  const currentBookStats = getBookProgress(selectedBook);

  const getModuleColor = (mod) => {
    switch (mod) {
      case 'Listening': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', activeBg: 'bg-amber-500' };
      case 'Reading': return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', activeBg: 'bg-sky-500' };
      case 'Writing': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', activeBg: 'bg-purple-500' };
      case 'Speaking': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', activeBg: 'bg-emerald-500' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', activeBg: 'bg-slate-800' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 max-h-[92vh] flex flex-col">
        
        {/* Toast */}
        {notification && (
          <div className="absolute top-4 right-16 z-30 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold font-bengali shadow-xl flex items-center gap-2 animate-fadeIn border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold font-bengali text-slate-900">
                  Cambridge Master Book Tracker (বুক ১০ - ১৯)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full border border-teal-200">
                  10 Books • 40 Tests Matrix
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bengali mt-0.5">
                অফিসিয়াল কেমব্রিজ টেস্টগুলোর প্রোগ্রেস ও স্কোর ম্যাট্রিক্স ট্র্যাক করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Progress Banner */}
        <div className="py-3 shrink-0">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-teal-500/15">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-100 font-mono">
                Overall Cambridge Completion
              </span>
              <h4 className="text-base font-extrabold font-bengali">
                মোট কেমব্রিজ প্রস্তুতি অগ্রগতি: {totalCompletedUnits} / {totalSlots} সেকশন সম্পন্ন ({overallPercentage}%)
              </h4>
            </div>

            <div className="w-full sm:w-48 space-y-1">
              <div className="h-2.5 bg-teal-900/40 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500" 
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-teal-100 text-right block font-mono font-bold">
                {overallPercentage}% Complete
              </span>
            </div>
          </div>
        </div>

        {/* Book Selector Tabs */}
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 border-b border-slate-100 pb-3">
          {CAMBRIDGE_BOOKS.map((b) => {
            const stats = getBookProgress(b);
            const isSelected = selectedBook === b;

            return (
              <button
                key={b}
                onClick={() => setSelectedBook(b)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{b}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-700 text-teal-300' : 'bg-slate-200 text-slate-600'
                }`}>
                  {stats.pct}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Book Tests Matrix View */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold font-bengali text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>{selectedBook} এর ৪টি টেস্টের অগ্রগতি ({currentBookStats.done}/{currentBookStats.total} সম্পন্ন)</span>
            </h4>

            {/* Filter by Module */}
            <div className="flex items-center gap-1">
              {['All', 'Listening', 'Reading', 'Writing', 'Speaking'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModuleFilter(m)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-colors ${
                    selectedModuleFilter === m
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Tests Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTS.map((testName) => {
              return (
                <div 
                  key={testName}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {testName}
                      </span>
                      <span className="text-xs font-bold text-slate-600 font-bengali">
                        {selectedBook}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono font-bold">
                      {MODULES.filter(m => trackerData[`${selectedBook}_${testName}_${m}`]?.done).length} / 4 Done
                    </span>
                  </div>

                  {/* 4 Modules Row for this Test */}
                  <div className="space-y-2">
                    {MODULES
                      .filter(m => selectedModuleFilter === 'All' || selectedModuleFilter === m)
                      .map((mod) => {
                        const key = `${selectedBook}_${testName}_${mod}`;
                        const unit = trackerData[key] || { done: false, score: '' };
                        const colors = getModuleColor(mod);

                        return (
                          <div 
                            key={mod}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                              unit.done 
                                ? `${colors.bg} ${colors.border}` 
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            {/* Checkbox & Module Name */}
                            <div 
                              className="flex items-center gap-2.5 cursor-pointer flex-1"
                              onClick={() => handleToggleModule(selectedBook, testName, mod)}
                            >
                              <button
                                type="button"
                                className={`p-1 rounded-lg transition-colors ${
                                  unit.done ? `${colors.activeBg} text-white` : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                              >
                                {unit.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                              </button>

                              <div>
                                <span className={`text-xs font-bold font-mono ${unit.done ? colors.text : 'text-slate-700'}`}>
                                  {mod}
                                </span>
                                {unit.done && (
                                  <span className="text-[10px] text-emerald-600 font-bengali ml-2 font-bold">
                                    ✓ সম্পন্ন
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Score Input */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] text-slate-400 font-mono">Score:</span>
                              <input
                                type="text"
                                placeholder={mod === 'Writing' || mod === 'Speaking' ? 'Band 7' : '34/40'}
                                value={unit.score || ''}
                                onChange={(e) => handleScoreChange(selectedBook, testName, mod, e.target.value)}
                                className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 text-center focus:outline-none focus:border-teal-500 shadow-xs"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-bengali">
            * সমস্ত স্কোর ও প্রোগ্রেস স্বয়ংক্রিয়ভাবে লোকালস্টোরেজে সেভ হয়ে থাকবে।
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-bengali transition-all shadow-xs"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}
