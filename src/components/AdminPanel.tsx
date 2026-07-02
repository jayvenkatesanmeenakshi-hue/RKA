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
  ArrowLeft,
  FileText,
  Mail,
  Edit3,
  Database,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { BlogPost } from '../types';

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

interface Enquiry {
  id: number;
  parentName: string;
  mobileNumber: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

interface AdminPanelProps {
  navigateTo: (path: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ navigateTo }) => {
  const { refetchBlogs } = useAcademy();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Tab: 'blogs' | 'enquiries' | 'basic' | 'social' | 'sitemap'
  const [activeTab, setActiveTab] = useState<'blogs' | 'enquiries' | 'basic' | 'social' | 'sitemap'>('blogs');
  
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

  // Blog Manager States
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState<boolean>(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null); // null = new or viewing list
  const [isCreatingBlog, setIsCreatingBlog] = useState<boolean>(false);
  const [blogStatus, setBlogStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSavingBlog, setIsSavingBlog] = useState<boolean>(false);

  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Cognitive Skills',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    readTime: '5 Min Read',
    author: 'Admin',
    tags: 'Abacus, Child Development, Education'
  });

  // Parent Enquiries States
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState<boolean>(false);
  const [enquirySearch, setEnquirySearch] = useState<string>('');

  // Sitemap Form Row State
  const [newUrl, setNewUrl] = useState<string>('');
  const [newFreq, setNewFreq] = useState<string>('weekly');
  const [newPriority, setNewPriority] = useState<string>('0.8');

  // Check auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_username') || 'admin';
    if (savedToken) {
      testToken(savedUser, savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const testToken = async (userToTest: string, tokenToTest: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'x-admin-token': tokenToTest,
          'x-admin-username': userToTest
        }
      });
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', tokenToTest);
        localStorage.setItem('admin_username', userToTest);
        
        const seoRes = await fetch('/api/seo');
        if (seoRes.ok) {
          const sData = await seoRes.json();
          setSeoData(sData);
        }
        
        loadBlogs();
        loadEnquiries(tokenToTest, userToTest);
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
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
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanPass) {
      setLoginError('Password is required');
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });

      let resData: any = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        resData = await response.json();
      } else {
        const textResp = await response.text();
        console.error('Non-JSON login response:', textResp);
        resData = { error: `Server response error (${response.status}): ${response.statusText || 'Unexpected format'}` };
      }

      if (response.ok && resData.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', cleanPass);
        localStorage.setItem('admin_username', cleanUser);
        
        // Fetch SEO data
        const seoRes = await fetch('/api/seo');
        if (seoRes.ok) {
          const sData = await seoRes.json();
          setSeoData(sData);
        }
        
        // Load blogs and enquiries
        loadBlogs();
        loadEnquiries(cleanPass, cleanUser);
      } else {
        setLoginError(resData.error || 'Invalid Administrator Username or Password.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err?.message ? `Connection error: ${err.message}` : 'Connection failed. Please verify that your server is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
    setPassword('');
  };

  // --- BLOGS MANAGEMENT ---
  const loadBlogs = async () => {
    setIsLoadingBlogs(true);
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogsList(data);
      }
    } catch (err) {
      console.error('Error loading blogs:', err);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  const handleNewBlog = () => {
    setEditingSlug(null);
    setIsCreatingBlog(true);
    setBlogForm({
      title: '',
      slug: '',
      category: 'Cognitive Skills',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      readTime: '5 Min Read',
      author: 'Admin',
      tags: 'Abacus, Education, Brain Development'
    });
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingSlug(blog.slug);
    setIsCreatingBlog(false);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      readTime: blog.readTime || '5 Min Read',
      author: blog.author || 'Admin',
      tags: blog.tags ? blog.tags.join(', ') : ''
    });
  };

  const generateSlugFromTitle = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return slug;
  };

  const handleBlogTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setBlogForm(prev => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug if creating a new post
      slug: isCreatingBlog ? generateSlugFromTitle(newTitle) : prev.slug
    }));
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.content) {
      setBlogStatus({ type: 'error', message: 'Title, slug, and content are required.' });
      return;
    }

    setIsSavingBlog(true);
    setBlogStatus({ type: null, message: '' });
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';

    try {
      const tagsArray = blogForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = {
        title: blogForm.title,
        slug: blogForm.slug,
        category: blogForm.category,
        excerpt: blogForm.excerpt || blogForm.title,
        content: blogForm.content,
        coverImage: blogForm.coverImage,
        readTime: blogForm.readTime,
        author: blogForm.author,
        tags: tagsArray
      };

      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-username': user
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setBlogStatus({ type: 'success', message: 'Blog post successfully saved to Neon Postgres database!' });
        await loadBlogs();
        await refetchBlogs();
        setTimeout(() => {
          setIsCreatingBlog(false);
          setEditingSlug(null);
          setBlogStatus({ type: null, message: '' });
        }, 1500);
      } else {
        setBlogStatus({ type: 'error', message: resData.error || 'Failed to save blog post.' });
      }
    } catch (err) {
      setBlogStatus({ type: 'error', message: 'Network error saving blog post.' });
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete the blog post "${slug}"?`)) return;

    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';

    try {
      const res = await fetch(`/api/admin/blogs/${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });

      if (res.ok) {
        await loadBlogs();
        await refetchBlogs();
        if (editingSlug === slug) {
          setIsCreatingBlog(false);
          setEditingSlug(null);
        }
      } else {
        alert('Failed to delete blog post.');
      }
    } catch (err) {
      console.error('Delete blog error:', err);
    }
  };

  // --- ENQUIRIES MANAGEMENT ---
  const loadEnquiries = async (tokenOverride?: string, userOverride?: string) => {
    setIsLoadingEnquiries(true);
    const token = tokenOverride || localStorage.getItem('admin_token') || '';
    const user = userOverride || localStorage.getItem('admin_username') || 'admin';

    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Error loading enquiries:', err);
    } finally {
      setIsLoadingEnquiries(false);
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;

    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });

      if (res.ok) {
        setEnquiries(prev => prev.filter(e => e.id !== id));
      } else {
        alert('Failed to delete enquiry.');
      }
    } catch (err) {
      console.error('Delete enquiry error:', err);
    }
  };

  // --- SEO SAVE ---
  const handleSaveSeo = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';

    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-username': user
        },
        body: JSON.stringify(seoData)
      });

      const resData = await response.json();

      if (response.ok) {
        setSeoData(resData.data);
        setSaveStatus({ type: 'success', message: 'SEO Configuration saved to Neon Postgres successfully and sitemap XML generated!' });
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

  const addSitemapUrl = () => {
    if (!newUrl) return;
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('/') && !formattedUrl.startsWith('http')) {
      formattedUrl = '/' + formattedUrl;
    }

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

  const filteredEnquiries = enquiries.filter(e => 
    e.parentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
    e.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
    e.mobileNumber.includes(enquirySearch) ||
    e.message.toLowerCase().includes(enquirySearch.toLowerCase())
  );

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
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10">
          <div className="p-8 text-center border-b border-slate-700/60 bg-slate-800/80">
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 to-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
              <Lock className="w-8 h-8 text-slate-950" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-400 text-xs mt-1">Rocking Kids Academy Management Portal</p>
            
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>Neon Postgres Storage Active</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Administrator Username
              </label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors pr-12"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-yellow-500/20 hover:from-yellow-400 hover:to-amber-300 transition-all text-sm flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-center">
            <button 
              onClick={() => navigateTo('/')}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Academy Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <Settings className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Admin Portal</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Rocking Kids Academy Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
              <Database className="w-3.5 h-3.5" />
              <span>Neon Postgres Storage Active</span>
            </div>

            <button
              onClick={() => navigateTo('/')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg border border-red-500/20 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
            <button
              onClick={() => { setActiveTab('blogs'); setIsCreatingBlog(false); setEditingSlug(null); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'blogs' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Blog Articles (Postgres)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/20 font-bold">
                {blogsList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('enquiries'); loadEnquiries(); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'enquiries' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Parent Enquiries</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/20 font-bold">
                {enquiries.length}
              </span>
            </button>

            <div className="pt-2 pb-1 px-4 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              SEO & Search Engines
            </div>

            <button
              onClick={() => setActiveTab('basic')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'basic' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>General Meta Tags</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'social' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>OpenGraph & Cards</span>
            </button>

            <button
              onClick={() => setActiveTab('sitemap')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'sitemap' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Sitemap Generator</span>
            </button>
          </div>

          <div className="mt-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Neon Database Synced</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              All blog updates, enquiries, and SEO rules are instantly saved in your Neon Postgres cloud cluster.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: BLOGS MANAGEMENT */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-500" />
                    <span>Blog Articles Manager</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage articles, guides, and news stored in your Neon Postgres database.
                  </p>
                </div>

                {!isCreatingBlog && !editingSlug ? (
                  <button
                    onClick={handleNewBlog}
                    className="px-4 py-2 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-yellow-400 transition-all shadow-md shadow-yellow-500/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Article</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsCreatingBlog(false); setEditingSlug(null); }}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-700 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Articles List</span>
                  </button>
                )}
              </div>

              {blogStatus.message && (
                <div className={`p-4 rounded-xl text-xs font-medium border ${
                  blogStatus.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {blogStatus.message}
                </div>
              )}

              {/* EDITOR FORM */}
              {(isCreatingBlog || editingSlug) ? (
                <form onSubmit={handleSaveBlog} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-yellow-500" />
                      <span>{isCreatingBlog ? 'Create New Article' : `Edit Article: ${editingSlug}`}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Article Title
                      </label>
                      <input 
                        type="text"
                        value={blogForm.title}
                        onChange={handleBlogTitleChange}
                        placeholder="e.g. 5 Benefits of Abacus Training for Young Kids"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        URL Slug
                      </label>
                      <input 
                        type="text"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g. 5-benefits-of-abacus-training"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 font-mono text-xs"
                        required
                        disabled={!isCreatingBlog}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Category
                      </label>
                      <select 
                        value={blogForm.category}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500"
                      >
                        <option value="Cognitive Skills">Cognitive Skills</option>
                        <option value="Reading & Literacy">Reading & Literacy</option>
                        <option value="Handwriting & Motor Skills">Handwriting & Motor Skills</option>
                        <option value="Child Education">Child Education</option>
                        <option value="Parenting Guides">Parenting Guides</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Cover Image URL
                      </label>
                      <input 
                        type="url"
                        value={blogForm.coverImage}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, coverImage: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Read Time
                      </label>
                      <input 
                        type="text"
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, readTime: e.target.value }))}
                        placeholder="5 Min Read"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input 
                        type="text"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="Abacus, Phonics, Brain Development"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Short Excerpt
                    </label>
                    <textarea 
                      rows={2}
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Summary description for social previews and search listings..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Full Article Content (Markdown format)
                    </label>
                    <textarea 
                      rows={14}
                      value={blogForm.content}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content using Markdown (# Headings, **bold**, *lists*, etc.)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm font-mono focus:outline-none focus:border-yellow-500 leading-relaxed"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => { setIsCreatingBlog(false); setEditingSlug(null); }}
                      className="px-5 py-2.5 bg-slate-800 text-slate-300 font-medium rounded-xl text-xs hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingBlog}
                      className="px-6 py-2.5 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                    >
                      {isSavingBlog ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to Postgres...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Publish to Neon Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* ARTICLES LIST */
                <div className="space-y-4">
                  {isLoadingBlogs ? (
                    <div className="p-12 text-center text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-500 mb-2" />
                      <p className="text-xs">Fetching articles from Neon Postgres database...</p>
                    </div>
                  ) : blogsList.length === 0 ? (
                    <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                      <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-white">No Blog Articles Found</h3>
                      <p className="text-xs text-slate-400 mt-1 mb-4">Get started by publishing your first article.</p>
                      <button
                        onClick={handleNewBlog}
                        className="px-4 py-2 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 hover:bg-yellow-400"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create First Article</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {blogsList.map((blog) => (
                        <div 
                          key={blog.slug}
                          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <img 
                              src={blog.coverImage} 
                              alt={blog.title}
                              className="w-20 h-20 object-cover rounded-xl border border-slate-800 flex-shrink-0" 
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md text-[10px] font-bold">
                                  {blog.category}
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {blog.date}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white truncate">{blog.title}</h4>
                              <p className="text-xs text-slate-400 truncate mt-1">{blog.excerpt}</p>
                              <div className="text-[10px] text-slate-500 font-mono mt-1">/blog/{blog.slug}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                            <button
                              onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                              title="Preview Article"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteBlog(blog.slug)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PARENT ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-yellow-500" />
                    <span>Parent Enquiries (Postgres DB)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Inquiries submitted via the website contact form are stored in your Neon database.
                  </p>
                </div>

                <button
                  onClick={() => loadEnquiries()}
                  className="px-3.5 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEnquiries ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Filter enquiries by parent name, mobile number, or email..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {isLoadingEnquiries ? (
                <div className="p-12 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-500 mb-2" />
                  <p className="text-xs">Loading enquiries from Neon Postgres...</p>
                </div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                  <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white">No Enquiries Found</h3>
                  <p className="text-xs text-slate-400 mt-1">New enquiries submitted on the website will appear here in real time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnquiries.map((enq) => (
                    <div key={enq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 font-bold text-sm">
                            {enq.parentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{enq.parentName}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                              <a href={`tel:${enq.mobileNumber}`} className="hover:text-yellow-400 transition-colors">
                                📞 {enq.mobileNumber}
                              </a>
                              <span>•</span>
                              <a href={`mailto:${enq.email}`} className="hover:text-yellow-400 transition-colors">
                                ✉️ {enq.email}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md">
                            {new Date(enq.createdAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {enq.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BASIC SEO */}
          {activeTab === 'basic' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-yellow-500" />
                  <span>General SEO Meta Configuration</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Control search engine title tags, canonical URLs, and global page descriptions.
                </p>
              </div>

              {saveStatus.message && (
                <div className={`p-4 rounded-xl text-xs font-medium border ${
                  saveStatus.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {saveStatus.message}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Primary Canonical Domain URL
                  </label>
                  <input 
                    type="url"
                    value={seoData.canonical}
                    onChange={(e) => handleInputChange('canonical', e.target.value)}
                    placeholder="https://rockingkidsacademy.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Preferred canonical URL used across all sitemaps and search engines.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Default Search Title
                  </label>
                  <input 
                    type="text"
                    value={seoData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Meta Description
                  </label>
                  <textarea 
                    rows={3}
                    value={seoData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Meta Keywords
                  </label>
                  <input 
                    type="text"
                    value={seoData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveSeo}
                  disabled={isSaving}
                  className="px-6 py-3 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save SEO Config to Postgres</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL OPENGRAPH */}
          {activeTab === 'social' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-yellow-500" />
                  <span>Social Cards & OpenGraph Meta</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Customize previews when links are shared on WhatsApp, Facebook, LinkedIn, or Twitter.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    OpenGraph Title (WhatsApp / Facebook)
                  </label>
                  <input 
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    OpenGraph Image URL
                  </label>
                  <input 
                    type="url"
                    value={seoData.ogImage}
                    onChange={(e) => handleInputChange('ogImage', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    OpenGraph Description
                  </label>
                  <textarea 
                    rows={2}
                    value={seoData.ogDescription}
                    onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveSeo}
                  disabled={isSaving}
                  className="px-6 py-3 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Social Config</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SITEMAP */}
          {activeTab === 'sitemap' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Map className="w-5 h-5 text-yellow-500" />
                    <span>Dynamic Sitemap Generator</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Your site serves dynamic XML sitemaps automatically at <code className="text-yellow-400 font-mono">/sitemap.xml</code>
                  </p>
                </div>

                <button
                  onClick={copySitemapLink}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Link!' : 'Copy /sitemap.xml URL'}</span>
                </button>
              </div>

              {/* Add URL row */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300">Add Custom Sitemap Route</span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <input 
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="/program/Abacus"
                    className="sm:col-span-6 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-yellow-500 font-mono"
                  />
                  <select 
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value)}
                    className="sm:col-span-3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <button
                    onClick={addSitemapUrl}
                    className="sm:col-span-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs py-2 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Route</span>
                  </button>
                </div>
              </div>

              {/* Sitemap list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configured Routes in Sitemap</span>
                <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 bg-slate-950">
                  {seoData.sitemapUrls.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-900/50 transition-colors">
                      <span className="font-mono text-slate-200">{item.url}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 text-[10px] uppercase">{item.changefreq}</span>
                        <button 
                          onClick={() => removeSitemapUrl(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveSeo}
                  disabled={isSaving}
                  className="px-6 py-3 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Sitemap Rules</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
