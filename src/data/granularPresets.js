// Ultra-comprehensive IELTS Micro-Tasks Preset Library (Covering all modules, question types & skill drills)

export const GRANULAR_IELTS_PRESETS = [
  // ==========================================
  // 1. LISTENING MODULE (10 Specific Micro-Tasks)
  // ==========================================
  {
    module: 'Listening',
    icon: 'Headphones',
    color: 'amber',
    tasks: [
      {
        id: 'lis_sec1_form',
        title: 'Listening Section 1: Form & Table Filling (Names, Numbers & Spelling)',
        desc: 'ফোন নম্বর, পোস্টকোড, তারিখ ও নামের বানান নিখুঁত করার প্র্যাকটিস',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'high'
      },
      {
        id: 'lis_sec2_map',
        title: 'Listening Section 2: Map & Diagram Labeling Targeted Drill',
        desc: 'ডিরেকশন, এন্ট্রান্স, করিডোর ও পজিশন বোঝার ৫টি ম্যাপ সলভ',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'lis_sec3_discussion',
        title: 'Listening Section 3: Academic Discussion & Multiple Choice',
        desc: 'ছাত্র-শিক্ষকের কথোপকথন এবং কে কোন প্রস্তাবে রাজি হলো তা ট্র্যাক করা',
        defaultTime: 30,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'lis_sec4_lecture',
        title: 'Listening Section 4: Fast Monologue & Flowchart Completion',
        desc: 'টানা ১৫ মিনিট কোনো বিরতি ছাড়া দ্রুত লেকচার শুনে নোট নেওয়া',
        defaultTime: 30,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'lis_distractors_drill',
        title: 'Listening: Distractor Elimination Drill (Spotting Corrections)',
        desc: 'স্পিকারের "Actually", "Sorry, I meant", "Instead" জাতীয় ভুল শুধরানো নোটিশ করা',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'medium'
      },
      {
        id: 'lis_cambridge_full_mock',
        title: 'Cambridge Full Listening Test (40 Questions Timed)',
        desc: 'সেকশন ১ থেকে ৪ ফুল টেস্ট ও সাথে সাথে স্ক্রিপ্ট দেখে অ্যানালাইসিস',
        defaultTime: 45,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'lis_script_analysis',
        title: 'Listening Audio Script Deep Analysis & Synonym Hunting',
        desc: 'অডিও স্ক্রিপ্ট পড়ে মিস হওয়া কী-ওয়ার্ড ও প্রতিশব্দ হাইলাইট করা',
        defaultTime: 25,
        defaultSlot: 'night',
        priority: 'medium'
      },
      {
        id: 'lis_speed_boost_125x',
        title: 'Speed Listening: 1.25x Speed Reflex Booster Practice',
        desc: '১.২৫ গুণ গতিতে অডিও শুনে দ্রুত রেসপন্স করার ক্ষমতা বাড়ানো',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'medium'
      },
      {
        id: 'lis_accent_familiarization',
        title: 'Accent Drill: British, Australian & Canadian Podcasts Dictation',
        desc: 'বিভিন্ন এক্সেন্টের অডিও শুনে কঠিন বাক্য খাতায় লিখে নেওয়া',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'low'
      },
      {
        id: 'lis_spelling_traps',
        title: 'Listening Spelling Traps: 50 Most Frequently Misspelled Words',
        desc: 'Environment, Accommodation, Privilege, Recommendation বানান রিভিশন',
        defaultTime: 15,
        defaultSlot: 'morning',
        priority: 'high'
      }
    ]
  },

  // ==========================================
  // 2. READING MODULE (11 Specific Micro-Tasks)
  // ==========================================
  {
    module: 'Reading',
    icon: 'BookOpen',
    color: 'sky',
    tasks: [
      {
        id: 'read_tfng_mastery',
        title: 'Reading: True / False / Not Given 15 Questions Targeted Drill',
        desc: 'প্যাসেজের ফ্যাক্ট বিশ্লেষণ ও লজিক্যাল এলিমিনেশন টেকনিক মাস্টার করা',
        defaultTime: 30,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'read_ynng_opinions',
        title: 'Reading: Yes / No / Not Given (Writer\'s Views & Claims)',
        desc: 'লেখকের মতামত বনাম সাধারণ তথ্যের পার্থক্য বিশ্লেষণ ড্রিল',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'read_headings_skimming',
        title: 'Reading: Matching Headings Elimination Drill (2 Passages)',
        desc: 'প্যারাগ্রাফের ১ম ও শেষ লাইন স্কিম করে থিম বের করার কৌশল',
        defaultTime: 30,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'read_paragraph_matching',
        title: 'Reading: Matching Information to Paragraphs (Where is detail?)',
        desc: 'প্যাসেজের ভেতরের নির্দিষ্ট তথ্য ও উদাহরণ কোন প্যারাগ্রাফে আছে খোঁজা',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'medium'
      },
      {
        id: 'read_summary_completion',
        title: 'Reading: Summary & Sentence Completion (Word Limit & Synonyms)',
        desc: 'গ্রামাটিক্যাল ফর্ম (Noun/Verb) দেখে শূন্যস্থান পূরণের শর্টকাট',
        defaultTime: 25,
        defaultSlot: 'morning',
        priority: 'medium'
      },
      {
        id: 'read_passage1_sprint',
        title: 'Reading Passage 1 Speed Sprint (Target: 13/13 in 15 mins)',
        desc: 'প্যাসেজ ১ এ দ্রুত স্ক্যানিং করে ১৫ মিনিটে ফুল মার্কস তোলার ড্রিল',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'high'
      },
      {
        id: 'read_passage2_timed',
        title: 'Reading Passage 2 Academic Article (Timed 20 Mins)',
        desc: 'মিডিয়াম লেভেলের একাডেমিক আর্টিকেলের দ্রুত উত্তর বের করা',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'read_passage3_hard',
        title: 'Reading Passage 3 Deep Science/Philosophy Article Analysis',
        desc: 'জটিল ও দীর্ঘ প্যাসেজের সিনোনিম ট্র্যাকিং ও নিখুঁত সমাধান',
        defaultTime: 35,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'read_full_exam_mock',
        title: 'Cambridge Full Reading Exam Simulation (3 Passages • 60 Mins)',
        desc: 'পরীক্ষার হলের মতো ঘড়ি ধরে একটানা ৪০টি প্রশ্নের সমাধান',
        defaultTime: 60,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'read_speed_skimming',
        title: 'Speed Reading: The Economist / Scientific American Article Skim',
        desc: 'এক নজরে ৩-৪টি শব্দের গ্রুপ পড়ে ১০০০ শব্দের আর্টিকেল ৩ মিনিটে বোঝা',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'low'
      },
      {
        id: 'read_vocab_extractor',
        title: 'Reading Vocabulary Hunt: Extracting 20 Academic Synonyms',
        desc: 'প্যাসেজে ব্যবহৃত প্রশ্ন ও উত্তরের সমার্থক শব্দের তালিকা তৈরি',
        defaultTime: 20,
        defaultSlot: 'night',
        priority: 'medium'
      }
    ]
  },

  // ==========================================
  // 3. WRITING MODULE (12 Specific Micro-Tasks)
  // ==========================================
  {
    module: 'Writing',
    icon: 'PenTool',
    color: 'purple',
    tasks: [
      {
        id: 'wri_t2_cause_effect_intro',
        title: 'Writing Task 2: Cause/Effect 10 Topic Introductions & Thesis',
        desc: 'প্রম্পট প্যারাফ্রেজিং + স্ট্রং কারণ ও প্রভাবের থিসিস স্টেটমেন্ট লেখার ড্রিল',
        defaultTime: 30,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'wri_t2_agree_disagree_intro',
        title: 'Writing Task 2: Agree/Disagree 10 Topic Introductions & Stance',
        desc: 'নিজের পরিষ্কার মতামত (Complete or Partial Agreement) লেখার ড্রিল',
        defaultTime: 30,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'wri_t2_discuss_both_views',
        title: 'Writing Task 2: Discuss Both Views 10 Topic Introductions',
        desc: 'উভয় পক্ষের বক্তব্যের নিরপেক্ষ সূচনা ও ব্যক্তিগত অভিমতের থিসিস',
        defaultTime: 30,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'wri_t2_problem_solution_intro',
        title: 'Writing Task 2: Problems & Solutions 10 Topic Introductions',
        desc: 'সমস্যা এবং কার্যকর সমাধানের রূপরেখা দিয়ে ইন্ট্রোডাকশন তৈরি',
        defaultTime: 30,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'wri_t2_body_peel_drill',
        title: 'Writing Task 2: Body Paragraph Structuring Drill (PEEL Method)',
        desc: 'Point -> Explanation -> Example -> Link এর সাহায্যে ২টি বডি প্যারাগ্রাফ লেখা',
        defaultTime: 35,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'wri_t2_idea_brainstorming',
        title: 'Writing Task 2: 5 Essay Topics Idea Generation & Outline Notes',
        desc: 'টপিক দেখে দ্রুত মূল পয়েন্ট, কারণ ও বাস্তব উদাহরণ পয়েন্ট আকারে নোট করা',
        defaultTime: 25,
        defaultSlot: 'morning',
        priority: 'medium'
      },
      {
        id: 'wri_t2_conclusion_drill',
        title: 'Writing Task 2: 5 Different Conclusions Writing Practice',
        desc: 'কোনো নতুন পয়েন্ট না এনে আগের মূল আইডিয়ার নিখুঁত সারসংক্ষেপ লেখা',
        defaultTime: 20,
        defaultSlot: 'night',
        priority: 'medium'
      },
      {
        id: 'wri_t2_full_essay_ai_review',
        title: 'Writing Task 2: Full Essay (250+ Words in 40 Mins) + AI Review',
        desc: 'টাইপ করে এসে লেখা এবং ChatGPT দিয়ে গ্রামার ও লেক্সিকাল রিভিউ নেওয়া',
        defaultTime: 50,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'wri_t1_overview_mastery',
        title: 'Writing Task 1: 5 Different Graphs/Maps Overview Paragraphs',
        desc: 'প্রধান ট্রেন্ড ও সর্বোচ্চ/সর্বনিম্ন ফিচার চিহ্নিত করে ওভারভিউ লেখা',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'wri_t1_trend_vocabulary',
        title: 'Writing Task 1: Line & Bar Chart Trend Vocabulary Drill',
        desc: 'Plummeted, surged, fluctuated, sharp decline বাক্য গঠনের অনুশীলন',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'medium'
      },
      {
        id: 'wri_t1_process_diagram_passive',
        title: 'Writing Task 1: Process & Map Diagram (Passive Voice Practice)',
        desc: 'ধাপভিত্তিক প্রক্রিয়া বর্ণনা ও মানচিত্রের পরিবর্তন প্যারাগ্রাফ তৈরি',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'medium'
      },
      {
        id: 'wri_t1_full_report_timed',
        title: 'Writing Task 1: Full Report Writing (150+ Words in 20 Mins)',
        desc: 'স্ট্যান্ডার্ড ৪-প্যারাগ্রাফ রিপোর্ট ড্রাফট ও মডেল অ্যানসারের সাথে মিলানো',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'high'
      }
    ]
  },

  // ==========================================
  // 4. SPEAKING MODULE (10 Specific Micro-Tasks)
  // ==========================================
  {
    module: 'Speaking',
    icon: 'Mic',
    color: 'emerald',
    tasks: [
      {
        id: 'spk_part1_common_topics',
        title: 'Speaking Part 1: 5 Common Topics (Hometown, Study, Hobbies)',
        desc: 'প্রতিটি প্রশ্নের উত্তর ২-৩ বাক্যে কারণ ও উদাহরণ দিয়ে বড় করা',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'high'
      },
      {
        id: 'spk_cue_card_makkar_recent',
        title: 'Speaking Part 2: 2 Recent Cue Cards (1-min Note + 2-min Speech)',
        desc: 'ভয়েস রেকর্ডার দিয়ে নিজের বক্তব্য রেকর্ড ও পজ/গ্রামার সেলফ-রিভিউ',
        defaultTime: 25,
        defaultSlot: 'afternoon',
        priority: 'high'
      },
      {
        id: 'spk_storytelling_framework',
        title: 'Speaking Part 2: Storytelling Drill (Who, When, Where, Why)',
        desc: 'কিউ-কার্ডে আটকে না গিয়ে ২ মিনিট একটানা গল্প বলার ফ্রেমওয়ার্ক',
        defaultTime: 20,
        defaultSlot: 'afternoon',
        priority: 'medium'
      },
      {
        id: 'spk_part3_abstract_reasoning',
        title: 'Speaking Part 3: Abstract Discussion & Society Issues Reasoning',
        desc: 'In-depth মতামত, Pros/Cons ও ভবিষ্যৎ প্রেডিকশন প্রকাশ করার ড্রিল',
        defaultTime: 25,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'spk_part3_speculating_future',
        title: 'Speaking Part 3: Speculating About The Future ("In the next decade...")',
        desc: 'ভবিষ্যতের সম্ভাবনা নিয়ে কথা বলার স্ট্রাকচার ও মডাল ভার্ব প্র্যাকটিস',
        defaultTime: 20,
        defaultSlot: 'night',
        priority: 'medium'
      },
      {
        id: 'spk_idioms_natural_usage',
        title: 'Speaking Idioms & Collocations: 5 Natural Idioms in Context',
        desc: 'Once in a blue moon, over the moon, see eye to eye এর স্বাভাবিক প্রয়োগ',
        defaultTime: 15,
        defaultSlot: 'morning',
        priority: 'low'
      },
      {
        id: 'spk_shadowing_ted_talk',
        title: 'Speaking Shadowing: TED Talk Native Accent & Intonation Mimic',
        desc: 'নেটিভ স্পিকারের কথা শুনে সাথে সাথে হুবহু উচ্চারণ ও সুর নকল করা',
        defaultTime: 20,
        defaultSlot: 'afternoon',
        priority: 'medium'
      },
      {
        id: 'spk_recording_pause_analysis',
        title: 'Speaking Self-Audit: Listening to Own Recording & Error Log',
        desc: 'কোথায় "Um/Uh" ফিলার এলো এবং ব্যাকরণ ভুল হলো তা লিখে রাখা',
        defaultTime: 20,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'spk_full_mock_interview',
        title: 'Full 15-Minute Speaking Mock Interview Simulation (Part 1, 2, 3)',
        desc: 'টাইমার ধরে পূর্ণাঙ্গ স্পিকিং টেস্ট দিয়ে সেলফ-ইভালুয়েশন করা',
        defaultTime: 25,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'spk_paraphrasing_unfamiliar',
        title: 'Speaking Reflex: Paraphrasing Unfamiliar Words on the Spot',
        desc: 'কোনো নির্দিষ্ট ইংরেজি শব্দ ভুলে গেলে ঘুরিয়ে বাক্য বুঝিয়ে দেওয়ার ড্রিল',
        defaultTime: 15,
        defaultSlot: 'morning',
        priority: 'medium'
      }
    ]
  },

  // ==========================================
  // 5. VOCABULARY & GRAMMAR (10 Specific Micro-Tasks)
  // ==========================================
  {
    module: 'Vocabulary & Grammar',
    icon: 'Sparkles',
    color: 'indigo',
    tasks: [
      {
        id: 'voc_collocations_environment',
        title: 'Vocabulary: 15 Band 7+ Collocations on Environment & Climate',
        desc: 'Fossil fuels, carbon footprint, renewable energy দিয়ে বাক্য গঠন',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'high'
      },
      {
        id: 'voc_collocations_technology',
        title: 'Vocabulary: 15 Band 7+ Collocations on Tech, AI & Social Media',
        desc: 'Cutting-edge technology, algorithm, digital literacy দিয়ে বাক্য গঠন',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'high'
      },
      {
        id: 'voc_collocations_education',
        title: 'Vocabulary: 15 Band 7+ Collocations on Education & Job Market',
        desc: 'Curriculum, academic performance, tertiary education দিয়ে বাক্য গঠন',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'high'
      },
      {
        id: 'voc_collocations_health',
        title: 'Vocabulary: 15 Band 7+ Collocations on Health, Diet & Medicine',
        desc: 'Sedentary lifestyle, balanced diet, healthcare infrastructure প্র্যাকটিস',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'high'
      },
      {
        id: 'voc_collocations_crime',
        title: 'Vocabulary: 15 Band 7+ Collocations on Crime, Law & Society',
        desc: 'Juvenile delinquency, rehabilitate offenders, deterrent effect বাক্য তৈরি',
        defaultTime: 20,
        defaultSlot: 'morning',
        priority: 'medium'
      },
      {
        id: 'gra_linking_signposting',
        title: 'Grammar: Academic Linking Words & Signposting Masterclass',
        desc: 'Furthermore, in contrast, consequently, nevertheless এর নিখুঁত ব্যবহার',
        defaultTime: 20,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'gra_complex_conditionals',
        title: 'Grammar: Complex Sentences (Conditionals & Inversion Structure)',
        desc: 'If/Unless এবং "Not only... but also", "Had it not been for" ড্রিল',
        defaultTime: 25,
        defaultSlot: 'night',
        priority: 'high'
      },
      {
        id: 'gra_passive_nominalization',
        title: 'Grammar: Passive Voice & Nominalization for Academic Writing',
        desc: 'ভার্বকে নাউনে রূপান্তর করে প্রাতিষ্ঠানিক ও ফরমাল বাক্যের ড্রিল',
        defaultTime: 20,
        defaultSlot: 'night',
        priority: 'medium'
      },
      {
        id: 'voc_spaced_flashcards',
        title: 'Active Recall: Daily Flashcards & Spaced Repetition Review',
        desc: 'গত ১ সপ্তাহে নোট করা ৫০টি কঠিন শব্দের স্পিড কুইজ রিভিশন',
        defaultTime: 15,
        defaultSlot: 'morning',
        priority: 'medium'
      },
      {
        id: 'gra_punctuation_commas',
        title: 'Grammar: Punctuation, Commas & Run-on Sentence Fixes',
        desc: 'কমা স্প্লাইস ও সেমিকোলনের সঠিক নিয়ম প্র্যাকটিস করে মার্কস বাঁচানো',
        defaultTime: 15,
        defaultSlot: 'night',
        priority: 'low'
      }
    ]
  }
];
