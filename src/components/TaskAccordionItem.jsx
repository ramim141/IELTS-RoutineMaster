import React, { useState } from 'react';
import { 
  Check, 
  Circle, 
  Clock, 
  Trash2, 
  FastForward, 
  ChevronDown, 
  ChevronUp, 
  FileEdit, 
  AlertTriangle, 
  Sparkles, 
  Save, 
  BookOpenCheck
} from 'lucide-react';

export default function TaskAccordionItem({
  task,
  currentDay,
  onToggleComplete,
  onShiftToNextDay,
  onDelete,
  onUpdateTaskDetails,
  slotColor = 'amber'
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Local state for expandable details
  const [topicRef, setTopicRef] = useState(task.topicRef || '');
  const [mistakeLog, setMistakeLog] = useState(task.mistakeLog || '');
  const [keyLearnings, setKeyLearnings] = useState(task.keyLearnings || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveDetails = (e) => {
    e?.stopPropagation();
    onUpdateTaskDetails(task.id, {
      topicRef,
      mistakeLog,
      keyLearnings
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
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

  const hasExtraNotes = Boolean(task.topicRef || task.mistakeLog || task.keyLearnings);

  return (
    <div 
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        task.completed
          ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50 shadow-xs'
          : isExpanded 
            ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-600 shadow-md ring-1 ring-indigo-500/10' 
            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      {/* Main Task Header Row */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        
        {/* Left Checkbox & Title */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className={`mt-0.5 p-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              task.completed 
                ? 'bg-emerald-600 text-white shadow-xs scale-105' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-slate-400'
            }`}
            title={task.completed ? 'সম্পন্ন (আনচেক করতে ক্লিক করুন)' : 'সম্পন্ন মার্ক করুন'}
          >
            {task.completed ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4" />}
          </button>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono ${getModuleBadgeColor(task.module)}`}>
                {task.module}
              </span>

              <h4 className={`text-sm font-bold font-bengali flex items-center gap-2 ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500 font-normal' : 'text-slate-900 dark:text-white'
              }`}>
                {task.title}
              </h4>

              {task.priority === 'high' && !task.completed && (
                <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60 font-medium font-bengali">
                  🔥 High
                </span>
              )}

              {task.completed && (
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-bold font-bengali">
                  ✓ সম্পন্ন
                </span>
              )}

              {hasExtraNotes && (
                <span className="text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/60 font-bengali font-bold flex items-center gap-1">
                  <FileEdit className="w-3 h-3" /> নোট যুক্ত আছে
                </span>
              )}
            </div>

            <p className={`text-xs font-bengali ${task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
              {task.desc}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 justify-between sm:justify-end">
          
          {/* Estimated time */}
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{task.estimatedTime}m</span>
          </div>

          {/* Shift to Next Day */}
          {!task.completed && (
            <button
              onClick={() => onShiftToNextDay(task)}
              className="px-2.5 py-1.5 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-950/50 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs font-bold font-bengali flex items-center gap-1 transition-all cursor-pointer"
              title={`Day ${currentDay + 1} এ শিফট করুন`}
            >
              <FastForward className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">Day {currentDay + 1} এ শিফট</span>
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
            title="মুছুন"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Clean Icon-Only Accordion Arrow Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
              isExpanded 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
            title={isExpanded ? 'নোট বন্ধ করুন' : 'অ্যানালাইসিস ও নোট খুলুন'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* EXPANDABLE ACCORDION DRAWER: Topic, Mistake Log, Vocab */}
      {/* ======================================================== */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-4 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Topic / Cambridge Reference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1.5">
                <BookOpenCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>টপিক বা টেস্ট রেফারেন্স (Topic / Book Reference)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: Cambridge 18 - Test 2 (Reading Passage 2)"
                value={topicRef}
                onChange={(e) => setTopicRef(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-bengali shadow-xs transition-colors"
              />
            </div>

            {/* 2. Key Learnings & New Vocabulary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>শেখা নতুন শব্দ বা কী-পয়েন্ট (Vocabulary & Key Learnings)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: Profound impact, Alleviate congestion, Inversion rules"
                value={keyLearnings}
                onChange={(e) => setKeyLearnings(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-bengali shadow-xs transition-colors"
              />
            </div>

          </div>

          {/* 3. Deep Mistake Analysis Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-rose-700 dark:text-rose-400 font-bengali flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>ভুল বিশ্লেষণ ও কারণ (Mistake Analysis: কোথায় ভুল হলো ও কেন?)</span>
            </label>
            <textarea
              rows="2"
              placeholder="যেমন: Q14 এ 'necessary' বানান ভুল হয়েছিল। Q18 এ True/False এ প্যাসেজের মূল সিনোনিম না বুঝতে পারায় Not Given দিয়েছিলাম..."
              value={mistakeLog}
              onChange={(e) => setMistakeLog(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400 font-bengali resize-none shadow-xs transition-colors"
            />
          </div>

          {/* Accordion Footer Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bengali">
              এই নোটটি এই টাস্কের সাথে সংরক্ষিত থাকবে এবং রিভিশনে সাহায্য করবে।
            </span>

            <button
              onClick={handleSaveDetails}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-bengali flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>নোট সেভ হয়েছে!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>নোট সেভ করুন</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
