import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Share2, 
  Map, 
  Save, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Lock, 
  LogOut, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft 
} from 'lucide-react';

interface SitemapUrl {
  url: string;
  changefreq: string;
  priority: string;
}

interface SeoData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  sitemapUrls: SitemapUrl[];
}

interface AdminPanelProps {
  navigateTo: (path: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ navigateTo }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'sitemap'>('basic');
  
  // SEO States
  const [seoData, setSeoData] = useState<SeoData>({
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    sitemapUrls: []
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [copied, setCopied] = useState<boolean>(false);

  // Sitemap Form Row State
  const [newUrl, setNewUrl] = useState<string>('');
  const [newFreq, setNewFreq] = useState<string>('weekly');
  const [newPriority, setNewPriority] = useState<string>('0.8');

  // Check auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      testToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const testToken = async (tokenToTest: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seo', {
        headers: {
          'x-admin-token': tokenToTest
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', tokenToTest);
      } else {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError('Password is required');
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');
    try {
      // We check password by verifying if we can post/get with it
      const response = await fetch('/api/seo', {
        headers: {
          'x-admin-token': password
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', password);
      } else {
        setLoginError('Invalid Administrator Password. Please try again.');
      }
    } catch (err) {
      setLoginError('Connection failed. Please verify that your dev server is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });
    const token = localStorage.getItem('admin_token') || '';

    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(seoData)
      });

      const resData = await response.json();

      if (response.ok) {
        setSeoData(resData.data);
        setSaveStatus({ type: 'success', message: 'SEO Configuration saved successfully and sitemap.xml generated!' });
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 5000);
      } else {
        setSaveStatus({ type: 'error', message: resData.error || 'Failed to save SEO config.' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Network error saving settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SeoData, value: string) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sitemap management
  const addSitemapUrl = () => {
    if (!newUrl) return;
    
    // Ensure relative or absolute URL format is clean
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('/') && !formattedUrl.startsWith('http')) {
      formattedUrl = '/' + formattedUrl;
    }

    // Avoid duplicates
    if (seoData.sitemapUrls.some(item => item.url === formattedUrl)) {
      alert('This URL is already in your sitemap list.');
      return;
    }

    const updatedUrls = [
      ...seoData.sitemapUrls,
      { url: formattedUrl, changefreq: newFreq, priority: newPriority }
    ];

    setSeoData(prev => ({
      ...prev,
      sitemapUrls: updatedUrls
    }));

    setNewUrl('');
  };

  const removeSitemapUrl = (index: number) => {
    const updatedUrls = seoData.sitemapUrls.filter((_, idx) => idx !== index);
    setSeoData(prev => ({
      ...prev,
      sitemapUrls: updatedUrls
    }));
  };

  const copySitemapLink = () => {
    const sitemapUrl = `${seoData.canonical.replace(/\/$/, '')}/sitemap.xml`;
    navigator.clipboard.writeText(sitemapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to extract clean domain for display
  const getDisplayDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.toUpperCase();
    } catch {
      return 'ROCKINGKIDSACADEMY.IN';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-sans text-sm font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative z-10">
          <button 
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 font-bold transition-all"
          >
            <ArrowLeft size={14} /> Back to Website
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-yellow-500/10 rounded-xl text-yellow-500 mb-3 border border-yellow-500/20">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">SEO Admin Panel</h1>
            <p className="text-slate-400 text-xs font-sans mt-1.5">Manage search content & generate dynamic XML sitemaps.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-sans leading-relaxed">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest py-3.5 rounded-lg transition-all shadow-lg shadow-yellow-500/10 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Lock size={12} /> Unlock Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/40 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              Rocking Kids Academy • Internal Systems
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500 text-slate-950 rounded-lg shadow-inner">
            <Settings size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm uppercase tracking-wider text-white">SEO Command Center</h1>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[9px] font-bold">LIVE CONNECTION</span>
            </div>
            <p className="text-slate-400 text-[10px] mt-0.5">Configure Rocking Kids Academy search presentation meta & sitemaps.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('/')}
            className="hidden sm:inline-flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-bold transition-all border border-slate-700/50"
          >
            <ArrowLeft size={14} /> Main Site
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white px-4 py-2 rounded-lg font-bold transition-all border border-rose-500/20"
            title="Log Out"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Panel */}
      <div className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form column (Cols 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Status Message */}
          {saveStatus.type && (
            <div className={`p-4 rounded-xl text-xs font-sans border flex items-start gap-3 ${
              saveStatus.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">{saveStatus.type === 'success' ? 'Success!' : 'Error Saving Settings'}</p>
                <p className="opacity-90 mt-0.5 leading-relaxed">{saveStatus.message}</p>
              </div>
            </div>
          )}

          {/* Editors Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex border-b border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === 'basic'
                    ? 'border-yellow-500 text-yellow-500 bg-slate-800/30 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe size={14} /> Basic SEO Tags
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === 'social'
                    ? 'border-yellow-500 text-yellow-500 bg-slate-800/30 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Share2 size={14} /> Social Sharing
              </button>
              <button
                onClick={() => setActiveTab('sitemap')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === 'sitemap'
                    ? 'border-yellow-500 text-yellow-500 bg-slate-800/30 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Map size={14} /> XML Sitemap
              </button>
            </div>

            {/* Tab Editor Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Tab 1: Basic SEO */}
              {activeTab === 'basic' && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                      Meta Title Template
                    </label>
                    <input 
                      type="text"
                      value={seoData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g. Rocking Kids Academy | Premier Skill Development Center"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
                    />
                    <p className="text-slate-500 text-[10px] font-mono mt-1.5">Recommended length: 50-60 characters. Current: {seoData.title.length}</p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                      Meta Description
                    </label>
                    <textarea 
                      value={seoData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      placeholder="e.g. Rocking Kids Academy offers expert skill coaching..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all resize-none leading-relaxed"
                    />
                    <p className="text-slate-500 text-[10px] font-mono mt-1.5">Recommended length: 120-160 characters. Current: {seoData.description.length}</p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                      Meta Keywords
                    </label>
                    <input 
                      type="text"
                      value={seoData.keywords}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                      placeholder="Abacus classes, Phonics training, Rocking Kids Academy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
                    />
                    <p className="text-slate-500 text-[10px] font-sans mt-1.5">Comma separated search phrases that help classify your site.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                      Canonical Site Link URL
                    </label>
                    <input 
                      type="url"
                      value={seoData.canonical}
                      onChange={(e) => handleInputChange('canonical', e.target.value)}
                      placeholder="https://rockingkidsacademy.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
                    />
                    <p className="text-slate-500 text-[10px] font-sans mt-1.5">Ensures search engines don't index duplicate variations of pages.</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Social Sharing (OG / Twitter) */}
              {activeTab === 'social' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-l-2 border-yellow-500/40 pl-4 py-1">
                    <h3 className="text-xs font-black uppercase text-white tracking-wider">Open Graph Settings (Facebook, WhatsApp, LinkedIn)</h3>
                    <p className="text-[10px] text-slate-400 font-sans">Controls how cards look when links are pasted in messages or social posts.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                        OG Title
                      </label>
                      <input 
                        type="text"
                        value={seoData.ogTitle}
                        onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                        placeholder="Rocking Kids Academy | Skill Center"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                        OG Image Link
                      </label>
                      <input 
                        type="text"
                        value={seoData.ogImage}
                        onChange={(e) => handleInputChange('ogImage', e.target.value)}
                        placeholder="https://rockingkidsacademy.in/assets/images/logo-icon.png"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                      OG Description
                    </label>
                    <textarea 
                      value={seoData.ogDescription}
                      onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                      rows={2}
                      placeholder="A premium learning environment for Abacus..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all resize-none"
                    />
                  </div>

                  <div className="border-l-2 border-yellow-500/40 pl-4 py-1 pt-4">
                    <h3 className="text-xs font-black uppercase text-white tracking-wider">Twitter Card Presentation</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                        Twitter Title
                      </label>
                      <input 
                        type="text"
                        value={seoData.twitterTitle}
                        onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                        placeholder="Rocking Kids Academy"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                        Twitter Image Link
                      </label>
                      <input 
                        type="text"
                        value={seoData.twitterImage}
                        onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                        placeholder="https://rockingkidsacademy.in/assets/images/logo-icon.png"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                      Twitter Description
                    </label>
                    <textarea 
                      value={seoData.twitterDescription}
                      onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                      rows={2}
                      placeholder="Enroll your children in expert modules..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: XML Sitemap Builder */}
              {activeTab === 'sitemap' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-l-2 border-yellow-500/40 pl-4 py-1">
                    <h3 className="text-xs font-black uppercase text-white tracking-wider">Site Route Map Builder</h3>
                    <p className="text-[10px] text-slate-400 font-sans">Sitemaps guide Google search crawlers to scan all sub-anchors & courses on your single-page app.</p>
                  </div>

                  {/* Sitemap Form Add Row */}
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-300">Add New Sitemap Anchor Link</p>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-5">
                        <label className="block text-[9px] text-slate-500 font-sans mb-1">Anchor URL path</label>
                        <input 
                          type="text"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          placeholder="e.g. /#curriculum"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[9px] text-slate-500 font-sans mb-1">Scan Frequency</label>
                        <select 
                          value={newFreq}
                          onChange={(e) => setNewFreq(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        >
                          <option value="always">Always</option>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[9px] text-slate-500 font-sans mb-1">Priority</label>
                        <select 
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        >
                          <option value="1.0">1.0 (Highest)</option>
                          <option value="0.9">0.9</option>
                          <option value="0.8">0.8</option>
                          <option value="0.7">0.7</option>
                          <option value="0.6">0.6</option>
                          <option value="0.5">0.5 (Average)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={addSitemapUrl}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-500 hover:text-yellow-400 border border-yellow-500/30 rounded py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Registered Routes List */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Currently Registered Map URL Anchors ({seoData.sitemapUrls.length})</p>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800 max-h-[220px] overflow-y-auto">
                      {seoData.sitemapUrls.map((item, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between text-xs font-mono">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <span className="text-yellow-500 font-sans font-bold">{item.url}</span>
                            <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                              <span>Freq: {item.changefreq}</span>
                              <span className="text-slate-700">•</span>
                              <span>Priority: {item.priority}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSitemapUrl(idx)}
                            className="text-slate-600 hover:text-rose-500 p-1.5 rounded hover:bg-slate-900 transition-all cursor-pointer"
                            title="Delete route"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-slate-900/50 border-t border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                <span className="text-[10px] font-sans text-slate-400">All configurations are dynamically saved instantly on click.</span>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save & Generate Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview mockup column (Cols 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Section title */}
          <div className="border-l-2 border-yellow-500/40 pl-4 py-1">
            <h2 className="text-xs font-black uppercase text-white tracking-wider">Search & Social Live Previews</h2>
            <p className="text-[10px] text-slate-400 font-sans">Simulated mockups in real-time based on your parameters.</p>
          </div>

          {/* Google Search Listing Mockup */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Globe size={11} /> Google SERP Preview
            </p>
            <div className="bg-white text-slate-900 p-5 rounded-lg border border-slate-200 shadow-inner font-sans leading-relaxed">
              {/* Breadcrumb line */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1 leading-none">
                <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black border border-slate-200">R</div>
                <span className="font-sans font-normal truncate max-w-[200px]">{seoData.canonical || 'https://rockingkidsacademy.in'}</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">&gt; home</span>
              </div>
              {/* Clickable blue title */}
              <h4 className="text-[18px] text-[#1a0dab] font-sans font-medium hover:underline cursor-pointer leading-tight mb-1 truncate">
                {seoData.title || 'Rocking Kids Academy | Premier Learning Center'}
              </h4>
              {/* Gray snippet description */}
              <p className="text-xs text-[#4d5156] font-sans font-normal leading-relaxed text-ellipsis overflow-hidden line-clamp-2">
                {seoData.description || 'Dedicated to skill development for kids ages 4 to 14...'}
              </p>
            </div>
          </div>

          {/* Facebook/Meta Card Mockup */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Share2 size={11} /> Social Media Share Card
            </p>
            <div className="bg-slate-950 text-slate-300 rounded-lg overflow-hidden border border-slate-800 shadow-md">
              {/* Image box mockup */}
              <div className="h-44 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                {seoData.ogImage ? (
                  <img 
                    src={seoData.ogImage} 
                    alt="Social Preview" 
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://rockingkidsacademy.in/assets/images/logo-icon.png';
                    }}
                  />
                ) : (
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Image Preview Placeholder</span>
                )}
                <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 rounded text-[9px] font-black uppercase tracking-widest">Open Graph Card</div>
              </div>
              {/* Text content card */}
              <div className="p-3 bg-[#242526] border-t border-slate-800 font-sans">
                <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">{getDisplayDomain(seoData.canonical)}</span>
                <h5 className="font-bold text-sm text-white mt-1 leading-snug line-clamp-1">
                  {seoData.ogTitle || seoData.title || 'Rocking Kids Academy | Premier Learning Center'}
                </h5>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed font-sans font-normal">
                  {seoData.ogDescription || seoData.description || 'Rocking Kids Academy is a premier learning center...'}
                </p>
              </div>
            </div>
          </div>

          {/* Live Link Sitemap info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Map size={11} /> Public Sitemap URL
              </p>
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                className="text-yellow-500 hover:text-yellow-400 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Open xml <ExternalLink size={10} />
              </a>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-800 rounded-lg flex items-center justify-between gap-3 font-mono text-xs">
              <span className="text-slate-400 truncate select-all">{seoData.canonical.replace(/\/$/, '')}/sitemap.xml</span>
              <button
                onClick={copySitemapLink}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                <span className="text-[10px] font-sans font-black uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
