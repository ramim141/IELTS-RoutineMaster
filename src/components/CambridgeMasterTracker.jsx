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
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Award,
  FileEdit,
  Info,
  ArrowLeft
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

// IELTS 0-40 Raw score to Band converter
export const calculateIeltsBand = (rawScore, mod = 'Listening') => {
  const score = parseInt(rawScore, 10);
  if (isNaN(score) || score <= 0) return null;
  if (score >= 39) return '9.0';
  if (score >= 37) return '8.5';
  if (score >= 35) return '8.0';
  if (score >= 32) return '7.5';
  if (score >= 30) return '7.0';
  if (score >= 26) return '6.5';
  if (score >= 23) return '6.0';
  if (score >= 18) return '5.5';
  if (score >= 16) return '5.0';
  if (score >= 13) return '4.5';
  if (score >= 10) return '4.0';
  return '3.5';
};

const MODULE_META = {
  Listening: { 
    name: 'Listening', 
    bnName: 'লিসেনিং', 
    icon: Headphones,
    placeholder: '34/40',
    color: 'amber',
    sections: [
      { key: 's1', label: 'Section 1', range: 'Q1-10', max: 10, tip: 'Form & Table Filling' },
      { key: 's2', label: 'Section 2', range: 'Q11-20', max: 10, tip: 'Maps & Monologue' },
      { key: 's3', label: 'Section 3', range: 'Q21-30', max: 10, tip: 'Academic MCQs & Discussion' },
      { key: 's4', label: 'Section 4', range: 'Q31-40', max: 10, tip: 'Fast Lecture Flowchart' }
    ]
  },
  Reading: { 
    name: 'Reading', 
    bnName: 'রিডিং', 
    icon: BookText,
    placeholder: '35/40',
    color: 'sky',
    sections: [
      { key: 's1', label: 'Passage 1', range: 'Q1-13', max: 13, tip: 'Factual & True/False/NG' },
      { key: 's2', label: 'Passage 2', range: 'Q14-26', max: 13, tip: 'Descriptive & Headings' },
      { key: 's3', label: 'Passage 3', range: 'Q27-40', max: 14, tip: 'Complex Academic & Summary' }
    ]
  },
  Writing: { 
    name: 'Writing', 
    bnName: 'রাইটিং', 
    icon: PenTool,
    placeholder: 'Band 7.0',
    color: 'purple',
    sections: [
      { key: 's1', label: 'Task 1 (Report/Letter)', range: '150 words', max: 9, isBand: true, tip: 'Overview & Key Trends (33%)' },
      { key: 's2', label: 'Task 2 (Essay)', range: '250 words', max: 9, isBand: true, tip: 'Opinion/Discussion Essay (67%)' }
    ]
  },
  Speaking: { 
    name: 'Speaking', 
    bnName: 'স্পিকিং', 
    icon: Mic2,
    placeholder: 'Band 7.5',
    color: 'emerald',
    sections: [
      { key: 's1', label: 'Part 1', range: 'Intro & Q&A', max: 9, isBand: true, tip: 'Fluency on Familiar Topics' },
      { key: 's2', label: 'Part 2', range: 'Cue Card Speech', max: 9, isBand: true, tip: '1-Min Notes & 2-Min Speech' },
      { key: 's3', label: 'Part 3', range: 'Abstract Discussion', max: 9, isBand: true, tip: 'Deep Opinions & Justifications' }
    ]
  }
};

const MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'];

export default function CambridgeMasterTracker({ 
  isOpen = true, 
  onClose,
  isPageView = false,
  onBack 
}) {
  const [trackerData, setTrackerData] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_cambridge_master_tracker');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [selectedBook, setSelectedBook] = useState('Cambridge 10');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('All');
  const [expandedSections, setExpandedSections] = useState({}); // { [key]: boolean }
  const [expandedTests, setExpandedTests] = useState(() => ({
    'Test 1': true,
    'Test 2': true,
    'Test 3': true,
    'Test 4': true
  }));
  const [notification, setNotification] = useState(null);

  const toggleTestExpand = (testName) => {
    setExpandedTests(prev => ({
      ...prev,
      [testName]: !prev[testName]
    }));
  };

  const handleToggleAllTests = (expand) => {
    const next = {};
    TESTS.forEach(t => { next[t] = expand; });
    setExpandedTests(next);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2400);
  };

  const saveTrackerData = (newData) => {
    setTrackerData(newData);
    try {
      localStorage.setItem('ielts_cambridge_master_tracker', JSON.stringify(newData));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSectionExpand = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
      }
    });

    saveTrackerData(updated);
    if (!isAllDone) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      showToast(`🎉 ${book} • ${test} সম্পূর্ণ কমপ্লিট!`);
    }
  };

  // Direct Overall Score Change
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

  // Individual Section Score Change (Section 1, Section 2, Section 3, Section 4)
  const handleSectionScoreChange = (book, test, mod, secKey, val) => {
    const key = `${book}_${test}_${mod}`;
    const current = trackerData[key] || { done: false, score: '', sections: {} };
    const currentSections = current.sections || {};

    const updatedSections = {
      ...currentSections,
      [secKey]: val === '' ? '' : Math.max(0, parseFloat(val) || 0)
    };

    // Calculate total score & Band automatically based on module
    let computedScore = current.score;
    let computedBand = null;

    if (mod === 'Listening' || mod === 'Reading') {
      const secValues = Object.values(updatedSections).filter(v => v !== '' && !isNaN(v));
      if (secValues.length > 0) {
        const sum = secValues.reduce((a, b) => a + Number(b), 0);
        const band = calculateIeltsBand(sum, mod);
        computedScore = `${sum}/40`;
        computedBand = band;
      }
    } else if (mod === 'Writing') {
      const t1 = parseFloat(updatedSections.s1);
      const t2 = parseFloat(updatedSections.s2);
      if (!isNaN(t2) && !isNaN(t1)) {
        const weighted = ((t1 * 1) + (t2 * 2)) / 3;
        computedBand = (Math.round(weighted * 2) / 2).toFixed(1);
        computedScore = `Band ${computedBand}`;
      } else if (!isNaN(t2)) {
        computedScore = `Band ${t2}`;
        computedBand = `${t2}`;
      }
    } else if (mod === 'Speaking') {
      const parts = [updatedSections.s1, updatedSections.s2, updatedSections.s3].filter(v => v !== '' && !isNaN(v));
      if (parts.length > 0) {
        const avg = parts.reduce((a, b) => a + Number(b), 0) / parts.length;
        computedBand = (Math.round(avg * 2) / 2).toFixed(1);
        computedScore = `Band ${computedBand}`;
      }
    }

    const hasAnySectionInput = Object.values(updatedSections).some(v => v !== '' && v !== null);

    const updated = {
      ...trackerData,
      [key]: {
        ...current,
        sections: updatedSections,
        score: computedScore || current.score,
        calculatedBand: computedBand,
        done: hasAnySectionInput ? true : current.done,
        completedAt: (hasAnySectionInput && !current.done) ? new Date().toISOString() : current.completedAt
      }
    };

    saveTrackerData(updated);
  };

  // Section Note / Mistake Remarks Change
  const handleSectionNotesChange = (book, test, mod, notesVal) => {
    const key = `${book}_${test}_${mod}`;
    const current = trackerData[key] || { done: false, score: '', sections: {} };

    const updated = {
      ...trackerData,
      [key]: {
        ...current,
        notes: notesVal
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

  if (!isOpen && !isPageView) return null;

  const contentMarkup = (
    <div className={`relative w-full ${isPageView ? 'bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm' : 'max-w-5xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-h-[94vh] my-auto'} text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden`}>
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-3.5 right-14 z-50 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold font-bengali shadow-xl flex items-center gap-1.5 animate-fadeIn border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
        <div className="flex items-center gap-3">
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

          <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight font-bengali">
                Cambridge Master Tracker & সেকশন স্কোর
              </h3>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 hidden sm:inline">
                Books 10 - 19
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali">
              লিসেনিং ও রিডিংয়ের প্রতিটি সেকশন / পার্টের নম্বর আলাদাভাবে এন্ট্রি ও ব্যান্ড স্কোর ক্যালকুলেশন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Overall Progress Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span>Total: <strong className="text-slate-900 dark:text-white font-bold">{totalCompletedUnits}/160</strong></span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">({overallPercentage}%)</span>
          </div>

          {!isPageView && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

        {/* Toolbar with Dropdowns */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-200/70 dark:border-slate-800 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            
            {/* Left: Dropdowns & Navigation */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              
              {/* Book Select Dropdown with Quick Arrow Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevBook}
                  disabled={CAMBRIDGE_BOOKS.indexOf(selectedBook) === CAMBRIDGE_BOOKS.length - 1}
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 transition-all shadow-xs cursor-pointer"
                  title="Previous Book"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="relative">
                  <select
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                    className="appearance-none bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold text-xs pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-xs"
                  >
                    {CAMBRIDGE_BOOKS.map((book) => {
                      const stats = getBookProgress(book);
                      return (
                        <option key={book} value={book} className="dark:bg-slate-800 dark:text-slate-200">
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
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 transition-all shadow-xs cursor-pointer"
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
                  className="appearance-none bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono font-semibold text-xs pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-xs"
                >
                  <option value="All" className="dark:bg-slate-800 dark:text-slate-200">All Modules (160)</option>
                  <option value="Listening" className="dark:bg-slate-800 dark:text-slate-200">Listening ({getModuleGlobalStats('Listening').done}/40)</option>
                  <option value="Reading" className="dark:bg-slate-800 dark:text-slate-200">Reading ({getModuleGlobalStats('Reading').done}/40)</option>
                  <option value="Writing" className="dark:bg-slate-800 dark:text-slate-200">Writing ({getModuleGlobalStats('Writing').done}/40)</option>
                  <option value="Speaking" className="dark:bg-slate-800 dark:text-slate-200">Speaking ({getModuleGlobalStats('Speaking').done}/40)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quick Expand All / Collapse All buttons */}
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllTests(true)}
                  className="px-2.5 py-1 text-[11px] font-bengali font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  সব টেস্ট খুলুন
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllTests(false)}
                  className="px-2.5 py-1 text-[11px] font-bengali font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  সব বন্ধ করুন
                </button>
              </div>

            </div>

            {/* Right: Selected Book Progress */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">{selectedBook}:</strong> {currentBookStats.done}/16 Done ({currentBookStats.pct}%)
              </span>
              <div className="w-20 sm:w-28 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${currentBookStats.pct}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Tests List - 1 Row per Test (Full-width Nested Accordion) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white dark:bg-[#0F172A] custom-scrollbar">
          <div className="space-y-4">
            {TESTS.map((testName) => {
              const testModulesDone = MODULES.filter(m => trackerData[`${selectedBook}_${testName}_${m}`]?.done).length;
              const isTestFullyDone = testModulesDone === 4;
              const isTestExpanded = Boolean(expandedTests[testName]);

              return (
                <div 
                  key={testName}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isTestFullyDone
                      ? 'bg-slate-50/80 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  {/* LEVEL 1 ACCORDION HEADER: TEST HEADER (Click to Expand / Collapse Test) */}
                  <div 
                    onClick={() => toggleTestExpand(testName)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                        isTestExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : ''
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold font-mono px-3 py-1 rounded-xl shadow-xs ${
                          isTestFullyDone 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {testName}
                        </span>
                        
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                          {selectedBook}
                        </span>

                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                          isTestFullyDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                            : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'
                        }`}>
                          {testModulesDone}/4 সম্পন্ন
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleWholeTest(selectedBook, testName)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-bengali bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        {isTestFullyDone ? 'সব আনমার্ক করুন' : 'সবগুলো সম্পন্ন করুন'}
                      </button>
                    </div>
                  </div>

                  {/* LEVEL 1 ACCORDION BODY: NESTED MODULES */}
                  {isTestExpanded && (
                    <div className="p-4 space-y-3 bg-white dark:bg-slate-900/60 animate-fadeIn">
                      {MODULES
                        .filter(m => selectedModuleFilter === 'All' || selectedModuleFilter === m)
                        .map((mod) => {
                          const key = `${selectedBook}_${testName}_${mod}`;
                          const unit = trackerData[key] || { done: false, score: '', sections: {}, notes: '' };
                          const sections = unit.sections || {};
                          const meta = MODULE_META[mod];
                          const IconComp = meta.icon;
                          const isExpanded = Boolean(expandedSections[key]);

                          // Determine if any individual section has score
                          const hasSectionScores = Object.values(sections).some(v => v !== '' && v !== undefined && v !== null);

                          // Estimated Band
                          const estimatedBand = unit.calculatedBand || (
                            mod === 'Listening' || mod === 'Reading' 
                              ? calculateIeltsBand(parseInt(unit.score, 10), mod) 
                              : null
                          );

                          return (
                            <div 
                              key={mod}
                              className={`rounded-2xl border transition-all overflow-hidden ${
                                isExpanded
                                  ? 'bg-slate-50/90 dark:bg-slate-800/90 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/20 shadow-xs'
                                  : unit.done 
                                    ? 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-slate-100' 
                                    : 'bg-white dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              {/* LEVEL 2 ACCORDION HEADER: MODULE HEADER */}
                              <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                                
                                {/* Left: Checkbox & Module Name */}
                                <div className="flex items-center gap-3 flex-1 select-none min-w-[200px]">
                                  <div 
                                    onClick={() => handleToggleModule(selectedBook, testName, mod)}
                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                                      unit.done 
                                        ? 'bg-emerald-600 text-white shadow-2xs' 
                                        : 'border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800'
                                    }`}
                                    title={unit.done ? 'Mark incomplete' : 'Mark completed'}
                                  >
                                    {unit.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>

                                  <div 
                                    onClick={() => toggleSectionExpand(key)}
                                    className="flex items-center gap-2 flex-wrap cursor-pointer flex-1"
                                  >
                                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-mono ${unit.done ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                                      {mod}
                                    </span>

                                    {/* Sub-sections preview pills if present and collapsed */}
                                    {hasSectionScores && !isExpanded && (
                                      <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-200/70 dark:border-indigo-800/60">
                                        {meta.sections.map(s => (
                                          <span key={s.key} className="whitespace-nowrap">
                                            {s.label.split(' ')[0][0]}{s.key.replace('s', '')}: {sections[s.key] ?? '-'}
                                          </span>
                                        )).reduce((prev, curr) => [prev, ' • ', curr])}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Band Badge, Total Score Input & Accordion Toggle */}
                                <div className="flex items-center gap-2 shrink-0">
                                  
                                  {/* Band pill if calculated */}
                                  {estimatedBand && (
                                    <span className="text-xs font-extrabold font-mono px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                                      Band {estimatedBand}
                                    </span>
                                  )}

                                  {/* Score Input */}
                                  <input
                                    type="text"
                                    placeholder={meta.placeholder}
                                    value={unit.score || ''}
                                    onChange={(e) => handleScoreChange(selectedBook, testName, mod, e.target.value)}
                                    className={`w-20 bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 text-xs font-mono text-center focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all ${
                                      unit.score 
                                        ? 'border-indigo-300 dark:border-indigo-700 font-bold text-indigo-950 dark:text-indigo-200 shadow-2xs' 
                                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600'
                                    }`}
                                    title="মোট স্কোর"
                                  />

                                  {/* Section Breakdown Accordion Toggle Button */}
                                  <button
                                    type="button"
                                    onClick={() => toggleSectionExpand(key)}
                                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-bengali font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                      isExpanded 
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                                        : hasSectionScores 
                                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' 
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                    title={isExpanded ? 'সেকশন ব্রেকডাউন লুকান' : 'সেকশন অনুযায়ী নম্বর দিন'}
                                  >
                                    <Sliders className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{isExpanded ? 'লুকান' : 'সেকশন নম্বর'}</span>
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* LEVEL 2 ACCORDION DRAWER: SECTIONS BREAKDOWN */}
                              {isExpanded && (
                                <div className="p-4 bg-indigo-50/40 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3 animate-fadeIn">
                                  <div className="flex items-center justify-between text-xs font-bengali">
                                    <span className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                                      <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                      <span>{mod} - প্রতিটি সেকশন/পার্ট অনুযায়ী নম্বর এন্ট্রি:</span>
                                    </span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                      {mod === 'Listening' ? '4 Sections (Total 40)' : mod === 'Reading' ? '3 Passages (Total 40)' : 'Tasks/Parts'}
                                    </span>
                                  </div>

                                  {/* Section Inputs Grid */}
                                  <div className={`grid gap-3 ${meta.sections.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : meta.sections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                    {meta.sections.map((sec) => {
                                      const currentSecVal = sections[sec.key] !== undefined ? sections[sec.key] : '';

                                      return (
                                        <div 
                                          key={sec.key}
                                          className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1.5"
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                                              {sec.label}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                              {sec.range}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-1.5">
                                            <input
                                              type="number"
                                              step={sec.isBand ? '0.5' : '1'}
                                              min="0"
                                              max={sec.max}
                                              value={currentSecVal}
                                              onChange={(e) => handleSectionScoreChange(selectedBook, testName, mod, sec.key, e.target.value)}
                                              placeholder={`0-${sec.max}`}
                                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 px-2 text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                                            />
                                            <span className="text-xs font-mono text-slate-400">/{sec.max}</span>
                                          </div>

                                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bengali truncate block" title={sec.tip}>
                                            {sec.tip}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Quick Mistake Log / Notes input for this test */}
                                  <div className="space-y-1 pt-1">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali">
                                      <FileEdit className="w-3.5 h-3.5 text-indigo-500" />
                                      <span>ভুল ও দুর্বলতার নোট (ঐচ্ছিক):</span>
                                    </div>
                                    <input
                                      type="text"
                                      value={unit.notes || ''}
                                      onChange={(e) => handleSectionNotesChange(selectedBook, testName, mod, e.target.value)}
                                      placeholder="উদাঃ Section 3 এর ৩টি MCQ ভুল হয়েছে, স্পেলিং মিস্টেক..."
                                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 font-bengali focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>

                                </div>
                              )}

                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/60 dark:bg-slate-950/40 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-bengali">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>সেকশন ব্রেকডাউন ওপেন করতে প্রতিটি মডিউলের ডানে <strong>Sliders (🎛️)</strong> বাটনে ক্লিক করুন।</span>
          </div>

          <button
            onClick={isPageView ? onBack : onClose}
            className="px-5 py-1.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold font-bengali transition-all active:scale-95 cursor-pointer shadow-xs"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      {contentMarkup}
    </div>
  );
}
