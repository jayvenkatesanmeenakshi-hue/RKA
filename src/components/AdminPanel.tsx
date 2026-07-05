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
  Tag,
  Key,
  Code,
  Bot,
  FileCode,
  AlertCircle,
  Layers,
  Cpu,
  Star
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
  jsonLd?: any;
  llmsTxt?: string;
  robotsTxt?: string;
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

  // Active Tab: 'blogs' | 'enquiries' | 'basic' | 'social' | 'json-ld' | 'llms-txt' | 'robots-txt' | 'sitemap' | 'google-reviews'
  const [activeTab, setActiveTab] = useState<'blogs' | 'enquiries' | 'basic' | 'social' | 'json-ld' | 'llms-txt' | 'robots-txt' | 'sitemap' | 'google-reviews'>('blogs');
  
  // Google Places API & Database Reviews State
  const [googleApiKey, setGoogleApiKey] = useState(() => localStorage.getItem('google_places_api_key') || '');
  const [googlePlaceId, setGooglePlaceId] = useState(() => localStorage.getItem('google_place_id') || '');
  const [googleTestStatus, setGoogleTestStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isTestingGoogle, setIsTestingGoogle] = useState(false);
  
  // Stored Database Google Reviews State
  const [allAdminReviews, setAllAdminReviews] = useState<any[]>([]);
  const [hiddenReviewIds, setHiddenReviewIds] = useState<string[]>([]);
  const [customHideId, setCustomHideId] = useState<string>('');
  const [syncedReviews, setSyncedReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [isSyncingReviews, setIsSyncingReviews] = useState<boolean>(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false);
  const [newReviewForm, setNewReviewForm] = useState({
    authorName: '',
    authorLocation: 'Ponmar, Chennai',
    rating: 5,
    text: '',
    category: 'Abacus & Phonics'
  });

  // JSON-LD, llms.txt & robots.txt Editor States
  const [jsonLdCode, setJsonLdCode] = useState<string>('');
  const [jsonLdError, setJsonLdError] = useState<string | null>(null);
  const [isGeneratingJsonLd, setIsGeneratingJsonLd] = useState<boolean>(false);
  const [jsonLdCopied, setJsonLdCopied] = useState<boolean>(false);

  const [llmsTxtCode, setLlmsTxtCode] = useState<string>('');
  const [isGeneratingLlmsTxt, setIsGeneratingLlmsTxt] = useState<boolean>(false);
  const [llmsTxtCopied, setLlmsTxtCopied] = useState<boolean>(false);

  const [robotsTxtCode, setRobotsTxtCode] = useState<string>('');
  const [isGeneratingRobotsTxt, setIsGeneratingRobotsTxt] = useState<boolean>(false);
  const [robotsTxtCopied, setRobotsTxtCopied] = useState<boolean>(false);
  
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
    tags: 'Abacus, Child Development, Education',
    isFeatured: false,
    isFocus: false
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

  const applySeoData = (sData: any) => {
    setSeoData(sData);
    if (sData.jsonLd) {
      try {
        setJsonLdCode(typeof sData.jsonLd === 'string' ? sData.jsonLd : JSON.stringify(sData.jsonLd, null, 2));
        setJsonLdError(null);
      } catch (e) {
        setJsonLdCode(String(sData.jsonLd));
      }
    }
    if (sData.llmsTxt) {
      setLlmsTxtCode(sData.llmsTxt);
    }
    if (sData.robotsTxt) {
      setRobotsTxtCode(sData.robotsTxt);
    }
  };

  const handleJsonLdTextChange = (val: string) => {
    setJsonLdCode(val);
    try {
      const parsed = JSON.parse(val);
      setJsonLdError(null);
      setSeoData(prev => ({ ...prev, jsonLd: parsed }));
    } catch (err: any) {
      setJsonLdError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const handleGenerateJsonLd = async () => {
    setIsGeneratingJsonLd(true);
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const res = await fetch('/api/admin/seo/generate-jsonld', {
        method: 'POST',
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });
      const data = await res.json();
      if (res.ok && data.jsonLd) {
        setJsonLdCode(JSON.stringify(data.jsonLd, null, 2));
        setJsonLdError(null);
        setSeoData(prev => ({ ...prev, jsonLd: data.jsonLd }));
        setSaveStatus({ type: 'success', message: 'Generated fresh JSON-LD Schema.org graph from database state!' });
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
      }
    } catch (err) {
      console.error('Error generating JSON-LD:', err);
    } finally {
      setIsGeneratingJsonLd(false);
    }
  };

  const handleGenerateLlmsTxt = async () => {
    setIsGeneratingLlmsTxt(true);
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const res = await fetch('/api/admin/seo/generate-llmstxt', {
        method: 'POST',
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });
      const data = await res.json();
      if (res.ok && data.llmsTxt) {
        setLlmsTxtCode(data.llmsTxt);
        setSeoData(prev => ({ ...prev, llmsTxt: data.llmsTxt }));
        setSaveStatus({ type: 'success', message: 'Generated fresh llms.txt markdown document from database state!' });
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
      }
    } catch (err) {
      console.error('Error generating llms.txt:', err);
    } finally {
      setIsGeneratingLlmsTxt(false);
    }
  };

  const handleGenerateRobotsTxt = async () => {
    setIsGeneratingRobotsTxt(true);
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const res = await fetch('/api/admin/seo/generate-robotstxt', {
        method: 'POST',
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });
      const data = await res.json();
      if (res.ok && data.robotsTxt) {
        setRobotsTxtCode(data.robotsTxt);
        setSeoData(prev => ({ ...prev, robotsTxt: data.robotsTxt }));
        setSaveStatus({ type: 'success', message: 'Generated fresh robots.txt document from database state!' });
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
      }
    } catch (err) {
      console.error('Error generating robots.txt:', err);
    } finally {
      setIsGeneratingRobotsTxt(false);
    }
  };

  const copyJsonLd = () => {
    navigator.clipboard.writeText(jsonLdCode);
    setJsonLdCopied(true);
    setTimeout(() => setJsonLdCopied(false), 2000);
  };

  const copyLlmsTxt = () => {
    navigator.clipboard.writeText(llmsTxtCode);
    setLlmsTxtCopied(true);
    setTimeout(() => setLlmsTxtCopied(false), 2000);
  };

  const copyRobotsTxt = () => {
    navigator.clipboard.writeText(robotsTxtCode);
    setRobotsTxtCopied(true);
    setTimeout(() => setRobotsTxtCopied(false), 2000);
  };

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
          applySeoData(sData);
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
        try {
          resData = JSON.parse(textResp);
        } catch (e) {
          resData = { error: `Server error (${response.status}): Unable to parse response from server.` };
        }
      }

      if (response.ok && resData.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', cleanPass);
        localStorage.setItem('admin_username', cleanUser);
        
        // Fetch SEO data
        const seoRes = await fetch('/api/seo');
        if (seoRes.ok) {
          const sData = await seoRes.json();
          applySeoData(sData);
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
      tags: 'Abacus, Education, Brain Development',
      isFeatured: false,
      isFocus: false
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
      tags: blog.tags ? blog.tags.join(', ') : '',
      isFeatured: !!blog.isFeatured,
      isFocus: !!blog.isFocus
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
        tags: tagsArray,
        isFeatured: blogForm.isFeatured,
        isFocus: blogForm.isFocus
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

    let parsedJsonLd = seoData.jsonLd;
    if (jsonLdCode) {
      try {
        parsedJsonLd = JSON.parse(jsonLdCode);
      } catch (err: any) {
        setSaveStatus({ type: 'error', message: `Cannot save: Invalid JSON-LD syntax (${err.message}).` });
        setIsSaving(false);
        return;
      }
    }

    const payload = {
      ...seoData,
      jsonLd: parsedJsonLd,
      llmsTxt: llmsTxtCode,
      robotsTxt: robotsTxtCode
    };

    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-username': user
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (response.ok) {
        applySeoData(resData.data);
        setSaveStatus({ type: 'success', message: 'SEO, JSON-LD Schema, llms.txt, and robots.txt saved to Neon Postgres successfully!' });
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

  // --- GOOGLE REVIEWS HIDDEN LIST MANAGEMENT ---
  const fetchHiddenReviews = async () => {
    try {
      const res = await fetch('/api/hidden-reviews');
      const data = await res.json();
      if (data.hiddenIds) {
        setHiddenReviewIds(data.hiddenIds);
      }
    } catch (err) {
      console.error('Error fetching hidden reviews:', err);
    }
  };

  const loadAdminReviews = async () => {
    setIsLoadingReviews(true);
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });
      const data = await res.json();
      if (data.reviews) {
        setAllAdminReviews(data.reviews);
      }
      if (data.hiddenIds) {
        setHiddenReviewIds(data.hiddenIds);
      }
    } catch (err) {
      console.error('Error loading admin reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleSyncGoogleReviews = async () => {
    setIsSyncingReviews(true);
    setGoogleTestStatus({ type: null, message: '' });
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const apiKey = googleApiKey.trim();
      const placeId = googlePlaceId.trim();
      if (apiKey) localStorage.setItem('google_places_api_key', apiKey);
      if (placeId) localStorage.setItem('google_place_id', placeId);

      const res = await fetch('/api/admin/reviews/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-username': user
        },
        body: JSON.stringify({ apiKey, placeId })
      });
      const data = await res.json();
      if (data.success) {
        setGoogleTestStatus({
          type: 'success',
          message: data.message || `Successfully synced ${data.syncResult?.count || 0} reviews into the database!`
        });
        if (data.reviews) setAllAdminReviews(data.reviews);
      } else {
        setGoogleTestStatus({
          type: 'error',
          message: data.message || 'Failed to sync reviews from Google API.'
        });
      }
    } catch (err: any) {
      setGoogleTestStatus({
        type: 'error',
        message: err.message || 'Network error syncing reviews.'
      });
    } finally {
      setIsSyncingReviews(false);
    }
  };

  const handleToggleReviewVisibility = async (reviewId: string, currentHidden: boolean) => {
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const res = await fetch('/api/admin/reviews/toggle-visibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-username': user
        },
        body: JSON.stringify({ reviewId, hidden: !currentHidden })
      });
      const data = await res.json();
      if (data.success && data.reviews) {
        setAllAdminReviews(data.reviews);
        setGoogleTestStatus({
          type: 'success',
          message: `Review ${!currentHidden ? 'hidden' : 'published'} successfully!`
        });
      }
    } catch (err) {
      console.error('Error toggling review visibility:', err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review from the database?')) return;
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const res = await fetch(`/api/admin/reviews/${encodeURIComponent(reviewId)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
          'x-admin-username': user
        }
      });
      const data = await res.json();
      if (data.success && data.reviews) {
        setAllAdminReviews(data.reviews);
        setGoogleTestStatus({
          type: 'success',
          message: 'Review deleted from database.'
        });
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleAddManualReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.authorName || !newReviewForm.text) return;
    const token = localStorage.getItem('admin_token') || '';
    const user = localStorage.getItem('admin_username') || 'admin';
    try {
      const res = await fetch('/api/admin/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-username': user
        },
        body: JSON.stringify(newReviewForm)
      });
      const data = await res.json();
      if (data.success && data.reviews) {
        setAllAdminReviews(data.reviews);
        setShowAddReviewModal(false);
        setNewReviewForm({ authorName: '', authorLocation: 'Ponmar, Chennai', rating: 5, text: '', category: 'Abacus & Phonics' });
        setGoogleTestStatus({
          type: 'success',
          message: 'New genuine review added to database!'
        });
      }
    } catch (err) {
      console.error('Error adding manual review:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'google-reviews') {
      loadAdminReviews();
    }
  }, [activeTab]);

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
              onClick={() => setActiveTab('json-ld')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'json-ld' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span>JSON-LD Schema.org</span>
            </button>

            <button
              onClick={() => setActiveTab('llms-txt')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'llms-txt' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4 text-sky-400" />
              <span>llms.txt AI File</span>
            </button>

            <button
              onClick={() => setActiveTab('robots-txt')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'robots-txt' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>Robots.txt Crawlers</span>
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

            <div className="pt-2 pb-1 px-4 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Integrations & APIs
            </div>

            <button
              onClick={() => setActiveTab('google-reviews')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'google-reviews' 
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-4 h-4 text-yellow-500" />
              <span>Google Reviews Sync</span>
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

                  {/* Feature & Focus Flag Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer text-xs text-white font-medium select-none">
                      <input 
                        type="checkbox" 
                        checked={blogForm.isFocus} 
                        onChange={(e) => setBlogForm(prev => ({ ...prev, isFocus: e.target.checked }))}
                        className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-yellow-400">Focus Post</span> (Main Blog on Left)
                        <p className="text-[10px] text-slate-400">Pins this article as the primary featured article on the left column.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer text-xs text-white font-medium select-none">
                      <input 
                        type="checkbox" 
                        checked={blogForm.isFeatured} 
                        onChange={(e) => setBlogForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-amber-400">Featured Post</span> (Right Side Content)
                        <p className="text-[10px] text-slate-400">Includes this article in the featured sidebar list on the right column.</p>
                      </div>
                    </label>
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
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md text-[10px] font-bold">
                                  {blog.category}
                                </span>
                                {blog.isFocus && (
                                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[9px] font-black uppercase tracking-wider">
                                    ★ Focus Post
                                  </span>
                                )}
                                {blog.isFeatured && (
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md text-[9px] font-black uppercase tracking-wider">
                                    Featured
                                  </span>
                                )}
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
                    OpenGraph Image URL (Fallback / General)
                  </label>
                  <input 
                    type="url"
                    value={seoData.ogImage}
                    onChange={(e) => handleInputChange('ogImage', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Note: Articles automatically use their specific cover image as the large preview card when shared on WhatsApp, with "Rocking Kids Academy" logo brand in the title.
                  </p>
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

                {/* WhatsApp Shared Card Live Preview */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Link Card Preview</span>
                  </h3>
                  <div className="max-w-md bg-[#0b141a] p-3 rounded-2xl border border-slate-800 font-sans shadow-xl">
                    <div className="bg-[#1f2c34] rounded-xl overflow-hidden border border-[#2a3942]">
                      <div className="aspect-[1.91/1] w-full bg-slate-800 overflow-hidden relative">
                        <img 
                          src={seoData.ogImage || "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200"} 
                          alt="WhatsApp Share Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-3 bg-[#111b21]">
                        <p className="text-[11px] font-bold text-[#e9edef] line-clamp-1 leading-snug">
                          {seoData.ogTitle || "Article Title | Rocking Kids Academy"}
                        </p>
                        <p className="text-[10px] text-[#8696a0] line-clamp-2 mt-1 leading-normal">
                          {seoData.ogDescription || "Read article on Rocking Kids Academy..."}
                        </p>
                        <p className="text-[9px] text-[#8696a0] uppercase tracking-wider mt-2 font-mono flex items-center gap-1">
                          <span>rockingkidsacademy.in</span>
                        </p>
                      </div>
                    </div>
                  </div>
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

          {/* TAB: JSON-LD SCHEMA MANAGEMENT */}
          {activeTab === 'json-ld' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-400" />
                    <span>JSON-LD Schema.org Structured Data</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Structured machine-readable markup injected into the HTML &lt;head&gt; for Google, Bing, schema crawlers, and AI search engines.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={copyJsonLd}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {jsonLdCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{jsonLdCopied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                  <a
                    href="/json-ld.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View /json-ld.json</span>
                  </a>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-emerald-500/20"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Google Rich Results Test</span>
                  </a>
                </div>
              </div>

              {/* Entity Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Primary Entity</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-0.5 truncate">EducationalOrganization</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Courses Schema</div>
                  <div className="text-xs font-semibold text-sky-400 mt-0.5">4 Academy Programs</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Google Rating</div>
                  <div className="text-xs font-semibold text-yellow-400 mt-0.5">4.9 ★ (183 Reviews)</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Schema FAQ</div>
                  <div className="text-xs font-semibold text-purple-400 mt-0.5">3 Parent Questions</div>
                </div>
              </div>

              {/* Auto Generator Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Database Schema Sync</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Re-index courses, ratings, and site metadata directly from your Neon database.</p>
                </div>
                <button
                  onClick={handleGenerateJsonLd}
                  disabled={isGeneratingJsonLd}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all shadow-md self-start sm:self-auto"
                >
                  {isGeneratingJsonLd ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Auto-Generate Schema from DB</span>
                </button>
              </div>

              {/* Syntax Validation Indicator */}
              {jsonLdError ? (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-mono">{jsonLdError}</span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Valid JSON-LD Schema.org syntax. Automatically injected into HTML head!</span>
                </div>
              )}

              {/* Code Textarea Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Schema.org JSON-LD Code Editor
                </label>
                <textarea
                  rows={16}
                  value={jsonLdCode}
                  onChange={(e) => handleJsonLdTextChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 leading-relaxed focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  placeholder="Paste or edit Schema.org JSON-LD graph here..."
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveSeo}
                  disabled={isSaving || !!jsonLdError}
                  className="px-6 py-3 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save JSON-LD Schema</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: LLMS.TXT AI ASSISTANT FILE MANAGEMENT */}
          {activeTab === 'llms-txt' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-sky-400" />
                    <span>llms.txt AI Assistant Knowledge Base</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    A clean, curated Markdown document served at <code className="bg-slate-950 text-sky-400 px-1.5 py-0.5 rounded border border-slate-800">/llms.txt</code> for LLM assistants (ChatGPT, Gemini, Perplexity) to index academy programs and articles.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyLlmsTxt}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {llmsTxtCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{llmsTxtCopied ? 'Copied' : 'Copy llms.txt'}</span>
                  </button>
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live /llms.txt</span>
                  </a>
                </div>
              </div>

              {/* Auto Generator Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Automatic Document Sync</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Gathers active courses, contact numbers, and published blog posts into structured Markdown.</p>
                </div>
                <button
                  onClick={handleGenerateLlmsTxt}
                  disabled={isGeneratingLlmsTxt}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all shadow-md self-start sm:self-auto"
                >
                  {isGeneratingLlmsTxt ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Auto-Generate llms.txt from DB</span>
                </button>
              </div>

              {/* Code Textarea Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  llms.txt Markdown Editor
                </label>
                <textarea
                  rows={16}
                  value={llmsTxtCode}
                  onChange={(e) => {
                    setLlmsTxtCode(e.target.value);
                    setSeoData(prev => ({ ...prev, llmsTxt: e.target.value }));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  placeholder="Edit llms.txt markdown content here..."
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveSeo}
                  disabled={isSaving}
                  className="px-6 py-3 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save llms.txt Document</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: ROBOTS.TXT CRAWLER MANAGEMENT */}
          {activeTab === 'robots-txt' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-purple-400" />
                    <span>robots.txt Search Engine Crawlers</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Defines crawling directives for search engines (Googlebot, Bingbot) and AI bots (GPTBot, ClaudeBot). Served dynamically at <code className="bg-slate-950 text-purple-400 px-1.5 py-0.5 rounded border border-slate-800">/robots.txt</code>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyRobotsTxt}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {robotsTxtCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{robotsTxtCopied ? 'Copied' : 'Copy robots.txt'}</span>
                  </button>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live /robots.txt</span>
                  </a>
                </div>
              </div>

              {/* Directive Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Default Directive</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-0.5">Allow: /</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Protected Routes</div>
                  <div className="text-xs font-semibold text-red-400 mt-0.5">/admin, /api/</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Search Bots</div>
                  <div className="text-xs font-semibold text-sky-400 mt-0.5">GPT, Claude, Perplexity</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">XML Sitemap Link</div>
                  <div className="text-xs font-semibold text-purple-400 mt-0.5 font-mono truncate">/sitemap.xml</div>
                </div>
              </div>

              {/* Auto Generator Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Reset & Sync Directives</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Generates clean standard directives matching your configured canonical domain.</p>
                </div>
                <button
                  onClick={handleGenerateRobotsTxt}
                  disabled={isGeneratingRobotsTxt}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all shadow-md self-start sm:self-auto"
                >
                  {isGeneratingRobotsTxt ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Auto-Generate robots.txt</span>
                </button>
              </div>

              {/* Code Textarea Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  robots.txt Code Editor
                </label>
                <textarea
                  rows={14}
                  value={robotsTxtCode}
                  onChange={(e) => {
                    setRobotsTxtCode(e.target.value);
                    setSeoData(prev => ({ ...prev, robotsTxt: e.target.value }));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-purple-300 leading-relaxed focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  placeholder="Edit robots.txt crawler rules here..."
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveSeo}
                  disabled={isSaving}
                  className="px-6 py-3 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save robots.txt Directives</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE REVIEWS DATABASE & AUTOMATED SYNC */}
          {activeTab === 'google-reviews' && (
            <div className="space-y-6">
              {/* Status Banner */}
              {googleTestStatus.message && (
                <div className={`p-4 rounded-xl text-xs font-medium border ${
                  googleTestStatus.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {googleTestStatus.message}
                </div>
              )}

              {/* Top Summary Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Stored Reviews</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {allAdminReviews.length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">In Neon Postgres DB</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>5★ Published</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {allAdminReviews.filter(r => Number(r.rating) === 5 && !r.hidden).length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Visible on Public Site</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-red-400" />
                    <span>Hidden / Moderated</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400 mt-1">
                    {allAdminReviews.filter(r => r.hidden).length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Hidden from Public Site</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                    <span>Auto Weekly Sync</span>
                  </div>
                  <div className="text-sm font-bold text-sky-400 mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Active (7 Days)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Auto-updates database</div>
                </div>
              </div>

              {/* API Credentials & Sync Controls */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-yellow-500" />
                      <span>Google Business Sync & Settings</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Sync live reviews into your database. Background schedule auto-refreshes every 7 days.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddReviewModal(true)}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Genuine Review</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Google Places API Key
                    </label>
                    <input 
                      type="password"
                      value={googleApiKey}
                      onChange={(e) => setGoogleApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Google Place ID
                    </label>
                    <input 
                      type="text"
                      value={googlePlaceId}
                      onChange={(e) => setGooglePlaceId(e.target.value)}
                      placeholder="e.g. ChIJ..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500 italic">
                    Note: Stored reviews are served directly from database to ensure high performance and zero Google API rate limit issues.
                  </div>
                  <button
                    onClick={handleSyncGoogleReviews}
                    disabled={isSyncingReviews}
                    className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingReviews ? 'animate-spin' : ''}`} />
                    <span>{isSyncingReviews ? 'Syncing...' : 'Sync & Store Google Reviews'}</span>
                  </button>
                </div>
              </div>

              {/* Database Reviews List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-yellow-500" />
                      <span>Database Reviews & Website Visibility Control</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Only 5★ reviews that are NOT hidden are displayed on the public website. Toggle visibility or delete any review below.
                    </p>
                  </div>

                  <button
                    onClick={loadAdminReviews}
                    disabled={isLoadingReviews}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReviews ? 'animate-spin' : ''}`} />
                    <span>Refresh Database</span>
                  </button>
                </div>

                {isLoadingReviews ? (
                  <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />
                    <span>Loading reviews from database...</span>
                  </div>
                ) : allAdminReviews.length === 0 ? (
                  <div className="p-8 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                    No reviews in database. Click "Sync & Store Google Reviews" or "Add Genuine Review" above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allAdminReviews.map((rev) => {
                      const isHidden = Boolean(rev.hidden);
                      const isFiveStar = Number(rev.rating) === 5;
                      const isShownOnSite = isFiveStar && !isHidden;

                      return (
                        <div 
                          key={rev.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            isHidden 
                              ? 'bg-red-950/20 border-red-500/30' 
                              : isShownOnSite
                              ? 'bg-slate-950 border-emerald-500/30'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              {rev.author_photo || rev.authorPhoto ? (
                                <img src={rev.author_photo || rev.authorPhoto} alt={rev.author_name || rev.authorName} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-xs">
                                  {(rev.author_name || rev.authorName || 'P')[0]}
                                </div>
                              )}
                              <div>
                                <h4 className="text-xs font-bold text-white leading-tight">{rev.author_name || rev.authorName}</h4>
                                <span className="text-[10px] text-slate-400">{rev.author_location || rev.authorLocation || rev.relative_time || 'Google Review'}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-400 text-xs font-bold">
                              ★ {rev.rating}
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-3 mb-3 italic">
                            "{rev.text}"
                          </p>

                          {/* Category Tag */}
                          {rev.category && (
                            <div className="mb-3">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                                {rev.category}
                              </span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
                            {/* Visibility Badge */}
                            <div>
                              {isHidden ? (
                                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wide">
                                  Hidden by Admin
                                </span>
                              ) : isFiveStar ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wide">
                                  ● Shown on Website
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wide">
                                  Filtered (Non 5★)
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleReviewVisibility(rev.id, isHidden)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border ${
                                  isHidden 
                                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                                }`}
                              >
                                {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                <span>{isHidden ? 'Show' : 'Hide'}</span>
                              </button>

                              <button
                                onClick={() => handleDeleteReview(rev.id)}
                                className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                                title="Delete from Database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal for Adding Manual Genuine Review */}
              {showAddReviewModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Plus className="w-4 h-4 text-yellow-500" />
                        <span>Add Genuine Parent Review</span>
                      </h3>
                      <button 
                        onClick={() => setShowAddReviewModal(false)}
                        className="text-slate-400 hover:text-white p-1 text-lg font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleAddManualReview} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Parent / Author Name *
                        </label>
                        <input 
                          type="text"
                          required
                          value={newReviewForm.authorName}
                          onChange={(e) => setNewReviewForm({ ...newReviewForm, authorName: e.target.value })}
                          placeholder="e.g. Priyadarshini R"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-yellow-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Location / Area
                          </label>
                          <input 
                            type="text"
                            value={newReviewForm.authorLocation}
                            onChange={(e) => setNewReviewForm({ ...newReviewForm, authorLocation: e.target.value })}
                            placeholder="e.g. Ponmar, Chennai"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-yellow-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Rating Stars
                          </label>
                          <select
                            value={newReviewForm.rating}
                            onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-yellow-500"
                          >
                            <option value={5}>5 Stars (★ ★ ★ ★ ★)</option>
                            <option value={4}>4 Stars (★ ★ ★ ★)</option>
                            <option value={3}>3 Stars (★ ★ ★)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Program / Category Tag
                        </label>
                        <input 
                          type="text"
                          value={newReviewForm.category}
                          onChange={(e) => setNewReviewForm({ ...newReviewForm, category: e.target.value })}
                          placeholder="e.g. Abacus & Phonics"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-yellow-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Review Text / Feedback *
                        </label>
                        <textarea 
                          rows={4}
                          required
                          value={newReviewForm.text}
                          onChange={(e) => setNewReviewForm({ ...newReviewForm, text: e.target.value })}
                          placeholder="Write the parent's testimonial review here..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-yellow-500"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddReviewModal(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-yellow-500/20"
                        >
                          Save Review to Database
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
