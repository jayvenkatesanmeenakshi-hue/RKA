/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../context/AcademyContext';
import { MapPin, Clock, Phone, Mail, ChevronRight, Award, Zap, MessageCircle, PenTool } from 'lucide-react';
import { AcademyMap } from './AcademyMap';

export const LandingPage = () => {
  const { programs } = useAcademy();

  const getIcon = (id: string) => {
    switch (id) {
      case 'Abacus': return <Zap className="text-yellow-500" size={28} />;
      case 'Phonics': return <Award className="text-yellow-500" size={28} />;
      case 'English': return <MessageCircle className="text-yellow-500" size={28} />;
      case 'Handwriting': return <PenTool className="text-yellow-500" size={28} />;
      default: return <Award className="text-yellow-500" size={28} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section - Light & Academic Activity Center */}
      <section className="bg-white border-b border-navy-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-20 md:py-32 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-3">
              <span className="w-10 h-[2px] bg-yellow-500"></span>
              <p className="text-navy-500 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Empowering Next Generation</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-navy-900 tracking-tight leading-[1.1]">
              A Premier <br/>
              <span className="text-yellow-600">Learning Center.</span>
            </h1>
            <p className="text-navy-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed font-sans">
              Dedicated to skill development for children ages 4 to 14. We provide a nurturing environment for Abacus, Phonics, English, and Handwriting mastery.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-navy-900 text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-2xl shadow-navy-900/20 cursor-pointer">
                Enroll Today
              </button>
              <button className="text-navy-900 border-b-2 border-navy-100 hover:border-yellow-500 px-4 py-4 font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer">
                Our Programs
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 w-full"
          >
            <div className="aspect-[4/3] bg-navy-50 border-4 border-white shadow-2xl relative overflow-hidden rounded-lg">
               <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Active Learning Environment" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-navy-900/5"></div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-8 shadow-xl">
                 <div className="text-navy-900 text-center">
                    <p className="text-3xl font-black">10+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Years Excellence</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>
      </section>

      {/* Core Academic Curricula */}
      <section id="programs" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Curriculum Pathways</p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">Active Learning Tracks</h2>
            <div className="w-12 h-1 bg-navy-100 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, idx) => (
              <motion.div 
                key={program.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-yellow-400 hover:shadow-xl transition-all group rounded-lg"
              >
                <div className="mb-6 w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm group-hover:bg-yellow-50 transition-colors">
                  {getIcon(program.id)}
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-4 tracking-tight">{program.title}</h3>
                <p className="text-navy-500 text-xs font-medium leading-relaxed font-sans mb-6">
                  {program.description}
                </p>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-navy-400 group-hover:text-yellow-600 transition-colors cursor-pointer">
                  <span>Explore Track</span>
                  <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Excellence Section - Light Version */}
      <section className="bg-slate-50 border-y border-slate-200 py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
               <h2 className="text-4xl font-bold text-navy-900 leading-tight">Institutional <span className="text-yellow-600">Values</span> & Outcomes</h2>
               <p className="text-navy-500 font-sans leading-relaxed text-sm">We believe in structured cognitive milestones. Our center in Mambakkam provides personalized attention with a focus on core skill foundations.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">1:15</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Class Size Limit</p>
               </div>
               <div className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">Elite</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Staff Credentials</p>
               </div>
               <div className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">Global</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Curricula Standard</p>
               </div>
               <div className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">2026</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Admissions Active</p>
               </div>
            </div>
          </div>
          <div className="flex-1 bg-white p-12 shadow-2xl relative border border-slate-100 rounded-sm">
             <div className="flex flex-col gap-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Campus Information</p>
                    <h3 className="text-2xl font-bold text-navy-900">Mambakkam Activity Center</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-sm shrink-0">
                          <Clock className="text-navy-400" size={18} />
                       </div>
                       <div>
                          <p className="font-bold text-xs uppercase tracking-tight text-navy-900">Operating Hours</p>
                          <p className="text-[11px] text-navy-400 font-sans mt-1">
                             Mon - Fri: 17:00 - 20:00<br/>
                             Sat: 10:30 - 17:30
                          </p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-sm shrink-0">
                          <MapPin className="text-navy-400" size={18} />
                       </div>
                       <div>
                          <p className="font-bold text-xs uppercase tracking-tight text-navy-900">Location Details</p>
                          <p className="text-[11px] text-navy-400 font-sans mt-1">
                             Ponmar Main Road, Near SBIOA<br/>
                             Mambakkam, Chennai 127
                          </p>
                       </div>
                    </div>
                 </div>

                 <button className="w-full bg-navy-900 text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all cursor-pointer">
                    Contact Admissions
                 </button>
             </div>
          </div>
        </div>
      </section>

      {/* Campus Presence Section */}
      <section className="py-24 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <div className="w-full md:w-1/3 space-y-8">
            <div className="space-y-4">
              <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Campus Presence</p>
              <h2 className="text-4xl font-bold text-navy-900 tracking-tight">Visit our Center</h2>
              <p className="text-navy-500 font-sans leading-relaxed text-sm">
                Strategically located on Ponmar Main Road, our activity center is easily accessible for residents of Mambakkam and surrounding educational hubs.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-lg">
                <MapPin className="text-navy-900 shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-navy-900">Mambakkam Campus</p>
                  <p className="text-[11px] text-navy-500 leading-normal font-sans">
                    Trivesh Complex, Ponmar Main Road,<br/>
                    Near SBIOA School, Chennai 600127
                  </p>
                </div>
              </div>
            </div>
            
            <button className="text-[10px] font-black uppercase tracking-widest text-navy-900 border-b-2 border-yellow-500 pb-1 hover:text-yellow-600 transition-colors cursor-pointer">
              Get Driving Directions
            </button>
          </div>
          
          <div className="flex-1">
            <AcademyMap />
          </div>
        </div>
      </section>

      {/* Structured Footer */}
      <footer className="py-24 px-8 border-t border-navy-100 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
           <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="bg-navy-900 text-yellow-400 w-10 h-10 flex items-center justify-center font-black rounded-sm">RK</div>
                 <h2 className="text-xl font-bold text-navy-900 tracking-tight">Rocking Kids Academy</h2>
              </div>
              <p className="text-navy-400 text-sm font-medium leading-relaxed max-w-sm font-sans">The premier skill development institute for children in Mambakkam, dedicated to building strong cognitive foundations through specialized academic tracks.</p>
           </div>
           <div className="space-y-6 px-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-navy-300">Intake Phases</p>
              <ul className="space-y-3 text-sm font-bold text-navy-600">
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Abacus Foundation</a></li>
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Linguistic Phonics</a></li>
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Master Handwriting</a></li>
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Spoken English</a></li>
              </ul>
           </div>
           <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-navy-300">The Institution</p>
              <ul className="space-y-3 text-sm font-bold text-navy-600">
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Parent Portal</a></li>
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
                 <li><a href="#" className="hover:text-yellow-500 transition-colors">Faculty Login</a></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 border-t border-navy-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest">© 2026 Rocking Kids Academy • Mambakkam Center • Chennai 600127</p>
           <div className="flex gap-8">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-navy-100 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-navy-100 rounded-full"></div>
           </div>
        </div>
      </footer>
    </div>
  );
};
