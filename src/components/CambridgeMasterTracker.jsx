import React, { useState } from 'react';
import { 
  BookOpen, 
  Check, 
  Sparkles, 
  X, 
  Headphones, 
  BookText, 
  PenTool, 
  Mic2, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown
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

const MODULE_META = {
  Listening: { 
    name: 'Listening', 
    bnName: 'লিসেনিং', 
    icon: Headphones,
    placeholder: '34/40'
  },
  Reading: { 
    name: 'Reading', 
    bnName: 'রিডিং', 
    icon: BookText,
    placeholder: '35/40'
  },
  Writing: { 
    name: 'Writing', 
    bnName: 'রাইটিং', 
    icon: PenTool,
    placeholder: 'Band 7.0'
  },
  Speaking: { 
    name: 'Speaking', 
    bnName: 'স্পিকিং', 
    icon: Mic2,
    placeholder: 'Band 7.5'
  }
};

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
    setTimeout(() => setNotification(null), 2200);
  };

  const saveTrackerData = (newData) => {
    setTrackerData(newData);
    try {
      localStorage.setItem('ielts_cambridge_master_tracker', JSON.stringify(newData));
    } catch (e) {
      console.error(e);
    }
  };

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
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
      showToast(`✓ ${book} • ${test} (${mod}) সম্পন্ন!`);
    }
  };

  const handleToggleWholeTest = (book, test) => {
    const isAllDone = MODULES.every(m => trackerData[`${book}_${test}_${m}`]?.done);
    const updated = { ...trackerData };
    
    MODULES.forEach(m => {
      const key = `${book}_${test}_${m}`;
      const current = trackerData[key] || { done: false, score: '' };
      updated[key] = {
        ...current,
        done: !isAllDone,
        completedAt: !isAllDone ? new Date().toISOString() : null
      };
    });

    saveTrackerData(updated);
    if (!isAllDone) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      showToast(`🎉 ${book} • ${test} সম্পূর্ণ কমপ্লিট!`);
    }
  };

  const handleScoreChange = (book, test, mod, scoreVal) => {
    const key = `${book}_${test}_${mod}`;
    const current = trackerData[key] || { done: false, score: '' };

    const updated = {
      ...trackerData,
      [key]: {
        ...current,
        score: scoreVal,
        done: scoreVal.trim() !== '' ? true : current.done
      }
    };

    saveTrackerData(updated);
  };

  const handlePrevBook = () => {
    const currentIndex = CAMBRIDGE_BOOKS.indexOf(selectedBook);
    if (currentIndex < CAMBRIDGE_BOOKS.length - 1) {
      setSelectedBook(CAMBRIDGE_BOOKS[currentIndex + 1]);
    }
  };

  const handleNextBook = () => {
    const currentIndex = CAMBRIDGE_BOOKS.indexOf(selectedBook);
    if (currentIndex > 0) {
      setSelectedBook(CAMBRIDGE_BOOKS[currentIndex - 1]);
    }
  };

  const totalSlots = CAMBRIDGE_BOOKS.length * TESTS.length * MODULES.length; // 160
  const totalCompletedUnits = Object.values(trackerData).filter(item => item.done).length;
  const overallPercentage = Math.round((totalCompletedUnits / totalSlots) * 100);

  const getModuleGlobalStats = (mod) => {
    const totalModUnits = CAMBRIDGE_BOOKS.length * TESTS.length; // 40
    let doneCount = 0;
    CAMBRIDGE_BOOKS.forEach(b => {
      TESTS.forEach(t => {
        if (trackerData[`${b}_${t}_${mod}`]?.done) doneCount++;
      });
    });
    return { done: doneCount, total: totalModUnits, pct: Math.round((doneCount / totalModUnits) * 100) };
  };

  const getBookProgress = (book) => {
    const bookTotal = TESTS.length * MODULES.length; // 16
    let done = 0;
    TESTS.forEach(t => {
      MODULES.forEach(m => {
        if (trackerData[`${book}_${t}_${m}`]?.done) done++;
      });
    });
    return { done, total: bookTotal, pct: Math.round((done / bookTotal) * 100) };
  };

  const currentBookStats = getBookProgress(selectedBook);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-900 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Minimal Toast Notification */}
        {notification && (
          <div className="absolute top-3.5 right-14 z-40 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium font-bengali shadow-lg flex items-center gap-1.5 animate-fadeIn">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Minimal Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-bengali">
                  Cambridge Master Tracker
                </h3>
                <span className="text-[11px] font-mono text-slate-500 font-medium hidden sm:inline">
                  (Books 10 - 19)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Minimal Overall Progress Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
              <span>Total: <strong className="text-slate-900 font-semibold">{totalCompletedUnits}/160</strong></span>
              <span className="text-indigo-600 font-bold">({overallPercentage}%)</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimal Clean Toolbar with Dropdowns */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-50/70 border-b border-slate-200/70 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            
            {/* Left: Clean Minimal Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              
              {/* Book Select Dropdown with Quick Arrow Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevBook}
                  disabled={CAMBRIDGE_BOOKS.indexOf(selectedBook) === CAMBRIDGE_BOOKS.length - 1}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition-all shadow-xs"
                  title="Previous Book"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="relative">
                  <select
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                    className="appearance-none bg-white hover:bg-slate-50 text-slate-800 font-mono font-semibold text-xs pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-xs"
                  >
                    {CAMBRIDGE_BOOKS.map((book) => {
                      const stats = getBookProgress(book);
                      return (
                        <option key={book} value={book}>
                          {book} ({stats.done}/16)
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  onClick={handleNextBook}
                  disabled={CAMBRIDGE_BOOKS.indexOf(selectedBook) === 0}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition-all shadow-xs"
                  title="Next Book"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Module Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedModuleFilter}
                  onChange={(e) => setSelectedModuleFilter(e.target.value)}
                  className="appearance-none bg-white hover:bg-slate-50 text-slate-800 font-mono font-medium text-xs pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-xs"
                >
                  <option value="All">All Modules (160)</option>
                  <option value="Listening">Listening ({getModuleGlobalStats('Listening').done}/40)</option>
                  <option value="Reading">Reading ({getModuleGlobalStats('Reading').done}/40)</option>
                  <option value="Writing">Writing ({getModuleGlobalStats('Writing').done}/40)</option>
                  <option value="Speaking">Speaking ({getModuleGlobalStats('Speaking').done}/40)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

            </div>

            {/* Right: Clean Minimal Selected Book Progress */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <span className="text-xs font-mono text-slate-600">
                <strong className="text-slate-900">{selectedBook}:</strong> {currentBookStats.done}/16 Done ({currentBookStats.pct}%)
              </span>
              <div className="w-20 sm:w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${currentBookStats.pct}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Clean Tests Grid View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {TESTS.map((testName) => {
              const testModulesDone = MODULES.filter(m => trackerData[`${selectedBook}_${testName}_${m}`]?.done).length;
              const isTestFullyDone = testModulesDone === 4;

              return (
                <div 
                  key={testName}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isTestFullyDone
                      ? 'bg-slate-50/80 border-slate-300/80'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Test Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                        isTestFullyDone 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {testName}
                      </span>
                      <span className="text-xs font-medium text-slate-500 font-mono">
                        {selectedBook}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleWholeTest(selectedBook, testName)}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-900 hover:underline px-1 transition-colors"
                      >
                        {isTestFullyDone ? 'Unmark all' : 'Mark all done'}
                      </button>
                      
                      <span className="text-[11px] font-mono font-medium text-slate-400">
                        {testModulesDone}/4
                      </span>
                    </div>
                  </div>

                  {/* Modules List */}
                  <div className="space-y-1.5">
                    {MODULES
                      .filter(m => selectedModuleFilter === 'All' || selectedModuleFilter === m)
                      .map((mod) => {
                        const key = `${selectedBook}_${testName}_${mod}`;
                        const unit = trackerData[key] || { done: false, score: '' };
                        const meta = MODULE_META[mod];
                        const IconComp = meta.icon;

                        return (
                          <div 
                            key={mod}
                            className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between gap-2.5 transition-all ${
                              unit.done 
                                ? 'bg-slate-50 border-slate-200 text-slate-900' 
                                : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                            }`}
                          >
                            {/* Checkbox & Name */}
                            <div 
                              className="flex items-center gap-2 cursor-pointer flex-1 select-none"
                              onClick={() => handleToggleModule(selectedBook, testName, mod)}
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                                unit.done 
                                  ? 'bg-slate-900 text-white' 
                                  : 'border border-slate-300 hover:border-slate-400 bg-white'
                              }`}>
                                {unit.done && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <IconComp className="w-3 h-3 text-slate-400" />
                                <span className={`text-xs font-mono ${unit.done ? 'font-semibold text-slate-900' : 'font-normal text-slate-700'}`}>
                                  {mod}
                                </span>
                              </div>
                            </div>

                            {/* Minimal Score Input */}
                            <div className="flex items-center gap-1 shrink-0">
                              <input
                                type="text"
                                placeholder={meta.placeholder}
                                value={unit.score || ''}
                                onChange={(e) => handleScoreChange(selectedBook, testName, mod, e.target.value)}
                                className={`w-16 bg-white border rounded px-1.5 py-0.5 text-[11px] font-mono text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                                  unit.score 
                                    ? 'border-indigo-300 font-semibold text-indigo-900' 
                                    : 'border-slate-200 text-slate-700 placeholder:text-slate-300'
                                }`}
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

        {/* Minimal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <span className="text-[11px] text-slate-400 font-bengali">
            * স্কোর ও প্রোগ্রেস স্বয়ংক্রিয়ভাবে সেভ হয়ে থাকে।
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium font-bengali transition-all active:scale-95"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}
