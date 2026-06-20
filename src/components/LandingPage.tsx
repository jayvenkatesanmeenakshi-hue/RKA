/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../context/AcademyContext';
import { MapPin, Clock, Phone, Mail, ChevronRight, Award, Zap, MessageCircle, PenTool } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Academic Focus */}
      <section className="bg-navy-900 border-b-4 border-yellow-400 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-24 md:py-32 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-3 border-l-4 border-yellow-400 pl-4">
              <p className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em] font-sans">Institutional Excellence</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
              Enriching <br/>
              <span className="text-yellow-400">Young Minds.</span>
            </h1>
            <p className="text-navy-200 text-lg md:text-xl font-medium max-w-xl leading-relaxed font-sans">
              Rocking Kids Academy Mambakkam serves as a premier center for cognitive development, offering rigorous curricula in mental arithmetic, linguistics, and motor skills.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button className="bg-white text-navy-900 px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl shadow-black/20 cursor-pointer">
                Enroll for 2026
              </button>
              <button className="text-white border-b-2 border-white/20 hover:border-yellow-400 px-2 py-4 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer">
                Download Prospectus
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 w-full"
          >
            <div className="aspect-[3/4] md:aspect-[4/5] bg-navy-800 border-8 border-white/5 relative overflow-hidden grayscale contrast-125">
               <img 
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200" 
                alt="Academy Architecture" 
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                 <div className="flex items-end justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Facility Accreditation</p>
                       <p className="text-white text-sm font-bold opacity-80">Ponmar Main Road Campus • Chennai</p>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
      </section>

      {/* Core Academic Curricula */}
      <section id="programs" className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-navy-100 pb-12 mb-20">
            <p className="text-navy-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4 font-sans">The Curriculum Framework</p>
            <h2 className="text-5xl font-bold text-navy-900 tracking-tight">Core Academic Tracks</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-navy-100 border-y border-navy-100">
            {programs.map((program, idx) => (
              <motion.div 
                key={program.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-12 hover:bg-navy-50 transition-all group relative overflow-hidden"
              >
                <span className="text-[60px] font-black text-navy-900/5 absolute -right-4 -top-4 select-none">0{idx + 1}</span>
                <div className="mb-10 text-navy-900">
                  {getIcon(program.id)}
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-4 tracking-tight">{program.title}</h3>
                <p className="text-navy-500 text-sm font-medium leading-relaxed font-sans mb-8">
                  {program.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy-900 group-hover:text-yellow-600 transition-colors cursor-pointer">
                  <span>Syllabus Details</span>
                  <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Integrity Section */}
      <section className="bg-navy-900 text-white py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
               <h2 className="text-5xl font-bold leading-tight">Academic Integrity & <br/><span className="text-yellow-400">Institutional Values</span></h2>
               <p className="text-navy-300 font-sans leading-relaxed">Our pedagogy focuses on small batch sizes, individual attention, and a structured milestone-based progression system that ensures 100% learning outcomes for every child.</p>
            </div>
            <div className="grid grid-cols-2 gap-12">
               <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-yellow-400">1:15</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Student-Staff Ratio</p>
               </div>
               <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-yellow-400">100%</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Success Verification</p>
               </div>
               <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-yellow-400">Elite</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Faculty Standards</p>
               </div>
               <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-yellow-400">2026</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Academic Intake Open</p>
               </div>
            </div>
          </div>
          <div className="flex-1 bg-white/5 p-16 rounded-sm border border-white/10 relative">
             <div className="absolute top-0 right-0 p-8">
                <Award size={48} className="text-yellow-400/20" />
             </div>
             <h3 className="text-3xl font-bold mb-6">Mambakkam Center</h3>
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <Clock className="text-yellow-400 mt-1" size={20} />
                   <div>
                      <p className="font-bold text-sm">Weekday Batches</p>
                      <p className="text-xs text-navy-300 font-sans">Monday - Friday • 17:00 - 20:00</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <Clock className="text-yellow-400 mt-1" size={20} />
                   <div>
                      <p className="font-bold text-sm">Weekend Intensive</p>
                      <p className="text-xs text-navy-300 font-sans">Saturday • 10:30 - 17:30</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <MapPin className="text-yellow-400 mt-1" size={20} />
                   <div>
                      <p className="font-bold text-sm">Campus Address</p>
                      <p className="text-xs text-navy-300 font-sans">Trivesh Complex, Ponmar Main Road <br/>Near SBIOA, Mambakkam, Chennai 127</p>
                   </div>
                </div>
             </div>
             <button className="w-full mt-12 bg-yellow-400 text-navy-900 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-white transition-all cursor-pointer">
                Locate Presence
             </button>
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
