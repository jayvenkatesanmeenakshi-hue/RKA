import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Send, Loader2, Check, AlertCircle } from 'lucide-react';
import logoIcon from '../assets/images/logo-icon.png';

interface FooterProps {
  navigateTo: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          mobileNumber: mobileNumber.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setAlreadySubscribed(data.alreadySubscribed || false);
        setMessage(data.message || 'Thank you for subscribing to our newsletter!');
        setEmail('');
        setMobileNumber('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setMessage('A network error occurred. Please try again later.');
    }
  };

  return (
    <footer className="border-t border-slate-100 bg-white">
      {/* Newsletter Subscription Section */}
      <div className="bg-gradient-to-br from-navy-900 to-slate-900 text-white py-14 px-8 relative overflow-hidden">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Text Info */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-yellow-400/20">
              <Mail size={10} /> Newsletter & Updates
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-tight leading-tight">
              Subscribe for Updates
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-md">
              Receive research-backed parenting tips, child cognitive development guides, early phonics reading keys, and handwriting improvement secrets directly in your inbox.
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-lg">
                  <Check size={24} className="stroke-[3]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold font-serif text-white">
                    {alreadySubscribed ? 'Already Connected!' : 'Subscription Confirmed!'}
                  </h4>
                  <p className="text-emerald-200/90 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    {message}
                  </p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 text-[10px] font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-widest transition-colors"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300">
                      Email Address <span className="text-yellow-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/40 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all font-sans"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Mobile Number Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300">
                      Mobile Number <span className="text-slate-400 text-[9px] lowercase font-medium">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Phone size={14} />
                      </span>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/40 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all font-sans"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-2 text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 text-xs">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans max-w-xs text-center sm:text-left">
                    We hate spam. Unsubscribe at any time with a single click. Your data is 100% secure.
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-yellow-400 text-navy-900 hover:bg-yellow-300 active:scale-[0.98] font-black text-[10px] uppercase tracking-widest py-3.5 px-8 rounded-lg shadow-lg hover:shadow-yellow-400/10 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin" size={12} />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send size={11} />
                        Subscribe for Updates
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Academy Branding */}
      <div className="py-14 px-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Logo & Info column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/')}>
              <img 
                src={logoIcon} 
                alt="Rocking Kids Academy Logo" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-lg font-bold text-navy-900 tracking-tight font-serif">Rocking Kids Academy</span>
            </div>
            <p className="text-navy-500 text-xs leading-relaxed max-w-sm">
              An elite premium childhood skill enrichment & cognitive activity development center in Chennai, specialising in Brainobrain Abacus math training, synthetic Phonics reading tracks, cursive handwriting perfection, and creative English fluency programs.
            </p>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Academy Location:</p>
              <p className="text-navy-600 text-xs font-medium">312/2, Ponmar Main Road, Mambakkam, Chennai, Tamil Nadu 600127</p>
            </div>
          </div>

          {/* Links column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] font-black text-navy-800 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              Program Curriculums
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-navy-600">
              <li>
                <a 
                  href="/program/Abacus" 
                  onClick={(e) => { e.preventDefault(); navigateTo('/program/Abacus'); }}
                  className="hover:text-yellow-600 transition-colors"
                >
                  Abacus & Mental Math
                </a>
              </li>
              <li>
                <a 
                  href="/program/Phonics" 
                  onClick={(e) => { e.preventDefault(); navigateTo('/program/Phonics'); }}
                  className="hover:text-yellow-600 transition-colors"
                >
                  Structured Synthetic Phonics
                </a>
              </li>
              <li>
                <a 
                  href="/program/English" 
                  onClick={(e) => { e.preventDefault(); navigateTo('/program/English'); }}
                  className="hover:text-yellow-600 transition-colors"
                >
                  English Fluency & Creative Writing
                </a>
              </li>
              <li>
                <a 
                  href="/program/Handwriting" 
                  onClick={(e) => { e.preventDefault(); navigateTo('/program/Handwriting'); }}
                  className="hover:text-yellow-600 transition-colors"
                >
                  Scientific Handwriting Perfection
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Info & Social links column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[11px] font-black text-navy-800 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              Contact & Support
            </h4>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Academic Admissions:</span>
                <a href="tel:+918754431210" className="text-xs font-bold text-navy-900 hover:text-yellow-600 transition-colors flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> +91 87544 31210
                </a>
                <a href="tel:+918754495607" className="text-xs font-bold text-navy-900 hover:text-yellow-600 transition-colors flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> +91 87544 95607
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Office Support Mail:</span>
                <a href="mailto:jayvenkatesanmeenakshi@gmail.com" className="text-xs font-bold text-navy-900 hover:text-yellow-600 transition-colors flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> jayvenkatesanmeenakshi@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">
            © 2026 Rocking Kids Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-navy-500">
            <a 
              href="/founder" 
              onClick={(e) => { e.preventDefault(); navigateTo('/founder'); }} 
              className="hover:text-yellow-600 transition-colors"
            >
              Director's Profile
            </a>
            <span className="text-slate-300">|</span>
            <a 
              href="/blog" 
              onClick={(e) => { e.preventDefault(); navigateTo('/blog'); }} 
              className="hover:text-yellow-600 transition-colors"
            >
              Academic Resource Blog
            </a>
            <span className="text-slate-300">|</span>
            <a 
              href="/admin" 
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/admin');
              }}
              className="hover:text-yellow-600 transition-colors"
            >
              SEO Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
