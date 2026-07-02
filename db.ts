import pg from 'pg';
import dotenv from 'dotenv';
import { BLOG_POSTS } from './src/blogData.js';

dotenv.config();

const { Pool } = pg;

// Connection URL from environment variables (Neon Postgres on Vercel)
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pool: pg.Pool | null = null;

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
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
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed initial blogs if table is empty
      const blogRes = await client.query('SELECT COUNT(*) FROM blog_posts');
      if (parseInt(blogRes.rows[0].count, 10) === 0) {
        for (const blog of BLOG_POSTS) {
          await client.query(
            `INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, cover_image, read_time, author, date, published)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
              true
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

/**
 * Admin Login Verification
 */
export async function verifyAdminLogin(usernameInput: string, passwordInput: string): Promise<boolean> {
  const expectedPass = process.env.ADMIN_PASSWORD || 'RockingKids2026';
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';

  if (!pool) {
    // Fallback login check
    return (usernameInput === expectedUser || usernameInput === 'admin') && passwordInput === expectedPass;
  }

  try {
    const res = await pool.query('SELECT * FROM admin_users WHERE username = $1', [usernameInput]);
    if (res.rows.length > 0) {
      const user = res.rows[0];
      return user.password === passwordInput;
    }
    // Fallback to env password if not found in db
    return (usernameInput === expectedUser || usernameInput === 'admin') && passwordInput === expectedPass;
  } catch (err) {
    console.error('DB Login verification error:', err);
    return (usernameInput === expectedUser || usernameInput === 'admin') && passwordInput === expectedPass;
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
      published: row.published,
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
      published: row.published,
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
}): Promise<any> {
  const dateStr = blogData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const tagsArr = blogData.tags || [];

  if (!pool) {
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
      date: dateStr
    };
    if (existingIdx >= 0) {
      memoryBlogs[existingIdx] = newBlog;
    } else {
      memoryBlogs.unshift(newBlog);
    }
    return newBlog;
  }

  try {
    const query = `
      INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, cover_image, read_time, author, date, published, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, CURRENT_TIMESTAMP)
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
      dateStr
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
      date: row.date
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
