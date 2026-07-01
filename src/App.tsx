/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AcademyProvider } from './context/AcademyContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    // Listen to pushState/replaceState updates as well
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If path matches admin panel route
  if (path === '/admin') {
    return <AdminPanel navigateTo={navigateTo} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-navy-900 selection:bg-yellow-100">
      <Navigation />
      
      <main className="flex-grow">
        <LandingPage />
      </main>
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
