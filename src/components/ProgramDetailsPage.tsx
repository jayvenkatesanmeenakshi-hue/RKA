/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../context/AcademyContext';
import { ProgramType } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Zap, 
  MessageCircle, 
  PenTool, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Loader2 
} from 'lucide-react';

interface ProgramDetailsPageProps {
  programId: ProgramType;
  navigateTo: (path: string) => void;
}

export const ProgramDetailsPage = ({ programId, navigateTo }: ProgramDetailsPageProps) => {
  const { programDetails } = useAcademy();
  const details = programDetails[programId];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    parentName: '',
    mobileNumber: '',
    email: '',
    message: `Hi, I am interested in enrolling my child in the ${details?.title || programId} program. Please provide more details.`
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [formWarning, setFormWarning] = useState('');

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [programId]);

  if (!details) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-navy-900 mb-4">Program Not Found</h2>
        <p className="text-navy-500 mb-8">The requested program details could not be loaded.</p>
        <button 
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        message: `Hi, I am interested in enrolling my child in the ${details.title} program. Please provide more details.`
      });
    } catch (err: any) {
      console.error('Error submitting enquiry form:', err);
      setFormStatus('error');
      setFormError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'Abacus': return <Zap className="text-yellow-500" size={32} />;
      case 'Phonics': return <Award className="text-yellow-500" size={32} />;
      case 'English': return <MessageCircle className="text-yellow-500" size={32} />;
      case 'Handwriting': return <PenTool className="text-yellow-500" size={32} />;
      default: return <Award className="text-yellow-500" size={32} />;
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
    <div className="bg-slate-50/50 min-h-screen pb-24">
      {/* Dynamic SEO Title Update */}
      {(() => {
        document.title = `${details.title} | Rocking Kids Academy Chennai`;
        return null;
      })()}

      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigateTo('/')}
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy-400 hover:text-navy-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-yellow-600 font-mono">
            Rocking Kids Academy / Programs / {details.id}
          </div>
        </div>
      </div>

      {/* Program Hero Section */}
      <section className="bg-white border-b border-navy-100 py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column: Title & Intro */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-sm">
                {getIcon(details.id)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600 font-sans">
                Featured Program
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
              {details.title}
            </h1>
            <p className="text-lg text-navy-600 font-sans leading-relaxed">
              {details.extendedDescription}
            </p>

            {/* Program Quick Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Users className="text-yellow-600" size={20} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-navy-400">Target Age</p>
                  <p className="text-xs font-bold text-navy-900">{details.ageGroup}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" size={20} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-navy-400">Class Duration</p>
                  <p className="text-xs font-bold text-navy-900">{details.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-yellow-600" size={20} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-navy-400">Frequency</p>
                  <p className="text-xs font-bold text-navy-900">{details.classFrequency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="flex-1 w-full relative">
            <div className="aspect-[16/10] bg-white border border-slate-100 rounded-lg overflow-hidden shadow-2xl relative">
              <img 
                src={getProgramImage(details.id)} 
                alt={details.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Core Benefits Grid */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">
            Why It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
            Key Educational Benefits
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {details.benefits.map((benefit, index) => (
            <div 
              key={index}
              className="p-8 bg-white border border-slate-100 rounded-lg flex gap-6 hover:shadow-lg hover:border-yellow-400/40 transition-all"
            >
              <div className="w-12 h-12 rounded-sm bg-yellow-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-yellow-600" size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-navy-900">{benefit.title}</h3>
                <p className="text-xs text-navy-500 font-sans leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum breakdown timeline */}
      <section className="py-20 px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">
              Structured Milestones
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
              Curriculum & Level Breakdown
            </h2>
            <div className="w-12 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.curriculumDetails.map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-slate-50 border border-slate-100 rounded-lg space-y-3 relative overflow-hidden group hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-4 font-mono font-black text-slate-100 text-5xl group-hover:text-yellow-100/60 transition-colors select-none">
                  0{index + 1}
                </div>
                <div className="inline-block bg-yellow-400/20 text-yellow-700 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm relative z-10">
                  {item.level}
                </div>
                <h4 className="font-bold text-navy-900 relative z-10">Learning Goal</h4>
                <p className="text-xs text-navy-500 font-sans leading-relaxed relative z-10">
                  {item.focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Contact Dual Grid */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* FAQ Column */}
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">
                Common Questions
              </p>
              <h2 className="text-3xl font-bold text-navy-900 tracking-tight">
                Program FAQs
              </h2>
              <div className="w-12 h-1 bg-yellow-500"></div>
            </div>

            <div className="space-y-4">
              {details.faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white border border-slate-100 rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 text-navy-900 font-bold hover:text-yellow-600 transition-colors"
                  >
                    <span className="text-sm md:text-base">{faq.question}</span>
                    {activeFaq === index ? <ChevronUp size={20} className="shrink-0 text-yellow-600" /> : <ChevronDown size={20} className="shrink-0 text-navy-400" />}
                  </button>
                  
                  {activeFaq === index && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                      <p className="text-xs text-navy-500 font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Registration Form Column */}
          <div className="w-full lg:w-5/12 bg-white border border-slate-100 p-8 md:p-10 rounded-lg shadow-xl relative overflow-hidden">
            <div className="space-y-2 mb-8">
              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Enrollment Active</p>
              <h3 className="text-2xl font-bold text-navy-900">Enquire for {details.id}</h3>
              <p className="text-xs text-navy-400 font-sans">
                Submit this enquiry to lock in a trial session at our Mambakkam Main Road center.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-navy-400">Parent Name</label>
                <input 
                  type="text" 
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Name"
                  className="w-full border-b border-slate-200 focus:border-yellow-400 focus:outline-none py-3 text-sm font-sans font-medium text-navy-900 placeholder:text-navy-200 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-navy-400">Mobile Number</label>
                  <input 
                    type="tel" 
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Your Phone"
                    className="w-full border-b border-slate-200 focus:border-yellow-400 focus:outline-none py-3 text-sm font-sans font-medium text-navy-900 placeholder:text-navy-200 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-navy-400">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Your Email"
                    className="w-full border-b border-slate-200 focus:border-yellow-400 focus:outline-none py-3 text-sm font-sans font-medium text-navy-900 placeholder:text-navy-200 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-navy-400">Personal Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border border-slate-100 rounded-sm focus:border-yellow-400 focus:outline-none p-3 text-xs font-sans font-medium text-navy-900 placeholder:text-navy-200 transition-colors resize-none"
                />
              </div>

              {formStatus === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-sm space-y-1 font-sans">
                  <p className="font-bold">✓ Enquiry submitted successfully!</p>
                  <p className="text-[10px] text-emerald-600">Our academic registrar will reach out to you within 24 hours.</p>
                  {formWarning && <p className="text-[10px] text-amber-600 mt-2 font-mono">{formWarning}</p>}
                </div>
              )}

              {formStatus === 'error' && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-sm font-sans font-medium">
                  ✗ Error: {formError}
                </div>
              )}

              <button 
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-navy-900 hover:bg-yellow-500 hover:text-navy-900 text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} /> Send Enquiry
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};
