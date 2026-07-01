/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoHorizontal from '../assets/images/logo-for-header.png';

interface NavigationProps {
  path?: string;
  navigateTo?: (path: string) => void;
}

export const Navigation = ({ path = '/', navigateTo = () => {} }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleContactClick = () => {
    closeMenu();
    if (path !== '/') {
      navigateTo('/');
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    closeMenu();
    if (path !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 py-3 md:py-4 min-h-20 lg:min-h-24 flex flex-col justify-center px-4 sm:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-navy-900">
        {/* Logo Section */}
        <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
          <img 
            src={logoHorizontal} 
            alt="Rocking Kids Academy" 
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain max-w-[240px] sm:max-w-[320px] md:max-w-[400px]"
            referrerPolicy="no-referrer"
            fetchPriority="high"
          />
        </div>

        {/* Desktop Menu - Visible on lg screens (1024px+) and wider */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-navy-400">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); navigateTo('/'); }} 
            className={`transition-all hover:translate-y-[-1px] ${path === '/' ? 'text-yellow-600 font-bold' : 'hover:text-yellow-600'}`}
          >
            Home
          </a>
          <a 
            href="#prospectus" 
            onClick={(e) => handleHashClick(e, '#prospectus')} 
            className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]"
          >
            Prospectus
          </a>
          <a 
            href="#curriculum" 
            onClick={(e) => handleHashClick(e, '#curriculum')} 
            className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]"
          >
            Curriculum
          </a>
          <a 
            href="#faculty" 
            onClick={(e) => handleHashClick(e, '#faculty')} 
            className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]"
          >
            Faculty
          </a>
          <a 
            href="#location" 
            onClick={(e) => handleHashClick(e, '#location')} 
            className="hover:text-yellow-600 transition-all hover:translate-y-[-1px]"
          >
            Location
          </a>
          <a 
            href="/blog" 
            onClick={(e) => { e.preventDefault(); navigateTo('/blog'); }} 
            className={`transition-all hover:translate-y-[-1px] ${path.startsWith('/blog') ? 'text-yellow-600 font-bold' : 'hover:text-yellow-600'}`}
          >
            Blog
          </a>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* CTA Button in Header */}
          <button 
            className="hidden sm:inline-flex bg-navy-900 text-white px-5 lg:px-6 py-2 lg:py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-xl shadow-navy-900/10 cursor-pointer whitespace-nowrap"
            onClick={handleContactClick}
          >
            Contact Admissions
          </button>

          {/* Hamburger / Close Icon */}
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
              href="/" 
              onClick={(e) => { e.preventDefault(); closeMenu(); navigateTo('/'); }}
              className={`py-2 px-3 rounded-sm hover:bg-slate-50 transition-all ${path === '/' ? 'text-yellow-600 font-bold bg-slate-50' : 'hover:text-yellow-600'}`}
            >
              Home
            </a>
            <a 
              href="#prospectus" 
              onClick={(e) => handleHashClick(e, '#prospectus')}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Prospectus
            </a>
            <a 
              href="#curriculum" 
              onClick={(e) => handleHashClick(e, '#curriculum')}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Curriculum
            </a>
            <a 
              href="#faculty" 
              onClick={(e) => handleHashClick(e, '#faculty')}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Faculty
            </a>
            <a 
              href="#location" 
              onClick={(e) => handleHashClick(e, '#location')}
              className="py-2 px-3 hover:bg-slate-50 rounded-sm hover:text-yellow-600 transition-all"
            >
              Location
            </a>
            <a 
              href="/blog" 
              onClick={(e) => { e.preventDefault(); closeMenu(); navigateTo('/blog'); }}
              className={`py-2 px-3 rounded-sm hover:bg-slate-50 transition-all ${path.startsWith('/blog') ? 'text-yellow-600 font-bold bg-slate-50' : 'hover:text-yellow-600'}`}
            >
              Blog
            </a>
          </div>
          
          {/* Mobile-only CTA button */}
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
