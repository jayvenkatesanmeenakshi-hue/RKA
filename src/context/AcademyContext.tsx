/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Program } from '../types';
import { PROGRAMS } from '../data';

interface AcademyContextType {
  programs: Program[];
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AcademyContext.Provider value={{
      programs: PROGRAMS,
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
