/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Program, ProgramDetails, BlogPost } from '../types';
import { PROGRAMS } from '../data';
import { PROGRAM_DETAILS } from '../programData';
import { BLOG_POSTS } from '../blogData';

interface AcademyContextType {
  programs: Program[];
  programDetails: Record<string, ProgramDetails>;
  blogPosts: BlogPost[];
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AcademyContext.Provider value={{
      programs: PROGRAMS,
      programDetails: PROGRAM_DETAILS,
      blogPosts: BLOG_POSTS,
    }}>
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) throw new Error('useAcademy must be used within AcademyProvider');
  return context;
};
