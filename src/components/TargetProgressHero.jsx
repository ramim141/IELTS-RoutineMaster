import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  Target, 
  Flame,
  CheckCircle2,
  CalendarCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { IELTS_TIPS } from '../data/ieltsTips';

export default function TargetProgressHero({ 
  targetSettings, 
  currentDay, 
  onDayChange, 
  onOpenSettings 
}) {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * IELTS_TIPS.length));
  const [isFading, setIsFading] = useState(false);

  // Auto-refresh tips every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % IELTS_TIPS.length);
        setIsFading(false);
      }, 300);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const totalDays = targetSettings.totalDays || 60;
  const progressPercent = Math.min(100, Math.round((currentDay / totalDays) * 100));
  const daysRemaining = Math.max(0, totalDays - currentDay);

  // Determine current phase details
  const getPhaseDetails = () => {
    if (progressPercent < 35) {
      return { 
        name: 'Phase 1: Foundation & Basics', 
        desc: 'কোর টেকনিক ও বেসিক স্কিল ডেভেলপমেন্ট',
        step: 1,
        color: 'text-sky-700 bg-sky-50 border-sky-200' 
      };
    }
    if (progressPercent < 75) {
      return { 
        name: 'Phase 2: Intensive Practice', 
        desc: 'ক্যামব্রিজ টেস্ট ও টাইম ম্যানেজমেন্ট',
        step: 2,
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200' 
      };
    }
    return { 
      name: 'Phase 3: Final Mock Sprint', 
      desc: 'ফুল লেন্থ মক টেস্ট ও ফাইনাল রিভিশন',
      step: 3,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200' 
    };
  };

  const phase = getPhaseDetails();

  const formattedExamDate = new Date(targetSettings.examDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Calculate SVG Circular Progress parameters
  const circleRadius = 42;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] overflow-hidden transition-all">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER BAR: Current Phase & Smart Day Controls */}
      {/* ======================================================== */}
      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="font-mono text-indigo-600 uppercase tracking-wide text-[11px]">
              {targetSettings.examType}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-bengali text-slate-700">{phase.name}</span>
          </div>

          <span className="hidden md:inline text-xs text-slate-400 font-bengali">
            {phase.desc}
          </span>
        </div>

        {/* Smart Day Stepper */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 p-1 rounded-2xl shadow-xs">
          <button
            onClick={() => onDayChange(Math.max(1, currentDay - 1))}
            disabled={currentDay <= 1}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="আগের দিন"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDayChange(1)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-100 transition-colors font-mono"
            title="Day 1 এ ফিরে যান"
          >
            Day 1
          </button>

          <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-black font-mono shadow-xs">
            Day {currentDay} <span className="opacity-70 font-normal">/ {totalDays}</span>
          </span>

          <button
            onClick={() => onDayChange(Math.min(totalDays, currentDay + 1))}
            disabled={currentDay >= totalDays}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="পরের দিন"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN COCKPIT BODY: Circular Ring + 4 Smart Metrics */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* LEFT: Hero Circular Dial & Current Day Highlight */}
        <div className="lg:col-span-5 flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white border border-slate-200/80 shadow-xs">
          {/* Radial Progress Gauge */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                className="text-slate-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                className="text-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                {progressPercent}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Done
              </span>
            </div>
          </div>

          {/* Day & Timeline Status */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bengali">আজকের সক্রিয় দিন</span>
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                Day {currentDay}
              </h2>
              <span className="text-xs font-semibold text-slate-400 font-mono">
                / {totalDays}d
              </span>
            </div>

            <p className="text-xs text-slate-500 font-bengali flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>পরীক্ষা: <strong className="text-slate-800 font-semibold">{formattedExamDate}</strong></span>
            </p>
          </div>
        </div>

        {/* RIGHT: 4 Smart Connected Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* 1. Countdown Days Left */}
          <div className="group p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/70 transition-all hover:scale-[1.02] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[11px] font-bold font-bengali">বাকি দিন</span>
              <div className="p-1 rounded-lg bg-amber-100 text-amber-700">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono tracking-tight">
                {daysRemaining}
              </div>
            </div>
            <span className="text-[10px] text-amber-700/80 font-medium">Days to Exam</span>
          </div>

          {/* 2. Target Band */}
          <div className="group p-4 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200/70 transition-all hover:scale-[1.02] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-800">
              <span className="text-[11px] font-bold font-bengali">টার্গেট ব্যান্ড</span>
              <div className="p-1 rounded-lg bg-indigo-100 text-indigo-700">
                <Target className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono tracking-tight">
                {targetSettings.targetBand}
              </div>
            </div>
            <span className="text-[10px] text-indigo-700/80 font-medium">Target Score</span>
          </div>

          {/* 3. Daily Study Goal */}
          <div className="group p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200/70 transition-all hover:scale-[1.02] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-[11px] font-bold font-bengali">দৈনিক স্টাডি</span>
              <div className="p-1 rounded-lg bg-purple-100 text-purple-700">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-black text-purple-600 font-mono tracking-tight">
                {targetSettings.dailyHoursGoal}h
              </div>
            </div>
            <span className="text-[10px] text-purple-700/80 font-medium">Goal / Day</span>
          </div>

          {/* 4. Preparation Pace */}
          <div className="group p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/70 transition-all hover:scale-[1.02] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[11px] font-bold font-bengali">রোডম্যাপ পেস</span>
              <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight">
                {progressPercent}%
              </div>
            </div>
            <span className="text-[10px] text-emerald-700/80 font-medium">Pace: Perfect 🔥</span>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. INTEGRATED 3-PHASE STEP PROGRESS TRACKER */}
      {/* ======================================================== */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 font-bengali flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            রোডম্যাপ প্রগ্রেস ও মাইলস্টোন
          </span>
          <span className="font-mono text-indigo-600 font-bold bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Milestone Segment Track */}
        <div className="relative w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-700 ease-out relative shadow-xs"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/80 rounded-full animate-pulse" />
          </div>
        </div>

        {/* 3-Phases Interactive Labels */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className={`text-left p-1.5 rounded-lg text-[10px] transition-colors ${progressPercent < 35 ? 'bg-indigo-50 font-bold text-indigo-700 border border-indigo-100' : 'text-slate-400'}`}>
            <span className="font-mono">01.</span> Foundation (Day 1 - {Math.round(totalDays * 0.35)})
          </div>
          <div className={`text-center p-1.5 rounded-lg text-[10px] transition-colors ${progressPercent >= 35 && progressPercent < 75 ? 'bg-indigo-50 font-bold text-indigo-700 border border-indigo-100' : 'text-slate-400'}`}>
            <span className="font-mono">02.</span> Intensive ({Math.round(totalDays * 0.35) + 1} - {Math.round(totalDays * 0.75)})
          </div>
          <div className={`text-right p-1.5 rounded-lg text-[10px] transition-colors ${progressPercent >= 75 ? 'bg-emerald-50 font-bold text-emerald-700 border border-emerald-100' : 'text-slate-400'}`}>
            <span className="font-mono">03.</span> Mock Sprint ({Math.round(totalDays * 0.75) + 1} - {totalDays}🎯)
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. CLEAN FULLY-AUTOMATIC IELTS PRO TIP TICKER (30s AUTO ROTATE) */}
      {/* ======================================================== */}
      <div className="relative px-6 py-3.5 bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white flex items-center justify-between gap-4 overflow-hidden">
        
        {/* Subtle 30s cycle pulse bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500/20 overflow-hidden">
          <div 
            key={tipIndex}
            className="h-full bg-amber-400/90"
            style={{ width: '100%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          />
        </div>

        <div className="flex items-center gap-3.5 overflow-hidden w-full">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider shrink-0 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>IELTS Tip #{tipIndex + 1}</span>
          </div>

          <p className={`text-xs text-indigo-50 font-bengali truncate font-medium transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            {IELTS_TIPS[tipIndex]}
          </p>
        </div>

      </div>

    </div>
  );
}
