/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../context/AcademyContext';
import { BlogPost } from '../types';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Share2, 
  Check, 
  BookOpen, 
  ChevronRight,
  Sparkles,
  Star
} from 'lucide-react';

// A super clean and fast custom Markdown parser to avoid peer dependency issues with React 19.
// This splits text into paragraphs, headings, list items, and strong highlights.
const SimpleMarkdownRenderer = ({ content }: { content: string }) => {
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: string | number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc pl-6 my-6 space-y-2 text-navy-700 font-sans text-sm md:text-base leading-relaxed">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  // Helper to parse bold text **bold**
  const formatText = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-navy-950">{part}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      return;
    }

    // Horizontal Rule
    if (trimmed === '---') {
      flushList(index);
      renderedElements.push(
        <hr key={index} className="my-8 border-t border-slate-200" />
      );
      return;
    }

    // Headings
    if (trimmed.startsWith('###')) {
      flushList(index);
      const headingText = trimmed.replace(/^###\s+/, '');
      renderedElements.push(
        <h3 key={index} className="text-xl md:text-2xl font-bold text-navy-900 mt-8 mb-4 tracking-tight">
          {formatText(headingText)}
        </h3>
      );
      return;
    }
    
    if (trimmed.startsWith('##')) {
      flushList(index);
      const headingText = trimmed.replace(/^##\s+/, '');
      renderedElements.push(
        <h2 key={index} className="text-2xl md:text-3xl font-bold text-navy-900 mt-10 mb-5 tracking-tight border-b border-slate-100 pb-2">
          {formatText(headingText)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('#')) {
      flushList(index);
      const headingText = trimmed.replace(/^#\s+/, '');
      renderedElements.push(
        <h1 key={index} className="text-3xl md:text-4xl font-bold text-navy-900 mt-12 mb-6 tracking-tight">
          {formatText(headingText)}
        </h1>
      );
      return;
    }

    // List items starting with * or -
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      const itemText = trimmed.replace(/^[*-\s]+/, '');
      currentList.push(
        <li key={`li-${index}`} className="leading-relaxed">
          {formatText(itemText)}
        </li>
      );
      return;
    }

    // Regular paragraphs
    flushList(index);
    renderedElements.push(
      <p key={index} className="text-sm md:text-base text-navy-700 font-sans leading-relaxed mb-6">
        {formatText(trimmed)}
      </p>
    );
  });

  flushList('end');

  return <div className="prose prose-slate max-w-none">{renderedElements}</div>;
};

interface BlogModuleProps {
  currentSlug: string | null;
  navigateTo: (path: string) => void;
}

export const BlogModule = ({ currentSlug, navigateTo }: BlogModuleProps) => {
  const { blogPosts } = useAcademy();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copied, setCopied] = useState(false);

  // Categories extracted from posts
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const handleShare = (postTitle?: string, postSlug?: string) => {
    const canonicalDomain = "https://rockingkidsacademy.in";
    const articleUrl = postSlug ? `${canonicalDomain}/blog/${postSlug}` : window.location.href;
    const shareText = postTitle ? `${postTitle} | Rocking Kids Academy\n${articleUrl}` : articleUrl;

    if (navigator.share) {
      navigator.share({
        title: postTitle ? `${postTitle} | Rocking Kids Academy` : 'Rocking Kids Academy Blog',
        text: postTitle ? `${postTitle} - Rocking Kids Academy` : 'Check out this article',
        url: articleUrl
      }).catch(() => {
        navigator.clipboard.writeText(articleUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = (postTitle: string, postSlug: string) => {
    const canonicalDomain = "https://rockingkidsacademy.in";
    const articleUrl = `${canonicalDomain}/blog/${postSlug}`;
    const message = `${postTitle} | Rocking Kids Academy\n\nRead full article:\n${articleUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    // Scroll to top on page or view transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSlug]);

  // Find the selected post if viewing a single article
  const currentPost = currentSlug ? blogPosts.find(p => p.slug === currentSlug) : null;

  if (currentPost) {
    // Dynamic SEO title
    document.title = `${currentPost.title} | Rocking Kids Academy`;

    // Filter out the current post to show "Related Reads"
    const relatedPosts = blogPosts
      .filter(p => p.slug !== currentPost.slug)
      .slice(0, 2);

    return (
      <div className="bg-slate-50/50 min-h-screen pb-24">
        {/* Blog Navigation Header */}
        <div className="bg-white border-b border-slate-100 py-6 px-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => navigateTo('/blog')}
              className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy-400 hover:text-navy-900 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest text-yellow-600 font-mono">
              Category: {currentPost.category}
            </div>
          </div>
        </div>

        {/* Article Container */}
        <article className="max-w-4xl mx-auto px-6 mt-12">
          {/* Post Title & Metadata Card */}
          <div className="bg-white border border-slate-100 rounded-lg p-8 md:p-12 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm">
              {currentPost.category}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
              {currentPost.title}
            </h1>

            {/* Author, Date & Read Time */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-navy-400 border-y border-slate-100 py-4 font-sans">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-yellow-600" /> By {currentPost.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-yellow-600" /> {currentPost.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-yellow-600" /> {currentPost.readTime}
              </span>
              
              {/* WhatsApp & Share Action Buttons */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => handleWhatsAppShare(currentPost.title, currentPost.slug)}
                  title="Share Article on WhatsApp"
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded transition-colors cursor-pointer border border-emerald-200/60"
                >
                  <Share2 size={13} className="text-emerald-600" /> WhatsApp
                </button>
                <button 
                  onClick={() => handleShare(currentPost.title, currentPost.slug)}
                  className="inline-flex items-center gap-1.5 hover:text-navy-900 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded transition-colors cursor-pointer border border-yellow-200/60"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Share2 size={13} /> Share Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Cover Image */}
            <div className="aspect-video w-full rounded-md overflow-hidden bg-slate-100 border border-slate-100">
              <img 
                src={currentPost.coverImage} 
                alt={currentPost.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                fetchPriority="high"
              />
            </div>

            {/* Parsed content text */}
            <div className="mt-10 px-0 md:px-4">
              <SimpleMarkdownRenderer content={currentPost.content} />
            </div>

            {/* Post tags */}
            <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100">
              {currentPost.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold text-navy-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Call To Action Trial Box */}
        <section className="max-w-4xl mx-auto px-6 mt-12">
          <div className="bg-navy-900 text-white p-8 md:p-12 rounded-lg relative overflow-hidden shadow-xl border border-navy-800 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Enrollment Active</p>
              <h3 className="text-2xl font-bold tracking-tight">Unlock Your Child’s True Cognitive Capabilities</h3>
              <p className="text-xs text-navy-200 font-sans leading-relaxed">
                Experience our custom programs in Abacus, Phonics, English, or Handwriting. Reserve a free trial session at our state-of-the-art Ponmar Main Road center.
              </p>
            </div>
            <button 
              onClick={() => {
                navigateTo('/');
                setTimeout(() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 150);
              }}
              className="bg-yellow-500 text-navy-900 px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-navy-900 transition-all shrink-0 cursor-pointer shadow-lg shadow-yellow-500/10"
            >
              BOOK FREE TRIAL SLOT
            </button>
          </div>
        </section>

        {/* Related Reads Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 mt-20 space-y-8">
            <h3 className="text-xl font-bold text-navy-900 tracking-tight">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(post => (
                <div 
                  key={post.slug}
                  onClick={() => navigateTo(`/blog/${post.slug}`)}
                  className="bg-white border border-slate-100 hover:border-yellow-400/60 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-yellow-600">{post.category}</p>
                      <h4 className="font-bold text-navy-900 line-clamp-2 leading-snug group-hover:text-yellow-600 transition-colors">
                        {post.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-navy-300 pt-4 border-t border-slate-50 mt-4">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // --- Blog Index / Listing Mode ---
  document.title = "Learning Resource Hub & Blog | Rocking Kids Academy Chennai";

  // Filter and search posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Main post on left: check if any filtered post has isFocus === true, otherwise fallback to latest post
  const focusPost = filteredPosts.find(p => p.isFocus);
  const mainPost = focusPost || filteredPosts[0];

  // Featured side content on right: posts marked with isFeatured (excluding the main post)
  let featuredPosts = filteredPosts.filter(p => p.isFeatured && p.slug !== mainPost?.slug);
  
  // If no posts are explicitly flagged as featured, fallback to up to 3 remaining posts
  if (featuredPosts.length === 0 && mainPost) {
    featuredPosts = filteredPosts.filter(p => p.slug !== mainPost.slug).slice(0, 3);
  }

  // All other posts to show in the grid below
  const gridPosts = filteredPosts.filter(p => p.slug !== mainPost?.slug);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      {/* Blog Hero Heading */}
      <section className="bg-white border-b border-navy-100 py-16 px-8">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">
            Child Development Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">
            Academic Insights & Parenting Hub
          </h1>
          <p className="text-sm md:text-base text-navy-500 max-w-2xl mx-auto font-sans leading-relaxed">
            Discover research-backed tips, instructional updates, and parent guides on abacus calculations, early childhood literacy, handwriting development, and child psychology.
          </p>
          <div className="w-12 h-1 bg-yellow-500 mx-auto"></div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-8 mt-12">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white border border-slate-100 p-6 rounded-lg shadow-sm">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer ${
                  selectedCategory === category 
                    ? 'bg-navy-900 text-white shadow-md shadow-navy-900/10' 
                    : 'bg-slate-50 hover:bg-slate-100 text-navy-400 hover:text-navy-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" size={16} />
            <input 
              type="text" 
              placeholder="Search articles or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-100 focus:border-yellow-400 focus:outline-none pl-10 pr-4 py-2.5 text-xs font-sans font-medium rounded-sm text-navy-900 transition-all placeholder:text-navy-300"
            />
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="max-w-7xl mx-auto px-8 mt-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-100 rounded-lg">
            <BookOpen className="mx-auto text-navy-200 mb-4" size={40} />
            <h3 className="text-lg font-bold text-navy-900">No Articles Found</h3>
            <p className="text-xs text-navy-400 font-sans mt-1">Try adjusting your category filter or search keywords.</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* HERO LAYOUT: LEFT MAIN COLUMN + RIGHT FEATURED SIDEBAR */}
            {mainPost && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT MAIN COLUMN (8 cols on lg) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-navy-900 font-sans">
                        {mainPost.isFocus ? 'Main Focus Article' : 'Latest Article'}
                      </h2>
                    </div>
                    {mainPost.isFocus && (
                      <span className="text-[10px] font-mono font-bold text-yellow-800 bg-yellow-100 border border-yellow-300 px-2.5 py-0.5 rounded-sm flex items-center gap-1">
                        <Star size={10} className="fill-yellow-600 text-yellow-600" /> Focus Fixed
                      </span>
                    )}
                  </div>

                  {/* Main Article Hero Card */}
                  <div 
                    onClick={() => navigateTo(`/blog/${mainPost.slug}`)}
                    className="bg-white border border-slate-100 hover:border-yellow-400 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                      <img 
                        src={mainPost.coverImage} 
                        alt={mainPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                        fetchPriority="high"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-navy-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
                          {mainPost.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 md:p-10 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-navy-400 font-sans">
                          <span className="flex items-center gap-1.5"><User size={13} className="text-yellow-600" /> {mainPost.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5"><Calendar size={13} className="text-yellow-600" /> {mainPost.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5"><Clock size={13} className="text-yellow-600" /> {mainPost.readTime}</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 tracking-tight leading-tight group-hover:text-yellow-600 transition-colors">
                          {mainPost.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-navy-600 font-sans leading-relaxed line-clamp-3">
                          {mainPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                        <div className="flex flex-wrap gap-1.5">
                          {mainPost.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] font-bold text-navy-400 bg-slate-100 px-2.5 py-0.5 rounded-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-navy-900 group-hover:text-yellow-600 transition-colors">
                          Read Full Article <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE COLUMN (4 cols on lg - FEATURED BLOGS SIDE CONTENT) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-navy-900 font-sans flex items-center gap-2">
                      <Sparkles size={14} className="text-yellow-500 fill-yellow-500" /> Featured Reading
                    </h2>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm divide-y divide-slate-100">
                    {featuredPosts.length === 0 ? (
                      <p className="text-xs text-navy-400 py-6 font-sans text-center">No other featured articles available.</p>
                    ) : (
                      featuredPosts.map(post => (
                        <div 
                          key={post.slug}
                          onClick={() => navigateTo(`/blog/${post.slug}`)}
                          className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start group cursor-pointer transition-all"
                        >
                          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                            <img 
                              src={post.coverImage} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-black uppercase tracking-wider text-yellow-700 bg-yellow-50 border border-yellow-200/60 px-2 py-0.5 rounded-sm">
                                {post.category}
                              </span>
                              <span className="text-[9px] font-mono text-navy-300 shrink-0">{post.readTime}</span>
                            </div>
                            <h3 className="text-xs font-bold text-navy-900 leading-snug line-clamp-2 group-hover:text-yellow-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-[10px] font-sans text-navy-400 line-clamp-1">{post.date}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ALL ARTICLES / MORE READS GRID BELOW */}
            {gridPosts.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy-900 tracking-tight">
                    Explore All Articles
                  </h3>
                  <span className="text-xs text-navy-400 font-sans">
                    Showing {gridPosts.length} article{gridPosts.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridPosts.map(post => (
                    <div 
                      key={post.slug}
                      onClick={() => navigateTo(`/blog/${post.slug}`)}
                      className="bg-white border border-slate-100 hover:border-yellow-400 hover:shadow-lg rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all group"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {post.isFeatured && (
                          <span className="absolute top-3 left-3 bg-navy-900/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="text-[9px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-50 px-2 py-1 rounded-sm">
                            {post.category}
                          </span>
                          <h3 className="text-base font-bold text-navy-900 line-clamp-2 leading-snug group-hover:text-yellow-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs text-navy-400 leading-relaxed font-sans line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-slate-50 mt-6 flex items-center justify-between text-[10px] font-mono text-navy-300">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </section>
    </div>
  );
};
