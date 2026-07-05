/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../context/AcademyContext';
import { MapPin, Clock, Phone, Mail, Award, Zap, MessageCircle, PenTool, Instagram, Facebook, Send, Loader2 } from 'lucide-react';
import { AcademyMap } from './AcademyMap';
import { GoogleReviews } from './GoogleReviews';
import logoIcon from '../assets/images/logo-icon.png';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 70,
      damping: 20,
      mass: 0.8
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 24,
      mass: 0.5
    }
  }
};

export const LandingPage = ({ navigateTo }: { navigateTo: (path: string) => void }) => {
  const { programs } = useAcademy();

  const [formData, setFormData] = useState({
    parentName: '',
    mobileNumber: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [formWarning, setFormWarning] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormError('');
    setFormWarning('');

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      if (data.warning) {
        setFormWarning(data.warning);
      }

      setFormStatus('success');
      setFormData({
        parentName: '',
        mobileNumber: '',
        email: '',
        message: ''
      });
    } catch (err: any) {
      console.error('Error submitting enquiry form:', err);
      setFormStatus('error');
      setFormError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'Abacus': return <Zap className="text-yellow-500" size={28} />;
      case 'Phonics': return <Award className="text-yellow-500" size={28} />;
      case 'English': return <MessageCircle className="text-yellow-500" size={28} />;
      case 'Handwriting': return <PenTool className="text-yellow-500" size={28} />;
      default: return <Award className="text-yellow-500" size={28} />;
    }
  };

  const getProgramImage = (id: string) => {
    switch (id) {
      case 'Abacus': return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlfyqRSZ85qEQbv13UC5Rlb188UUJYFsqLu69j75hMHYgFmjM92UKM72I&s=10";
      case 'Phonics': return "https://www.startwithabook.org/sites/default/files/styles/compress/public/swab-fluency.jpg?itok=6WyhPfiw";
      case 'English': return "https://snu.edu.in/site/assets/files/11901/86cb4198-f490-4f56-a25f-8399a039edf4.1600x0.webp";
      case 'Handwriting': return "https://i.ytimg.com/vi/d479blB8l9Y/maxresdefault.jpg";
      default: return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section - Light & Academic Activity Center */}
      <section id="prospectus" className="bg-white border-b border-navy-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-20 md:py-32 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="flex-1 space-y-8"
          >
            <motion.div variants={textRevealVariants} className="inline-flex items-center gap-3">
              <span className="w-10 h-[2px] bg-yellow-500"></span>
              <p className="text-navy-500 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Empowering Next Generation</p>
            </motion.div>
            <motion.h1 variants={textRevealVariants} className="text-5xl md:text-7xl font-bold text-navy-900 tracking-tight leading-[1.1]">
              A Premier <br/>
              <span className="text-yellow-600">Learning Center.</span>
            </motion.h1>
            <motion.p variants={textRevealVariants} className="text-navy-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed font-sans">
              Dedicated to skill development for children ages 4 to 14. We provide a nurturing environment for Abacus, Phonics, English, and Handwriting mastery.
            </motion.p>
            <motion.div variants={textRevealVariants} className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-navy-900 text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-2xl shadow-navy-900/20 cursor-pointer"
              >
                BOOK FREE TRIAL SLOT
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('curriculum');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-navy-900 border-b-2 border-navy-100 hover:border-yellow-500 px-4 py-4 font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
              >
                Our Programs
              </button>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 1.05, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 40,
              damping: 24,
              mass: 1.2,
              delay: 0.3
            }}
            className="flex-1 w-full"
          >
            <div className="aspect-[4/3] bg-navy-50 border-4 border-white shadow-2xl relative overflow-hidden rounded-lg group">
               <img 
                src="https://images.jdmagicbox.com/v2/comp/chennai/z1/044pxx44.xx44.140111110123.q7z1/catalogue/rocking-kids-mandaveli-chennai-handwriting-classes-elkuhnvsl7.jpg" 
                alt="Learning at Rocking Kids Academy" 
                className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                fetchPriority="high"
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
      <section id="curriculum" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center mb-20 space-y-4"
          >
            <motion.p variants={textRevealVariants} className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Curriculum Pathways</motion.p>
            <motion.h2 variants={textRevealVariants} className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">Active Learning Tracks</motion.h2>
            <motion.div variants={textRevealVariants} className="w-12 h-1 bg-navy-100 mx-auto"></motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {programs.map((program) => (
              <motion.div 
                key={program.id}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                onClick={() => navigateTo(`/program/${program.id}`)}
                className="overflow-hidden bg-white border border-slate-100 hover:border-yellow-400 hover:shadow-xl transition-all group rounded-lg flex flex-col cursor-pointer"
              >
                <div className={`aspect-[16/10] overflow-hidden relative ${program.id === 'Abacus' ? 'bg-white p-4' : ''}`}>
                   <img 
                      src={getProgramImage(program.id)} 
                      alt={program.title}
                      className={`w-full h-full ${program.id === 'Abacus' ? 'object-contain' : 'object-cover'} group-hover:scale-110 transition-transform duration-500`}
                      loading="lazy"
                   />
                   <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-sm shadow-sm">
                      {getIcon(program.id)}
                   </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-navy-900 mb-4 tracking-tight">{program.title}</h3>
                  <p className="text-navy-500 text-xs font-medium leading-relaxed font-sans mb-6">
                    {program.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <ul className="flex flex-wrap gap-1.5">
                       {program.levels.slice(0, 2).map(level => (
                          <li key={level} className="text-[9px] font-black uppercase tracking-wider text-navy-300 bg-slate-50 px-2 py-1 rounded-sm">{level}</li>
                       ))}
                       {program.levels.length > 2 && <li className="text-[9px] font-black uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-1 rounded-sm">+{program.levels.length - 2} More</li>}
                    </ul>
                    <span className="text-[10px] font-black uppercase tracking-widest text-navy-400 group-hover:text-yellow-600 transition-colors inline-flex items-center gap-1">
                      Explore →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Academic Excellence Section - Light Version */}
      <section id="faculty" className="bg-slate-50 border-y border-slate-200 py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="flex-1 space-y-10"
          >
            <div className="space-y-4">
               <motion.h2 variants={textRevealVariants} className="text-4xl font-bold text-navy-900 leading-tight">Institutional <span className="text-yellow-600">Values</span> & Outcomes</motion.h2>
               <motion.p variants={textRevealVariants} className="text-navy-500 font-sans leading-relaxed text-sm">We believe in structured cognitive milestones. Our center provides personalized attention with a focus on core skill foundations.</motion.p>
            </div>
            <motion.div variants={containerVariants} className="grid grid-cols-2 gap-8">
               <motion.div variants={textRevealVariants} className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">Max 08</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Students Per Class</p>
               </motion.div>
               <motion.div variants={textRevealVariants} className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">Elite</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Staff Credentials</p>
               </motion.div>
               <motion.div variants={textRevealVariants} className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">Proven</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Learning Methods</p>
               </motion.div>
               <motion.div variants={textRevealVariants} className="space-y-2 border-l-2 border-navy-100 pl-4">
                  <h4 className="text-3xl font-bold text-navy-900">2026</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Admissions Active</p>
               </motion.div>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: 8 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              type: "spring", 
              stiffness: 60, 
              damping: 22,
              mass: 1
            }}
            className="flex-1 bg-white shadow-2xl relative border border-slate-100 rounded-sm overflow-hidden"
          >
             <div className="aspect-video w-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200" 
                  alt="Student Excellence at our Center" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
             </div>
             <div className="flex flex-col gap-8 p-12">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Campus Information</p>
                    <h3 className="text-2xl font-bold text-navy-900">Rocking Kids Academy</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-sm shrink-0">
                          <Clock className="text-navy-400" size={18} />
                       </div>
                       <div>
                          <p className="font-bold text-xs uppercase tracking-tight text-navy-900">Operating Hours</p>
                          <p className="text-[11px] text-navy-400 font-sans mt-1">
                             Mon - Fri: 16:00 - 20:00<br/>
                             Sat: 14:00 - 18:00
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
                             Chennai 600127
                          </p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => {
                     const el = document.getElementById('contact');
                     if (el) el.scrollIntoView({ behavior: 'smooth' });
                   }}
                   className="w-full bg-navy-900 text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all cursor-pointer"
                 >
                    BOOK FREE TRIAL SLOT
                 </button>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Campus Presence Section */}
      <section id="location" className="py-24 px-8 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="w-full md:w-1/3 space-y-8"
          >
            <div className="space-y-4">
              <motion.p variants={textRevealVariants} className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Campus Presence</motion.p>
              <motion.h2 variants={textRevealVariants} className="text-4xl font-bold text-navy-900 tracking-tight">Visit our Center</motion.h2>
              <motion.p variants={textRevealVariants} className="text-navy-500 font-sans leading-relaxed text-sm">
                Strategically located on Ponmar Main Road, our activity center is easily accessible for residents and surrounding educational hubs.
              </motion.p>
            </div>
            
            <motion.div variants={textRevealVariants} className="space-y-4">
              <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-lg group hover:bg-white hover:shadow-lg transition-all duration-500">
                <MapPin className="text-navy-900 shrink-0 group-hover:text-yellow-600 transition-colors" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-navy-900">Main Campus</p>
                  <p className="text-[11px] text-navy-500 leading-normal font-sans">
                    Trivesh Complex, Ponmar Main Road,<br/>
                    Near SBIOA School, Chennai 600127
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ 
              type: "spring", 
              stiffness: 60, 
              damping: 24,
              mass: 1
            }}
            className="flex-1"
          >
            <AcademyMap />
          </motion.div>
        </div>
      </section>

      {/* Google Reviews & Testimonials Section */}
      <GoogleReviews />

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center mb-16 space-y-4"
          >
            <motion.p variants={textRevealVariants} className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Get In Touch</motion.p>
            <motion.h2 variants={textRevealVariants} className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">Contact Us</motion.h2>
            <motion.div variants={textRevealVariants} className="w-12 h-1 bg-navy-100 mx-auto"></motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Social/Phone Channels */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
              className="lg:col-span-5 space-y-6"
            >
              <p className="text-navy-500 font-sans text-sm leading-relaxed mb-8">
                Have questions about our curriculum, class schedules, or admissions? Please submit an enquiry using the form. Our admissions desk will review your submission and connect with you shortly.
              </p>

              {/* WhatsApp/Phone Card */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all group flex items-start gap-5"
              >
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-sm group-hover:bg-yellow-400 transition-colors shrink-0">
                  <Phone className="text-navy-900" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900 mb-1">Phone / WhatsApp</h3>
                  <p className="text-navy-500 text-xs font-sans mb-3">Direct assistance for admissions and general inquiries.</p>
                  <div className="flex flex-col gap-3">
                    {/* Number 1 */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <a 
                        href="tel:+918754431210" 
                        className="inline-flex items-center gap-1.5 text-navy-900 font-black text-[10px] uppercase tracking-widest hover:text-yellow-600 transition-colors border-r border-slate-200 pr-2.5"
                        title="Click to Call"
                      >
                        <Phone size={10} className="text-navy-400" /> +91 87544 31210
                      </a>
                      <a 
                        href="https://wa.me/918754431210" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600 hover:text-green-700 uppercase tracking-wider transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={12} className="fill-green-500 text-green-500" /> Chat
                      </a>
                    </div>

                    {/* Number 2 */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <a 
                        href="tel:+918754495607" 
                        className="inline-flex items-center gap-1.5 text-navy-900 font-black text-[10px] uppercase tracking-widest hover:text-yellow-600 transition-colors border-r border-slate-200 pr-2.5"
                        title="Click to Call"
                      >
                        <Phone size={10} className="text-navy-400" /> +91 87544 95607
                      </a>
                      <a 
                        href="https://wa.me/918754495607" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600 hover:text-green-700 uppercase tracking-wider transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={12} className="fill-green-500 text-green-500" /> Chat
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Instagram Card */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all group flex items-start gap-5"
              >
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-sm group-hover:bg-yellow-400 transition-colors shrink-0">
                  <Instagram className="text-navy-900" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900 mb-1">Instagram</h3>
                  <p className="text-navy-500 text-xs font-sans mb-3">Follow daily activities and academy milestones.</p>
                  <a 
                    href="https://www.instagram.com/rockingkidsacademy/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-navy-900 font-black text-[9px] uppercase tracking-widest hover:text-yellow-600 transition-colors"
                  >
                    @rockingkidsacademy
                  </a>
                </div>
              </motion.div>

              {/* Facebook Card */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all group flex items-start gap-5"
              >
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-sm group-hover:bg-yellow-400 transition-colors shrink-0">
                  <Facebook className="text-navy-900" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900 mb-1">Facebook</h3>
                  <p className="text-navy-500 text-xs font-sans mb-3">Stay updated with our community announcements.</p>
                  <a 
                    href="https://www.facebook.com/rockingkidsacademy/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-navy-900 font-black text-[9px] uppercase tracking-widest hover:text-yellow-600 transition-colors"
                  >
                    /rockingkidsacademy
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Interactive Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 bg-white p-8 md:p-10 border border-slate-100 rounded-lg shadow-xl shadow-slate-200/40"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-navy-900 mb-1">Book Free Trial Slot / Send Enquiry</h3>
                <p className="text-navy-400 text-xs font-sans">Submit your contact info to lock in a trial session at our Ponmar Main Road center.</p>
              </div>

              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 p-8 rounded-lg text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-green-100 text-green-600 mx-auto flex items-center justify-center rounded-full">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-green-900">Enquiry Received!</h4>
                  <p className="text-green-700 text-sm font-sans max-w-md mx-auto">
                    Thank you for reaching out to Rocking Kids Academy. Your inquiry has been processed and logged. Our team is excited to assist you!
                  </p>

                  {formWarning && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-xs text-left font-sans mt-4 space-y-1 max-w-md mx-auto">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse animate-duration-1000"></span>
                        System Notice (Mail Server):
                      </div>
                      <p className="opacity-95 text-[11px] leading-relaxed">{formWarning}</p>
                    </div>
                  )}

                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {formStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded text-xs text-red-600 font-sans">
                      <strong>Submission Error:</strong> {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="parentName" className="block text-[10px] font-black uppercase tracking-wider text-navy-600">Parent's Name <span className="text-yellow-600">*</span></label>
                      <input 
                        type="text" 
                        id="parentName" 
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-yellow-500 focus:bg-white px-4 py-3 text-sm rounded outline-none transition-all font-sans text-navy-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="mobileNumber" className="block text-[10px] font-black uppercase tracking-wider text-navy-600">Mobile Number <span className="text-yellow-600">*</span></label>
                      <input 
                        type="tel" 
                        id="mobileNumber" 
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-yellow-500 focus:bg-white px-4 py-3 text-sm rounded outline-none transition-all font-sans text-navy-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-wider text-navy-600">Email Address <span className="text-yellow-600">*</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="parent@example.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-yellow-500 focus:bg-white px-4 py-3 text-sm rounded outline-none transition-all font-sans text-navy-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-wider text-navy-600">Enquiry Message <span className="text-yellow-600">*</span></label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="I would like to enquire about active learning tracks..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-yellow-500 focus:bg-white px-4 py-3 text-sm rounded outline-none transition-all font-sans text-navy-900 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-navy-900 hover:bg-yellow-500 hover:text-navy-900 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Sending Enquiry...
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        Submit Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-12 px-8 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src={logoIcon} 
                alt="Rocking Kids Academy Logo" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <h2 className="text-lg font-bold text-navy-900 tracking-tight">Rocking Kids Academy</h2>
            </div>
            <div className="hidden md:block w-px h-6 bg-slate-100"></div>
            <p className="text-navy-400 text-[10px] font-black uppercase tracking-widest">Chennai 600127</p>
          </div>
          
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-navy-600">
            <a href="#curriculum" className="hover:text-yellow-500 transition-colors">Curriculum</a>
            <a href="#location" className="hover:text-yellow-500 transition-colors">Location</a>
            <a href="#contact" className="hover:text-yellow-500 transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest">© 2026</p>
            <span className="text-slate-200">|</span>
            <a 
              href="/admin" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new Event('popstate'));
              }}
              className="text-[10px] font-black text-navy-300 hover:text-yellow-600 uppercase tracking-widest transition-colors"
            >
              SEO Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
