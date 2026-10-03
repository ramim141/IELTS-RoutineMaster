import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Check, 
  Plus, 
  Trash2, 
  Search, 
  RotateCcw, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  X,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Eye,
  EyeOff,
  Zap,
  Lightbulb,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  IELTS_CURATED_VOCAB, 
  IELTS_VOCAB_TOPICS, 
  BAND_PARAPHRASE_REPLACEMENTS, 
  HIGH_BAND_COLLOCATIONS 
} from '../data/ieltsVocabData';

export default function IeltsVocabVault({ 
  isOpen = true, 
  onClose,
  isPageView = false,
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Mastered Words in LocalStorage
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_vocab_mastered_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Initial reference sample word matching user's requested IELTS structure
  const SAMPLE_EXPONENTIAL_GROWTH = {
    id: 'sample_exp_growth',
    word: 'Exponential growth',
    pos: 'Noun phrase',
    alternative: 'Rapid increase / Very fast growth',
    meaning: 'Becoming more and more rapid in growth or development',
    bnMeaning: 'দ্রুত বা অত্যন্ত দ্রুত বৃদ্ধি (গুণোত্তর হারে বৃদ্ধি)',
    example: 'Over the past decade, the use of renewable energy has experienced exponential growth.',
    tip: '"Increased very fast" বা "Huge growth"-এর জায়গায় এটি ব্যবহার করলে ব্যান্ড স্কোর এক লাফে Band 8 লেভেলে যায়।',
    createdAt: '03/10/2026'
  };

  // Personal Word Vault in LocalStorage
  const [personalWords, setPersonalWords] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_personal_word_vault');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const hasExp = parsed.some(w => w.word?.toLowerCase() === 'exponential growth');
          if (!hasExp) {
            return [SAMPLE_EXPONENTIAL_GROWTH, ...parsed];
          }
          return parsed;
        }
      }
      return [SAMPLE_EXPONENTIAL_GROWTH];
    } catch (e) {
      return [SAMPLE_EXPONENTIAL_GROWTH];
    }
  });

  // Custom word form
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newPos, setNewPos] = useState('Noun phrase');
  const [newAlternative, setNewAlternative] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newBnMeaning, setNewBnMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newTip, setNewTip] = useState('');

  // Personal words collapsible state & search
  const [expandedWordIds, setExpandedWordIds] = useState({ sample_exp_growth: true });
  const [personalSearchQuery, setPersonalSearchQuery] = useState('');

  const toggleWordExpand = (id) => {
    setExpandedWordIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllPersonalWords = (expand) => {
    const nextState = {};
    personalWords.forEach(w => {
      nextState[w.id] = expand;
    });
    setExpandedWordIds(nextState);
  };

  const handleCloseModal = () => {
    setIsAddCustomOpen(false);
    setNewWord('');
    setNewPos('Noun phrase');
    setNewAlternative('');
    setNewMeaning('');
    setNewBnMeaning('');
    setNewExample('');
    setNewTip('');
  };

  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredWords = IELTS_CURATED_VOCAB.filter(item => {
    const matchesTopic = selectedTopic === 'All Topics' || item.topic === selectedTopic;
    const matchesQuery = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.bnMeaning.includes(searchQuery);
    return matchesTopic && matchesQuery;
  });

  const filteredPersonalWords = personalWords.filter(item => {
    if (!personalSearchQuery.trim()) return true;
    const q = personalSearchQuery.toLowerCase();
    return (
      item.word?.toLowerCase().includes(q) ||
      item.meaning?.toLowerCase().includes(q) ||
      item.bnMeaning?.toLowerCase().includes(q) ||
      item.alternative?.toLowerCase().includes(q) ||
      item.tip?.toLowerCase().includes(q) ||
      item.pos?.toLowerCase().includes(q)
    );
  });

  const toggleMastery = (wordId) => {
    const isAlready = masteredIds.includes(wordId);
    let updated;
    if (isAlready) {
      updated = masteredIds.filter(id => id !== wordId);
      showToast('রিভিউ তালিকায় রাখা হলো');
    } else {
      updated = [...masteredIds, wordId];
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.6 } });
      showToast('✓ Mastered চিহ্নিত করা হয়েছে');
    }

    setMasteredIds(updated);
    try {
      localStorage.setItem('ielts_vocab_mastered_ids', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const savePersonalWords = (words) => {
    setPersonalWords(words);
    try {
      localStorage.setItem('ielts_personal_word_vault', JSON.stringify(words));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPersonalWord = (e) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    const item = {
      id: 'p_word_' + Date.now(),
      word: newWord.trim(),
      pos: newPos,
      alternative: newAlternative.trim(),
      meaning: newMeaning.trim(),
      bnMeaning: newBnMeaning.trim(),
      example: newExample.trim(),
      tip: newTip.trim(),
      createdAt: new Date().toLocaleDateString('en-GB')
    };

    savePersonalWords([item, ...personalWords]);
    setExpandedWordIds(prev => ({ ...prev, [item.id]: true }));
    handleCloseModal();

    confetti({ particleCount: 25, spread: 35, origin: { y: 0.6 } });
    showToast('📝 নতুন শব্দ সেভ হয়েছে');
  };

  const handleDeletePersonalWord = (id) => {
    savePersonalWords(personalWords.filter(w => w.id !== id));
    showToast('মুছে ফেলা হয়েছে');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('✓ কপি হয়েছে');
  };

  const currentCard = filteredWords[cardIndex] || filteredWords[0];
  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const handleNextCard = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if (filteredWords.length === 0) return;
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
    setIsRevealed(false);
  };

  const handlePrevCard = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if (filteredWords.length === 0) return;
    setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    setIsRevealed(false);
  };

  const handleShuffle = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if (filteredWords.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    setCardIndex(randomIndex);
    setIsRevealed(false);
    showToast('🔀 র‍্যান্ডম শব্দ লোড হয়েছে');
  };

  // Keyboard navigation support
  useEffect(() => {
    if (!isOpen && !isPageView) return;

    const handleKeyDown = (e) => {
      if (isAddCustomOpen) {
        if (e.key === 'Escape') {
          handleCloseModal();
        }
        return;
      }

      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if (e.key === 'ArrowRight') {
        handleNextCard(e);
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard(e);
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsRevealed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPageView, filteredWords.length, isAddCustomOpen]);

  if (!isOpen && !isPageView) return null;

  const contentMarkup = (
    <div className={`relative w-full ${isPageView ? 'bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm' : 'max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl max-h-[90vh]'} text-slate-800 dark:text-slate-100 flex flex-col overflow-hidden`}>
      
      {/* Minimal Floating Toast */}
      {notification && (
        <div className="absolute top-3.5 right-14 z-50 px-3.5 py-1.5 rounded-lg bg-slate-900/90 dark:bg-slate-800 text-white text-xs font-medium font-bengali shadow-md flex items-center gap-1.5 animate-fadeIn border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2.5">
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

          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-bengali">
                IELTS Smart Vocab Bank
              </h3>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">
                • 650+ Band 8.0+ Words
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Minimal Mastery Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{masteredIds.length}/{IELTS_CURATED_VOCAB.length}</span>
            </span>
          </div>

          {!isPageView && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

        {/* Minimal Tab Switcher Bar */}
        <div className="px-5 py-2 bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'flashcards'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ফ্ল্যাশ-কার্ড</span>
            </button>

            <button
              onClick={() => setActiveTab('wordbank')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'wordbank'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>টপিক শব্দভাণ্ডার</span>
            </button>

            <button
              onClick={() => setActiveTab('paraphraser')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'paraphraser'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Band 8+ প্যারাফ্রেজিং</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>আমার নোট ({personalWords.length})</span>
            </button>

          </div>

          {/* Search bar */}
          {(activeTab === 'wordbank' || activeTab === 'flashcards') && (
            <div className="relative hidden md:block w-40">
              <input
                type="text"
                placeholder="Search word..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-xs"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Tab 1: Clean Minimal Interactive Flip Flashcard */}
        {activeTab === 'flashcards' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-950/20">
            <div className="max-w-lg mx-auto flex flex-col gap-4 min-h-full justify-between">
              
              {/* Top Toolbar: Topic Selector, Shuffle & Counter */}
              <div className="flex items-center justify-between gap-2 shrink-0">
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => {
                      setSelectedTopic(e.target.value);
                      setCardIndex(0);
                      setIsRevealed(false);
                    }}
                    className="appearance-none bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-xs transition-colors"
                  >
                    {IELTS_VOCAB_TOPICS.map(t => (
                      <option key={t} value={t} className="dark:bg-slate-800 dark:text-slate-200">{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    title="Shuffle cards"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="hidden sm:inline font-bengali">র‍্যান্ডম</span>
                  </button>

                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium min-w-[50px] text-right">
                    {filteredWords.length > 0 ? cardIndex + 1 : 0} / {filteredWords.length}
                  </span>
                </div>
              </div>

              {/* True Interactive Flip Flashcard Card */}
              {currentCard ? (
                <div 
                  onClick={() => setIsRevealed(prev => !prev)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm flex flex-col justify-between min-h-[300px] transition-all duration-150 cursor-pointer select-none group space-y-4 my-auto"
                >
                  
                  {/* Card Top: Topic & Controls */}
                  <div className="flex items-center justify-between gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                        {currentCard.topic}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold font-mono border border-indigo-100 dark:border-indigo-900/50">
                        Band 8.0+
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(currentCard.word);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="উচ্চারণ শুনুন (British Accent)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMastery(currentCard.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isCurrentMastered
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                        title={isCurrentMastered ? 'Mastered word' : 'Mark as mastered'}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body: FRONT SIDE vs BACK SIDE */}
                  {!isRevealed ? (
                    /* FRONT SIDE (Word & Active Recall) */
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-2 animate-fadeIn">
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {currentCard.word}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-mono">
                        <span>{currentCard.phonetic}</span>
                        <span>•</span>
                        <span className="italic text-slate-500 dark:text-slate-400 font-serif">{currentCard.pos}</span>
                      </div>
                    </div>
                  ) : (
                    /* BACK SIDE (Meaning, Bengali, Collocations, Example) */
                    <div className="space-y-3 py-1 text-left animate-fadeIn">
                      
                      {/* Header summary */}
                      <div className="border-b border-slate-100 dark:border-slate-700 pb-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                            {currentCard.word}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded">
                            {currentCard.phonetic} • {currentCard.pos}
                          </span>
                        </div>
                      </div>

                      {/* English Meaning */}
                      <div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {currentCard.meaning}
                        </p>
                      </div>

                      {/* Bengali Translation */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/80">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-bengali shrink-0">বাংলা অর্থ:</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-bengali">
                            {currentCard.bnMeaning}
                          </span>
                        </div>
                      </div>

                      {/* Collocations */}
                      {currentCard.collocations && currentCard.collocations.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                            Collocations
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentCard.collocations.map((c, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* IELTS Example Sentence */}
                      {currentCard.example && (
                        <div className="pt-0.5">
                          <p className="text-xs italic text-slate-600 dark:text-slate-300 border-l-2 border-indigo-400 dark:border-indigo-500 pl-2.5 py-1 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-r-md">
                            "{currentCard.example}"
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Card Bottom: Flip Hint */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors font-bengali shrink-0">
                    <div className="flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                      <span>{!isRevealed ? 'কার্ডে ক্লিক করে অর্থ দেখুন (Space)' : 'কার্ডে ক্লিক করে সামনের পাশে ফিরুন'}</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 font-bengali text-sm">
                  কোনো শব্দ পাওয়া যায়নি
                </div>
              )}

              {/* Clean Single Bottom Navigation Bar */}
              <div className="flex items-center gap-3 w-full justify-between shrink-0 pt-2 pb-1">
                <button
                  type="button"
                  onClick={(e) => handlePrevCard(e)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-2 shadow-xs transition-all active:scale-95 font-bengali cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের শব্দ</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMastery(currentCard?.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium font-bengali flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isCurrentMastered
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isCurrentMastered ? 'Mastered ✓' : 'মাস্টার্ড মার্ক করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleNextCard(e)}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium flex items-center gap-2 shadow-xs transition-all active:scale-95 font-bengali cursor-pointer"
                >
                  <span>পরের শব্দ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Minimal Word Bank Explorer */}
        {activeTab === 'wordbank' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-white dark:bg-slate-900">
            
            {/* Topic Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {IELTS_VOCAB_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                    selectedTopic === topic
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Word Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredWords.map((item) => {
                const isMastered = masteredIds.includes(item.id);

                return (
                  <div 
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isMastered 
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700' 
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                            {item.word}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 italic">
                            {item.phonetic}
                          </span>
                          <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.2 rounded text-slate-600 dark:text-slate-300">
                            {item.pos}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium font-bengali mt-0.5">
                          {item.bnMeaning}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => speakWord(item.word)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Listen"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleMastery(item.id)}
                          className={`p-1 rounded-lg border text-xs ${
                            isMastered 
                              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100' 
                              : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                          }`}
                          title="Mark as Mastered"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1.5 leading-relaxed">
                      {item.meaning}
                    </p>

                    {item.example && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                        "{item.example}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 3: Minimal Band 8+ Paraphrase Replacer Matrix */}
        {activeTab === 'paraphraser' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-white dark:bg-slate-900">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-bengali">
              <Lightbulb className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>সাধারণ Band 6 শব্দগুলোর বদলে এই হাই-ব্যান্ড অলটারনেটিভগুলো ব্যবহার করলে Lexical Resource স্কোর বৃদ্ধি পায়।</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BAND_PARAPHRASE_REPLACEMENTS.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      Basic: {item.simple}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      Band 8.0+ Upgrades
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.upgrades.map((u, uIdx) => (
                      <button
                        key={uIdx}
                        onClick={() => copyToClipboard(u)}
                        className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium transition-colors"
                        title="কপি করতে ক্লিক করুন"
                      >
                        {u}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded text-xs border border-slate-100 dark:border-slate-800">
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "{item.band8Sentence}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* High-Scoring Collocations */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold font-bengali text-slate-900 dark:text-slate-100 mb-2">
                মাস্টার কলোকেশন ও এক্সপ্রেশন
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HIGH_BAND_COLLOCATIONS.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100">{c.phrase}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bengali">{c.meaning}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">"{c.example}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Minimal Personal Word Vault */}
        {activeTab === 'personal' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white dark:bg-slate-900 custom-scrollbar">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm sm:text-base font-bold font-bengali text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>আপনার ব্যক্তিগত শব্দভাণ্ডার</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    {personalWords.length}টি শব্দ
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">
                  টেস্টে বা রিডিংয়ে পাওয়া নতুন শব্দগুলো এখানে কার্ড আকারে সংরক্ষিত
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Search in Personal Words (if > 2 words) */}
                {personalWords.length > 2 && (
                  <div className="relative w-full sm:w-44">
                    <input
                      type="text"
                      placeholder="শব্দ খুঁজুন..."
                      value={personalSearchQuery}
                      onChange={(e) => setPersonalSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-bengali"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}

                {/* Expand / Collapse All (if > 1 word) */}
                {personalWords.length > 1 && (
                  <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-800/60">
                    <button
                      type="button"
                      onClick={() => toggleAllPersonalWords(true)}
                      className="px-2 py-1 text-[11px] font-bengali font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                      title="সব কার্ড খুলুন"
                    >
                      সব খুলুন
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <button
                      type="button"
                      onClick={() => toggleAllPersonalWords(false)}
                      className="px-2 py-1 text-[11px] font-bengali font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                      title="সব কার্ড বন্ধ করুন"
                    >
                      সব বন্ধ
                    </button>
                  </div>
                )}

                {/* Add New Word Button -> Opens Popup Modal */}
                <button
                  type="button"
                  onClick={() => setIsAddCustomOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold font-bengali flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap ml-auto sm:ml-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>নতুন শব্দ যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {personalWords.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-bengali">
                    ব্যক্তিগত শব্দভাণ্ডারে এখনো কোনো শব্দ যোগ করা হয়নি
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali max-w-sm mx-auto">
                    ক্যামব্রিজ টেস্ট বা রিডিং পড়ার সময় পাওয়া কঠিন শব্দগুলো এখানে সংরক্ষণ করে নিয়মিত প্র্যাকটিস করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCustomOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-bengali shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>প্রথম শব্দটি যোগ করুন</span>
                </button>
              </div>
            ) : filteredPersonalWords.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-bengali">
                কোনো শব্দ খুঁজে পাওয়া যায়নি।
              </div>
            ) : (
              /* Collapsible Word Cards Grid */
              <div className="space-y-3">
              {filteredPersonalWords.map((word, idx) => {
                const isExpanded = Boolean(expandedWordIds[word.id]);

                // POS Color Badges
                const posColors = {
                  'Noun phrase': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
                  Noun: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
                  Verb: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
                  Adjective: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
                  Adverb: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
                  Collocation: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
                  Phrase: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
                  Idiom: 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60'
                };
                const posBadgeClass = posColors[word.pos] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                return (
                  <div 
                    key={word.id} 
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800/80 shadow-md ring-1 ring-indigo-500/10'
                        : 'bg-white dark:bg-slate-850/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {/* Collapsible Card Header (Click to expand/collapse) */}
                    <div 
                      onClick={() => toggleWordExpand(word.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 flex-wrap sm:flex-nowrap">
                        {/* Number & Word Header matching user screenshot */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                            {idx + 1}. {word.word}
                          </span>
                          <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md border ${posBadgeClass}`}>
                            {word.pos}
                          </span>
                        </div>

                        {/* Collapsed Preview */}
                        {!isExpanded && (
                          <div className="flex items-center gap-2 truncate text-xs text-slate-500 dark:text-slate-400 font-bengali">
                            {word.alternative && (
                              <span className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/40 text-[11px] font-mono truncate hidden sm:inline">
                                বিকল্প: {word.alternative}
                              </span>
                            )}
                            {word.bnMeaning && (
                              <span className="truncate hidden md:inline">
                                • {word.bnMeaning}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons on header */}
                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button 
                          type="button"
                          onClick={() => speakWord(word.word)} 
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title="উচ্চারণ শুনুন"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleWordExpand(word.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title={isExpanded ? 'সংকোচন করুন' : 'বিস্তারিত দেখুন'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Card Body Drawer (Exact structure matching user screenshot) */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-3 animate-fadeIn text-xs sm:text-sm font-bengali leading-relaxed">
                        
                        {/* 1. Part of Speech */}
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full border border-slate-400 dark:border-slate-500 shrink-0 mt-1.5" />
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-slate-100">Part of Speech:</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                              {word.pos}
                            </span>
                          </div>
                        </div>

                        {/* 2. সাধারণ শব্দের বিকল্প */}
                        {word.alternative && (
                          <div className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full border border-amber-500 shrink-0 mt-1.5" />
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-slate-100">সাধারণ শব্দের বিকল্প:</span>
                              <span className="font-mono text-amber-800 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800/60">
                                {word.alternative}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 3. English Meaning */}
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full border border-indigo-500 shrink-0 mt-1.5" />
                          <div className="flex items-start gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">English Meaning:</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {word.meaning}
                            </span>
                          </div>
                        </div>

                        {/* 4. বাংলা অর্থ */}
                        {word.bnMeaning && (
                          <div className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full border border-emerald-500 shrink-0 mt-1.5" />
                            <div className="flex items-start gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">বাংলা অর্থ:</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold">
                                {word.bnMeaning}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 5. Writing/Speaking Use */}
                        {word.example && (
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full border border-purple-500 shrink-0" />
                              <span className="font-bold text-slate-900 dark:text-slate-100">Writing/Speaking Use:</span>
                            </div>
                            <div className="ml-5 pl-4 py-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 border-l-4 border-l-indigo-500 font-serif italic text-slate-800 dark:text-slate-200 text-xs sm:text-[13px] leading-relaxed shadow-2xs">
                              "{word.example}"
                            </div>
                          </div>
                        )}

                        {/* 6. টিপ */}
                        {word.tip && (
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-slate-900 dark:text-amber-100">
                            <span className="w-2 h-2 rounded-full border border-amber-600 dark:border-amber-400 shrink-0 mt-1.5" />
                            <div className="text-xs sm:text-[13px] leading-relaxed">
                              <strong className="font-bold text-amber-900 dark:text-amber-300">টিপ: </strong>
                              <span>{word.tip}</span>
                            </div>
                          </div>
                        )}

                        {/* Card Footer: Meta & Action controls */}
                        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                          <span>
                            {word.createdAt ? `যুক্ত হয়েছে: ${word.createdAt}` : ''}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(word.word)}
                              className="px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                              title="শব্দ কপি করুন"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => speakWord(word.word)}
                              className="px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bengali flex items-center gap-1 transition-colors cursor-pointer"
                              title="উচ্চারণ শুনুন"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>শুনুন</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePersonalWord(word.id)}
                              className="px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bengali flex items-center gap-1 transition-colors cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছুন</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}

          </div>
        )}

        {/* ADD PERSONAL WORD POPUP MODAL */}
        {isAddCustomOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs animate-fadeIn"
            onClick={handleCloseModal}
          >
            <div 
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-bengali">
                      নতুন শব্দ যোগ করুন
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali">
                      IELTS Band 8+ ফরম্যাটে নতুন শব্দ ও প্রয়োগ টুকে রাখুন
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddPersonalWord} className="p-5 sm:p-6 space-y-3.5 overflow-y-auto custom-scrollbar flex-1">
                {/* 1. Word & Part of Speech */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1">
                      <span>শব্দ বা ফ্রেজ (Word / Phrase)</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="উদাঃ Exponential growth"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali">
                      Part of Speech
                    </label>
                    <select
                      value={newPos}
                      onChange={(e) => setNewPos(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-mono"
                    >
                      <option value="Noun phrase">Noun phrase</option>
                      <option value="Noun">Noun</option>
                      <option value="Verb">Verb</option>
                      <option value="Adjective">Adjective</option>
                      <option value="Adverb">Adverb</option>
                      <option value="Collocation">Collocation</option>
                      <option value="Phrase">Phrase</option>
                      <option value="Idiom">Idiom</option>
                    </select>
                  </div>
                </div>

                {/* 2. সাধারণ শব্দের বিকল্প */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center justify-between">
                    <span>সাধারণ শব্দের বিকল্প (Alternative / Replacement)</span>
                    <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">যার বদলে এটি ব্যবহার করবেন</span>
                  </label>
                  <input
                    type="text"
                    placeholder="উদাঃ Rapid increase / Very fast growth"
                    value={newAlternative}
                    onChange={(e) => setNewAlternative(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* 3. English Meaning & বাংলা অর্থ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1">
                      <span>English Meaning</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="উদাঃ Becoming more and more rapid in growth"
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali">
                      বাংলা অর্থ
                    </label>
                    <input
                      type="text"
                      placeholder="উদাঃ দ্রুত বা অত্যন্ত দ্রুত বৃদ্ধি (গুণোত্তর হারে বৃদ্ধি)"
                      value={newBnMeaning}
                      onChange={(e) => setNewBnMeaning(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bengali text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* 4. Writing/Speaking Use */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali">
                    Writing/Speaking Use: (বাক্য প্রয়োগ)
                  </label>
                  <textarea
                    rows="2"
                    placeholder='উদাঃ "Over the past decade, the use of renewable energy has experienced exponential growth."'
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-serif"
                  />
                </div>

                {/* 5. টিপ */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>টিপ (IELTS Band 8+ পরামর্শ)</span>
                  </label>
                  <textarea
                    rows="2"
                    placeholder='উদাঃ "Increased very fast" বা "Huge growth"-এর জায়গায় এটি ব্যবহার করলে ব্যান্ড স্কোর এক লাফে Band 8 লেভেলে যায়।'
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bengali text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold font-bengali text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-bengali shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>সেভ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 sm:px-6 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bengali">
            * কিবোর্ড শর্টকাট: ← আগের শব্দ | → পরের শব্দ | Space অর্থ টগল
          </span>

          <button
            onClick={isPageView ? onBack : onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium font-bengali transition-all active:scale-95 cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      {contentMarkup}
    </div>
  );
}
