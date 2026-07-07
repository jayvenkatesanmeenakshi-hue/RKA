import pg from 'pg';
import dotenv from 'dotenv';
import { BLOG_POSTS } from './src/blogData.js';

dotenv.config();

const { Pool } = pg;

// Connection URL from environment variables (Neon Postgres on Vercel)
const rawDbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const dbUrl = rawDbUrl ? rawDbUrl.trim().replace(/^["']|["']$/g, '') : undefined;

let pool: pg.Pool | null = null;

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 10
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle Neon Postgres client:', err);
    });
    console.log('🔗 Neon Postgres client initialized with URL');
  } catch (err) {
    console.error('Failed to initialize Neon Postgres pool:', err);
  }
} else {
  console.log('ℹ️ No DATABASE_URL or POSTGRES_URL provided. Fallback to local in-memory/JSON store until Neon connection string is set in Vercel.');
}

// Memory fallback store for when Neon Postgres URL is not configured yet
let memoryBlogs = [...BLOG_POSTS];
let memoryEnquiries: Array<{
  id: number;
  parent_name: string;
  mobile_number: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}> = [];
let memoryHiddenReviews: string[] = [];

export const DEFAULT_5STAR_REVIEWS = [
  {
    id: 'rev-seed-1',
    authorName: 'S. Lakshmi',
    authorPhoto: '',
    authorLocation: 'Ponmar Rd, Chennai',
    rating: 5,
    date: '2 weeks ago',
    category: 'Abacus Math',
    text: "Very caring teachers. Lucky to have you as my son's teacher! Thank you so much for guiding him in Abacus math speed and accuracy.",
    avatarColor: 'bg-emerald-600',
    verified: true,
    likes: 24,
    hidden: false,
    source: 'seed'
  },
  {
    id: 'rev-seed-2',
    authorName: 'Karthik Swaminathan',
    authorPhoto: '',
    authorLocation: 'Ponmar, Chennai',
    rating: 5,
    date: '3 weeks ago',
    category: 'Abacus Math',
    text: 'Rocking Kids Academy (Phonics and Abacus) in Mambakkam/Ponmar has been a fantastic decision for my 7-year-old. Concentration and mental arithmetic speed improved drastically!',
    avatarColor: 'bg-purple-600',
    verified: true,
    likes: 12,
    hidden: false,
    source: 'seed'
  },
  {
    id: 'rev-seed-3',
    authorName: 'Priya Ramachandran',
    authorPhoto: '',
    authorLocation: 'Near SBIOA School',
    rating: 5,
    date: '1 month ago',
    category: 'Phonics & Reading',
    text: 'My 5-year-old daughter took the Phonics track here. She transitioned from basic letter sounds to reading entire storybooks effortlessly! The structured phonogram approach made reading fun.',
    avatarColor: 'bg-amber-600',
    verified: true,
    likes: 15,
    hidden: false,
    source: 'seed'
  },
  {
    id: 'rev-seed-4',
    authorName: 'Anitha Venkatesh',
    authorPhoto: '',
    authorLocation: 'Medavakkam / Ponmar',
    rating: 5,
    date: '1 month ago',
    category: 'Handwriting',
    text: 'Unbelievable handwriting transformation! Clear pencil grip & stroke guidance, double-line practice, and very supportive staff. Excellent activity center.',
    avatarColor: 'bg-rose-600',
    verified: true,
    likes: 19,
    hidden: false,
    source: 'seed'
  },
  {
    id: 'rev-seed-5',
    authorName: 'Rajesh Kumar M.',
    authorPhoto: '',
    authorLocation: 'Ponmar Main Road',
    rating: 5,
    date: '2 months ago',
    category: 'English & Grammar',
    text: 'Small batch sizes mean the teachers truly focus on each child. Friendly environment, clean space, and regular progress updates. My son loves attending classes here!',
    avatarColor: 'bg-indigo-600',
    verified: true,
    likes: 11,
    hidden: false,
    source: 'seed'
  },
  {
    id: 'rev-seed-6',
    authorName: 'A. R. Parent',
    authorPhoto: '',
    authorLocation: 'Mambakkam, Chennai',
    rating: 5,
    date: '1 week ago',
    category: 'Phonics & Reading',
    text: 'Definitely a great place for the kids to learn reading English and Tamil.. The teachers are very patient and structured in their teaching methodology.',
    avatarColor: 'bg-blue-600',
    verified: true,
    likes: 18,
    hidden: false,
    source: 'seed'
  }
];

let memoryStoredReviews = [...DEFAULT_5STAR_REVIEWS];

/**
 * Initialize Neon Postgres Database Tables & Seed Defaults
 */
export async function initDb(): Promise<boolean> {
  if (!pool) return false;

  try {
    const client = await pool.connect();
    try {
      // 1. Admin users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed default admin user if none exists
      const defaultAdminPass = process.env.ADMIN_PASSWORD || 'RockingKids2026';
      const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
      
      const adminRes = await client.query('SELECT * FROM admin_users WHERE username = $1', [defaultAdminUser]);
      if (adminRes.rowCount === 0) {
        await client.query(
          'INSERT INTO admin_users (username, password, role) VALUES ($1, $2, $3)',
          [defaultAdminUser, defaultAdminPass, 'admin']
        );
        console.log(`✅ Default admin user "${defaultAdminUser}" seeded into Neon Postgres.`);
      }

      // 2. Blog posts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id SERIAL PRIMARY KEY,
          slug VARCHAR(255) UNIQUE NOT NULL,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          tags TEXT[] DEFAULT '{}',
          cover_image TEXT NOT NULL,
          read_time VARCHAR(50) DEFAULT '5 Min Read',
          author VARCHAR(100) DEFAULT 'Admin',
          date VARCHAR(100) NOT NULL,
          published BOOLEAN DEFAULT true,
          is_featured BOOLEAN DEFAULT false,
          is_focus BOOLEAN DEFAULT false,
          meta_title VARCHAR(255),
          meta_description VARCHAR(500),
          series_name VARCHAR(255),
          series_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Migrations for existing tables
      await client.query(`
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_focus BOOLEAN DEFAULT false;
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500);
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS series_name VARCHAR(255);
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS series_order INTEGER DEFAULT 0;
      `);

      // Seed initial blogs if table is empty
      const blogRes = await client.query('SELECT COUNT(*) FROM blog_posts');
      if (parseInt(blogRes.rows[0].count, 10) === 0) {
        for (const blog of BLOG_POSTS) {
          await client.query(
            `INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, cover_image, read_time, author, date, published, is_featured, is_focus)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (slug) DO NOTHING`,
            [
              blog.slug,
              blog.title,
              blog.excerpt,
              blog.content,
              blog.category,
              blog.tags || [],
              blog.coverImage,
              blog.readTime || '5 Min Read',
              blog.author || 'Admin',
              blog.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              true,
              blog.isFeatured || false,
              blog.isFocus || false
            ]
          );
        }
        console.log(`✅ ${BLOG_POSTS.length} default blog posts seeded into Neon Postgres.`);
      }

      // 3. Parent Enquiries table
      await client.query(`
        CREATE TABLE IF NOT EXISTS enquiries (
          id SERIAL PRIMARY KEY,
          parent_name VARCHAR(255) NOT NULL,
          mobile_number VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'new',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. SEO Settings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS seo_settings (
          id SERIAL PRIMARY KEY,
          setting_key VARCHAR(50) UNIQUE NOT NULL DEFAULT 'default',
          data JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 5. Hidden Google Reviews table
      await client.query(`
        CREATE TABLE IF NOT EXISTS hidden_reviews (
          review_id TEXT PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 6. Google Reviews table (stores all fetched Google Business reviews permanently)
      await client.query(`
        CREATE TABLE IF NOT EXISTS google_reviews (
          id TEXT PRIMARY KEY,
          author_name TEXT NOT NULL,
          author_photo TEXT DEFAULT '',
          author_location TEXT DEFAULT 'Verified Google Reviewer',
          rating INT NOT NULL DEFAULT 5,
          date_str TEXT DEFAULT '',
          text TEXT NOT NULL,
          category TEXT DEFAULT 'Google Business Page',
          avatar_color TEXT DEFAULT 'bg-blue-600',
          verified BOOLEAN DEFAULT true,
          likes INT DEFAULT 5,
          hidden BOOLEAN DEFAULT false,
          source TEXT DEFAULT 'google_places',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed default 5-star reviews if google_reviews table is empty
      const reviewCountRes = await client.query('SELECT COUNT(*) FROM google_reviews');
      if (parseInt(reviewCountRes.rows[0].count, 10) === 0) {
        for (const rev of DEFAULT_5STAR_REVIEWS) {
          await client.query(
            `INSERT INTO google_reviews (id, author_name, author_photo, author_location, rating, date_str, text, category, avatar_color, verified, likes, hidden, source)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (id) DO NOTHING`,
            [
              rev.id,
              rev.authorName,
              rev.authorPhoto || '',
              rev.authorLocation || 'Ponmar, Chennai',
              rev.rating || 5,
              rev.date || 'Recently',
              rev.text,
              rev.category || 'Abacus & Phonics',
              rev.avatarColor || 'bg-blue-600',
              rev.verified ?? true,
              rev.likes || 15,
              rev.hidden ?? false,
              rev.source || 'seed'
            ]
          );
        }
        console.log(`✅ ${DEFAULT_5STAR_REVIEWS.length} default 5-star Google reviews seeded into Neon Postgres.`);
      }

      console.log('🚀 Neon Postgres database tables successfully initialized and verified!');
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Failed to connect or initialize Neon Postgres tables:', err);
    return false;
  }
}

let dbInitPromise: Promise<boolean> | null = null;

export async function ensureDbInitialized(): Promise<boolean> {
  if (!pool) return false;
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch((err) => {
      console.error('ensureDbInitialized error:', err);
      dbInitPromise = null;
      return false;
    });
  }
  return dbInitPromise;
}

/**
 * Admin Login Verification
 */
export async function verifyAdminLogin(usernameInput: string, passwordInput: string): Promise<boolean> {
  const expectedPass = (process.env.ADMIN_PASSWORD || 'RockingKids2026').trim();
  const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim();

  const cleanUser = (usernameInput || '').trim();
  const cleanPass = (passwordInput || '').trim();

  // Allow default environment password or default 'RockingKids2026' or 'RKAdmin@127'
  const isDefaultMatch =
    cleanPass === expectedPass ||
    cleanPass === 'RockingKids2026' ||
    cleanPass === 'RKAdmin@127';

  if (!pool) {
    return isDefaultMatch;
  }

  try {
    await ensureDbInitialized();
    
    // 1. Check exact match for username (case-insensitive)
    const userRes = await pool.query('SELECT * FROM admin_users WHERE LOWER(username) = LOWER($1)', [cleanUser]);
    if (userRes.rows.length > 0) {
      for (const row of userRes.rows) {
        if (row.password === cleanPass || isDefaultMatch) {
          return true;
        }
      }
    }

    // 2. Check if ANY user in admin_users matches this password
    const passRes = await pool.query('SELECT * FROM admin_users WHERE password = $1', [cleanPass]);
    if (passRes.rows.length > 0) {
      return true;
    }

    // 3. Fallback to default ENV / credential match
    return isDefaultMatch;
  } catch (err) {
    console.error('DB Login verification error (falling back to default env credentials):', err);
    return isDefaultMatch;
  }
}

/**
 * Get All Blog Posts
 */
export async function getBlogPosts(): Promise<any[]> {
  if (!pool) {
    return memoryBlogs;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query('SELECT * FROM blog_posts ORDER BY id DESC');
    return res.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category,
      tags: row.tags || [],
      coverImage: row.cover_image,
      readTime: row.read_time,
      author: row.author,
      date: row.date,
      published: row.published ?? true,
      isFeatured: row.is_featured ?? false,
      isFocus: row.is_focus ?? false,
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
      seriesName: row.series_name || '',
      seriesOrder: row.series_order ?? 0,
      createdAt: row.created_at
    }));
  } catch (err) {
    console.error('Error fetching blogs from Neon DB:', err);
    return memoryBlogs;
  }
}

/**
 * Get Single Blog Post by Slug
 */
export async function getBlogPostBySlug(slug: string): Promise<any | null> {
  if (!pool) {
    return memoryBlogs.find(b => b.slug === slug) || null;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category,
      tags: row.tags || [],
      coverImage: row.cover_image,
      readTime: row.read_time,
      author: row.author,
      date: row.date,
      published: row.published ?? true,
      isFeatured: row.is_featured ?? false,
      isFocus: row.is_focus ?? false,
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
      seriesName: row.series_name || '',
      seriesOrder: row.series_order ?? 0,
      createdAt: row.created_at
    };
  } catch (err) {
    console.error('Error fetching blog by slug from Neon DB:', err);
    return memoryBlogs.find(b => b.slug === slug) || null;
  }
}

/**
 * Create or Update Blog Post
 */
export async function saveBlogPost(blogData: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  coverImage: string;
  readTime?: string;
  author?: string;
  date?: string;
  isFeatured?: boolean;
  isFocus?: boolean;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  seriesName?: string;
  seriesOrder?: number;
}): Promise<any> {
  const dateStr = blogData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const tagsArr = blogData.tags || [];
  const isFeatured = blogData.isFeatured ?? false;
  const isFocus = blogData.isFocus ?? false;
  const published = blogData.published ?? true;
  const metaTitle = blogData.metaTitle || null;
  const metaDescription = blogData.metaDescription || null;
  const seriesName = blogData.seriesName || null;
  const seriesOrder = blogData.seriesOrder ?? 0;

  if (!pool) {
    if (isFocus) {
      memoryBlogs.forEach(b => { b.isFocus = false; });
    }
    const existingIdx = memoryBlogs.findIndex(b => b.slug === blogData.slug);
    const newBlog = {
      slug: blogData.slug,
      title: blogData.title,
      excerpt: blogData.excerpt,
      content: blogData.content,
      category: blogData.category,
      tags: tagsArr,
      coverImage: blogData.coverImage,
      readTime: blogData.readTime || '5 Min Read',
      author: blogData.author || 'Admin',
      date: dateStr,
      isFeatured: isFeatured,
      isFocus: isFocus,
      published: published,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
      seriesName: seriesName || '',
      seriesOrder: seriesOrder
    };
    if (existingIdx >= 0) {
      memoryBlogs[existingIdx] = newBlog;
    } else {
      memoryBlogs.unshift(newBlog);
    }
    return newBlog;
  }

  try {
    await ensureDbInitialized();

    // If setting as focus, optionally un-set focus on other posts so only one post is focus
    if (isFocus) {
      await pool.query('UPDATE blog_posts SET is_focus = false WHERE slug != $1', [blogData.slug]);
    }

    const query = `
      INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, cover_image, read_time, author, date, published, is_featured, is_focus, meta_title, meta_description, series_name, series_order, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        cover_image = EXCLUDED.cover_image,
        read_time = EXCLUDED.read_time,
        author = EXCLUDED.author,
        date = EXCLUDED.date,
        published = EXCLUDED.published,
        is_featured = EXCLUDED.is_featured,
        is_focus = EXCLUDED.is_focus,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        series_name = EXCLUDED.series_name,
        series_order = EXCLUDED.series_order,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [
      blogData.slug,
      blogData.title,
      blogData.excerpt,
      blogData.content,
      blogData.category,
      tagsArr,
      blogData.coverImage,
      blogData.readTime || '5 Min Read',
      blogData.author || 'Admin',
      dateStr,
      published,
      isFeatured,
      isFocus,
      metaTitle,
      metaDescription,
      seriesName,
      seriesOrder
    ];
    const res = await pool.query(query, values);
    const row = res.rows[0];
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category,
      tags: row.tags,
      coverImage: row.cover_image,
      readTime: row.read_time,
      author: row.author,
      date: row.date,
      published: row.published ?? true,
      isFeatured: row.is_featured ?? false,
      isFocus: row.is_focus ?? false,
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
      seriesName: row.series_name || '',
      seriesOrder: row.series_order ?? 0
    };
  } catch (err) {
    console.error('Error saving blog post to Neon DB:', err);
    throw err;
  }
}

/**
 * Delete Blog Post
 */
export async function deleteBlogPost(slug: string): Promise<boolean> {
  if (!pool) {
    memoryBlogs = memoryBlogs.filter(b => b.slug !== slug);
    return true;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query('DELETE FROM blog_posts WHERE slug = $1', [slug]);
    return (res.rowCount ?? 0) > 0;
  } catch (err) {
    console.error('Error deleting blog post from Neon DB:', err);
    throw err;
  }
}

/**
 * Save Parent Enquiry
 */
export async function saveEnquiry(enquiry: {
  parentName: string;
  mobileNumber: string;
  email: string;
  message: string;
}): Promise<any> {
  if (!pool) {
    const record = {
      id: Date.now(),
      parent_name: enquiry.parentName,
      mobile_number: enquiry.mobileNumber,
      email: enquiry.email,
      message: enquiry.message,
      status: 'new',
      created_at: new Date().toISOString()
    };
    memoryEnquiries.unshift(record);
    return record;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query(
      `INSERT INTO enquiries (parent_name, mobile_number, email, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [enquiry.parentName, enquiry.mobileNumber, enquiry.email, enquiry.message]
    );
    return res.rows[0];
  } catch (err) {
    console.error('Error saving enquiry to Neon DB:', err);
    throw err;
  }
}

/**
 * Get All Parent Enquiries (Admin)
 */
export async function getEnquiries(): Promise<any[]> {
  if (!pool) {
    return memoryEnquiries;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query('SELECT * FROM enquiries ORDER BY id DESC');
    return res.rows.map(row => ({
      id: row.id,
      parentName: row.parent_name,
      mobileNumber: row.mobile_number,
      email: row.email,
      message: row.message,
      status: row.status,
      createdAt: row.created_at
    }));
  } catch (err) {
    console.error('Error getting enquiries from Neon DB:', err);
    return memoryEnquiries;
  }
}

/**
 * Delete Enquiry (Admin)
 */
export async function deleteEnquiry(id: number): Promise<boolean> {
  if (!pool) {
    memoryEnquiries = memoryEnquiries.filter(e => e.id !== id);
    return true;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query('DELETE FROM enquiries WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  } catch (err) {
    console.error('Error deleting enquiry from Neon DB:', err);
    throw err;
  }
}

/**
 * Get SEO Data from DB
 */
export async function getDbSeoData(): Promise<any | null> {
  if (!pool) return null;

  try {
    await ensureDbInitialized();
    const res = await pool.query("SELECT data FROM seo_settings WHERE setting_key = 'default'");
    if (res.rows.length > 0) {
      return res.rows[0].data;
    }
    return null;
  } catch (err) {
    console.error('Error fetching SEO settings from Neon DB:', err);
    return null;
  }
}

/**
 * Save SEO Data to DB
 */
export async function saveDbSeoData(seoData: any): Promise<boolean> {
  if (!pool) return false;

  try {
    await ensureDbInitialized();
    await pool.query(
      `INSERT INTO seo_settings (setting_key, data, updated_at)
       VALUES ('default', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (setting_key) DO UPDATE SET
         data = EXCLUDED.data,
         updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(seoData)]
    );
    return true;
  } catch (err) {
    console.error('Error saving SEO settings to Neon DB:', err);
    return false;
  }
}

/**
 * Get Hidden Google Review IDs
 */
export async function getHiddenReviewIds(): Promise<string[]> {
  if (!pool) {
    return memoryHiddenReviews;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query('SELECT review_id FROM hidden_reviews');
    return res.rows.map(row => row.review_id);
  } catch (err) {
    console.error('Error fetching hidden reviews from Neon DB:', err);
    return memoryHiddenReviews;
  }
}

/**
 * Hide Google Review ID
 */
export async function hideReviewId(reviewId: string): Promise<boolean> {
  const cleanId = (reviewId || '').trim();
  if (!cleanId) return false;

  if (!pool) {
    if (!memoryHiddenReviews.includes(cleanId)) {
      memoryHiddenReviews.push(cleanId);
    }
    return true;
  }

  try {
    await ensureDbInitialized();
    await pool.query(
      `INSERT INTO hidden_reviews (review_id) VALUES ($1) ON CONFLICT (review_id) DO NOTHING`,
      [cleanId]
    );
    return true;
  } catch (err) {
    console.error('Error hiding review ID in Neon DB:', err);
    throw err;
  }
}

/**
 * Unhide Google Review ID
 */
export async function unhideReviewId(reviewId: string): Promise<boolean> {
  const cleanId = (reviewId || '').trim();
  if (!cleanId) return false;

  if (!pool) {
    memoryHiddenReviews = memoryHiddenReviews.filter(id => id !== cleanId);
    return true;
  }

  try {
    await ensureDbInitialized();
    await pool.query('DELETE FROM hidden_reviews WHERE review_id = $1', [cleanId]);
    return true;
  } catch (err) {
    console.error('Error unhiding review ID in Neon DB:', err);
    throw err;
  }
}

/**
 * Save / Upsert Google Reviews into Database
 */
export async function saveGoogleReviews(reviews: any[]): Promise<number> {
  if (!reviews || reviews.length === 0) return 0;

  if (!pool) {
    let insertedCount = 0;
    for (const rev of reviews) {
      const idx = memoryStoredReviews.findIndex(r => r.id === rev.id);
      if (idx >= 0) {
        memoryStoredReviews[idx] = { ...memoryStoredReviews[idx], ...rev };
      } else {
        memoryStoredReviews.unshift({
          id: rev.id || `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          authorName: rev.authorName || 'Google User',
          authorPhoto: rev.authorPhoto || '',
          authorLocation: rev.authorLocation || 'Verified Google Reviewer',
          rating: rev.rating || 5,
          date: rev.date || 'Recently',
          text: rev.text || '',
          category: rev.category || 'Google Business Page',
          avatarColor: rev.avatarColor || 'bg-blue-600',
          verified: rev.verified ?? true,
          likes: rev.likes || 10,
          hidden: rev.hidden ?? false,
          source: rev.source || 'google_places'
        });
        insertedCount++;
      }
    }
    return insertedCount;
  }

  try {
    await ensureDbInitialized();
    let insertedCount = 0;

    for (const rev of reviews) {
      const cleanId = (rev.id || `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`).trim();
      const res = await pool.query(
        `INSERT INTO google_reviews (
          id, author_name, author_photo, author_location, rating, date_str, text, category, avatar_color, verified, likes, hidden, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          author_name = EXCLUDED.author_name,
          author_photo = COALESCE(NULLIF(EXCLUDED.author_photo, ''), google_reviews.author_photo),
          text = EXCLUDED.text,
          rating = EXCLUDED.rating,
          date_str = EXCLUDED.date_str,
          updated_at = CURRENT_TIMESTAMP`,
        [
          cleanId,
          rev.authorName || 'Google User',
          rev.authorPhoto || '',
          rev.authorLocation || 'Verified Google Reviewer',
          rev.rating || 5,
          rev.date || 'Recently',
          rev.text || '',
          rev.category || 'Google Business Page',
          rev.avatarColor || 'bg-blue-600',
          rev.verified ?? true,
          rev.likes || 10,
          rev.hidden ?? false,
          rev.source || 'google_places'
        ]
      );
      if (res.rowCount && res.rowCount > 0) insertedCount++;
    }

    return insertedCount;
  } catch (err) {
    console.error('Error saving Google reviews to Neon DB:', err);
    return 0;
  }
}

/**
 * Get Stored Google Reviews from Database
 */
export async function getStoredGoogleReviews(options?: { onlyFiveStar?: boolean; includeHidden?: boolean }): Promise<any[]> {
  const onlyFiveStar = options?.onlyFiveStar ?? false;
  const includeHidden = options?.includeHidden ?? false;

  if (!pool) {
    return memoryStoredReviews.filter(rev => {
      if (onlyFiveStar && rev.rating !== 5) return false;
      if (!includeHidden && rev.hidden) return false;
      return true;
    });
  }

  try {
    await ensureDbInitialized();
    let query = 'SELECT * FROM google_reviews WHERE 1=1';
    const params: any[] = [];

    if (onlyFiveStar) {
      query += ' AND rating = 5';
    }
    if (!includeHidden) {
      query += ' AND (hidden IS NOT TRUE)';
    }

    query += ' ORDER BY updated_at DESC, created_at DESC';

    const res = await pool.query(query, params);

    // Also check hidden_reviews table for backwards compatibility
    const hiddenRes = await pool.query('SELECT review_id FROM hidden_reviews');
    const legacyHiddenIds = new Set(hiddenRes.rows.map(r => r.review_id));

    return res.rows
      .filter(row => includeHidden || (!row.hidden && !legacyHiddenIds.has(row.id)))
      .map(row => ({
        id: row.id,
        authorName: row.author_name,
        authorPhoto: row.author_photo || '',
        authorLocation: row.author_location || 'Verified Google Reviewer',
        rating: row.rating,
        date: row.date_str || 'Recently',
        text: row.text,
        category: row.category || 'Google Business Page',
        avatarColor: row.avatar_color || 'bg-blue-600',
        verified: row.verified ?? true,
        likes: row.likes || 10,
        hidden: row.hidden || legacyHiddenIds.has(row.id),
        source: row.source || 'google_places',
        createdAt: row.created_at
      }));
  } catch (err) {
    console.error('Error fetching stored google reviews from Neon DB:', err);
    return memoryStoredReviews.filter(rev => {
      if (onlyFiveStar && rev.rating !== 5) return false;
      if (!includeHidden && rev.hidden) return false;
      return true;
    });
  }
}

/**
 * Toggle Visibility of a Review (Hide / Unhide in database)
 */
export async function toggleReviewVisibility(reviewId: string, hidden: boolean): Promise<boolean> {
  const cleanId = (reviewId || '').trim();
  if (!cleanId) return false;

  if (!pool) {
    const idx = memoryStoredReviews.findIndex(r => r.id === cleanId);
    if (idx >= 0) {
      memoryStoredReviews[idx].hidden = hidden;
    }
    return true;
  }

  try {
    await ensureDbInitialized();
    await pool.query('UPDATE google_reviews SET hidden = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hidden, cleanId]);
    if (hidden) {
      await pool.query('INSERT INTO hidden_reviews (review_id) VALUES ($1) ON CONFLICT (review_id) DO NOTHING', [cleanId]);
    } else {
      await pool.query('DELETE FROM hidden_reviews WHERE review_id = $1', [cleanId]);
    }
    return true;
  } catch (err) {
    console.error('Error toggling review visibility in Neon DB:', err);
    throw err;
  }
}

/**
 * Delete a Stored Review from Database
 */
export async function deleteStoredReview(reviewId: string): Promise<boolean> {
  const cleanId = (reviewId || '').trim();
  if (!cleanId) return false;

  if (!pool) {
    memoryStoredReviews = memoryStoredReviews.filter(r => r.id !== cleanId);
    return true;
  }

  try {
    await ensureDbInitialized();
    await pool.query('DELETE FROM google_reviews WHERE id = $1', [cleanId]);
    return true;
  } catch (err) {
    console.error('Error deleting stored review from Neon DB:', err);
    throw err;
  }
}

/**
 * Save Manual Review added by Admin
 */
export async function saveManualReview(revData: any): Promise<boolean> {
  const id = revData.id || `manual-${Date.now()}`;
  return saveGoogleReviews([{ ...revData, id, source: 'manual_admin' }]).then(count => count > 0);
}

/**
 * Increment or decrement helpful likes count in database
 */
export async function incrementReviewLikes(reviewId: string, delta: number): Promise<number> {
  const cleanId = (reviewId || '').trim();
  if (!cleanId) return 0;

  if (!pool) {
    const idx = memoryStoredReviews.findIndex(r => r.id === cleanId);
    if (idx >= 0) {
      memoryStoredReviews[idx].likes = Math.max(0, (memoryStoredReviews[idx].likes || 0) + delta);
      return memoryStoredReviews[idx].likes;
    }
    return 0;
  }

  try {
    await ensureDbInitialized();
    const res = await pool.query(
      'UPDATE google_reviews SET likes = GREATEST(0, likes + $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING likes',
      [delta, cleanId]
    );
    if (res.rows && res.rows[0] && typeof res.rows[0].likes === 'number') {
      return res.rows[0].likes;
    }
    return 0;
  } catch (err) {
    console.error('Error updating review likes in Neon DB:', err);
    return 0;
  }
}

