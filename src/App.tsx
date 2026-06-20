/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ParentDashboard } from './components/ParentDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { AnimatePresence } from 'motion/react';

function AppContent() {
  const { currentUser } = useAcademy();
  const [showLogin, setShowLogin] = useState(false);

  const renderView = () => {
    if (!currentUser) return <LandingPage />;
    
    switch (currentUser.role) {
      case 'parent': return <ParentDashboard />;
      case 'staff': return <StaffDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navigation onLoginClick={() => setShowLogin(true)} />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      <AnimatePresence>
        {showLogin && (
          <Login onClose={() => setShowLogin(false)} />
        )}
      </AnimatePresence>
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
