const express = require('express');
const router = express.Router();

// @desc    Submit contact form and email details to the company
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    const emailTemplateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Submission</title>
        <style>
          body { font-family: 'Outfit', -apple-system, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; }
          .card { background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 24px; }
          .logo { font-size: 22px; font-weight: 900; color: #0e3e26; text-decoration: none; }
          .logo span { color: #f97316; }
          .title { font-size: 18px; font-weight: 800; color: #111827; margin-top: 0; }
          .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .meta-table td { padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
          .meta-table td.label { font-weight: bold; color: #4b5563; width: 120px; }
          .meta-table td.value { color: #111827; }
          .message-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 14px; color: #374151; line-height: 1.6; white-space: pre-wrap; margin-top: 15px; }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="logo">e-<span>Local</span>Kart</div>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #4b5563; font-weight: bold;">New Contact Form Submission</p>
          </div>
          
          <h2 class="title">New Inquiry Details</h2>
          <p style="font-size: 14px; color: #4b5563;">You have received a new customer inquiry from the e-LocalKart portal. Details are listed below:</p>
          
          <table class="meta-table">
            <tr>
              <td class="label">Name:</td>
              <td class="value">${name}</td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td class="value"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td class="label">Phone:</td>
              <td class="value">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td class="label">Subject:</td>
              <td class="value">${subject || 'General inquiry'}</td>
            </tr>
          </table>

          <h3 style="font-size: 14px; font-weight: bold; color: #111827; margin: 25px 0 10px 0;">Message Content:</h3>
          <div class="message-box">${message}</div>
          
          <div class="footer">
            This inquiry was sent automatically from the e-LocalKart server.<br>
            &copy; 2026 e-LocalKart, Ara, Bihar, India
          </div>
        </div>
      </body>
      </html>
    `;

    const resendApiKey = process.env.RESEND_API_KEY || process.env.RESEND_KEY_API;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'iamkhushi245@gmail.com'; 

    if (resendApiKey) {
      console.log('Sending email using Resend API...');
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: `e-LocalKart Inquiry <${fromEmail}>`,
          to: [recipientEmail],
          subject: `e-LocalKart Inquiry: ${subject || 'New Message'} from ${name}`,
          html: emailTemplateHtml
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        console.error('Resend API returned error:', resData);
        if (resData.name === 'validation_error' || response.status === 403) {
          console.warn('------------------------------------------------------------');
          console.warn('RESEND SANDBOX LIMITATION DETECTED:');
          console.warn(resData.message);
          console.warn('Logging email template html to console:');
          console.log(emailTemplateHtml);
          console.warn('------------------------------------------------------------');
          return res.json({
            success: true,
            simulated: true,
            message: `Submission successful! (Simulated: ${resData.message})`
          });
        }
        throw new Error(resData.message || 'Failed to send email via Resend');
      }

      console.log('Resend Email sent successfully. ID:', resData.id);
      return res.json({ success: true, message: 'Email sent successfully via Resend API!' });
    } else {
      console.log('------------------------------------------------------------');
      console.log('RESEND_API_KEY NOT SET IN .ENV. RUNNING IN SIMULATION MODE.');
      console.log(`Email recipient: ${recipientEmail}`);
      console.log(`Email subject: e-LocalKart Inquiry: ${subject || 'New Message'} from ${name}`);
      console.log('HTML CONTENT:');
      console.log(emailTemplateHtml);
      console.log('------------------------------------------------------------');

      return res.json({
        success: true,
        simulated: true,
        message: 'Submission successful! Email logged to server console (Resend API Key is missing in backend env).'
      });
    }
  } catch (error) {
    console.error('Contact Form Submission Error:', error.message);
    res.status(500).json({ message: 'Server error sending message: ' + error.message });
  }
});

module.exports = router;
