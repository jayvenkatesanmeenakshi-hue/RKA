/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Student, Program, Batch, ProgressLog, Invoice, ProgramType } from './types';

export const PROGRAMS: Program[] = [
  {
    id: 'Abacus',
    title: 'Mental Math Abacus',
    description: 'Developing lightning-fast arithmetic speed and cognitive focus through specialized abacus tools.',
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

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin Jay', email: 'admin@rockingkids.com', role: 'admin' },
  { id: 'u2', name: 'Mrs. Sangeetha', email: 'sangeetha@rockingkids.com', role: 'staff' },
  { id: 'u3', name: 'Mr. Ramesh', email: 'ramesh@parent.com', role: 'parent' },
  { id: 'u4', name: 'Ms. Priya', email: 'priya@parent.com', role: 'parent' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', parentId: 'u3', name: 'Arjun Ramesh', age: 7, school: 'Vidyashram Mambakkam', enrolledPrograms: ['Abacus', 'Phonics'] },
  { id: 's2', parentId: 'u3', name: 'Ananya Ramesh', age: 5, school: 'Vidyashram Mambakkam', enrolledPrograms: ['Phonics', 'Handwriting'] },
  { id: 's3', parentId: 'u4', name: 'Karthik Krishna', age: 9, school: 'SBIOA Ponmar', enrolledPrograms: ['Abacus', 'English'] },
];

export const MOCK_BATCHES: Batch[] = [
  { id: 'b1', programId: 'Abacus', instructorId: 'u2', day: 'Weekday', time: '5:00 PM - 6:30 PM', room: 'Room 101', studentIds: ['s1', 's3'] },
  { id: 'b2', programId: 'Phonics', instructorId: 'u2', day: 'Weekday', time: '4:00 PM - 5:00 PM', room: 'Room 102', studentIds: ['s1', 's2'] },
  { id: 'b3', programId: 'English', instructorId: 'u2', day: 'Saturday', time: '10:30 AM - 12:30 PM', room: 'Room 103', studentIds: ['s3'] },
];

export const MOCK_LOGS: ProgressLog[] = [
  { id: 'l1', studentId: 's1', programId: 'Abacus', date: '2026-06-18', attendance: true, currentLevel: 'Level 1 (Entry)', currentBook: 'Book 1A', notes: 'Excellent focus today. Solved 20 problems in 5 mins.', instructorId: 'u2' },
  { id: 'l2', studentId: 's2', programId: 'Phonics', date: '2026-06-18', attendance: true, currentLevel: 'Phase 1', currentBook: 'Vowels 1', notes: 'Identified all short vowel sounds correctly.', instructorId: 'u2' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'i1', studentId: 's1', amount: 3500, status: 'Paid', dueDate: '2026-06-05', description: 'June 2026 Tuition', paidDate: '2026-06-04' },
  { id: 'i2', studentId: 's2', amount: 3000, status: 'Pending', dueDate: '2026-07-05', description: 'July 2026 Tuition' },
  { id: 'i3', studentId: 's3', amount: 4000, status: 'Paid', dueDate: '2026-06-05', description: 'June 2026 Tuition', paidDate: '2026-06-05' },
];
