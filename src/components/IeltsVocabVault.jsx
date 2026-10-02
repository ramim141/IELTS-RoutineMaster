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

export default function IeltsVocabVault({ isOpen, onClose }) {
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

  // Personal Word Vault in LocalStorage
  const [personalWords, setPersonalWords] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_personal_word_vault');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Custom word form
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newPos, setNewPos] = useState('Noun');
  const [newMeaning, setNewMeaning] = useState('');
  const [newBnMeaning, setNewBnMeaning] = useState('');
  const [newExample, setNewExample] = useState('');

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
      meaning: newMeaning.trim(),
      bnMeaning: newBnMeaning.trim(),
      example: newExample.trim(),
      createdAt: new Date().toLocaleDateString('en-GB')
    };

    savePersonalWords([item, ...personalWords]);
    setNewWord('');
    setNewMeaning('');
    setNewBnMeaning('');
    setNewExample('');
    setIsAddCustomOpen(false);

    confetti({ particleCount: 20, spread: 30, origin: { y: 0.6 } });
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
    if (!isOpen) return;

    const handleKeyDown = (e) => {
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
  }, [isOpen, filteredWords.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200/90 rounded-2xl shadow-xl text-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Minimal Floating Toast */}
        {notification && (
          <div className="absolute top-3.5 right-14 z-50 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md text-white text-xs font-medium font-bengali shadow-md flex items-center gap-1.5 animate-fadeIn">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{notification}</span>
          </div>
        )}

        {/* Minimal Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-bengali">
                  IELTS Smart Vocab Bank
                </h3>
                <span className="text-[11px] font-mono text-slate-400 font-normal hidden sm:inline">
                  • 650+ Band 8.0+ Words
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Minimal Mastery Counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-600">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{masteredIds.length}/{IELTS_CURATED_VOCAB.length}</span>
              </span>
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

        {/* Minimal Tab Switcher Bar */}
        <div className="px-5 py-2 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'flashcards'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ফ্ল্যাশ-কার্ড</span>
            </button>

            <button
              onClick={() => setActiveTab('wordbank')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'wordbank'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>টপিক শব্দভাণ্ডার</span>
            </button>

            <button
              onClick={() => setActiveTab('paraphraser')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'paraphraser'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Band 8+ প্যারাফ্রেজিং</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bengali transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white'
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
                className="w-full bg-white border border-slate-200/90 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-xs"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Tab 1: Clean Minimal Interactive Flip Flashcard */}
        {activeTab === 'flashcards' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
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
                    className="appearance-none bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-xs transition-colors"
                  >
                    {IELTS_VOCAB_TOPICS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    title="Shuffle cards"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline font-bengali">র‍্যান্ডম</span>
                  </button>

                  <span className="text-xs font-mono text-slate-500 font-medium min-w-[50px] text-right">
                    {filteredWords.length > 0 ? cardIndex + 1 : 0} / {filteredWords.length}
                  </span>
                </div>
              </div>

              {/* True Interactive Flip Flashcard Card */}
              {currentCard ? (
                <div 
                  onClick={() => setIsRevealed(prev => !prev)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm flex flex-col justify-between min-h-[300px] transition-all duration-150 cursor-pointer select-none group space-y-4 my-auto"
                >
                  
                  {/* Card Top: Topic & Controls */}
                  <div className="flex items-center justify-between gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {currentCard.topic}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold font-mono">
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
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
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
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:border-slate-300'
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
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono group-hover:text-indigo-950 transition-colors">
                        {currentCard.word}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                        <span>{currentCard.phonetic}</span>
                        <span>•</span>
                        <span className="italic text-slate-500 font-serif">{currentCard.pos}</span>
                      </div>
                    </div>
                  ) : (
                    /* BACK SIDE (Meaning, Bengali, Collocations, Example) */
                    <div className="space-y-3 py-1 text-left animate-fadeIn">
                      
                      {/* Header summary */}
                      <div className="border-b border-slate-100 pb-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-mono font-bold text-slate-900 text-base sm:text-lg">
                            {currentCard.word}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                            {currentCard.phonetic} • {currentCard.pos}
                          </span>
                        </div>
                      </div>

                      {/* English Meaning */}
                      <div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                          {currentCard.meaning}
                        </p>
                      </div>

                      {/* Bengali Translation */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-slate-400 font-bengali shrink-0">বাংলা অর্থ:</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 font-bengali">
                            {currentCard.bnMeaning}
                          </span>
                        </div>
                      </div>

                      {/* Collocations */}
                      {currentCard.collocations && currentCard.collocations.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold block">
                            Collocations
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentCard.collocations.map((c, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
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
                          <p className="text-xs italic text-slate-600 border-l-2 border-indigo-400 pl-2.5 py-1 bg-indigo-50/20 rounded-r-md">
                            "{currentCard.example}"
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Card Bottom: Flip Hint */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-center text-xs text-slate-400 group-hover:text-slate-600 transition-colors font-bengali shrink-0">
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
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-medium flex items-center gap-2 shadow-xs transition-all active:scale-95 font-bengali cursor-pointer"
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
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isCurrentMastered ? 'Mastered ✓' : 'মাস্টার্ড মার্ক করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleNextCard(e)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-all active:scale-95 font-bengali cursor-pointer"
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
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-white">
            
            {/* Topic Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {IELTS_VOCAB_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                    selectedTopic === topic
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
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
                      isMastered ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold font-mono text-slate-900">
                            {item.word}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 italic">
                            {item.phonetic}
                          </span>
                          <span className="text-[9px] font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-600">
                            {item.pos}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium font-bengali mt-0.5">
                          {item.bnMeaning}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => speakWord(item.word)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Listen"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleMastery(item.id)}
                          className={`p-1 rounded-lg border text-xs ${
                            isMastered 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                          }`}
                          title="Mark as Mastered"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                      {item.meaning}
                    </p>

                    {item.example && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100">
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
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-white">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-700 font-bengali">
              <Lightbulb className="w-4 h-4 text-slate-500 shrink-0" />
              <span>সাধারণ Band 6 শব্দগুলোর বদলে এই হাই-ব্যান্ড অলটারনেটিভগুলো ব্যবহার করলে Lexical Resource স্কোর বৃদ্ধি পায়।</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BAND_PARAPHRASE_REPLACEMENTS.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Basic: {item.simple}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Band 8.0+ Upgrades
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.upgrades.map((u, uIdx) => (
                      <button
                        key={uIdx}
                        onClick={() => copyToClipboard(u)}
                        className="px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono font-medium transition-colors"
                        title="কপি করতে ক্লিক করুন"
                      >
                        {u}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-2 rounded text-xs border border-slate-100">
                    <p className="italic text-slate-700">
                      "{item.band8Sentence}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* High-Scoring Collocations */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold font-bengali text-slate-900 mb-2">
                মাস্টার কলোকেশন ও এক্সপ্রেশন
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HIGH_BAND_COLLOCATIONS.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-900">{c.phrase}</span>
                      <span className="text-[10px] text-slate-500 font-bengali">{c.meaning}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{c.example}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Minimal Personal Word Vault */}
        {activeTab === 'personal' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-white">
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold font-bengali text-slate-900">
                  আপনার ব্যক্তিগত শব্দভাণ্ডার ({personalWords.length}টি শব্দ)
                </h4>
                <p className="text-xs text-slate-500 font-bengali">
                  টেস্টে পাওয়া নতুন শব্দগুলো এখানে টুকে রাখুন
                </p>
              </div>

              <button
                onClick={() => setIsAddCustomOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium font-bengali flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন শব্দ যোগ করুন</span>
              </button>
            </div>

            {isAddCustomOpen && (
              <form onSubmit={handleAddPersonalWord} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-xs font-bold font-bengali text-slate-800">নতুন শব্দ এন্ট্রি</span>
                  <button type="button" onClick={() => setIsAddCustomOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Word (e.g. Ubiquitous)"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                  <div>
                    <select
                      value={newPos}
                      onChange={(e) => setNewPos(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      <option value="Noun">Noun</option>
                      <option value="Verb">Verb</option>
                      <option value="Adjective">Adjective</option>
                      <option value="Adverb">Adverb</option>
                      <option value="Phrase">Phrase</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="English Meaning"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="বাংলা অর্থ (ঐচ্ছিক)"
                    value={newBnMeaning}
                    onChange={(e) => setNewBnMeaning(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Example Sentence (ঐচ্ছিক)"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddCustomOpen(false)}
                    className="px-2.5 py-1 rounded text-xs text-slate-600 hover:bg-slate-200"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold font-bengali"
                  >
                    সেভ করুন
                  </button>
                </div>
              </form>
            )}

            {personalWords.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                <Bookmark className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-bengali">
                  ব্যক্তিগত শব্দভাণ্ডারে এখনো কোনো শব্দ যোগ করা হয়নি।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {personalWords.map((word) => (
                  <div key={word.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-sm font-bold font-mono text-slate-900">{word.word}</h5>
                          <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded">{word.pos}</span>
                        </div>
                        {word.bnMeaning && (
                          <span className="text-xs text-slate-700 font-bengali block">
                            {word.bnMeaning}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button onClick={() => speakWord(word.word)} className="p-1 text-slate-400 hover:text-slate-700">
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeletePersonalWord(word.id)} className="p-1 text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">{word.meaning}</p>
                    {word.example && (
                      <p className="text-[11px] italic text-slate-500 border-l border-slate-300 pl-2">
                        "{word.example}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Minimal Footer */}
        <div className="px-5 sm:px-6 py-2.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <span className="text-[11px] text-slate-400 font-bengali">
            * কিবোর্ড শর্টকাট: ← আগের শব্দ | → পরের শব্দ | Space অর্থ টগল
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
