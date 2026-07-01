/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoHorizontal from '../assets/images/logo-for-header.png';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleContactClick = () => {
    closeMenu();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 py-3 md:py-4 min-h-20 lg:min-h-24 flex flex-col justify-center px-4 sm:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-navy-900">
        {/* Logo Section */}
        <div className="flex items-center">
          <img 
            src={logoHorizontal} 
            alt="Rocking Kids Academy" 
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain max-w-[240px] sm:max-w-[320px] md:max-w-[400px]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Desktop Menu - Visible on lg screens (1024px+) and wider */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-navy-400">
          <a href="#prospectus" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Prospectus</a>
          <a href="#curriculum" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Curriculum</a>
          <a href="#faculty" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Faculty</a>
          <a href="#location" className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]">Location</a>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* CTA Button in Header (hidden on very small screens, visible on tablet and desktop) */}
          <button 
            className="hidden sm:inline-flex bg-navy-900 text-white px-5 lg:px-6 py-2 lg:py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-xl shadow-navy-900/10 cursor-pointer whitespace-nowrap"
            onClick={handleContactClick}
          >
            Contact Admissions
          </button>

          {/* Hamburger / Close Icon for Mobile & Tablet (hidden on lg screens) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-navy-900 hover:text-yellow-600 hover:bg-slate-50 rounded-md transition-all focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Menu (visible below lg breakpoint) */}
      {isOpen && (
        <div className="lg:hidden w-full bg-white border-t border-slate-100 mt-3 py-4 flex flex-col gap-4 animate-fadeIn">
          <div className="flex flex-col gap-3 px-2 text-[11px] font-black uppercase tracking-wider text-navy-400">
            <a 
              href="#prospectus" 
              onClick={closeMenu}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Prospectus
            </a>
            <a 
              href="#curriculum" 
              onClick={closeMenu}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Curriculum
            </a>
            <a 
              href="#faculty" 
              onClick={closeMenu}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Faculty
            </a>
            <a 
              href="#location" 
              onClick={closeMenu}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Location
            </a>
          </div>
          
          {/* Mobile-only CTA button when header CTA is hidden (e.g. mobile portrait xs) */}
          <div className="px-5 pt-2 sm:hidden border-t border-slate-50">
            <button 
              className="w-full bg-navy-900 text-white py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all text-center"
              onClick={handleContactClick}
            >
              Contact Admissions
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
