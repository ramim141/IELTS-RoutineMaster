import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  Award, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Clock, 
  Flame, 
  BookOpen, 
  Check, 
  TrendingUp
} from 'lucide-react';

export default function TargetSetupModal({ isOpen, onClose, targetSettings, onSave }) {
  const [examType, setExamType] = useState(targetSettings?.examType || 'Academic');
  const [targetBand, setTargetBand] = useState(targetSettings?.targetBand || 7.5);
  const [planType, setPlanType] = useState(targetSettings?.planType || 'days');
  const [totalDays, setTotalDays] = useState(targetSettings?.totalDays || 60);
  const [startDate, setStartDate] = useState(targetSettings?.startDate || new Date().toISOString().split('T')[0]);
  const [examDate, setExamDate] = useState(() => {
    if (targetSettings?.examDate) return targetSettings.examDate;
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  });
  const [dailyHoursGoal, setDailyHoursGoal] = useState(targetSettings?.dailyHoursGoal || 4);

  if (!isOpen) return null;

  const handleDaysPreset = (days) => {
    setPlanType('days');
    setTotalDays(days);
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + parseInt(days));
    setExamDate(end.toISOString().split('T')[0]);
  };

  const handleExamDateChange = (e) => {
    const selectedDate = e.target.value;
    setExamDate(selectedDate);
    setPlanType('date');
    const start = new Date(startDate);
    const end = new Date(selectedDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      setTotalDays(diffDays);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      examType,
      targetBand: parseFloat(targetBand),
      planType,
      totalDays: parseInt(totalDays, 10),
      startDate,
      examDate,
      dailyHoursGoal: parseFloat(dailyHoursGoal),
      isConfigured: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100 transition-all">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-100/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-1 ring-white/20">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold font-bengali text-slate-900 dark:text-slate-100">
                    IELTS প্রিপারেশন টার্গেট সেটআপ
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800">
                    <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                    Personalized Roadmap
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                  আপনার সময়সীমা ও কাঙ্ক্ষিত ব্যান্ড স্কোর নির্ধারণ করে স্মার্ট রুটিন তৈরি করুন
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {/* 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* LEFT COLUMN: Exam Type, Target Band, Daily Study Hours */}
              <div className="space-y-5">
                
                {/* 1. Exam Type Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bengali">
                    ১. পরীক্ষার ধরণ (Exam Track)
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'Academic', label: 'Academic', desc: 'Higher Studies' },
                      { id: 'General Training', label: 'General Training', desc: 'Work & Migration' }
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setExamType(item.id)}
                        className={`p-3 rounded-2xl border text-left transition-all relative ${
                          examType === item.id
                            ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500/20'
                            : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{item.label}</span>
                          {examType === item.id && (
                            <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Band Score Selection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bengali">
                      ২. টার্গেট ব্যান্ড স্কোর (Target Band)
                    </label>
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 shadow-xs font-mono">
                      Band {targetBand}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                      <button
                        type="button"
                        key={score}
                        onClick={() => setTargetBand(score)}
                        className={`py-2.5 rounded-xl text-xs font-black border transition-all font-mono ${
                          targetBand === score
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.03]'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Daily Study Hours Slider */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      দৈনিক পড়ার লক্ষ্য (Daily Study Hours)
                    </label>
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800 shadow-xs">
                      {dailyHoursGoal} Hours / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={dailyHoursGoal}
                    onChange={(e) => setDailyHoursGoal(e.target.value)}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bengali">
                    <span>১ ঘণ্টা (Light)</span>
                    <span>৪ ঘণ্টা (Standard)</span>
                    <span>৮+ ঘণ্টা (Intensive)</span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Duration Presets & Dates */}
              <div className="space-y-5">
                
                {/* 4. Duration Presets */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bengali">
                    ৩. প্রিপারেশনের মোট সময়সীমা (Timeline)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { days: 30, tag: 'Sprint' },
                      { days: 45, tag: 'Speed' },
                      { days: 60, tag: 'Standard' },
                      { days: 90, tag: 'Mastery' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.days}
                        onClick={() => handleDaysPreset(item.days)}
                        className={`p-3 rounded-2xl text-center border transition-all ${
                          totalDays === item.days && planType === 'days'
                            ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500/20'
                            : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-mono">{item.days} দিন</div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{item.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Custom Days & Exam Date Picker */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block font-bengali">
                      কাস্টম দিন (Days)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="7"
                        max="365"
                        value={totalDays}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 30;
                          setTotalDays(val);
                          const start = new Date(startDate);
                          const end = new Date(start);
                          end.setDate(end.getDate() + val);
                          setExamDate(end.toISOString().split('T')[0]);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 dark:text-slate-500 font-medium">Days</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block font-bengali">
                      পরীক্ষার সম্ভাব্য তারিখ
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={examDate}
                        onChange={handleExamDateChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Summary Preview Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-800/80 border border-indigo-100 dark:border-indigo-800 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bengali leading-relaxed text-slate-700 dark:text-slate-300">
                    আপনার নির্বাচিত প্ল্যান: <strong className="text-indigo-700 dark:text-indigo-400">{examType}</strong> • <strong className="text-indigo-700 dark:text-indigo-400">{totalDays} দিনের রোডম্যাপ</strong> • টার্গেট <strong className="text-indigo-700 dark:text-indigo-400">Band {targetBand}</strong>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Submit Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs transition-colors font-bengali"
              >
                বাতিল করুন
              </button>

              <button
                type="submit"
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>টার্গেট সেট করুন ও প্রিপারেশন শুরু করুন</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
