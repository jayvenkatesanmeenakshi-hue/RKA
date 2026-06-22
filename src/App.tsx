/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AcademyProvider } from './context/AcademyContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-navy-900 selection:bg-yellow-100">
      <Navigation />
      
      <main className="flex-grow">
        <LandingPage />
      </main>

      <div className="bg-navy-900 py-3 text-center">
        <p className="text-[10px] text-navy-400 font-black uppercase tracking-[0.3em]">Institutional Landing Platform • Mambakkam</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AcademyProvider>
      <AppContent />
    </AcademyProvider>
  );
}
