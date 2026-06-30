/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import logoHorizontal from '../assets/images/logo_horizontal_wide_1782801473176.jpg';

export const Navigation = () => {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 py-3 md:py-4 min-h-20 md:min-h-24 flex items-center px-8 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-navy-900">
        <div className="flex items-center">
           <img 
             src={logoHorizontal} 
             alt="Rocking Kids Academy" 
             className="h-16 md:h-24 w-auto object-contain max-w-[320px] md:max-w-[480px]"
             referrerPolicy="no-referrer"
           />
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-navy-400">
          <a href="#prospectus" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Prospectus</a>
          <a href="#curriculum" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Curriculum</a>
          <a href="#faculty" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Faculty</a>
          <a href="#location" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Location</a>
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
