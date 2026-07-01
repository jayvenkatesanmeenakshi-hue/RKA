/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProgramDetails } from './types';

export const PROGRAM_DETAILS: Record<string, ProgramDetails> = {
  Abacus: {
    id: 'Abacus',
    title: 'Brainobrain Affiliation',
    description: 'Brainobrain is a global child empowerment institute boosting mental math, concentration, memory, and confidence.',
    extendedDescription: 'Our Brainobrain program is a pioneer in child development, employing the advanced Abacus method to activate both hemispheres of the brain. Through structured, fun-filled exercises, kids master mental arithmetic alongside personal empowerment skills like concentration, creative thinking, memory retention, and public speaking.',
    ageGroup: '5 to 14 Years',
    duration: '8 to 10 Levels (3 Months per Level)',
    classFrequency: '2 Hours per week (Usually Weekends)',
    keyTakeaways: [
      'Master lightning-fast mental math arithmetic computations',
      'Significantly improve visual and auditory memory',
      'Enhance long-term focus, discipline, and attention to detail',
      'Develop self-confidence, leadership, and public presentation skills'
    ],
    benefits: [
      {
        title: 'Whole Brain Development',
        description: 'Using the physical abacus stimulates both the logical left-brain and creative right-brain, unlocking your child’s full potential.'
      },
      {
        title: 'Mental Gymnastics',
        description: 'We train children to visualize the abacus beads internally, enabling them to calculate arithmetic sums faster than a calculator.'
      },
      {
        title: 'Concentration Booster',
        description: 'Structured timed exercises improve sensory skills, filtering noise and magnifying deep-focus capabilities.'
      },
      {
        title: 'Confidence and NLP',
        description: 'We integrate Neuro-Linguistic Programming (NLP) principles to cultivate positive self-esteem and public speaking.'
      }
    ],
    curriculumDetails: [
      { level: 'Level 1', focus: 'Introduction to Abacus, bead counting, simple addition and subtraction up to 10.' },
      { level: 'Level 2', focus: 'Concept of complements (Big Friends / Small Friends), double digit calculations.' },
      { level: 'Level 3', focus: 'Visual arithmetic without the physical abacus, introducing basic multiplication.' },
      { level: 'Level 4', focus: 'Multiplication mastery, three-digit visual addition, speed development.' },
      { level: 'Level 5', focus: 'Division on Abacus, fraction arithmetic, high-speed visual calculations.' },
      { level: 'Level 6', focus: 'Decimals, advanced division, multi-step compound arithmetic operations.' },
      { level: 'Level 7', focus: 'Visual division, advanced memory techniques, grand speed arithmetic.' },
      { level: 'Level 8', focus: 'Grandmaster level. Mastery of all arithmetic with ultra-fast mental retrieval.' }
    ],
    faqs: [
      {
        question: 'What is the right age for children to join the Abacus program?',
        answer: 'The ideal age is between 5 and 14 years. During this period, the brain is highly plastic and undergoing peak synaptic development, making it optimal to build neural pathways.'
      },
      {
        question: 'How long does it take to see results?',
        answer: 'Parents typically notice a marked improvement in concentration, memory, and mathematical speed within 3 to 6 months (by the end of Level 1 or 2).'
      },
      {
        question: 'Will this program interfere with school math methods?',
        answer: 'Not at all! In fact, it complements school math by making children completely comfortable with numbers. It removes math-phobia and builds a highly intuitive sense of number quantity and scale.'
      }
    ]
  },
  Phonics: {
    id: 'Phonics',
    title: 'Phonics Mastery',
    description: 'A structured approach to letter sounds, decoding, and reading fluency for young learners.',
    extendedDescription: 'Reading is the foundational gateway to all learning. Our Phonics Mastery program uses a systematic, multi-sensory synthetic phonics methodology. Children learn the 42 letter sounds, blending them to read words, and segmenting them to spell. We build reading confidence, pronunciation accuracy, and a lifelong love for books.',
    ageGroup: '4 to 8 Years',
    duration: '6 Levels / Phases (2-3 Months per Phase)',
    classFrequency: '2 Hours per week',
    keyTakeaways: [
      'Master the 42 primary letter sounds and their combinations',
      'Learn to blend sounds to read words effortlessly',
      'Learn to segment spoken words into individual sounds for accurate spelling',
      'Recognize tricky/sight words and achieve fluid text reading'
    ],
    benefits: [
      {
        title: 'Systematic Learning',
        description: 'Sounds are introduced in a specific order (not alphabetical) so children can start building and reading actual words from week one.'
      },
      {
        title: 'Multi-Sensory Play',
        description: 'Using tactile objects, stories, actions, and songs, we make learning phonetics active, engaging, and highly memorable.'
      },
      {
        title: 'Spelling Empowerment',
        description: 'By teaching segmentation, children can break down any word into phonemes, empowering them to spell complex words logically.'
      },
      {
        title: 'Reading Fluency',
        description: 'We transition kids from decoding single words to reading whole paragraphs with correct intonation and confidence.'
      }
    ],
    curriculumDetails: [
      { level: 'Phase 1', focus: 'The first 6 sounds (s, a, t, i, p, n). Blending and reading simple two-letter words.' },
      { level: 'Phase 2', focus: 'Introducing the next 12 letter sounds, including digraphs. Blending short vowel CVC words.' },
      { level: 'Phase 3', focus: 'Double letter sounds (sh, ch, th, ng, ee, oo). Reading decodable phrases and small stories.' },
      { level: 'Phase 4', focus: 'Consonant blends (ccvc, cvcc). Expanding vocabulary and introducing common sight words.' },
      { level: 'Phase 5', focus: 'Alternative spellings for vowel sounds (e.g., ai, ay, a-e). Reading multi-syllabic words.' },
      { level: 'Phase 6', focus: 'Fluency, spelling rules, suffixes and prefixes, reading unguided narrative texts.' }
    ],
    faqs: [
      {
        question: 'Why choose Phonics over traditional rote reading?',
        answer: 'Traditional reading relies heavily on memorizing word shapes (sight words), which fails once vocabulary gets complex. Phonics equips kids with the rules to decode *any* new word they encounter, fostering independent reading.'
      },
      {
        question: 'How do I know if my child needs Phonics?',
        answer: 'If your child is between 4 and 8 and struggles to read unfamiliar words, tends to guess words based on the first letter, or reads with a slow, halting rhythm, systematic Phonics is the proven solution.'
      },
      {
        question: 'Do you offer certificates at the end of the program?',
        answer: 'Yes! Upon successful completion and assessment of each key Phase, students receive certificates of achievement.'
      }
    ]
  },
  English: {
    id: 'English',
    title: 'English & Communication',
    description: 'Enhancing grammar, vocabulary, and public expression for confident communication.',
    extendedDescription: 'Articulating thoughts clearly is an essential life skill. Our English & Communication program covers grammar fundamentals, creative writing, oral comprehension, public speaking, and body language. We transform hesitant speakers into articulate, expressive, and logical communicators prepared for any platform.',
    ageGroup: '6 to 14 Years',
    duration: '4 Comprehensive Modules',
    classFrequency: '2 Hours per week',
    keyTakeaways: [
      'Gain a solid command over English grammar, syntax, and sentence structure',
      'Build a rich, contextual vocabulary of descriptive words',
      'Learn public speaking, debate formatting, and presentation mechanics',
      'Master creative writing, essay layout, and comprehension extraction'
    ],
    benefits: [
      {
        title: 'Expressive Clarity',
        description: 'We focus on clear articulation, helping children construct logical arguments and convey their thoughts without hesitation.'
      },
      {
        title: 'Public Speaking Confidence',
        description: 'Regular stage exposure and structured presentation drills eliminate the fear of public speaking early in life.'
      },
      {
        title: 'Grammar and Syntax',
        description: 'We replace boring grammar worksheets with interactive language labs, making sentence structure intuitive.'
      },
      {
        title: 'Creative Writing Lab',
        description: 'Students learn story arcs, character development, and descriptive prose, nurturing creative writing excellence.'
      }
    ],
    curriculumDetails: [
      { level: 'Primary A', focus: 'Noun-verb agreements, adjectives, sentence structure, and simple public self-introductions.' },
      { level: 'Primary B', focus: 'Tenses mastery, prepositions, conjunctions, reading comprehension, and guided storytelling.' },
      { level: 'Intermediate', focus: 'Active/passive voices, idioms, structured paragraph writing, formal letters, and debate basics.' },
      { level: 'Advance', focus: 'Complex clause structures, creative writing portfolio, public speeches, persuasion tactics, and critical analytical reading.' }
    ],
    faqs: [
      {
        question: 'My child knows English but is very shy to speak. Will this course help?',
        answer: 'Absolutely. Shyness is usually a lack of interactive practice and fear of mistakes. Our small class size (max 8 students) provides a safe, encouraging environment with extensive speaking opportunities.'
      },
      {
        question: 'Does the curriculum align with CBSE/ICSE patterns?',
        answer: 'Yes, our grammar and writing foundations align perfectly with major academic boards while going much further in real-world application, speaking, and creative expression.'
      }
    ]
  },
  Handwriting: {
    id: 'Handwriting',
    title: 'Handwriting Improvement',
    description: 'Perfecting cursive movements and fine motor precision for elegant, legible writing.',
    extendedDescription: 'Elegant, legible handwriting is not just beautiful; it is directly linked to cognitive memory and scholastic achievement. Our scientific Handwriting Improvement program focuses on the mechanics of writing—including pencil grip, seating posture, page tilt, wrist movement, letter sizing, and spacing. We help students write beautifully, fast, and without fatigue.',
    ageGroup: '5 to 14 Years',
    duration: '3 Specialized Stages (3 Months total)',
    classFrequency: '2 Hours per week',
    keyTakeaways: [
      'Correct improper finger grip and sitting posture for comfortable writing',
      'Master cursive joins, loops, and elegant printed stroke heights',
      'Acquire perfect consistent letter spacing, slant, and margin alignment',
      'Drastically increase writing speed while maintaining pristine legibility'
    ],
    benefits: [
      {
        title: 'Ergonomic Excellence',
        description: 'We teach proper hand-eye ergonomics to eliminate finger cramping, wrist strain, and writing fatigue.'
      },
      {
        title: 'Motor Control & Precision',
        description: 'Focused fine motor exercises strengthen the small muscles of the hand, leading to steady, elegant loops.'
      },
      {
        title: 'Visual Symmetry',
        description: 'We use specialized lined grid paper to instill absolute consistency in letter heights, slants, and alignments.'
      },
      {
        title: 'Exam Score Booster',
        description: 'Neat and legible exam papers create positive grader impressions, directly contributing to better academic results.'
      }
    ],
    curriculumDetails: [
      { level: 'Print Basics', focus: 'Stroke dynamics, single letter proportions, lowercase and uppercase heights, proper finger posture.' },
      { level: 'Cursive Connects', focus: 'The flow of cursive joins, loop formations, diagonal joins, and maintaining uniform letter slant.' },
      { level: 'Fluency & Speed', focus: 'Paragraph writing under time constraints, copy-speed drills, maintaining elegance under speed pressure.' }
    ],
    faqs: [
      {
        question: 'Can handwriting actually be changed in 3 months?',
        answer: 'Yes! Handwriting is a muscle memory skill. By practicing scientific muscle-memory strokes for 2 hours a week and following our guided daily sheets, the old habits are systematically replaced.'
      },
      {
        question: 'Do you teach print or cursive?',
        answer: 'We offer courses in both styles! Depending on your child’s age, current school guidelines, and preference, we tailor the track to Print Mastery or Cursive Excellence.'
      }
    ]
  }
};
