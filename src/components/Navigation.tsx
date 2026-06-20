/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { LogOut, User as UserIcon, BookOpen } from 'lucide-react';

export const Navigation = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const { currentUser, logout } = useAcademy();

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

        <div className="flex items-center gap-10">
           <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-navy-400">
              <a href="#prospectus" className="hover:text-yellow-600 transition-colors">Prospectus</a>
              <a href="#curriculum" className="hover:text-yellow-600 transition-colors">Curriculum</a>
              <a href="#faculty" className="hover:text-yellow-600 transition-colors">Faculty</a>
           </div>

           <div className="flex items-center gap-4">
             {currentUser ? (
               <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
                 <div className="text-right hidden sm:block">
                   <p className="text-navy-900 text-[10px] font-black uppercase tracking-tight">{currentUser.name}</p>
                   <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.2em]">{currentUser.role}</p>
                 </div>
                 <button 
                   onClick={logout}
                   className="w-10 h-10 rounded-sm bg-navy-900 text-white flex items-center justify-center hover:bg-yellow-500 hover:text-navy-900 transition-colors cursor-pointer"
                 >
                   <LogOut size={16} />
                 </button>
               </div>
             ) : (
               <button 
                 onClick={onLoginClick}
                 className="bg-navy-900 text-white px-6 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-xl shadow-navy-900/10 cursor-pointer"
               >
                 Portal Access
               </button>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
};
