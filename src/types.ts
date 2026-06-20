/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'staff' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type ProgramType = 'Abacus' | 'Phonics' | 'English' | 'Handwriting';

export interface Program {
  id: ProgramType;
  title: string;
  description: string;
  levels: string[];
}

export interface Student {
  id: string;
  parentId: string;
  name: string;
  age: number;
  school: string;
  enrolledPrograms: ProgramType[];
  avatar?: string;
}

export interface ProgressLog {
  id: string;
  studentId: string;
  programId: ProgramType;
  date: string;
  attendance: boolean;
  currentLevel: string;
  currentBook: string;
  notes: string;
  instructorId: string;
}

export interface Batch {
  id: string;
  programId: ProgramType;
  instructorId: string;
  day: 'Weekday' | 'Saturday';
  time: string;
  room: string;
  studentIds: string[];
}

export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  status: 'Paid' | 'Pending';
  dueDate: string;
  description: string;
  paidDate?: string;
}

export interface AcademyState {
  currentUser: User | null;
  users: User[];
  students: Student[];
  programs: Program[];
  batches: Batch[];
  logs: ProgressLog[];
  invoices: Invoice[];
}
