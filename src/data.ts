/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Program } from './types';

export const PROGRAMS: Program[] = [
  {
    id: 'Abacus',
    title: 'Brainobrain Affiliation',
    description: 'Brainobrain is a global child empowerment institute boosting mental math, concentration, memory, and confidence.',
    levels: ['Level 1 (Entry)', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8 (Grandmaster)']
  },
  {
    id: 'Phonics',
    title: 'Phonics Mastery',
    description: 'A structured approach to letter sounds, decoding, and reading fluency for young learners.',
    levels: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6']
  },
  {
    id: 'English',
    title: 'English & Communication',
    description: 'Enhancing grammar, vocabulary, and public expression for confident communication.',
    levels: ['Primary A', 'Primary B', 'Intermediate', 'Advance']
  },
  {
    id: 'Handwriting',
    title: 'Handwriting Improvement',
    description: 'Perfecting cursive movements and fine motor precision for elegant, legible writing.',
    levels: ['Print Basics', 'Cursive Connects', 'Fluency & Speed']
  }
];
