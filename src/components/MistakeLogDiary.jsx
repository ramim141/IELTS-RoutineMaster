import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Sparkles, 
  X, 
  Check, 
  Filter, 
  Tag, 
  Calendar,
  BookOpenCheck,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MistakeLogDiary({ isOpen, onClose, tasksByDay = {}, currentDay = 1 }) {
  // Standalone custom mistake entries
  const [customMistakes, setCustomMistakes] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_mistake_diary_custom_entries');
      return saved ? JSON.parse(saved) : [
        {
          id: 'mis_sample_1',
          module: 'Reading',
          topicRef: 'Cambridge 18 - Test 2 (Passage 2)',
          questionType: 'True / False / Not Given',
          mistakeNote: "Q18 এ 'Contradiction' এর বদলে প্যাসেজে তথ্য না থাকায় Not Given হতো। আমি অনুমান করে False দিয়েছিলাম।",
          lesson: "প্যাসেজে তথ্য সরাসরি বিপরীত না হলে False দেওয়া যাবে না, Not Given হবে।",
          day: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 'mis_sample_2',
          module: 'Listening',
          topicRef: 'Cambridge 17 - Test 1 (Section 1)',
          questionType: 'Spelling & Form Fill',
          mistakeNote: "'Accommodation' এ ডাবল c ও ডাবল m ভুল করে সিঙ্গেল m লিখেছিলাম।",
          lesson: "কমন কনফিউজিং স্পেলিংগুলোর তালিকা নিয়মিত সকালে রিভিশন দিতে হবে।",
          day: 1,
          createdAt: new Date().toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModuleTab, setActiveModuleTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // New mistake form state
  const [newModule, setNewModule] = useState('Reading');
  const [newTopicRef, setNewTopicRef] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('True/False/Not Given');
  const [newMistakeNote, setNewMistakeNote] = useState('');
  const [newLesson, setNewLesson] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const saveCustomMistakes = (data) => {
    setCustomMistakes(data);
    try {
      localStorage.setItem('ielts_mistake_diary_custom_entries', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  // Extract mistakes from daily tasks across all days
  const taskMistakes = Object.entries(tasksByDay).flatMap(([dayNum, tasks]) => {
    if (!Array.isArray(tasks)) return [];
    return tasks
      .filter(t => t.mistakeLog && t.mistakeLog.trim() !== '')
      .map(t => ({
        id: `task_mis_${t.id}`,
        module: t.module || 'Other',
        topicRef: t.topicRef || t.title,
        questionType: 'Daily Task Note',
        mistakeNote: t.mistakeLog,
        lesson: t.keyLearnings || '',
        day: parseInt(dayNum, 10),
        isFromDailyTask: true
      }));
  });

  // Combine task mistakes + custom diary mistakes
  const allMistakes = [...customMistakes, ...taskMistakes];

  // Filtered mistakes
  const filteredMistakes = allMistakes.filter(m => {
    const matchesModule = activeModuleTab === 'All' || m.module.toLowerCase().includes(activeModuleTab.toLowerCase());
    const matchesSearch = !searchQuery || 
      m.topicRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mistakeNote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.lesson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.questionType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // Add new standalone mistake
  const handleAddNewMistake = (e) => {
    e.preventDefault();
    if (!newMistakeNote.trim()) return;

    const entry = {
      id: 'mis_' + Date.now(),
      module: newModule,
      topicRef: newTopicRef.trim() || 'General Mock Test',
      questionType: newQuestionType.trim() || 'General',
      mistakeNote: newMistakeNote.trim(),
      lesson: newLesson.trim() || 'সতর্ক থাকতে হবে',
      day: currentDay,
      createdAt: new Date().toISOString()
    };

    saveCustomMistakes([entry, ...customMistakes]);
    setNewTopicRef('');
    setNewMistakeNote('');
    setNewLesson('');
    setIsAddModalOpen(false);

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.6 }
    });
    showToast('📝 নতুন ভুল বিশ্লেষণ ডায়েরিতে সেভ হয়েছে!');
  };

  // Delete custom mistake
  const handleDeleteCustomMistake = (id) => {
    saveCustomMistakes(customMistakes.filter(m => m.id !== id));
    showToast('মুছে ফেলা হয়েছে');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Toast */}
        {notification && (
          <div className="absolute top-4 right-16 z-30 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold font-bengali shadow-xl flex items-center gap-2 animate-fadeIn border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60 shadow-xs">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold font-bengali text-slate-900 dark:text-slate-100">
                  IELTS Mistake Log Diary (ভুল বিশ্লেষণ ডায়েরি)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-900 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  {allMistakes.length} Logs Saved
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">
                মক টেস্ট ও প্র্যাকটিসের সমস্ত ভুল, কারণ এবং সমাধান এক জায়গায় নিয়মিত রিভিশন দিন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold font-bengali flex items-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ভুল নোট করুন</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="py-3 space-y-2.5 shrink-0 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="ভুল সার্চ করুন (যেমন: Spelling, True/False, Headings, Cambridge 18, Thesis statement)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Listening', 'Reading', 'Writing', 'Speaking'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveModuleTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeModuleTab === tab
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Mistake Entries List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {filteredMistakes.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-rose-200/80 dark:border-rose-900/50 rounded-2xl bg-rose-50/20 dark:bg-rose-950/20 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-bengali">
                কোনো ভুল নোট পাওয়া যায়নি!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-bengali">
                টাস্কের অ্যাকর্ডিয়ান ড্রয়ারে ভুল লিখলে অথবা উপরের <strong>'নতুন ভুল নোট করুন'</strong> বাটনে ক্লিক করলে তা এখানে প্রদর্শিত হবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMistakes.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-750 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-sm transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${getModuleBadgeColor(entry.module)}`}>
                          {entry.module}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                          Day {entry.day}
                        </span>
                      </div>

                      {!entry.isFromDailyTask && (
                        <button
                          onClick={() => handleDeleteCustomMistake(entry.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Topic / Reference */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">
                      <BookOpenCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{entry.topicRef}</span>
                    </div>

                    {/* Mistake Detail */}
                    <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 space-y-1">
                      <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider font-bengali flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                        কী ভুল হয়েছিল:
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-bengali leading-relaxed">
                        {entry.mistakeNote}
                      </p>
                    </div>

                    {/* Actionable Lesson / Vocabulary */}
                    {entry.lesson && (
                      <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider font-bengali flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          শিক্ষা ও সমাধান (Lesson):
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-bengali leading-relaxed">
                          {entry.lesson}
                        </p>
                      </div>
                    )}
                  </div>

                  {entry.isFromDailyTask && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bengali italic block text-right pt-1 border-t border-slate-100 dark:border-slate-700/80">
                      * আজকের স্লট টাস্ক থেকে সিঙ্ক করা
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
            মোট ভুল বিশ্লেষণ এন্ট্রি: <strong className="text-rose-600 dark:text-rose-400 font-mono">{filteredMistakes.length}টি</strong>
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-bengali transition-all shadow-xs"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* ADD CUSTOM MISTAKE POPUP MODAL */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-bengali text-slate-900 dark:text-slate-100">
                    নতুন ভুল বিশ্লেষণ এন্ট্রি
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                    মক টেস্টের যেকোনো ভুল ও সমাধান নোট লিখে রাখুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewMistake} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali block mb-1.5">
                  মডিউল
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Listening', 'Reading', 'Writing', 'Speaking'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setNewModule(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        newModule === m
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali block mb-1">
                  টপিক বা টেস্ট রেফারেন্স
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Cambridge 18 Test 2 Reading Passage 3"
                  value={newTopicRef}
                  onChange={(e) => setNewTopicRef(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 font-bengali transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-rose-800 dark:text-rose-300 font-bengali block mb-1">
                  কোথায় ভুল হলো এবং কেন? (Mistake Detail)
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="যেমন: Q24 এ 'Synonym' না বুঝতে পেরে ভুল উত্তর সিলেক্ট করেছিলাম..."
                  value={newMistakeNote}
                  onChange={(e) => setNewMistakeNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 font-bengali resize-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-800 dark:text-amber-300 font-bengali block mb-1">
                  কী শিক্ষা নিলেন বা সমাধান (Actionable Lesson)
                </label>
                <textarea
                  rows="2"
                  placeholder="যেমন: সবসময় প্যারাগ্রাফের শেষ দুই লাইনের কন্টেক্সট ভালো করে রিচেক করতে হবে..."
                  value={newLesson}
                  onChange={(e) => setNewLesson(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 font-bengali resize-none transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bengali"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold font-bengali shadow-md shadow-rose-600/20 active:scale-95"
                >
                  ডায়েরিতে সেভ করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
