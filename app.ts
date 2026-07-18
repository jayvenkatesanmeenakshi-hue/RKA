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
  saveDbSeoData,
  getHiddenReviewIds,
  hideReviewId,
  unhideReviewId,
  saveGoogleReviews,
  getStoredGoogleReviews,
  toggleReviewVisibility,
  deleteStoredReview,
  saveManualReview,
  incrementReviewLikes,
  DEFAULT_5STAR_REVIEWS,
  saveNewsletterSubscriber,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber
} from "./db.js";

// Load environment variables
dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());

// Serve static assets from public, public/assets, src/assets with explicit CORS headers
const staticOptions = {
  maxAge: "1d",
  setHeaders: (res: express.Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
};

app.use("/assets", express.static(path.join(process.cwd(), "public", "assets"), staticOptions));
app.use("/assets", express.static(path.join(process.cwd(), "src", "assets"), staticOptions));
app.use("/assets/images", express.static(path.join(process.cwd(), "public", "assets", "images"), staticOptions));
app.use("/assets/images", express.static(path.join(process.cwd(), "src", "assets", "images"), staticOptions));
app.use("/src/assets", express.static(path.join(process.cwd(), "src", "assets"), staticOptions));
app.use("/src/assets", express.static(path.join(process.cwd(), "public", "assets"), staticOptions));
app.use("/src/assets/images", express.static(path.join(process.cwd(), "src", "assets", "images"), staticOptions));
app.use("/src/assets/images", express.static(path.join(process.cwd(), "public", "assets", "images"), staticOptions));
app.use("/public", express.static(path.join(process.cwd(), "public"), staticOptions));

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

// Helper to build default JSON-LD Schema.org graph
export function getDefaultJsonLd(seo: any) {
  const domain = (seo?.canonical || "https://rockingkidsacademy.in").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness", "ChildCare"],
        "@id": `${domain}/#organization`,
        "name": "Rocking Kids Academy",
        "alternateName": "Rocking Kids Academy Phonics and Abacus Center",
        "description": seo?.description || "Premier child skill development and learning center in Mambakkam, Chennai, specializing in Abacus, Phonics, English, and Handwriting mastery.",
        "url": domain,
        "logo": `${domain}/assets/images/logo-icon.png`,
        "image": `${domain}/assets/images/logo-icon.png`,
        "telephone": "+91-9840000000",
        "email": "meenakshidevarajan@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "312/2, Ponmar Main Road",
          "addressLocality": "Mambakkam, Chennai",
          "addressRegion": "Tamil Nadu",
          "postalCode": "600127",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.8450,
          "longitude": 80.1700
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "19:00"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "183",
          "bestRating": "5",
          "worstRating": "1"
        },
        "priceRange": "₹₹",
        "sameAs": [
          "https://share.google/v4RsF6b9XjAwE9uFs"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        "url": domain,
        "name": "Rocking Kids Academy",
        "description": seo?.description || "Premier Learning Center for Abacus, Phonics, English & Handwriting",
        "publisher": {
          "@id": `${domain}/#organization`
        }
      },
      {
        "@type": "Course",
        "@id": `${domain}/program/Abacus#course`,
        "name": "Abacus & Mental Math Computation (Brainobrain Certified)",
        "description": "Boosts brain development, visual memory, concentration, and lightning-fast mental math computations. Certified Brainobrain curriculum.",
        "provider": {
          "@id": `${domain}/#organization`
        },
        "educationalCredentialAwarded": "Brainobrain Certified Abacus Level Certificate"
      },
      {
        "@type": "Course",
        "@id": `${domain}/program/Phonics#course`,
        "name": "Structured Synthetic Phonics & Early Reading Fluency",
        "description": "Synthetic phonics training focusing on letter sounds, blending, segmenting, and early reading fluency for children aged 4 to 8.",
        "provider": {
          "@id": `${domain}/#organization`
        }
      },
      {
        "@type": "Course",
        "@id": `${domain}/program/English#course`,
        "name": "English Speaking, Creative Writing & Public Speaking",
        "description": "Elevates grammar, descriptive vocabulary, creative writing, reading comprehension, and public speaking confidence for children aged 6 to 14.",
        "provider": {
          "@id": `${domain}/#organization`
        }
      },
      {
        "@type": "Course",
        "@id": `${domain}/program/Handwriting#course`,
        "name": "Scientific Cursive & Print Handwriting Improvement",
        "description": "Scientific correction of pencil grip, posture, letter formation, spacing, sizing, and writing speed.",
        "provider": {
          "@id": `${domain}/#organization`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${domain}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What age group is suitable for programs at Rocking Kids Academy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer structured courses in Abacus, Phonics, English, and Handwriting for children aged 4 to 14 years."
            }
          },
          {
            "@type": "Question",
            "name": "What is the Abacus affiliation at Rocking Kids Academy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our Abacus program is affiliated with Brainobrain, offering certified multi-level mental arithmetic and neuro-linguistic training."
            }
          },
          {
            "@type": "Question",
            "name": "Where is Rocking Kids Academy located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rocking Kids Academy is located at 312/2, Ponmar Main Road, Mambakkam, Chennai, Tamil Nadu 600127 (serving Mambakkam, Ponmar, and Medavakkam regions)."
            }
          }
        ]
      }
    ]
  };
}

// Helper to build default llms.txt content
export function getDefaultLlmsTxt(seo: any) {
  const domain = (seo?.canonical || "https://rockingkidsacademy.in").replace(/\/$/, "");
  return `# Rocking Kids Academy

Rocking Kids Academy is a premier child skill development and learning center based in Mambakkam, Chennai, India. We specialize in expert-led, scientifically structured courses designed for children aged 4 to 14. Our programs build cognitive abilities, literacy, communication skills, and motor coordination.

## Core Programs

- **Abacus (Brainobrain Affiliation)**: Boosts brain development, improves visual memory, concentration, and enables lightning-fast mental arithmetic computations. Certified Brainobrain curriculum.
- **Structured Phonics**: Synthetic phonics course focusing on letter sounds, blending, segmenting, and early reading fluency for children aged 4 to 8.
- **English Speaking & Communication**: Elevates grammar, descriptive vocabulary, creative writing, comprehension, and public speaking confidence for children aged 6 to 14.
- **Handwriting & Cursive Improvement**: Scientific correction of pencil grip, posture, letter formation, spacing, sizing, and writing speed.

## Navigation & Site Map

- **Home page (\`/\`)**: Main landing page with a program overview, key philosophy, parents' testimonials, and the direct contact enquiry form.
- **Curriculum Details (\`/#curriculum\`)**: Information on our pedagogical approach and age-specific child developments.
- **Contact Enquiry Form (\`/api/enquiry\`)**: POST endpoint to submit student/parent enquiries (parentName, mobileNumber, email, message).
- **Abacus Program (\`/program/Abacus\`)**: Detailed description of the abacus brainobrain training.
- **Phonics Program (\`/program/Phonics\`)**: Detailed description of the reading and phonics training.
- **English Program (\`/program/English\`)**: Detailed description of our speech, vocabulary, and grammar program.
- **Handwriting Program (\`/program/Handwriting\`)**: Detailed description of cursive writing and posture correction.
- **Learning Hub / Blog (\`/blog\`)**: Articles on cognitive growth, parenting guides, motor skills development, and literacy.
  - **Abacus benefits article (\`/blog/power-of-abacus-mental-math-brain-development\`)**: Science behind abacus and mental math.
  - **Phonics article (\`/blog/phonics-vs-whole-language-why-essential-reading-success\`)**: Synthetic phonics vs whole language method.
  - **Handwriting article (\`/blog/effective-ways-improve-child-handwriting-motor-skills\`)**: 5 ways to correct pencil grip and hand-eye coordination.

## Contact & Location

- **Address**: Mambakkam Main Road, Mambakkam, Chennai (near Mandaveli / Mambakkam region).
- **Inquiries**: For admissions or trial classes, parents can use the interactive contact form on the home page or email meenakshidevarajan@gmail.com / cc venky1302@gmail.com.
`;
}

// Helper to build default robots.txt content
export function getDefaultRobotsTxt(seo: any) {
  const domain = (seo?.canonical || "https://rockingkidsacademy.in").replace(/\/$/, "");
  return `# Robots.txt for Rocking Kids Academy
# https://rockingkidsacademy.in/robots.txt

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Explicitly Allow Major AI Search & Agent Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# XML Sitemap & AI LLMs Knowledge Base
Sitemap: ${domain}/sitemap.xml
# LLM Overview: ${domain}/llms.txt
`;
}

// Middleware for sitemap, llms.txt, json-ld.json, and robots.txt
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

  if (
    url.includes("robots.txt") ||
    originalUrl.includes("robots.txt") ||
    forwardedUrl.includes("robots.txt") ||
    matchedPath.includes("robots.txt")
  ) {
    return serveRobotsTxt(req, res);
  }

  if (
    url.includes("llms.txt") ||
    originalUrl.includes("llms.txt") ||
    forwardedUrl.includes("llms.txt") ||
    matchedPath.includes("llms.txt")
  ) {
    return serveLlmsTxt(req, res);
  }

  if (
    url.includes("json-ld.json") ||
    originalUrl.includes("json-ld.json") ||
    forwardedUrl.includes("json-ld.json") ||
    matchedPath.includes("json-ld.json")
  ) {
    return serveJsonLd(req, res);
  }

  next();
});

// SEO JSON File Path
const LOCAL_SEO_FILE = path.join(process.cwd(), "seo.json");
const TMP_SEO_FILE = path.join("/tmp", "seo.json");

// Helper to load SEO data safely (DB first, file fallback)
export async function loadSeoData() {
  let seoData: any = null;

  try {
    const dbData = await getDbSeoData();
    if (dbData) seoData = dbData;
  } catch (err) {
    console.error("Error reading SEO from DB, fallback to file:", err);
  }

  if (!seoData) {
    try {
      if (fs.existsSync(TMP_SEO_FILE)) {
        seoData = JSON.parse(fs.readFileSync(TMP_SEO_FILE, "utf-8"));
      } else if (fs.existsSync(LOCAL_SEO_FILE)) {
        seoData = JSON.parse(fs.readFileSync(LOCAL_SEO_FILE, "utf-8"));
      }
    } catch (err) {
      console.error("Error reading seo.json, using defaults:", err);
    }
  }

  if (!seoData) {
    seoData = {
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

  if (!seoData.jsonLd) {
    seoData.jsonLd = getDefaultJsonLd(seoData);
  }

  if (!seoData.llmsTxt) {
    seoData.llmsTxt = getDefaultLlmsTxt(seoData);
  }

  if (!seoData.robotsTxt) {
    seoData.robotsTxt = getDefaultRobotsTxt(seoData);
  }

  return seoData;
}

// Helper to serve robots.txt dynamically
export async function serveRobotsTxt(req: express.Request, res: express.Response) {
  const seo = await loadSeoData();
  const content = seo.robotsTxt || getDefaultRobotsTxt(seo);
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(content);
}

// Helper to serve llms.txt dynamically
export async function serveLlmsTxt(req: express.Request, res: express.Response) {
  const seo = await loadSeoData();
  const content = seo.llmsTxt || getDefaultLlmsTxt(seo);
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(content);
}

// Helper to serve json-ld.json dynamically
export async function serveJsonLd(req: express.Request, res: express.Response) {
  const seo = await loadSeoData();
  const jsonLd = seo.jsonLd || getDefaultJsonLd(seo);
  res.header("Content-Type", "application/ld+json; charset=utf-8");
  res.status(200).send(JSON.stringify(jsonLd, null, 2));
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
  const domain = (baseSeo.canonical || "https://rockingkidsacademy.in").replace(/\/$/, "");
  
  if (reqPath === '/blog') {
    const blogHubImage = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200";
    let publishedBlogs: any[] = [];
    try {
      const blogPosts = await getBlogPosts();
      publishedBlogs = (blogPosts || []).filter((b: any) => b.published !== false);
    } catch (e) {
      console.error("Error fetching blogs for blog hub schema:", e);
    }

    const blogJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${domain}/blog#webpage`,
          "url": `${domain}/blog`,
          "name": "Learning Resource Hub & Blog | Rocking Kids Academy Chennai",
          "isPartOf": {
            "@id": `${domain}/#website`
          },
          "breadcrumb": {
            "@id": `${domain}/blog#breadcrumb`
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${domain}/blog#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": domain
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": `${domain}/blog`
            }
          ]
        },
        {
          "@type": "Blog",
          "@id": `${domain}/blog#publication`,
          "name": "Rocking Kids Academy Blog",
          "description": "Discover research-backed parenting tips, child cognitive development guides, phonics reading keys, and handwriting improvement techniques.",
          "publisher": {
            "@type": "Organization",
            "name": "Rocking Kids Academy",
            "logo": {
              "@type": "ImageObject",
              "url": "https://rockingkidsacademy.in/assets/images/logo_icon_1782800321150.jpg"
            }
          },
          "blogPost": publishedBlogs.slice(0, 15).map((b: any) => {
            let cover = b.coverImage || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200";
            if (cover.startsWith('/')) {
              cover = `${domain}${cover}`;
            }
            let pubDate = b.createdAt || b.date || new Date().toISOString();
            return {
              "@type": "BlogPosting",
              "headline": b.title,
              "description": b.excerpt,
              "image": cover,
              "datePublished": pubDate,
              "dateModified": pubDate,
              "author": {
                "@type": "Person",
                "name": b.author === 'Founder' ? "Meenakshi D. Venkatesan" : (b.author || "Academic Counselor")
              },
              "url": `${domain}/blog/${b.slug}`
            };
          })
        }
      ]
    };

    return {
      ...baseSeo,
      title: "Learning Resource Hub & Blog | Rocking Kids Academy Chennai",
      description: "Discover research-backed parenting tips, child cognitive development guides, phonics reading keys, and handwriting improvement techniques.",
      canonical: `${domain}/blog`,
      ogType: "website",
      ogSiteName: "Rocking Kids Academy",
      ogTitle: "Learning Resource Hub & Blog | Rocking Kids Academy Chennai",
      ogDescription: "Discover research-backed parenting tips, child cognitive development guides, phonics reading keys, and handwriting improvement techniques.",
      ogImage: blogHubImage,
      ogImageSecure: blogHubImage,
      twitterTitle: "Learning Resource Hub & Blog | Rocking Kids Academy Chennai",
      twitterDescription: "Discover research-backed parenting tips, child cognitive development guides, phonics reading keys, and handwriting improvement techniques.",
      twitterImage: blogHubImage,
      jsonLd: blogJsonLd
    };
  }

  if (reqPath === '/founder') {
    const founderImage = "https://s3.ap-south-1.amazonaws.com/medias.prithureader.com/rk-websites/dot-in/website/rk-founder.png";
    const title = "Meenakshi D. Venkatesan | Founder & Director | Rocking Kids Academy";
    const description = "Meet Meenakshi D. Venkatesan, Founder & Director of Rocking Kids Academy, early literacy specialist and creator of the PrithuReader Early Literacy Programme.";
    
    const founderJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AboutPage",
          "@id": `${domain}/founder#webpage`,
          "url": `${domain}/founder`,
          "name": title,
          "description": description,
          "isPartOf": {
            "@id": `${domain}/#website`
          },
          "breadcrumb": {
            "@id": `${domain}/founder#breadcrumb`
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${domain}/founder#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": domain
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Founder",
              "item": `${domain}/founder`
            }
          ]
        },
        {
          "@type": "Person",
          "@id": `${domain}/founder#person`,
          "name": "Meenakshi D. Venkatesan",
          "jobTitle": "Founder & Director",
          "worksFor": {
            "@type": "EducationalOrganization",
            "name": "Rocking Kids Academy"
          },
          "image": founderImage,
          "description": "Founder and Director of Rocking Kids Academy, early literacy specialist, and creator of the PrithuReader Early Literacy Programme."
        }
      ]
    };

    return {
      ...baseSeo,
      title,
      description,
      canonical: `${domain}/founder`,
      ogType: "profile",
      ogSiteName: "Rocking Kids Academy",
      ogTitle: title,
      ogDescription: description,
      ogImage: founderImage,
      ogImageSecure: founderImage,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: founderImage,
      jsonLd: founderJsonLd
    };
  }
  
  if (reqPath.startsWith('/program/')) {
    const prog = reqPath.replace('/program/', '').split('?')[0].split('#')[0];
    let title = "";
    let description = "";
    let coverImage = "";
    
    if (prog === 'Abacus') {
      title = "Abacus & Brainobrain Affiliation Class | Rocking Kids Academy";
      description = "Master lightning-fast mental arithmetic computations and boost brain development with our certified Brainobrain abacus program at Mambakkam, Chennai. Book a trial.";
      coverImage = "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200";
    } else if (prog === 'Phonics') {
      title = "Structured Phonics Mastery Course | Rocking Kids Academy";
      description = "Synthetic phonics class for early reading fluency, letter sounds, and spelling mastery. Ideal for children aged 4 to 8 at our Chennai center.";
      coverImage = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200";
    } else if (prog === 'English') {
      title = "English Speaking & Communication Course | Rocking Kids Academy";
      description = "Elevate grammar, descriptive vocabulary, creative writing, and public speaking confidence for children ages 6 to 14. Located in Mambakkam, Chennai.";
      coverImage = "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200";
    } else if (prog === 'Handwriting') {
      title = "Handwriting & Cursive Improvement Course | Rocking Kids Academy";
      description = "Scientific handwriting improvement class correcting physical pencil grip, posture, letter sizing, and writing speed. Chennai Mambakkam Main Road center.";
      coverImage = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200";
    } else {
      return {
        ...baseSeo,
        canonical: `${domain}${reqPath}`
      };
    }

    let courseDetails: any = null;
    if (prog === 'Abacus') {
      courseDetails = {
        "@type": "Course",
        "@id": `${domain}/program/Abacus#course`,
        "name": "Abacus & Mental Math Computation (Brainobrain Certified)",
        "description": "Boosts brain development, visual memory, concentration, and lightning-fast mental math computations. Certified Brainobrain curriculum.",
        "provider": {
          "@type": "Organization",
          "name": "Rocking Kids Academy"
        },
        "educationalCredentialAwarded": "Brainobrain Certified Abacus Level Certificate"
      };
    } else if (prog === 'Phonics') {
      courseDetails = {
        "@type": "Course",
        "@id": `${domain}/program/Phonics#course`,
        "name": "Structured Synthetic Phonics & Early Reading Fluency",
        "description": "Synthetic phonics training focusing on letter sounds, blending, segmenting, and early reading fluency for children aged 4 to 8.",
        "provider": {
          "@type": "Organization",
          "name": "Rocking Kids Academy"
        }
      };
    } else if (prog === 'English') {
      courseDetails = {
        "@type": "Course",
        "@id": `${domain}/program/English#course`,
        "name": "English Speaking, Creative Writing & Public Speaking",
        "description": "Elevates grammar, descriptive vocabulary, creative writing, reading comprehension, and public speaking confidence for children aged 6 to 14.",
        "provider": {
          "@type": "Organization",
          "name": "Rocking Kids Academy"
        }
      };
    } else if (prog === 'Handwriting') {
      courseDetails = {
        "@type": "Course",
        "@id": `${domain}/program/Handwriting#course`,
        "name": "Scientific Cursive & Print Handwriting Improvement",
        "description": "Scientific correction of pencil grip, posture, letter formation, spacing, sizing, and writing speed.",
        "provider": {
          "@type": "Organization",
          "name": "Rocking Kids Academy"
        }
      };
    }

    const programJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${domain}/program/${prog}#webpage`,
          "url": `${domain}/program/${prog}`,
          "name": title,
          "description": description,
          "isPartOf": {
            "@id": `${domain}/#website`
          },
          "breadcrumb": {
            "@id": `${domain}/program/${prog}#breadcrumb`
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${domain}/program/${prog}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": domain
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": prog,
              "item": `${domain}/program/${prog}`
            }
          ]
        }
      ]
    };

    if (courseDetails) {
      programJsonLd["@graph"].push(courseDetails);
    }
    
    return {
      ...baseSeo,
      title,
      description,
      canonical: `${domain}${reqPath}`,
      ogType: "website",
      ogSiteName: "Rocking Kids Academy",
      ogTitle: title,
      ogDescription: description,
      ogImage: coverImage,
      ogImageSecure: coverImage,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: coverImage,
      jsonLd: programJsonLd
    };
  }
  
  if (reqPath.startsWith('/blog/')) {
    const slug = reqPath.replace('/blog/', '').split('?')[0].split('#')[0];
    console.log(`[DEBUG SEO] req.path: "${reqPath}"`);
    console.log(`[DEBUG SEO] slug: "${slug}"`);
    try {
      const blog = await getBlogPostBySlug(slug);
      console.log(`[DEBUG SEO] whether getBlogPostBySlug() returned a record: ${!!blog}`);
      if (blog) {
        console.log(`[DEBUG SEO] blog.coverImage: "${blog.coverImage}"`);
        let cover = blog.coverImage;
        const defaultArticleImage = "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200";
        
        if (!cover || cover.trim() === '') {
          cover = defaultArticleImage;
        } else if (cover.startsWith('/')) {
          cover = `${domain}${cover}`;
        }

        const fullTitle = blog.metaTitle && blog.metaTitle.trim() !== '' ? blog.metaTitle : `${blog.title} | Rocking Kids Academy`;
        const excerpt = blog.metaDescription && blog.metaDescription.trim() !== '' ? blog.metaDescription : (blog.excerpt || "Read this article on Rocking Kids Academy learning blog.");

        let isoDate = new Date().toISOString();
        if (blog.createdAt) {
          try {
            isoDate = new Date(blog.createdAt).toISOString();
          } catch (e) {}
        } else if (blog.date) {
          try {
            isoDate = new Date(blog.date).toISOString();
          } catch (e) {}
        }

        const blogJsonLd = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${domain}/blog/${blog.slug}#entry`,
              "isPartOf": {
                "@id": `${domain}/blog/${blog.slug}#webpage`
              },
              "headline": blog.title,
              "image": [cover],
              "datePublished": isoDate,
              "dateModified": isoDate,
              "author": {
                "@type": "Person",
                "name": blog.author === 'Founder' ? "Meenakshi D. Venkatesan" : (blog.author || "Academic Counselor")
              },
              "publisher": {
                "@type": "Organization",
                "name": "Rocking Kids Academy",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://rockingkidsacademy.in/assets/images/logo_icon_1782800321150.jpg"
                }
              },
              "description": excerpt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${domain}/blog/${blog.slug}`
              }
            },
            {
              "@type": "WebPage",
              "@id": `${domain}/blog/${blog.slug}#webpage`,
              "url": `${domain}/blog/${blog.slug}`,
              "name": fullTitle,
              "description": excerpt,
              "isPartOf": {
                "@id": `${domain}/#website`
              },
              "breadcrumb": {
                "@id": `${domain}/blog/${blog.slug}#breadcrumb`
              }
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${domain}/blog/${blog.slug}#breadcrumb`,
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": domain
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": `${domain}/blog`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": blog.title,
                  "item": `${domain}/blog/${blog.slug}`
                }
              ]
            }
          ]
        };

        return {
          ...baseSeo,
          title: fullTitle,
          description: excerpt,
          canonical: `${domain}${reqPath}`,
          ogType: 'article',
          ogSiteName: 'Rocking Kids Academy',
          ogTitle: fullTitle,
          ogDescription: excerpt,
          ogImage: cover,
          ogImageSecure: cover,
          twitterCard: 'summary_large_image',
          twitterTitle: fullTitle,
          twitterDescription: excerpt,
          twitterImage: cover,
          jsonLd: blogJsonLd
        };
      }
    } catch (e) {
      console.error("Error generating override SEO for blog:", e);
    }
  }

  const cleanPath = reqPath === '/' ? '' : reqPath;
  return {
    ...baseSeo,
    canonical: `${domain}${cleanPath}`
  };
}

// Dynamic SEO Injection function
export async function injectSeo(htmlStr: string, baseSeo: any, reqPath?: string): Promise<string> {
  const seo = reqPath ? await getOverrideSeo(reqPath, baseSeo) : baseSeo;

  console.log(`[DEBUG SEO] seo.ogImage before injectSeo(): "${seo.ogImage}"`);

  const canonicalUrl = seo.canonical || "https://rockingkidsacademy.in";
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  const ogType = seo.ogType || 'website';
  const ogSiteName = seo.ogSiteName || 'Rocking Kids Academy';
  const ogImage = seo.ogImage || 'https://rockingkidsacademy.in/assets/images/logo_icon_1782800321150.jpg';
  const ogImageSecure = seo.ogImageSecure || ogImage;

  htmlStr = htmlStr.replace(/<title>[^<]*<\/title>/i, `<title>${seo.title}</title>`);
  htmlStr = htmlStr.replace(/<meta[^>]*?name="description"[^>]*?content="[^"]*"[^>]*?>/i, `<meta name="description" content="${seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?name="description"[^>]*?>/i, `<meta name="description" content="${seo.description}" />`);
  if (seo.keywords) {
    htmlStr = htmlStr.replace(/<meta[^>]*?name="keywords"[^>]*?content="[^"]*"[^>]*?>/i, `<meta name="keywords" content="${seo.keywords}" />`);
    htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?name="keywords"[^>]*?>/i, `<meta name="keywords" content="${seo.keywords}" />`);
  }

  // Canonical tag replacement
  if (htmlStr.includes('rel="canonical"') || htmlStr.includes("rel='canonical'")) {
    htmlStr = htmlStr.replace(/<link[^>]*?rel=["']canonical["'][^>]*?>/i, canonicalTag);
    htmlStr = htmlStr.replace(/<link[^>]*?href="[^"]*"[^>]*?rel=["']canonical["'][^>]*?>/i, canonicalTag);
  } else {
    htmlStr = htmlStr.replace(/<\/head>/i, `  ${canonicalTag}\n</head>`);
  }

  // Open Graph Type
  if (htmlStr.includes('property="og:type"')) {
    htmlStr = htmlStr.replace(/<meta[^>]*?property="og:type"[^>]*?>/i, `<meta property="og:type" content="${ogType}" />`);
  } else {
    htmlStr = htmlStr.replace(/<\/head>/i, `  <meta property="og:type" content="${ogType}" />\n</head>`);
  }

  // Open Graph Site Name
  if (htmlStr.includes('property="og:site_name"')) {
    htmlStr = htmlStr.replace(/<meta[^>]*?property="og:site_name"[^>]*?>/i, `<meta property="og:site_name" content="${ogSiteName}" />`);
  } else {
    htmlStr = htmlStr.replace(/<\/head>/i, `  <meta property="og:site_name" content="${ogSiteName}" />\n</head>`);
  }

  // Open Graph Title
  htmlStr = htmlStr.replace(/<meta[^>]*?property=["']og:title["'][^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:title" content="${seo.ogTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property=["']og:title["'][^>]*?>/i, `<meta property="og:title" content="${seo.ogTitle || seo.title}" />`);

  // Open Graph Description
  htmlStr = htmlStr.replace(/<meta[^>]*?property=["']og:description["'][^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:description" content="${seo.ogDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property=["']og:description["'][^>]*?>/i, `<meta property="og:description" content="${seo.ogDescription || seo.description}" />`);

  // Open Graph Image
  htmlStr = htmlStr.replace(/<meta[^>]*?property=["']og:image["'][^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:image" content="${ogImage}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property=["']og:image["'][^>]*?>/i, `<meta property="og:image" content="${ogImage}" />`);

  // Open Graph Image Secure URL
  if (htmlStr.includes('property="og:image:secure_url"') || htmlStr.includes("property='og:image:secure_url'")) {
    htmlStr = htmlStr.replace(/<meta[^>]*?property=["']og:image:secure_url["'][^>]*?content="[^"]*"[^>]*?>/i, `<meta property="og:image:secure_url" content="${ogImageSecure}" />`);
    htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?property=["']og:image:secure_url["'][^>]*?>/i, `<meta property="og:image:secure_url" content="${ogImageSecure}" />`);
  } else {
    htmlStr = htmlStr.replace(/<\/head>/i, `  <meta property="og:image:secure_url" content="${ogImageSecure}" />\n</head>`);
  }

  // Open Graph Image Dimensions
  if (!htmlStr.includes('property="og:image:width"') && !htmlStr.includes("property='og:image:width'")) {
    htmlStr = htmlStr.replace(/<\/head>/i, `  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n</head>`);
  }

  // Twitter Tags
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)=["']twitter:title["'][^>]*?content="[^"]*"[^>]*?>/i, `<meta name="twitter:title" content="${seo.twitterTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)=["']twitter:title["'][^>]*?>/i, `<meta name="twitter:title" content="${seo.twitterTitle || seo.title}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)=["']twitter:description["'][^>]*?content="[^"]*"[^>]*?>/i, `<meta name="twitter:description" content="${seo.twitterDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)=["']twitter:description["'][^>]*?>/i, `<meta name="twitter:description" content="${seo.twitterDescription || seo.description}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)=["']twitter:image["'][^>]*?content="[^"]*"[^>]*?>/i, `<meta name="twitter:image" content="${ogImage}" />`);
  htmlStr = htmlStr.replace(/<meta[^>]*?content="[^"]*"[^>]*?(?:name|property)=["']twitter:image["'][^>]*?>/i, `<meta name="twitter:image" content="${ogImage}" />`);

  // Twitter Card Type
  if (htmlStr.includes('name="twitter:card"') || htmlStr.includes('property="twitter:card"')) {
    htmlStr = htmlStr.replace(/<meta[^>]*?(?:name|property)="twitter:card"[^>]*?>/i, `<meta name="twitter:card" content="summary_large_image" />`);
  } else {
    htmlStr = htmlStr.replace(/<\/head>/i, `  <meta name="twitter:card" content="summary_large_image" />\n</head>`);
  }
  
  // Inject JSON-LD Schema.org script into <head>
  const jsonLdObj = seo.jsonLd || getDefaultJsonLd(seo);
  const jsonLdScript = `<script type="application/ld+json" id="json-ld-schema">\n${JSON.stringify(jsonLdObj, null, 2)}\n</script>`;

  if (htmlStr.includes('id="json-ld-schema"') || htmlStr.includes('type="application/ld+json"')) {
    htmlStr = htmlStr.replace(/<script[^>]*?type="application\/ld\+json"[^>]*?>[\s\S]*?<\/script>/i, jsonLdScript);
  } else {
    htmlStr = htmlStr.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);
  }

  const ogImageMetaTag = htmlStr.match(/<meta[^>]*?property="og:image"[^>]*?>/i)?.[0];
  console.log(`[DEBUG SEO] final HTML og:image tag after injectSeo(): ${ogImageMetaTag}`);

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
    // Filter out unpublished (draft) posts for the public view
    const publishedBlogs = blogs.filter(b => b.published !== false);
    res.json(publishedBlogs);
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

apiRouter.get("/admin/blogs", checkAdminAuth, async (req, res) => {
  try {
    const blogs = await getBlogPosts();
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch blog posts for admin" });
  }
});

apiRouter.post("/admin/blogs", checkAdminAuth, async (req, res) => {
  try {
    const { slug, title, excerpt, content, category, tags, coverImage, readTime, author, date, isFeatured, isFocus, published, metaTitle, metaDescription, seriesName, seriesOrder } = req.body;
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
      isFocus: !!isFocus,
      published: published !== false,
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      seriesName: seriesName || "",
      seriesOrder: seriesOrder !== undefined ? Number(seriesOrder) : 0
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
  const { 
    title, 
    description, 
    keywords, 
    canonical, 
    ogTitle, 
    ogDescription, 
    ogImage, 
    twitterTitle, 
    twitterDescription, 
    twitterImage, 
    sitemapUrls,
    jsonLd,
    llmsTxt,
    robotsTxt 
  } = req.body;
  
  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required fields" });
    return;
  }

  const existingSeo = await loadSeoData();
  
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
    sitemapUrls: sitemapUrls || existingSeo.sitemapUrls || [],
    jsonLd: jsonLd || existingSeo.jsonLd || getDefaultJsonLd(existingSeo),
    llmsTxt: llmsTxt || existingSeo.llmsTxt || getDefaultLlmsTxt(existingSeo),
    robotsTxt: robotsTxt || existingSeo.robotsTxt || getDefaultRobotsTxt(existingSeo)
  };
  
  await saveSeoData(newSeo);
  res.json({ success: true, message: "SEO, JSON-LD, llms.txt & robots.txt configuration updated successfully in Neon Postgres!", data: newSeo });
});

// --- ADMIN AUTO-GENERATE JSON-LD, LLMS.TXT & ROBOTS.TXT ENDPOINTS ---
apiRouter.post("/admin/seo/generate-jsonld", checkAdminAuth, async (req, res) => {
  try {
    const seo = await loadSeoData();
    const freshJsonLd = getDefaultJsonLd(seo);
    
    seo.jsonLd = freshJsonLd;
    await saveSeoData(seo);
    res.json({ success: true, message: "Successfully re-generated JSON-LD Schema from database!", jsonLd: freshJsonLd });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate JSON-LD" });
  }
});

apiRouter.post("/admin/seo/generate-robotstxt", checkAdminAuth, async (req, res) => {
  try {
    const seo = await loadSeoData();
    const freshRobotsTxt = getDefaultRobotsTxt(seo);
    
    seo.robotsTxt = freshRobotsTxt;
    await saveSeoData(seo);
    res.json({ success: true, message: "Successfully re-generated robots.txt from database!", robotsTxt: freshRobotsTxt });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate robots.txt" });
  }
});

apiRouter.post("/admin/seo/generate-llmstxt", checkAdminAuth, async (req, res) => {
  try {
    const seo = await loadSeoData();
    let freshLlmsTxt = getDefaultLlmsTxt(seo);
    
    try {
      const blogs = await getBlogPosts();
      if (blogs && blogs.length > 0) {
        let blogLines = "\n## Published Blog Articles & Parent Resources\n\n";
        blogs.forEach((b: any) => {
          blogLines += `- **${b.title}** (\`/blog/${b.slug}\`): ${b.excerpt}\n`;
        });
        freshLlmsTxt += blogLines;
      }
    } catch (e) {
      console.error("Error fetching blogs for llms.txt generator:", e);
    }

    seo.llmsTxt = freshLlmsTxt;
    await saveSeoData(seo);
    res.json({ success: true, message: "Successfully re-generated llms.txt from database!", llmsTxt: freshLlmsTxt });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate llms.txt" });
  }
});

// --- HIDDEN GOOGLE REVIEWS ENDPOINTS ---
apiRouter.get("/hidden-reviews", async (req, res) => {
  try {
    const hiddenIds = await getHiddenReviewIds();
    res.json({ success: true, hiddenIds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cache for Google Reviews API responses
let reviewsCache: { data: any; timestamp: number } | null = null;

apiRouter.post("/hidden-reviews", async (req, res) => {
  try {
    const { reviewId } = req.body;
    if (!reviewId) {
      res.status(400).json({ success: false, error: "reviewId is required" });
      return;
    }
    await hideReviewId(reviewId);
    reviewsCache = null; // Invalidate cache so hidden review disappears immediately
    const hiddenIds = await getHiddenReviewIds();
    res.json({ success: true, message: "Review hidden successfully", hiddenIds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post("/hidden-reviews/unhide", async (req, res) => {
  try {
    const { reviewId } = req.body;
    if (!reviewId) {
      res.status(400).json({ success: false, error: "reviewId is required" });
      return;
    }
    await unhideReviewId(reviewId);
    reviewsCache = null; // Invalidate cache so unhidden review appears
    const hiddenIds = await getHiddenReviewIds();
    res.json({ success: true, message: "Review restored successfully", hiddenIds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- GOOGLE PLACES API LIVE REVIEWS SYNC & STORE LOGIC ---

async function syncGoogleReviewsFromApi(apiKeyInput?: string, placeIdInput?: string) {
  const apiKey = (apiKeyInput || process.env.GOOGLE_PLACES_API_KEY || "").trim();
  const placeId = (placeIdInput || process.env.GOOGLE_PLACE_ID || "").trim();

  if (!apiKey || !placeId) {
    return {
      success: false,
      count: 0,
      message: "API Key or Place ID not provided in environment or request."
    };
  }

  const errorsLogged: any[] = [];
  let fetchedReviews: any[] = [];
  let metaRating = 4.9;
  let metaUserRatingCount = 183;
  let metaDisplayName = "Rocking Kids Academy (Phonics and Abacus)";

  try {
    // Attempt 1: Try Places API (New) v1 endpoint
    const newApiUrl = `https://places.googleapis.com/v1/places/${placeId}`;
    const newApiRes = await fetch(newApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews"
      }
    });

    const newResText = await newApiRes.text();
    let newResBody: any;
    try { newResBody = JSON.parse(newResText); } catch { newResBody = newResText; }

    if (newApiRes.ok && newResBody) {
      metaRating = newResBody.rating || 4.9;
      metaUserRatingCount = newResBody.userRatingCount || 183;
      metaDisplayName = newResBody.displayName?.text || metaDisplayName;

      fetchedReviews = (newResBody.reviews || []).map((rev: any, index: number) => ({
        id: rev.name || `rev-google-v1-${index}`,
        authorName: rev.authorAttribution?.displayName || "Google User",
        authorPhoto: rev.authorAttribution?.photoUri || "",
        authorLocation: "Verified Google Reviewer",
        rating: rev.rating || 5,
        date: rev.relativePublishTimeDescription || "Recently",
        category: "Google Business Page",
        text: rev.originalText?.text || rev.text?.text || "Great experience at Rocking Kids Academy!",
        avatarColor: "bg-blue-600",
        verified: true,
        likes: Math.floor(Math.random() * 10) + 5,
        source: "google_places_api_v1"
      }));
    } else {
      errorsLogged.push({ endpoint: "Places API (New) v1", status: newApiRes.status, body: newResBody });

      // Attempt 2: Fallback to Places API (Legacy Details) endpoint
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,reviews,user_ratings_total&key=${encodeURIComponent(apiKey)}`;
      const legacyRes = await fetch(legacyUrl);
      const legacyResText = await legacyRes.text();
      let legacyResBody: any;
      try { legacyResBody = JSON.parse(legacyResText); } catch { legacyResBody = legacyResText; }

      if (legacyRes.ok && legacyResBody?.status === "OK" && legacyResBody?.result) {
        const result = legacyResBody.result;
        metaRating = result.rating || 4.9;
        metaUserRatingCount = result.user_ratings_total || 183;
        metaDisplayName = result.name || metaDisplayName;

        fetchedReviews = (result.reviews || []).map((rev: any, index: number) => ({
          id: `rev-legacy-${index}`,
          authorName: rev.author_name || "Google User",
          authorPhoto: rev.profile_photo_url || "",
          authorLocation: "Verified Google Reviewer",
          rating: rev.rating || 5,
          date: rev.relative_time_description || "Recently",
          category: "Google Business Page",
          text: rev.text || "Great experience at Rocking Kids Academy!",
          avatarColor: "bg-emerald-600",
          verified: true,
          likes: Math.floor(Math.random() * 10) + 5,
          source: "google_places_api_legacy"
        }));
      } else {
        errorsLogged.push({ endpoint: "Places API (Legacy) Details", status: legacyRes.status, body: legacyResBody });
      }
    }

    if (fetchedReviews.length > 0) {
      // Store all fetched reviews permanently in database
      const savedCount = await saveGoogleReviews(fetchedReviews);
      console.log(`✅ Stored ${savedCount} Google Reviews in database.`);
      return {
        success: true,
        count: savedCount,
        totalFetched: fetchedReviews.length,
        rating: metaRating,
        userRatingCount: metaUserRatingCount,
        displayName: metaDisplayName,
        reviews: fetchedReviews
      };
    } else {
      return {
        success: false,
        count: 0,
        message: "No reviews returned from Google API.",
        errors: errorsLogged
      };
    }
  } catch (err: any) {
    console.error("Error in syncGoogleReviewsFromApi:", err);
    return {
      success: false,
      count: 0,
      message: err.message || "Network error fetching reviews."
    };
  }
}

// PUBLIC WEBSITE GOOGLE REVIEWS ENDPOINT (SERVES ONLY 5-STAR REVIEWS FROM DATABASE)
apiRouter.get("/google-reviews", async (req, res) => {
  const apiKey = (req.query.apiKey as string) || process.env.GOOGLE_PLACES_API_KEY || "";
  const placeId = (req.query.placeId as string) || process.env.GOOGLE_PLACE_ID || "";
  const forceRefresh = req.query.refresh === "true" || req.query.force === "true";

  // Check current DB reviews
  let storedFiveStarReviews = await getStoredGoogleReviews({ onlyFiveStar: true, includeHidden: false });

  // If forceRefresh is requested OR DB has no 5-star reviews, attempt sync from Google API
  if (forceRefresh || storedFiveStarReviews.length === 0) {
    if (apiKey && placeId) {
      await syncGoogleReviewsFromApi(apiKey, placeId);
      storedFiveStarReviews = await getStoredGoogleReviews({ onlyFiveStar: true, includeHidden: false });
    }
  }

  // Ensure at least 6 reviews by combining with default seed reviews if needed
  let finalReviews = [...storedFiveStarReviews];
  if (finalReviews.length < 6) {
    const existingTexts = new Set(finalReviews.map(r => r.text.trim().toLowerCase()));
    const existingAuthors = new Set(finalReviews.map(r => r.authorName.trim().toLowerCase()));

    for (const seed of DEFAULT_5STAR_REVIEWS) {
      if (finalReviews.length >= 6) break;
      if (!existingTexts.has(seed.text.trim().toLowerCase()) && !existingAuthors.has(seed.authorName.trim().toLowerCase())) {
        finalReviews.push(seed);
      }
    }
  }

  // Limit website display strictly to top 6 reviews from database
  finalReviews = finalReviews.slice(0, 6);

  res.json({
    configured: true,
    rating: 4.9,
    userRatingCount: 183,
    displayName: "Rocking Kids Academy (Phonics and Abacus)",
    reviews: finalReviews,
    totalFiveStar: finalReviews.length,
    source: "database_stored_5star"
  });
});

// PUBLIC: INTERACTIVE HELPFUL LIKES BUTTON
apiRouter.post("/google-reviews/helpful", async (req, res) => {
  try {
    const { reviewId, action } = req.body;
    if (!reviewId) {
      res.status(400).json({ success: false, error: "reviewId is required" });
      return;
    }
    const delta = action === 'unlike' ? -1 : 1;
    const newLikes = await incrementReviewLikes(reviewId, delta);
    res.json({ success: true, likes: newLikes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN PANEL: GET ALL STORED REVIEWS (Includes 5-star, non-5-star, visible, hidden)
apiRouter.get("/admin/reviews", checkAdminAuth, async (req, res) => {
  try {
    const allReviews = await getStoredGoogleReviews({ onlyFiveStar: false, includeHidden: true });
    const hiddenIds = await getHiddenReviewIds();
    res.json({ success: true, reviews: allReviews, hiddenIds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN PANEL: TRIGGER GOOGLE REVIEWS SYNC & STORE IN DATABASE
apiRouter.post("/admin/reviews/sync", checkAdminAuth, async (req, res) => {
  try {
    const apiKey = req.body.apiKey || process.env.GOOGLE_PLACES_API_KEY || "";
    const placeId = req.body.placeId || process.env.GOOGLE_PLACE_ID || "";
    const syncResult = await syncGoogleReviewsFromApi(apiKey, placeId);
    const allReviews = await getStoredGoogleReviews({ onlyFiveStar: false, includeHidden: true });
    res.json({
      success: syncResult.success,
      message: syncResult.message || `Successfully synced ${syncResult.count || 0} reviews into the database`,
      syncResult,
      reviews: allReviews
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN PANEL: TOGGLE REVIEW VISIBILITY (SHOW / HIDE ON WEBSITE)
apiRouter.post("/admin/reviews/toggle-visibility", checkAdminAuth, async (req, res) => {
  try {
    const { reviewId, hidden } = req.body;
    if (!reviewId) {
      res.status(400).json({ success: false, error: "reviewId is required" });
      return;
    }
    await toggleReviewVisibility(reviewId, Boolean(hidden));
    const allReviews = await getStoredGoogleReviews({ onlyFiveStar: false, includeHidden: true });
    res.json({ success: true, message: `Review ${hidden ? 'hidden' : 'published'} successfully`, reviews: allReviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN PANEL: ADD MANUAL GENUINE REVIEW TO DATABASE
apiRouter.post("/admin/reviews/add", checkAdminAuth, async (req, res) => {
  try {
    const { authorName, authorLocation, rating, text, category } = req.body;
    if (!authorName || !text) {
      res.status(400).json({ success: false, error: "authorName and text are required" });
      return;
    }
    await saveManualReview({
      authorName,
      authorLocation: authorLocation || "Verified Parent",
      rating: Number(rating) || 5,
      text,
      category: category || "Parent Review"
    });
    const allReviews = await getStoredGoogleReviews({ onlyFiveStar: false, includeHidden: true });
    res.json({ success: true, message: "Review added to database successfully", reviews: allReviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN PANEL: DELETE A STORED REVIEW FROM DATABASE
apiRouter.delete("/admin/reviews/:id", checkAdminAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    await deleteStoredReview(reviewId);
    const allReviews = await getStoredGoogleReviews({ onlyFiveStar: false, includeHidden: true });
    res.json({ success: true, message: "Review deleted successfully", reviews: allReviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AUTOMATED WEEKLY GOOGLE REVIEWS FETCH SCHEDULER (Runs once per week = 7 days)
const ONE_WEEK_INTERVAL = 7 * 24 * 60 * 60 * 1000;
setInterval(() => {
  console.log("⏰ Running scheduled weekly Google Reviews sync to database...");
  syncGoogleReviewsFromApi().catch(err => {
    console.error("Scheduled Google Reviews sync error:", err);
  });
}, ONE_WEEK_INTERVAL);

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

// --- NEWSLETTER SUBSCRIPTION ENDPOINTS ---
apiRouter.post("/newsletter/subscribe", async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: "Email address is required" });
      return;
    }

    const result = await saveNewsletterSubscriber(email, mobileNumber);
    if (!result.success) {
      res.status(500).json({ success: false, error: result.error || "Failed to subscribe" });
      return;
    }

    // Attempt to send an email notification if SMTP is configured
    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const recipientEmail = process.env.ENQUIRY_RECIPIENT_EMAIL || "meenakshidevarajan@gmail.com";

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
          to: recipientEmail,
          cc: "venky1302@gmail.com",
          subject: `New Newsletter Subscriber! - ${email}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 8px;">
              <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px;">New Subscription Update</h2>
              <p style="font-size: 14px; color: #334155;">A user has subscribed for academy newsletter and updates.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px; font-weight: bold; width: 150px; color: #475569;">Email Address:</td>
                  <td style="padding: 10px; color: #0f172a;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${mobileNumber ? `
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #475569;">Mobile Number:</td>
                  <td style="padding: 10px; color: #0f172a;"><a href="tel:${mobileNumber}">${mobileNumber}</a></td>
                </tr>` : ''}
              </table>
              <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
                Received on ${new Date().toLocaleString()} from Rocking Kids Academy Website.
              </div>
            </div>
          `,
        });
      }
    } catch (mailErr) {
      console.error("Failed to send subscription email notification:", mailErr);
    }

    res.status(200).json({ 
      success: true, 
      alreadySubscribed: result.alreadySubscribed || false,
      message: result.alreadySubscribed 
        ? "You are already subscribed to our updates!" 
        : "Thank you for subscribing to Rocking Kids Academy updates!" 
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ success: false, error: error.message || "An unexpected error occurred" });
  }
});

// Admin endpoints for subscribers
apiRouter.get("/admin/newsletter/subscribers", checkAdminAuth, async (req, res) => {
  try {
    const list = await getNewsletterSubscribers();
    res.status(200).json(list);
  } catch (error: any) {
    console.error("Error fetching newsletter subscribers:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred" });
  }
});

apiRouter.delete("/admin/newsletter/subscribers/:id", checkAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid subscriber ID" });
      return;
    }
    const success = await deleteNewsletterSubscriber(id);
    res.status(200).json({ success });
  } catch (error: any) {
    console.error("Error deleting subscriber:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred" });
  }
});

// Mount API router on /api
app.use("/api", apiRouter);

// HTML Page Rendering with Server-Side Dynamic SEO Injection for Vercel
if (process.env.VERCEL) {
  app.get("*", async (req, res, next) => {
    const targetPath = (req.originalUrl || req.path).split("?")[0].split("#")[0];

    // If this request is explicitly targeting an API endpoint, pass to API 404 handler
    if (targetPath.startsWith("/api/") || targetPath === "/api") {
      return next();
    }

    // If this request is for a static asset with a file extension, skip HTML injection
    if (targetPath.includes(".") && !targetPath.endsWith(".html")) {
      return next();
    }

    try {
      let indexHtmlPath = path.join(process.cwd(), "dist", "index.html");
      if (!fs.existsSync(indexHtmlPath)) {
        indexHtmlPath = path.join(process.cwd(), "index.html");
      }
      const rawHtml = fs.readFileSync(indexHtmlPath, "utf-8");
      const baseSeo = await loadSeoData();
      const injectedHtml = await injectSeo(rawHtml, baseSeo, targetPath);

      res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).send(injectedHtml);
    } catch (err) {
      console.error("Error serving HTML page in app.ts:", err);
      next(err);
    }
  });
}

// Catch-all 404 for unmatched API requests
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});
app.use("/api", (req, res) => {
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
