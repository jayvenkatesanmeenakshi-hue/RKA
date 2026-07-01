import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

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

// Helper to load SEO data safely
function loadSeoData() {
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
  // fallback defaults
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
function saveSeoData(data: any) {
  try {
    fs.writeFileSync(LOCAL_SEO_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to local seo.json (expected on read-only environments like Vercel). Trying /tmp/seo.json...", err);
    try {
      fs.writeFileSync(TMP_SEO_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (tmpErr) {
      console.error("Failed to write to /tmp/seo.json:", tmpErr);
    }
  }
}

// Helper to serve sitemap XML dynamically
function serveSitemap(req: express.Request, res: express.Response) {
  const seo = loadSeoData();
  const domain = seo.canonical || "https://rockingkidsacademy.in";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Start with sitemapUrls from seo.json
  const urls = seo.sitemapUrls && seo.sitemapUrls.length > 0 ? [...seo.sitemapUrls] : [];
  
  // Ensure the homepage is there
  if (!urls.some((u: any) => u.url === "/")) {
    urls.unshift({ url: "/", changefreq: "daily", priority: "1.0" });
  }
  
  // Dynamically append new program routes
  const programUrls = [
    { url: "/program/Abacus", changefreq: "weekly", priority: "0.9" },
    { url: "/program/Phonics", changefreq: "weekly", priority: "0.9" },
    { url: "/program/English", changefreq: "weekly", priority: "0.9" },
    { url: "/program/Handwriting", changefreq: "weekly", priority: "0.9" }
  ];
  
  // Dynamically append blog routes
  const blogUrls = [
    { url: "/blog", changefreq: "daily", priority: "0.8" },
    { url: "/blog/power-of-abacus-mental-math-brain-development", changefreq: "monthly", priority: "0.7" },
    { url: "/blog/phonics-vs-whole-language-why-essential-reading-success", changefreq: "monthly", priority: "0.7" },
    { url: "/blog/effective-ways-improve-child-handwriting-motor-skills", changefreq: "monthly", priority: "0.7" }
  ];

  programUrls.forEach(item => {
    if (!urls.some((u: any) => u.url === item.url)) {
      urls.push(item);
    }
  });

  blogUrls.forEach(item => {
    if (!urls.some((u: any) => u.url === item.url)) {
      urls.push(item);
    }
  });
  
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
function getOverrideSeo(reqPath: string, baseSeo: any) {
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
    let title = "";
    let description = "";
    
    if (slug === 'power-of-abacus-mental-math-brain-development') {
      title = "The Power of Abacus: How Mental Math Boosts Brain Development";
      description = "Learn how abacus training builds whole-brain connectivity, visual working memory, concentration, and lifetime confidence in children.";
    } else if (slug === 'phonics-vs-whole-language-why-essential-reading-success') {
      title = "Phonics vs. Whole Language: Why Phonics is Essential for Reading";
      description = "Discover the cognitive science of reading and why systematic synthetic phonics is the absolute best way to build early literacy fluency.";
    } else if (slug === 'effective-ways-improve-child-handwriting-motor-skills') {
      title = "5 Effective Ways to Improve Your Child's Handwriting & Motor Skills";
      description = "Struggling with messy cursive? Read these practical, fine motor and ergonomic tips to improve your child's hand coordination.";
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
  
  return baseSeo;
}

// Dynamic SEO Injection function
function injectSeo(htmlStr: string, baseSeo: any, reqPath?: string): string {
  const seo = reqPath ? getOverrideSeo(reqPath, baseSeo) : baseSeo;

  // Replace title
  htmlStr = htmlStr.replace(/<title>[^<]*<\/title>/i, `<title>${seo.title}</title>`);
  
  // Replace meta description
  htmlStr = htmlStr.replace(/<meta[^>]*?name="description"[^>]*?content="[^"]*"[^>]*?>/i, `<meta name="description" content="${seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?name="description"[^>]*?>/i, `<meta name="description" content="${seo.description}" />`);
  
  // Replace meta keywords
  htmlStr = htmlStr.replace(/<meta[^>]*?name="keywords"[^>]*?content="[^"]*"[^>]*?>/i, `<meta name="keywords" content="${seo.keywords}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?name="keywords"[^>]*?>/i, `<meta name="keywords" content="${seo.keywords}" />`);
  
  // Replace canonical link
  htmlStr = htmlStr.replace(/<link[^>]*?rel="canonical"[^>]*?href="[^"]*"[^>]*?>/i, `<link rel="canonical" href="${seo.canonical}" />`);
  htmlStr = htmlStr.replace(/<link[^>]*?href="[^"]*"[^>]*?rel="canonical"[^>]*?>/i, `<link rel="canonical" href="${seo.canonical}" />`);
  
  // Replace og:title
  htmlStr = htmlStr.replace(/<meta[^>]*?property="og:title"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:title" content="${seo.ogTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property="og:title"[^>]*?>/i, `<meta property="og:title" content="${seo.ogTitle || seo.title}" />`);
  
  // Replace og:description
  htmlStr = htmlStr.replace(/<meta[^>]*?property="og:description"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:description" content="${seo.ogDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property="og:description"[^>]*?>/i, `<meta property="og:description" content="${seo.ogDescription || seo.description}" />`);
  
  // Replace og:image
  htmlStr = htmlStr.replace(/<meta[^>]*?property="og:image"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:image" content="${seo.ogImage || ''}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property="og:image"[^>]*?>/i, `<meta property="og:image" content="${seo.ogImage || ''}" />`);
  
  // Replace twitter:title
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)="twitter:title"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="twitter:title" content="${seo.twitterTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)="twitter:title"[^>]*?>/i, `<meta property="twitter:title" content="${seo.twitterTitle || seo.title}" />`);
  
  // Replace twitter:description
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)="twitter:description"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="twitter:description" content="${seo.twitterDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)="twitter:description"[^>]*?>/i, `<meta property="twitter:description" content="${seo.twitterDescription || seo.description}" />`);
  
  // Replace twitter:image
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)="twitter:image"[^>]*?content="[^"]*"[^>]*?>/i, `<meta property="twitter:image" content="${seo.twitterImage || ''}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)="twitter:image"[^>]*?>/i, `<meta property="twitter:image" content="${seo.twitterImage || ''}" />`);
  
  return htmlStr;
}

// API Routes for SEO Configuration
app.get("/api/seo", (req, res) => {
  res.json(loadSeoData());
});

app.post("/api/seo", (req, res) => {
  const token = req.headers["x-admin-token"];
  const expectedPassword = process.env.ADMIN_PASSWORD || "RockingKids2026";
  
  if (token !== expectedPassword) {
    res.status(401).json({ error: "Unauthorized: Invalid admin key" });
    return;
  }
  
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
  
  saveSeoData(newSeo);
  res.json({ success: true, message: "SEO configuration updated successfully!", data: newSeo });
});

// Dynamic public sitemap.xml endpoints
app.get("/sitemap.xml", (req, res) => {
  serveSitemap(req, res);
});

app.get("/api/sitemap.xml", (req, res) => {
  serveSitemap(req, res);
});

// API Enquiry Endpoint
app.post("/api/enquiry", async (req, res) => {
  try {
    const { parentName, mobileNumber, email, message } = req.body;

    // Basic validation
    if (!parentName || !mobileNumber || !email || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    console.log("-----------------------------------------");
    console.log("NEW ENQUIRY RECEIVED:");
    console.log(`Parent Name:   ${parentName}`);
    console.log(`Mobile Number: ${mobileNumber}`);
    console.log(`Email Address: ${email}`);
    console.log(`Message:       ${message}`);
    console.log("-----------------------------------------");

    // Gather SMTP Configuration from environment
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.ENQUIRY_RECIPIENT_EMAIL || "meenakshidevarajan@gmail.com";

    const emailSubject = `New Enquiry from Rocking Kids Academy - ${parentName}`;
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; rounded: 8px;">
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

    // Check if SMTP is configured
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // AWS SES / Strict SMTP Sender Resolution:
      // 1. Use SMTP_FROM if explicitly defined
      // 2. If SMTP_USER contains '@' (like Gmail/Outlook), use it as sender
      // 3. Fallback to recipientEmail (which is likely the verified identity in the email service)
      const smtpFrom = process.env.SMTP_FROM;
      const senderEmail = smtpFrom || (smtpUser.includes("@") ? smtpUser : recipientEmail);

      // Send the actual email
      await transporter.sendMail({
        from: `"Rocking Kids Academy" <${senderEmail}>`, // Send from the verified email identity
        replyTo: email, // Direct replies to the parent's actual email address
        to: recipientEmail,
        cc: "venky1302@gmail.com",
        subject: emailSubject,
        html: emailHtml,
      });

      res.status(200).json({ 
        success: true, 
        message: "Your enquiry has been sent successfully to the academy!" 
      });
    } else {
      // Graceful fallback for local development or unconfigured environment
      console.warn("SMTP credentials not configured. Skipping live email dispatch.");
      res.status(200).json({ 
        success: true, 
        warning: "SMTP credentials not configured in environment variables. Your enquiry was processed and printed to the server console.",
        previewData: { parentName, mobileNumber, email, message }
      });
    }
  } catch (error: any) {
    console.error("Enquiry Email Delivery Error Details:", {
      error: error.message || error,
      code: error.code,
      command: error.command,
      response: error.response,
      smtpHost: process.env.SMTP_HOST,
      recipientEmail: process.env.ENQUIRY_RECIPIENT_EMAIL || "meenakshidevarajan@gmail.com",
      smtpFrom: process.env.SMTP_FROM,
      resolvedSender: process.env.SMTP_FROM || (process.env.SMTP_USER && process.env.SMTP_USER.includes("@") ? process.env.SMTP_USER : (process.env.ENQUIRY_RECIPIENT_EMAIL || "meenakshidevarajan@gmail.com"))
    });
    res.status(200).json({ 
      success: true,
      warning: `Enquiry was received by the server, but email delivery failed: "${error.message || error}"`,
      previewData: req.body
    });
  }
});

// Setup Vite Dev Server / Static Assets handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    // Handle Vite's middlewares first (resolves all internal hot-reloads, client assets, and modules)
    app.use(vite.middlewares);

    // Custom router to inject dynamic SEO meta tags in development
    app.get("*", async (req, res, next) => {
      // Skip API and files that might have slipped through
      if (req.path.startsWith("/api/") || req.path.includes(".")) {
        return next();
      }
      try {
        const rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        const injected = injectSeo(rawHtml, loadSeoData(), req.path);
        const transformed = await vite.transformIndexHtml(req.url, injected);
        res.status(200).set({ "Content-Type": "text/html" }).end(transformed);
      } catch (e) {
        console.error("Vite index.html inject error:", e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files (but bypass index.html so we can inject dynamic SEO tags)
    app.use(express.static(distPath, { index: false }));
    
    // For React/Vite SPAs - inject dynamic SEO meta tags in production
    app.get("*", (req, res) => {
      try {
        const rawHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
        const injected = injectSeo(rawHtml, loadSeoData(), req.path);
        res.status(200).set({ "Content-Type": "text/html" }).end(injected);
      } catch (e) {
        console.error("Failed to inject SEO tags in production, sending raw index.html:", e);
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
