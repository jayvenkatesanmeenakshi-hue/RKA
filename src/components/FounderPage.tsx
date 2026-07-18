/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  GraduationCap, 
  BookOpen, 
  Smile, 
  Heart, 
  Brain, 
  ChevronRight, 
  Compass, 
  Sparkles,
  ArrowRight,
  BookMarked,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

interface FounderPageProps {
  navigateTo: (path: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
};

export const FounderPage = ({ navigateTo }: FounderPageProps) => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const qualifications = [
    {
      title: "Master of Computer Applications (MCA)",
      institution: "IT Foundation & Computational Logic",
      icon: <GraduationCap className="text-yellow-600" size={24} />,
      desc: "Completed in 2006. Provided a structured, analytical foundation that she later applied to developing systematic early learning frameworks."
    },
    {
      title: "Montessori Teacher Training",
      institution: "Kreedo Early Childhood Solutions",
      icon: <BookOpen className="text-yellow-600" size={24} />,
      desc: "Specialized early childhood pedagogy training focused on child-led, sensory-rich learning environments."
    },
    {
      title: "Brainobrain Faculty Training",
      institution: "Cognitive Skill Development",
      icon: <Brain className="text-yellow-600" size={24} />,
      desc: "Specialized training in abacus mental arithmetic, whole-brain activation, and bilateral learning methodologies."
    },
    {
      title: "Certified NLP Practitioner",
      institution: "Neuro-Linguistic Programming",
      icon: <Sparkles className="text-yellow-600" size={24} />,
      desc: "Utilizing language patterns, cognitive reframing, and mental modeling to boost children's confidence and self-esteem."
    },
    {
      title: "Certified Positive Parenting Coach",
      institution: "Family Partnerships & Guidance",
      icon: <Heart className="text-yellow-600" size={24} />,
      desc: "Empowering parents to partner in their child's development with evidence-backed, respectful, and encouraging support systems."
    },
    {
      title: "Developmental Psychology Certification",
      institution: "Child Psychology & Neuroscience",
      icon: <Compass className="text-yellow-600" size={24} />,
      desc: "Deep theoretical training on how children construct knowledge, process language, and build emotional resilience."
    },
    {
      title: "Certified STEM Educator",
      institution: "Interactive Hands-on Learning",
      icon: <Award className="text-yellow-600" size={24} />,
      desc: "Integrating Science, Technology, Engineering, and Math into play-based early childhood milestones."
    }
  ];

  const timelineEvents = [
    {
      year: "2006",
      title: "IT Industry Launch",
      description: "Graduated with her Master of Computer Applications (MCA) and initiated her professional career in the IT corporate sector, building robust analytical and structural skills."
    },
    {
      year: "2014",
      title: "Transition to Child Education",
      description: "As a mother seeking work-life balance, she completed formal Brainobrain Faculty Training. This pivotal decision ignited her deep, lifelong passion for child development."
    },
    {
      year: "2014 - Present",
      title: "A Decade of Dedicated Pedagogy",
      description: "Guided the early learning journeys of thousands of children. Actively coached families through cognitive skill courses, reading academies, and supportive parent educational circles."
    },
    {
      year: "Professional Growth",
      title: "Continuous Interdisciplinary Mastery",
      description: "Continually integrated modern science by earning certifications in Montessori, Developmental Psychology, NLP, STEM, and parenting coaching, focusing on child psychology and neuroscience."
    },
    {
      year: "Creator of PrithuReader",
      title: "Signature Literacy Program Launch",
      description: "Synthesized years of classroom insights and evidence-informed reading research to invent the PrithuReader Early Literacy Programme—a complete vocabulary and independent reading framework."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-8">
        {/* Subtle background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-100 rounded-full blur-3xl opacity-40 -ml-20 -mb-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-16 relative z-10">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full lg:w-5/12 flex justify-center"
          >
            <div className="relative group">
              {/* Animated Accent Frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-300 rounded-2xl opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white p-2.5 rounded-xl shadow-xl border border-slate-100 overflow-hidden max-w-sm sm:max-w-md">
                <img 
                  src="https://s3.ap-south-1.amazonaws.com/medias.prithureader.com/rk-websites/dot-in/website/rk-founder.png" 
                  alt="Meenakshi Devarajan" 
                  className="w-full h-auto object-cover rounded-lg aspect-[4/5]"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  fetchPriority="high"
                />
                
                {/* Embedded Floating Tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-navy-900/95 backdrop-blur-md text-white p-4 rounded-lg shadow-lg border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-1">Founder & Director</p>
                  <h3 className="text-lg font-bold font-serif text-white">Meenakshi Devarajan</h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-7/12 space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                <Sparkles size={12} /> Meet Our Founder
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 font-serif leading-tight">
                Meenakshi Devarajan
              </h1>
              <p className="text-xs md:text-sm font-black uppercase tracking-widest text-yellow-600 leading-relaxed font-sans">
                Early Literacy Specialist • Child Development Educator • Parent Coach
              </p>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            <blockquote className="border-l-4 border-yellow-500 pl-4 py-1 text-left">
              <p className="text-navy-600 italic text-base md:text-lg leading-relaxed font-serif">
                &ldquo;Every child has the potential to become an independent learner. My mission is to nurture confident readers, curious thinkers, and lifelong learners while partnering with parents to create the best possible foundation for their future.&rdquo;
              </p>
            </blockquote>

            <p className="text-navy-500 text-sm md:text-base font-sans leading-relaxed">
              Meenakshi is the visionary force behind Rocking Kids Academy, dedicated to building children's absolute reading independence and cognitive prowess while establishing a strong educational alliance with parents.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <button 
                onClick={() => {
                  const form = document.querySelector('#contact');
                  if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigateTo('/');
                    setTimeout(() => {
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }, 200);
                  }
                }}
                className="bg-navy-900 text-white hover:bg-yellow-500 hover:text-navy-900 px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-navy-900/10 inline-flex items-center gap-2"
              >
                Schedule a Consultation <ArrowRight size={14} />
              </button>
              
              <button 
                onClick={() => navigateTo('/blog')}
                className="bg-white border border-slate-200 text-navy-800 hover:bg-slate-50 px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all inline-flex items-center gap-2"
              >
                Read Founder's Blog <BookMarked size={14} />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Highlights Bar */}
      <section className="bg-navy-900 py-10 px-4 sm:px-8 text-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-yellow-400 font-serif">2014</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-navy-300">Teaching Since</p>
          </div>
          <div className="space-y-1 border-l border-white/10">
            <p className="text-3xl font-extrabold text-yellow-400 font-serif">1000+</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-navy-300">Children Empowered</p>
          </div>
          <div className="space-y-1 border-l border-white/10">
            <p className="text-3xl font-extrabold text-yellow-400 font-serif">Signature</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-navy-300">PrithuReader Creator</p>
          </div>
          <div className="space-y-1 border-l border-white/10">
            <p className="text-3xl font-extrabold text-yellow-400 font-serif">Elite</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-navy-300">Certified Practitioner</p>
          </div>
        </div>
      </section>

      {/* The Core Narrative Section */}
      <section className="py-16 md:py-24 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-navy-900">
              Our Professional <span className="text-yellow-600">Journey</span> & Philosophy
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 text-navy-600 text-sm md:text-base leading-relaxed font-sans">
            <div className="space-y-6">
              <p>
                After completing her Master of Computer Applications (MCA), Meenakshi began her professional career in the high-paced IT industry. However, her life shifted naturally with motherhood. Seeking a career path that would enable her to balance her professional growth with actively raising her children, she chose to venture into education.
              </p>
              <p>
                What began as a practical personal choice quickly blossomed into an immersive, lifelong calling to understand how young minds learn, interact, and develop. Since 2014, she has actively guided reading instruction, cognitive skill milestones, and parenting support networks.
              </p>
            </div>
            
            <div className="space-y-6">
              <p>
                Working daily in the classroom with children sparked an insatiable curiosity about neuroscience, memory formation, and the vital, irreplaceable role parents play in a child's success. This ongoing pursuit led her to create the revolutionary <strong>PrithuReader Early Literacy Programme</strong>.
              </p>
              <p>
                Rather than relying on mechanical phonics drills, PrithuReader blends systematic auditory-visual decoding with holistic vocabulary, comprehension structures, and playful encouragement, empowering kids to read book-length texts independently with high joy.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Professional Journey Timeline */}
      <section className="py-16 md:py-24 px-4 sm:px-8 bg-slate-50 border-t border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold font-serif text-navy-900">
              The Evolution of an Educator
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-navy-400">
              Timeline Milestones & Milestones of Excellence
            </p>
          </div>

          <div className="relative border-l-2 border-yellow-200 ml-4 sm:ml-32 space-y-12 py-4">
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 sm:pl-10"
              >
                {/* Year tag left aligned on large screens */}
                <div className="absolute left-0 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-yellow-500 border-4 border-white shadow-md z-10" />
                
                <div className="hidden sm:block absolute right-full mr-8 text-right top-0 w-24">
                  <span className="text-sm font-black text-navy-900 bg-yellow-100/70 border border-yellow-200/50 px-2 py-1 rounded-sm uppercase tracking-wider">
                    {event.year}
                  </span>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-2">
                  {/* Mobile-only Year Tag */}
                  <div className="sm:hidden mb-2">
                    <span className="text-[10px] font-black text-navy-900 bg-yellow-100/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {event.year}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-navy-900 font-serif">
                    {event.title}
                  </h4>
                  <p className="text-navy-500 text-xs sm:text-sm font-sans leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications & Professional Learning */}
      <section className="py-16 md:py-24 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-navy-900">
              Qualifications & <span className="text-yellow-600">Certifications</span>
            </h2>
            <p className="text-navy-400 text-xs font-black uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
              Continuous multidisciplinary research in early childhood development, cognitive psychology, counselling, and child neuroscience.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {qualifications.map((qual, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-slate-50 hover:bg-white p-6 md:p-8 rounded-lg border border-slate-100 hover:border-yellow-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center shadow-inner border border-yellow-100">
                    {qual.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-navy-900 tracking-tight font-serif">
                      {qual.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                      {qual.institution}
                    </p>
                  </div>
                  <p className="text-navy-500 text-xs font-sans leading-relaxed">
                    {qual.desc}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {/* Callout Info Box */}
            <motion.div 
              variants={itemVariants}
              className="bg-navy-900 text-white p-6 md:p-8 rounded-lg border border-navy-800 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-yellow-400" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-yellow-400 tracking-tight font-serif">
                    Ongoing Research & Study
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-navy-300">
                    Active Professional Learning
                  </p>
                </div>
                <p className="text-navy-300 text-xs font-sans leading-relaxed">
                  Consistently pursuing advanced course studies and research in Child Psychology, Cognitive Counselling, and Childhood Neuroscience to integrate cutting-edge evidence into academy programmes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="bg-gradient-to-br from-yellow-500/10 to-amber-600/5 py-16 md:py-20 px-4 sm:px-8 border-t border-b border-yellow-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
            Our Core Vision
          </span>
          <p className="text-xl md:text-2xl font-serif text-navy-900 italic leading-relaxed max-w-3xl mx-auto">
            &ldquo;Meenakshi envisions Rocking Kids Academy as a place where children discover the joy of learning, build strong literacy foundations, think independently, and develop the confidence to thrive in school and beyond.&rdquo;
          </p>
          <div className="w-12 h-0.5 bg-yellow-400 mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-navy-500">
            Education as a Partnership — Aligning Teachers, Students, and Parents
          </p>
        </div>
      </section>
    </div>
  );
};
