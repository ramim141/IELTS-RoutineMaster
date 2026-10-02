import React from 'react';
import { 
  Clock, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Sparkles, 
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function DailyTimeBreakdownChart({ dailyTasks = [], targetSettings }) {
  const dailyHoursGoal = targetSettings?.dailyHoursGoal || 4;
  const goalMinutes = dailyHoursGoal * 60;

  // Module breakdown calculation
  const breakdown = dailyTasks.reduce((acc, t) => {
    const mins = parseInt(t.estimatedTime, 10) || 0;
    const mod = t.module || 'Other';

    if (mod.includes('Listening')) acc.listening += mins;
    else if (mod.includes('Reading')) acc.reading += mins;
    else if (mod.includes('Writing')) acc.writing += mins;
    else if (mod.includes('Speaking')) acc.speaking += mins;
    else acc.vocab += mins;

    acc.total += mins;
    if (t.completed) acc.completedMinutes += mins;

    return acc;
  }, {
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    vocab: 0,
    total: 0,
    completedMinutes: 0
  });

  const totalHours = (breakdown.total / 60).toFixed(1);
  const completedHours = (breakdown.completedMinutes / 60).toFixed(1);
  const goalPercent = Math.min(100, Math.round((breakdown.total / goalMinutes) * 100));

  const getPercentage = (mins) => {
    if (breakdown.total === 0) return 0;
    return Math.round((mins / breakdown.total) * 100);
  };

  const modulesData = [
    { 
      name: 'Listening', 
      label: 'লিসেনিং', 
      mins: breakdown.listening, 
      pct: getPercentage(breakdown.listening),
      color: 'bg-amber-500', 
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: Headphones
    },
    { 
      name: 'Reading', 
      label: 'রিডিং', 
      mins: breakdown.reading, 
      pct: getPercentage(breakdown.reading),
      color: 'bg-sky-500', 
      textColor: 'text-sky-700',
      bgLight: 'bg-sky-50',
      borderColor: 'border-sky-200',
      icon: BookOpen
    },
    { 
      name: 'Writing', 
      label: 'রাইটিং', 
      mins: breakdown.writing, 
      pct: getPercentage(breakdown.writing),
      color: 'bg-purple-500', 
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: PenTool
    },
    { 
      name: 'Speaking', 
      label: 'স্পিকিং', 
      mins: breakdown.speaking, 
      pct: getPercentage(breakdown.speaking),
      color: 'bg-emerald-500', 
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: Mic
    },
    { 
      name: 'Vocab', 
      label: 'ভোকাভুলারি ও টিপস', 
      mins: breakdown.vocab, 
      pct: getPercentage(breakdown.vocab),
      color: 'bg-indigo-500', 
      textColor: 'text-indigo-700',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      icon: Sparkles
    }
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-bengali text-slate-900 flex items-center gap-2">
              দৈনিক সময়ের ব্যালেন্স চার্ট (Time Breakdown Chart)
            </h3>
            <p className="text-[11px] text-slate-500 font-bengali">
              ৪টি মডিউলের মধ্যে সময়ের ভারসাম্য ও লক্ষ্যমাত্রা ট্র্যাক করুন
            </p>
          </div>
        </div>

        {/* Goal Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>{totalHours}h / {dailyHoursGoal}h Goal ({goalPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 shadow-inner">
          {breakdown.total === 0 ? (
            <div className="w-full h-full bg-slate-200 rounded-full animate-pulse" />
          ) : (
            modulesData.map((m) => {
              if (m.mins === 0) return null;
              return (
                <div
                  key={m.name}
                  style={{ width: `${m.pct}%` }}
                  className={`h-full ${m.color} first:rounded-l-full last:rounded-r-full transition-all duration-500`}
                  title={`${m.label}: ${m.mins} min (${m.pct}%)`}
                />
              );
            })
          )}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bengali px-1">
          <span>মোট পরিকল্পিত সময়: <strong className="text-slate-800 font-mono font-bold">{breakdown.total} মিনিট</strong> ({totalHours} ঘণ্টা)</span>
          <span>সম্পন্ন হয়েছে: <strong className="text-emerald-600 font-mono font-bold">{breakdown.completedMinutes} মিনিট</strong> ({completedHours} ঘণ্টা)</span>
        </div>
      </div>

      {/* 5 Module Pill Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
        {modulesData.map((m) => {
          const IconComponent = m.icon;
          return (
            <div 
              key={m.name}
              className={`p-3 rounded-2xl border ${m.bgLight} ${m.borderColor} shadow-xs space-y-1`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <IconComponent className={`w-3.5 h-3.5 ${m.textColor}`} />
                  <span className={`text-xs font-bold font-bengali ${m.textColor}`}>{m.label}</span>
                </div>
                <span className="text-[10px] font-mono font-black text-slate-500">{m.pct}%</span>
              </div>
              <div className="text-sm font-black font-mono text-slate-900">
                {m.mins} <span className="text-[10px] font-bengali font-normal text-slate-500">মিনিট</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
