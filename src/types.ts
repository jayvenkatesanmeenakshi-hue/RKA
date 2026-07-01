/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProgramType = 'Abacus' | 'Phonics' | 'English' | 'Handwriting';

export interface Program {
  id: ProgramType;
  title: string;
  description: string;
  levels: string[];
}

export interface ProgramBenefit {
  title: string;
  description: string;
}

export interface ProgramDetails {
  id: ProgramType;
  title: string;
  description: string;
  extendedDescription: string;
  ageGroup: string;
  duration: string;
  classFrequency: string;
  keyTakeaways: string[];
  benefits: ProgramBenefit[];
  curriculumDetails: {
    level: string;
    focus: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  tags: string[];
}
