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
