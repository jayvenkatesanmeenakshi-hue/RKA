/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Navigation = () => {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 h-20 flex items-center px-8 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-navy-900">
        <div className="flex items-center gap-4">
           <div className="bg-navy-900 text-yellow-400 w-10 h-10 flex items-center justify-center font-black rounded-sm text-lg">
             RK
           </div>
           <div>
              <h1 className="text-xl font-bold tracking-tight">Rocking Kids</h1>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-navy-400">Activity Center</p>
           </div>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-navy-400">
          <a href="#prospectus" className="hover:text-yellow-600 transition-colors">Prospectus</a>
          <a href="#curriculum" className="hover:text-yellow-600 transition-colors">Curriculum</a>
          <a href="#faculty" className="hover:text-yellow-600 transition-colors">Faculty</a>
          <a href="#location" className="hover:text-yellow-600 transition-colors">Location</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="bg-navy-900 text-white px-6 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-xl shadow-navy-900/10 cursor-pointer"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            Contact Admissions
          </button>
        </div>
      </div>
    </nav>
  );
};
