import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

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
    const recipientEmail = process.env.ENQUIRY_RECIPIENT_EMAIL || "jayvenkatesanmeenakshi@gmail.com";

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
    console.error("Error processing enquiry:", error);
    res.status(200).json({ 
      success: true,
      warning: `Enquiry was received by the server, but email delivery failed due to SMTP error: "${error.message || error}". Please configure valid SMTP keys in your environment variables to receive live emails.`,
      previewData: req.body
    });
  }
});

// Setup Vite Dev Server / Static Assets handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For React/Vite SPAs
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
