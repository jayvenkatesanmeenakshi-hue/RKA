/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../context/AcademyContext';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Award, 
  Zap, 
  MessageCircle, 
  PenTool, 
  Instagram, 
  Facebook, 
  Send, 
  Loader2,
  Laptop,
  Globe,
  Users,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Check
} from 'lucide-react';
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
  const [selectedCourse, setSelectedCourse] = useState('Phonics Mastery');
  const [selectedMode, setSelectedMode] = useState('Live Online Class');
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

    const formattedMessage = `[Selected Course: ${selectedCourse}] [Preferred Learning Mode: ${selectedMode}]\n\nParent Message:\n${formData.message}`;

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentName: formData.parentName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          message: formattedMessage
        }),
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

  const enrichProgramInfo = (id: string) => {
    switch (id) {
      case 'Phonics':
        return {
          badge: '⭐ Flagship Program • Live Online',
          tagline: 'Master English Reading in 4-6 Months',
          bullets: [
            'Learn 42 synthetic phonemes & blending secrets',
            'Independent storybook reading confidence',
            'Correct speech pronunciation & sound articulation',
            'Max 6 kids per batch for spoken attention'
          ]
        };
      case 'Abacus':
        return {
          badge: '⭐ Brain Development • Live Online',
          tagline: 'Lightning Fast Mental Math Speed',
          bullets: [
            'Boost visual memory & auditory concentration',
            'Calculate speed math faster than a calculator',
            'Unlock left & right brain hemispheres together',
            'Certified Brainobrain levels & criteria'
          ]
        };
      case 'English':
        return {
          badge: '⭐ Confidence Builder • Live Online',
          tagline: 'Fluent Spoken English & Debate Labs',
          bullets: [
            'Express thoughts clearly and grammatically',
            'Overcome stage fear & build vocal posture',
            'Learn creative writing, essays & comprehension',
            'Dynamic story building & active listening'
          ]
        };
      case 'Handwriting':
        return {
          badge: '⭐ Motor Excellence • Live Online',
          tagline: 'Scientific Cursive Writing Perfection',
          bullets: [
            'Achieve perfect posture & pencil-grip habits',
            'Master smooth connectors & proportional sizes',
            'Improve neatness, layout structure & typing speed',
            'Direct live camera feedback on wrist flexibility'
          ]
        };
      default:
        return {
          badge: 'Childhood Enrichment',
          tagline: 'Interactive Skill Accelerator',
          bullets: []
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section - Optimized for Live Online Phonics & Childhood Skills */}
      <section id="prospectus" className="bg-white border-b border-navy-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="flex-1 space-y-8"
          >
            <motion.div variants={textRevealVariants} className="inline-flex items-center gap-2 bg-yellow-100/60 border border-yellow-300/50 px-3 py-1.5 rounded-full">
              <Sparkles className="text-yellow-600 w-3.5 h-3.5 animate-pulse" />
              <p className="text-navy-900 text-[10px] font-black uppercase tracking-wider font-sans">
                🏆 Rated #1 Live Online Reading & Phonics Classes
              </p>
            </motion.div>
            
            <motion.h1 variants={textRevealVariants} className="text-4.5xl md:text-6xl lg:text-7xl font-bold text-navy-900 tracking-tight leading-[1.15]">
              Transform Your Child's <br/>
              <span className="text-yellow-600">Reading & Confidence.</span>
            </motion.h1>
            
            <motion.p variants={textRevealVariants} className="text-navy-500 text-base md:text-lg lg:text-xl font-medium max-w-xl leading-relaxed font-sans">
              Watch your child read books independently in just 4-6 months! We offer premium <strong>Live Online Phonics, Abacus, spoken English, and Handwriting classes</strong> for kids ages 4 to 14. Real-time personal attention in fun, highly engaging small batches.
            </motion.p>
            
            {/* Value Highlights */}
            <motion.div variants={textRevealVariants} className="grid grid-cols-2 gap-y-3 gap-x-4 max-w-lg font-sans text-xs md:text-sm font-semibold text-navy-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="text-yellow-600 w-4 h-4 shrink-0" />
                <span>100% Interactive Live Online Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-yellow-600 w-4 h-4 shrink-0" />
                <span>Small Personal Batches (Max 6-8 Kids)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-yellow-600 w-4 h-4 shrink-0" />
                <span>Certified Child Enrichment Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="text-yellow-600 w-4 h-4 shrink-0" />
                <span>Learn Safely From Anywhere in India</span>
              </div>
            </motion.div>

            <motion.div variants={textRevealVariants} className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-navy-900 text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-2xl shadow-navy-900/20 cursor-pointer"
              >
                BOOK FREE LIVE TRIAL SLOT
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('curriculum');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-navy-900 border-b-2 border-navy-100 hover:border-yellow-500 px-4 py-4 font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
              >
                Explore Live Courses
              </button>
            </motion.div>

            <motion.p variants={textRevealVariants} className="text-[10px] text-navy-400 font-sans italic">
              * Also available: offline physical classroom sessions at our premium Mambakkam, Chennai hub!
            </motion.p>
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
                src="https://s3.ap-south-1.amazonaws.com/medias.prithureader.com/rk-websites/dot-in/website/landing-online-teacher.png" 
                alt="Child happily learning live online with Rocking Kids Academy" 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-navy-900/5"></div>

              <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-8 shadow-xl">
                 <div className="text-navy-900 text-center">
                    <p className="text-3xl font-black">10+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Years Excellence</p>
                    <p className="text-[9px] font-semibold tracking-wider mt-1.5 opacity-90">5,000+ Kids Trained</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>
      </section>

      {/* Why Live Online Learning Works - The Interactive Edge */}
      <section id="why-online" className="py-24 px-8 bg-slate-50 border-b border-navy-100/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={textRevealVariants} className="inline-flex items-center gap-3">
              <span className="w-8 h-[2px] bg-yellow-500"></span>
              <p className="text-navy-500 text-[10px] font-black uppercase tracking-[0.3em] font-sans">The Online Learning Edge</p>
              <span className="w-8 h-[2px] bg-yellow-500"></span>
            </motion.div>
            <motion.h2 variants={textRevealVariants} className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">
              Why Our Live Online Classes <br/>
              <span className="text-yellow-600">Actually Work for Young Learners</span>
            </motion.h2>
            <motion.p variants={textRevealVariants} className="text-navy-500 max-w-2xl mx-auto text-base md:text-lg font-sans leading-relaxed">
              We do not offer pre-recorded video tutorials. Our classes are 100% interactive, live video-based sessions where certified trainers engage directly with your child.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Edge Card 1 */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-md hover:shadow-xl hover:border-yellow-400 transition-all duration-300 group">
              <div className="w-12 h-12 rounded bg-yellow-100 flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                <Users className="text-navy-950" size={24} />
              </div>
              <h3 className="text-lg font-black text-navy-900 uppercase tracking-wide font-sans mb-3">
                Small Batches (Max 6-8 Kids)
              </h3>
              <p className="text-navy-500 text-sm leading-relaxed font-sans font-medium">
                Every child gets active speaking opportunities, personalized coaching, and regular verbal reading practice. No child gets left behind.
              </p>
            </motion.div>

            {/* Edge Card 2 */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-md hover:shadow-xl hover:border-yellow-400 transition-all duration-300 group">
              <div className="w-12 h-12 rounded bg-yellow-100 flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                <PenTool className="text-navy-950" size={24} />
              </div>
              <h3 className="text-lg font-black text-navy-900 uppercase tracking-wide font-sans mb-3">
                Interactive Student Portal
              </h3>
              <p className="text-navy-500 text-sm leading-relaxed font-sans font-medium">
                Facilitators assign exercises and worksheets through our portal, and students can access them directly through their student login.
              </p>
            </motion.div>

            {/* Edge Card 3 */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-md hover:shadow-xl hover:border-yellow-400 transition-all duration-300 group">
              <div className="w-12 h-12 rounded bg-yellow-100 flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                <Laptop className="text-navy-950" size={24} />
              </div>
              <h3 className="text-lg font-black text-navy-900 uppercase tracking-wide font-sans mb-3">
                Expert Trained Facilitators
              </h3>
              <p className="text-navy-500 text-sm leading-relaxed font-sans font-medium">
                Our classes are conducted exclusively by expert trained facilitators skilled in maintaining high energy and attention spans.
              </p>
            </motion.div>

            {/* Edge Card 4 */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-md hover:shadow-xl hover:border-yellow-400 transition-all duration-300 group">
              <div className="w-12 h-12 rounded bg-yellow-100 flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                <Clock className="text-navy-950" size={24} />
              </div>
              <h3 className="text-lg font-black text-navy-900 uppercase tracking-wide font-sans mb-3">
                Flexible Learning & Schedules
              </h3>
              <p className="text-navy-500 text-sm leading-relaxed font-sans font-medium">
                Flexible session replacements and zero daily travel stress for parents and kids.
              </p>
            </motion.div>

            {/* Edge Card 5 */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-md hover:shadow-xl hover:border-yellow-400 transition-all duration-300 group">
              <div className="w-12 h-12 rounded bg-yellow-100 flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                <Globe className="text-navy-950" size={24} />
              </div>
              <h3 className="text-lg font-black text-navy-900 uppercase tracking-wide font-sans mb-3">
                Proven Milestone Success
              </h3>
              <p className="text-navy-500 text-sm leading-relaxed font-sans font-medium">
                Over 1,000+ kids have successfully transitioned into highly fluent readers, confident public speakers, and mental math experts. We train kids aged 4 to 14.
              </p>
            </motion.div>
          </motion.div>

          {/* Interactive Action Ribbon */}
          <div className="mt-16 bg-navy-900 text-white rounded-lg p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-xl font-bold font-sans">Curious to see how a live online class works?</h4>
              <p className="text-navy-200 text-xs md:text-sm font-sans">Book a 20-minute live demonstration slot for your child at absolutely zero cost.</p>
            </div>
            <button 
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-navy-950 px-6 py-3 rounded font-black text-[10px] uppercase tracking-wider transition-all shadow-lg shrink-0 cursor-pointer"
            >
              SCHEDULE A FREE DEMO
            </button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>
      </section>

      {/* Core Academic Curricula - Rearranged and Enriched with Live Online Focus */}
      <section id="curriculum" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center mb-20 space-y-4"
          >
            <motion.p variants={textRevealVariants} className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">Our Premium Courses</motion.p>
            <motion.h2 variants={textRevealVariants} className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">Explore Live Interactive Programs</motion.h2>
            <motion.p variants={textRevealVariants} className="text-navy-500 max-w-xl mx-auto text-sm font-sans font-medium">
              Every course is structured around real-world milestones, guided by expert mentors, and optimized for maximum student-trainer interaction.
            </motion.p>
            <motion.div variants={textRevealVariants} className="w-12 h-1 bg-navy-100 mx-auto"></motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[...programs].sort((a, b) => a.id === 'Phonics' ? -1 : b.id === 'Phonics' ? 1 : 0).map((program) => {
              const enriched = enrichProgramInfo(program.id);
              return (
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
                  <div className="p-6 flex-grow flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-1 rounded self-start mb-2.5">
                      {enriched.badge}
                    </span>
                    <h3 className="text-lg font-bold text-navy-900 mb-1 tracking-tight leading-snug group-hover:text-yellow-600 transition-colors">{program.title}</h3>
                    <p className="text-navy-500 text-[11px] font-bold leading-normal font-sans mb-4 min-h-[32px]">
                      {enriched.tagline}
                    </p>
                    
                    {/* Bullet Highlights */}
                    <ul className="space-y-2.5 mb-6 text-navy-700 text-[11px] font-medium font-sans flex-grow">
                      {enriched.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="text-yellow-500 w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                         {program.levels.slice(0, 1).map(level => (
                            <span key={level} className="text-[8px] font-black uppercase tracking-wider text-navy-400 bg-slate-50 px-1.5 py-0.5 rounded-sm">{level}</span>
                         ))}
                         {program.levels.length > 1 && <span className="text-[8px] font-black uppercase tracking-wider text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-sm">+{program.levels.length - 1} Levels</span>}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-navy-400 group-hover:text-yellow-600 transition-colors inline-flex items-center gap-1 shrink-0">
                        Details →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                             312/2, Ponmar Main Road, Mambakkam<br/>
                             Chennai, Tamil Nadu 600127
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
                Strategically located on Mambakkam Main Road, our activity center is easily accessible for residents and surrounding educational hubs.
              </motion.p>
            </div>
            
            <motion.div variants={textRevealVariants} className="space-y-4">
              <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-lg group hover:bg-white hover:shadow-lg transition-all duration-500">
                <MapPin className="text-navy-900 shrink-0 group-hover:text-yellow-600 transition-colors" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-navy-900">Main Campus</p>
                  <p className="text-[11px] text-navy-500 leading-normal font-sans">
                    312/2, Ponmar Main Road, Mambakkam,<br/>
                    Near SBIOA School, Chennai, Tamil Nadu 600127
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
                <h3 className="text-xl font-bold text-navy-900 mb-1">Book Your Free Live Interactive Trial Slot</h3>
                <p className="text-navy-400 text-xs font-sans font-semibold leading-relaxed">
                  Select your child's learning goals. Our trainers will schedule a 1-on-1 personal diagnostic session with your child completely free!
                </p>
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
                  <h4 className="text-lg font-bold text-green-900">Trial Slot Requested!</h4>
                  <p className="text-green-700 text-sm font-sans max-w-md mx-auto">
                    We have successfully received your trial request for <strong>{selectedCourse}</strong> ({selectedMode}). Our early childhood mentors will contact you within 24 hours to schedule your preferred live slot.
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
                    Submit Another Request
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

                  {/* Course of Interest & Mode Select fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="courseSelect" className="block text-[10px] font-black uppercase tracking-wider text-navy-600">Course of Interest <span className="text-yellow-600">*</span></label>
                      <select 
                        id="courseSelect" 
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-yellow-500 focus:bg-white px-4 py-3 text-sm rounded outline-none transition-all font-sans text-navy-900"
                      >
                        <option value="Phonics Mastery">Phonics Mastery (Reading & Spelling)</option>
                        <option value="Brainobrain Abacus">Brainobrain Abacus (Mental Math)</option>
                        <option value="English & Communication">English & Communication (Fluency)</option>
                        <option value="Handwriting Improvement">Handwriting Improvement (Cursive)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modeSelect" className="block text-[10px] font-black uppercase tracking-wider text-navy-600">Preferred Mode <span className="text-yellow-600">*</span></label>
                      <select 
                        id="modeSelect" 
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-yellow-500 focus:bg-white px-4 py-3 text-sm rounded outline-none transition-all font-sans text-navy-900"
                      >
                        <option value="Live Online Class">Live Online Class (Learn from Anywhere)</option>
                        <option value="Offline Classroom">Offline Classroom (Mambakkam, Chennai Centre)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-wider text-navy-600">Message or Specific Requests <span className="text-navy-400 font-sans uppercase tracking-wider font-bold">(Optional)</span></label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="E.g., Preferred timings, child's age, specific learning struggles..."
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

    </div>
  );
};
