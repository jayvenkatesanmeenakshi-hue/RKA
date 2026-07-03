import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import {
  initDb,
  verifyAdminLogin,
  getBlogPosts,
  getBlogPostBySlug,
  saveBlogPost,
  deleteBlogPost,
  saveEnquiry,
  getEnquiries,
  deleteEnquiry,
  getDbSeoData,
  saveDbSeoData
} from "./db.js";

// Load environment variables
dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());

// Normalizer for Vercel Serverless Function Rewrites
app.use((req, res, next) => {
  const url = req.url || "";
  if (process.env.VERCEL) {
    if (!url.startsWith("/api") && !url.startsWith("/sitemap") && !url.startsWith("/_") && !url.includes(".")) {
      req.url = "/api" + (url.startsWith("/") ? "" : "/") + url;
    }
  }
  next();
});

// Robust sitemap detection middleware
app.use((req, res, next) => {
  const url = req.url || "";
  const originalUrl = req.originalUrl || "";
  const querySitemap = req.query.sitemap === "true";
  const forwardedUrl = (req.headers["x-forwarded-url"] as string) || "";
  const matchedPath = (req.headers["x-matched-path"] as string) || "";
  
  if (
    querySitemap ||
    url.includes("sitemap.xml") ||
    originalUrl.includes("sitemap.xml") ||
    forwardedUrl.includes("sitemap.xml") ||
    matchedPath.includes("sitemap.xml")
  ) {
    return serveSitemap(req, res);
  }
  next();
});

// SEO JSON File Path
const LOCAL_SEO_FILE = path.join(process.cwd(), "seo.json");
const TMP_SEO_FILE = path.join("/tmp", "seo.json");

// Helper to load SEO data safely (DB first, file fallback)
export async function loadSeoData() {
  try {
    const dbData = await getDbSeoData();
    if (dbData) return dbData;
  } catch (err) {
    console.error("Error reading SEO from DB, fallback to file:", err);
  }

  try {
    if (fs.existsSync(TMP_SEO_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_SEO_FILE, "utf-8"));
    }
    if (fs.existsSync(LOCAL_SEO_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_SEO_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading seo.json, using defaults:", err);
  }

  return {
    title: "Rocking Kids Academy | Premier Learning Center for Abacus, Phonics & English",
    description: "Rocking Kids Academy is a premier learning center dedicated to skill development for children ages 4 to 14. We offer expert-led courses in Abacus, Phonics, English, and Handwriting mastery.",
    keywords: "Rocking Kids Academy, Abacus for kids, Phonics training, English speaking kids, Handwriting mastery, Child development academy, Skill development classes",
    canonical: "https://rockingkidsacademy.in",
    ogTitle: "Rocking Kids Academy | Premier Learning Center for Abacus, Phonics & English",
    ogDescription: "Dedicated to skill development for children ages 4 to 14. Discover our nurturing environment for Abacus, Phonics, English, and Handwriting mastery.",
    ogImage: "https://rockingkidsacademy.in/assets/images/logo-icon.png",
    twitterTitle: "Rocking Kids Academy | Premier Learning Center for Abacus, Phonics & English",
    twitterDescription: "Dedicated to skill development for children ages 4 to 14. Discover our nurturing environment for Abacus, Phonics, English, and Handwriting mastery.",
    twitterImage: "https://rockingkidsacademy.in/assets/images/logo-icon.png",
    sitemapUrls: [
      { url: "/", changefreq: "daily", priority: "1.0" },
      { url: "/#prospectus", changefreq: "weekly", priority: "0.8" },
      { url: "/#curriculum", changefreq: "weekly", priority: "0.8" },
      { url: "/#faculty", changefreq: "weekly", priority: "0.7" },
      { url: "/#location", changefreq: "weekly", priority: "0.7" }
    ]
  };
}

// Helper to save SEO data
export async function saveSeoData(data: any) {
  await saveDbSeoData(data);

  try {
    fs.writeFileSync(LOCAL_SEO_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    try {
      fs.writeFileSync(TMP_SEO_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (tmpErr) {
      console.error("Failed to write to /tmp/seo.json:", tmpErr);
    }
  }
}

// Helper to serve sitemap XML dynamically
export async function serveSitemap(req: express.Request, res: express.Response) {
  const seo = await loadSeoData();
  const domain = seo.canonical || "https://rockingkidsacademy.in";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  const urls = seo.sitemapUrls && seo.sitemapUrls.length > 0 ? [...seo.sitemapUrls] : [];
  
  if (!urls.some((u: any) => u.url === "/")) {
    urls.unshift({ url: "/", changefreq: "daily", priority: "1.0" });
  }
  
  const programUrls = [
    { url: "/program/Abacus", changefreq: "weekly", priority: "0.9" },
    { url: "/program/Phonics", changefreq: "weekly", priority: "0.9" },
    { url: "/program/English", changefreq: "weekly", priority: "0.9" },
    { url: "/program/Handwriting", changefreq: "weekly", priority: "0.9" }
  ];
  
  programUrls.forEach(item => {
    if (!urls.some((u: any) => u.url === item.url)) {
      urls.push(item);
    }
  });

  // Dynamically append blog routes from Neon DB or memory
  try {
    const blogs = await getBlogPosts();
    if (!urls.some((u: any) => u.url === "/blog")) {
      urls.push({ url: "/blog", changefreq: "daily", priority: "0.8" });
    }
    blogs.forEach((b: any) => {
      const blogPath = `/blog/${b.slug}`;
      if (!urls.some((u: any) => u.url === blogPath)) {
        urls.push({ url: blogPath, changefreq: "monthly", priority: "0.7" });
      }
    });
  } catch (e) {
    console.error("Sitemap blog fetch error:", e);
  }
  
  urls.forEach((item: any) => {
    const urlPath = item.url.startsWith("http") ? item.url : `${domain.replace(/\/$/, '')}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
    xml += `  <url>\n`;
    xml += `    <loc>${urlPath}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq || 'weekly'}</changefreq>\n`;
    xml += `    <priority>${item.priority || '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += `</urlset>\n`;
  
  res.header("Content-Type", "application/xml");
  res.status(200).send(xml);
}

// Route-specific dynamic SEO parameters
export async function getOverrideSeo(reqPath: string, baseSeo: any) {
  const domain = baseSeo.canonical || "https://rockingkidsacademy.in";
  
  if (reqPath === '/blog') {
    return {
      ...baseSeo,
      title: "Learning Resource Hub & Blog | Rocking Kids Academy Chennai",
      description: "Discover research-backed parenting tips, child cognitive development guides, phonics reading keys, and handwriting improvement techniques.",
      canonical: `${domain}/blog`,
      ogTitle: "Learning Resource Hub & Blog | Rocking Kids Academy Chennai",
      ogDescription: "Discover research-backed parenting tips, child cognitive development guides, phonics reading keys, and handwriting improvement techniques."
    };
  }
  
  if (reqPath.startsWith('/program/')) {
    const prog = reqPath.replace('/program/', '');
    let title = "";
    let description = "";
    
    if (prog === 'Abacus') {
      title = "Abacus & Brainobrain Affiliation Class Chennai | Rocking Kids Academy";
      description = "Master lightning-fast mental arithmetic computations and boost brain development with our certified Brainobrain abacus program at Ponmar, Chennai. Book a trial.";
    } else if (prog === 'Phonics') {
      title = "Structured Phonics Mastery Course Chennai | Rocking Kids Academy";
      description = "Synthetic phonics class for early reading fluency, letter sounds, and spelling mastery. Ideal for children aged 4 to 8 at our Chennai center.";
    } else if (prog === 'English') {
      title = "English Speaking & Communication Course | Rocking Kids Academy";
      description = "Elevate grammar, descriptive vocabulary, creative writing, and public speaking confidence for children ages 6 to 14. Located in Ponmar, Chennai.";
    } else if (prog === 'Handwriting') {
      title = "Handwriting & Cursive Improvement Course | Rocking Kids Academy";
      description = "Scientific handwriting improvement class correcting physical pencil grip, posture, letter sizing, and writing speed. Chennai Ponmar Main Road center.";
    } else {
      return baseSeo;
    }
    
    return {
      ...baseSeo,
      title,
      description,
      canonical: `${domain}${reqPath}`,
      ogTitle: title,
      ogDescription: description,
      twitterTitle: title,
      twitterDescription: description
    };
  }
  
  if (reqPath.startsWith('/blog/')) {
    const slug = reqPath.replace('/blog/', '');
    try {
      const blog = await getBlogPostBySlug(slug);
      if (blog) {
        return {
          ...baseSeo,
          title: `${blog.title} | Rocking Kids Academy`,
          description: blog.excerpt,
          canonical: `${domain}${reqPath}`,
          ogTitle: blog.title,
          ogDescription: blog.excerpt,
          ogImage: blog.coverImage || baseSeo.ogImage,
          twitterTitle: blog.title,
          twitterDescription: blog.excerpt,
          twitterImage: blog.coverImage || baseSeo.twitterImage
        };
      }
    } catch (e) {
      console.error("Error generating override SEO for blog:", e);
    }
  }
  
  return baseSeo;
}

// Dynamic SEO Injection function
export async function injectSeo(htmlStr: string, baseSeo: any, reqPath?: string): Promise<string> {
  const seo = reqPath ? await getOverrideSeo(reqPath, baseSeo) : baseSeo;

  htmlStr = htmlStr.replace(/<title>[^<]*<\/title>/i, `<title>${seo.title}</title>`);
  htmlStr = htmlStr.replace(/<meta[^>]*?name="description"[^>]*?content="[^"]*"[^>]*?>/i, `<meta name="description" content="${seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?name="description"[^>]*?>/i, `<meta name="description" content="${seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?name="keywords"[^>]*?content="[^"]*"[^>]*?>/i, `<meta name="keywords" content="${seo.keywords}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?name="keywords"[^>]*?>/i, `<meta name="keywords" content="${seo.keywords}" />`);
  htmlStr = htmlStr.replace(/<link[^>]*?rel="canonical"[^>]*?href="[^"]*"[^>]*?>/i, `<link rel="canonical" href="${seo.canonical}" />`);
  htmlStr = htmlStr.replace(/<link[^>]*?href="[^"]*"[^>]*?rel="canonical"[^>]*?>/i, `<link rel="canonical" href="${seo.canonical}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?property="og:title"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:title" content="${seo.ogTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property="og:title"[^>]*?>/i, `<meta property="og:title" content="${seo.ogTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?property="og:description"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:description" content="${seo.ogDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property="og:description"[^>]*?>/i, `<meta property="og:description" content="${seo.ogDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?property="og:image"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:image" content="${seo.ogImage || ''}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property="og:image"[^>]*?>/i, `<meta property="og:image" content="${seo.ogImage || ''}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)="twitter:title"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="twitter:title" content="${seo.twitterTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)="twitter:title"[^>]*?>/i, `<meta property="twitter:title" content="${seo.twitterTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)="twitter:description"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="twitter:description" content="${seo.twitterDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)="twitter:description"[^>]*?>/i, `<meta property="twitter:description" content="${seo.twitterDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)="twitter:image"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="twitter:image" content="${seo.twitterImage || ''}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)="twitter:image"[^>]*?>/i, `<meta property="twitter:image" content="${seo.twitterImage || ''}" />`);
  
  return htmlStr;
}

// Admin Authorization Middleware
async function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers["x-admin-token"] as string;
  const username = (req.headers["x-admin-username"] as string) || "admin";

  if (!token) {
    res.status(401).json({ error: "Unauthorized: Missing admin security token" });
    return;
  }

  const isValid = await verifyAdminLogin(username, token);
  if (!isValid) {
    res.status(401).json({ error: "Unauthorized: Invalid admin credentials" });
    return;
  }

  next();
}

// Create Express API Router to handle endpoints seamlessly with or without /api prefix
const apiRouter = express.Router();

// --- ADMIN VERIFY & LOGIN API ENDPOINTS ---
apiRouter.get("/admin/verify", checkAdminAuth, (req, res) => {
  res.json({ success: true, message: "Admin authenticated" });
});

apiRouter.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const isValid = await verifyAdminLogin(username, password);
    if (isValid) {
      res.json({ success: true, token: password.trim(), username: username.trim() });
    } else {
      res.status(401).json({ error: "Invalid Administrator Username or Password." });
    }
  } catch (err: any) {
    console.error("Login endpoint error:", err);
    res.status(500).json({ error: err?.message || "An unexpected error occurred during login." });
  }
});

// --- BLOG POSTS API ENDPOINTS (NEON POSTGRES) ---
apiRouter.get("/blogs", async (req, res) => {
  try {
    const blogs = await getBlogPosts();
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch blog posts" });
  }
});

apiRouter.get("/blogs/:slug", async (req, res) => {
  try {
    const blog = await getBlogPostBySlug(req.params.slug);
    if (!blog) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch blog post" });
  }
});

apiRouter.post("/admin/blogs", checkAdminAuth, async (req, res) => {
  try {
    const { slug, title, excerpt, content, category, tags, coverImage, readTime, author, date, isFeatured, isFocus } = req.body;
    if (!slug || !title || !content) {
      res.status(400).json({ error: "Slug, title, and content are required fields" });
      return;
    }

    const blog = await saveBlogPost({
      slug,
      title,
      excerpt: excerpt || title,
      content,
      category: category || "General",
      tags: tags || [],
      coverImage: coverImage || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
      readTime,
      author,
      date,
      isFeatured: !!isFeatured,
      isFocus: !!isFocus
    });

    res.json({ success: true, message: "Blog post successfully saved to Neon Postgres!", blog });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save blog post to database" });
  }
});

apiRouter.delete("/admin/blogs/:slug", checkAdminAuth, async (req, res) => {
  try {
    const success = await deleteBlogPost(req.params.slug);
    if (success) {
      res.json({ success: true, message: "Blog post deleted successfully from Neon Postgres" });
    } else {
      res.status(404).json({ error: "Blog post not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete blog post" });
  }
});

// --- ADMIN ENQUIRIES API ENDPOINTS (NEON POSTGRES) ---
apiRouter.get("/admin/enquiries", checkAdminAuth, async (req, res) => {
  try {
    const enquiries = await getEnquiries();
    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch enquiries" });
  }
});

apiRouter.delete("/admin/enquiries/:id", checkAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await deleteEnquiry(id);
    if (success) {
      res.json({ success: true, message: "Enquiry deleted successfully" });
    } else {
      res.status(404).json({ error: "Enquiry not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete enquiry" });
  }
});

// --- SEO CONFIGURATION API ENDPOINTS ---
apiRouter.get("/seo", async (req, res) => {
  const seo = await loadSeoData();
  res.json(seo);
});

apiRouter.post("/seo", checkAdminAuth, async (req, res) => {
  const { title, description, keywords, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage, sitemapUrls } = req.body;
  
  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required fields" });
    return;
  }
  
  const newSeo = {
    title,
    description,
    keywords: keywords || "",
    canonical: canonical || "https://rockingkidsacademy.in",
    ogTitle: ogTitle || title,
    ogDescription: ogDescription || description,
    ogImage: ogImage || "",
    twitterTitle: twitterTitle || title,
    twitterDescription: twitterDescription || description,
    twitterImage: twitterImage || "",
    sitemapUrls: sitemapUrls || []
  };
  
  await saveSeoData(newSeo);
  res.json({ success: true, message: "SEO configuration updated successfully in Neon Postgres!", data: newSeo });
});

// --- PUBLIC PARENT ENQUIRY ENDPOINT ---
apiRouter.post("/enquiry", async (req, res) => {
  try {
    const { parentName, mobileNumber, email, message } = req.body;

    if (!parentName || !mobileNumber || !email || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Save inquiry to Neon Postgres Database
    let savedRecord = null;
    try {
      savedRecord = await saveEnquiry({ parentName, mobileNumber, email, message });
      console.log("💾 Enquiry saved to Neon Postgres database:", savedRecord);
    } catch (dbErr) {
      console.error("Failed to save enquiry to Neon DB:", dbErr);
    }

    // Gather SMTP Configuration from environment
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.ENQUIRY_RECIPIENT_EMAIL || "meenakshidevarajan@gmail.com";

    const emailSubject = `New Enquiry from Rocking Kids Academy - ${parentName}`;
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px;">Rocking Kids Academy Enquiry</h2>
        <p style="font-size: 14px; color: #334155;">A parent has submitted a new inquiry via the academy website contact form.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; width: 150px; color: #475569;">Parent Name:</td>
            <td style="padding: 10px; color: #0f172a;">${parentName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #475569;">Mobile Number:</td>
            <td style="padding: 10px; color: #0f172a;"><a href="tel:${mobileNumber}" style="color: #ca8a04; text-decoration: none;">${mobileNumber}</a></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; color: #475569;">Email Address:</td>
            <td style="padding: 10px; color: #0f172a;"><a href="mailto:${email}" style="color: #ca8a04; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; vertical-align: top; color: #475569;">Message:</td>
            <td style="padding: 10px; color: #0f172a; white-space: pre-wrap; line-height: 1.5;">${message}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
          Received on ${new Date().toLocaleString()} from Rocking Kids Academy Website.
        </div>
      </div>
    `;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const smtpFrom = process.env.SMTP_FROM;
      const senderEmail = smtpFrom || (smtpUser.includes("@") ? smtpUser : recipientEmail);

      await transporter.sendMail({
        from: `"Rocking Kids Academy" <${senderEmail}>`,
        replyTo: email,
        to: recipientEmail,
        cc: "venky1302@gmail.com",
        subject: emailSubject,
        html: emailHtml,
      });

      res.status(200).json({ 
        success: true, 
        message: "Your enquiry has been submitted and saved successfully!" 
      });
    } else {
      res.status(200).json({ 
        success: true, 
        message: "Your enquiry was received and stored in our database successfully!",
        previewData: { parentName, mobileNumber, email, message }
      });
    }
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    res.status(200).json({ 
      success: true,
      message: "Enquiry received and saved to database.",
      previewData: req.body
    });
  }
});

// Mount API router on both /api and / to handle all rewrite variants
app.use("/api", apiRouter);
app.use("/", apiRouter);

// Catch-all 404 for unmatched API requests
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler middleware to enforce JSON response formatting
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err);
  if (!res.headersSent) {
    res.status(500).json({ error: err?.message || "An unexpected server error occurred." });
  }
});

export default app;
