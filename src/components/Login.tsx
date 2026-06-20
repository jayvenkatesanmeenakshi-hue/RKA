/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion } from 'motion/react';
import { X, Lock, Mail, ChevronRight, Info } from 'lucide-react';

export const Login = ({ onClose }: { onClose: () => void }) => {
  const { login, users } = useAcademy();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (user) {
      login(email);
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-white w-full max-w-sm rounded-sm shadow-2xl relative z-10 overflow-hidden border border-slate-200"
      >
        <div className="bg-navy-900 text-white p-8 space-y-1 relative overflow-hidden border-b-2 border-yellow-400">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-navy-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold tracking-tight">Portal Access</h2>
          <p className="text-navy-300 text-[10px] uppercase font-bold tracking-widest">Institutional Management Console</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className={`space-y-2 transition-all ${error ? 'animate-shake' : ''}`}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Identity</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-navy-900'}`} size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mambakkam.edu"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-sm text-sm outline-none transition-all font-medium font-sans ${
                    error ? 'border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-navy-900'
                  }`}
                  required
                />
              </div>
              {error && <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">Access Denied: record not discovered.</p>}
            </div>

            <div className="bg-slate-50 p-5 rounded-sm border border-slate-100 flex gap-4">
              <Info className="text-navy-400 shrink-0" size={14} />
              <div className="space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Authorized Access Only</p>
                <div className="text-[9px] text-slate-400 leading-normal font-medium grid grid-cols-1 gap-1">
                  <span>admin@rockingkids.com</span>
                  <span>ramesh@parent.com</span>
                  <span>sangeetha@rockingkids.com</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-navy-900 text-yellow-400 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-xl shadow-black/10 group cursor-pointer"
          >
            Authenticate Profile
          </button>

          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
            Authorization Terminal • Mambakkam
          </p>
        </form>
      </motion.div>
    </div>
  );
};
