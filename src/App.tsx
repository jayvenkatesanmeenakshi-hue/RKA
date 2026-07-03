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
import { ProgramDetailsPage } from './components/ProgramDetailsPage';
import { BlogModule } from './components/BlogModule';
import { ProgramType } from './types';

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

  useEffect(() => {
    // Dynamic client-side canonical tag update
    const domain = "https://rockingkidsacademy.in";
    const canonicalPath = path === '/' ? '' : path;
    const fullCanonicalUrl = `${domain}${canonicalPath}`;

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullCanonicalUrl);
  }, [path]);

  const navigateTo = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If path matches admin panel route
  if (path === '/admin') {
    return <AdminPanel navigateTo={navigateTo} />;
  }

  // Route matching logic
  let mainContent = <LandingPage navigateTo={navigateTo} />;
  
  if (path.startsWith('/program/')) {
    const programId = path.replace('/program/', '') as ProgramType;
    mainContent = <ProgramDetailsPage programId={programId} navigateTo={navigateTo} />;
  } else if (path === '/blog') {
    mainContent = <BlogModule currentSlug={null} navigateTo={navigateTo} />;
  } else if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '');
    mainContent = <BlogModule currentSlug={slug} navigateTo={navigateTo} />;
  } else if (path !== '/' && !path.startsWith('/#')) {
    // 404 Route Not Found
    mainContent = (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-navy-900 mb-4">404 - Page Not Found</h2>
        <p className="text-navy-500 mb-8">The requested page does not exist or has been moved.</p>
        <button 
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-navy-900 selection:bg-yellow-100">
      <Navigation path={path} navigateTo={navigateTo} />
      
      <main className="flex-grow">
        {mainContent}
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
