const nodemailer = require('nodemailer');

/**
 * Send an OTP email using configured Email Provider (SMTP, Resend, or Ethereal test transport)
 * @param {Object} options
 * @param {string} options.email - Recipient email address
 * @param {string} options.name - Recipient name
 * @param {string} options.otpCode - 6-digit OTP code
 * @returns {Promise<Object>} Delivery result object
 */
async function sendOtpEmail({ email, name, otpCode }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'e-LocalKart <no-reply@localkart.com>';
  const resendApiKey = process.env.RESEND_API_KEY || process.env.RESEND_KEY_API;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>e-LocalKart Verification Code</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; }
        .card { background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 32px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 24px; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; color: #0e3e26; text-decoration: none; }
        .logo span { color: #f97316; }
        .title { font-size: 18px; font-weight: 800; color: #111827; margin-top: 0; text-align: center; }
        .otp-container { text-align: center; margin: 24px 0; }
        .otp-code { display: inline-block; font-size: 32px; font-weight: 900; color: #0e3e26; letter-spacing: 6px; background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 12px 24px; }
        .instructions { font-size: 14px; color: #4b5563; line-height: 1.6; text-align: center; }
        .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">e-<span>Local</span>Kart</div>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #4b5563; font-weight: bold;">Verify Your Email Address</p>
        </div>
        
        <h2 class="title">Your Registration Verification Code</h2>
        <p class="instructions">Hi ${name || 'Customer'}, thank you for signing up with e-LocalKart! Please use the following One-Time Password (OTP) to complete your account registration. This code is valid for 5 minutes:</p>
        
        <div class="otp-container">
          <span class="otp-code">${otpCode}</span>
        </div>
        
        <p class="instructions" style="font-size: 12px; color: #9ca3af;">If you did not request this code, please ignore this email.</p>
        
        <div class="footer">
          This email was sent automatically from e-LocalKart.<br>
          &copy; ${new Date().getFullYear()} e-LocalKart Commerce
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. SMTP Transport (if configured in environment variables)
  if (smtpHost && smtpUser && smtpPass) {
    console.log(`[EmailService] Delivering OTP to ${email} via SMTP (${smtpHost}:${smtpPort})...`);
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: emailFrom,
      to: email,
      subject: `${otpCode} is your e-LocalKart Verification Code`,
      html: emailHtml
    });

    console.log(`[EmailService] SMTP email sent successfully. MessageId: ${info.messageId}`);
    return {
      success: true,
      provider: 'SMTP',
      messageId: info.messageId,
      message: 'OTP delivered to email address successfully'
    };
  }

  // 2. Resend API Transport (if configured)
  if (resendApiKey) {
    console.log(`[EmailService] Delivering OTP to ${email} via Resend API...`);
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'e-LocalKart <onboarding@resend.dev>';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: `${otpCode} is your e-LocalKart Verification Code`,
        html: emailHtml
      })
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error('[EmailService] Resend API error:', resData);
      throw new Error(resData.message || 'Resend API delivery failed');
    }

    console.log(`[EmailService] Resend API email sent successfully. ID: ${resData.id}`);
    return {
      success: true,
      provider: 'Resend',
      messageId: resData.id,
      message: 'OTP delivered via Resend successfully'
    };
  }

  // 3. Fallback / Development Ethereal SMTP Transport
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Email provider configuration missing (SMTP_HOST or RESEND_API_KEY required in production environment)');
  }

  console.log(`[EmailService] No production SMTP configured. Creating auto-test Ethereal transport for ${email}...`);
  const testAccount = await nodemailer.createTestAccount();
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await testTransporter.sendMail({
    from: '"e-LocalKart Dev" <verify@localkart.com>',
    to: email,
    subject: `${otpCode} is your e-LocalKart Verification Code`,
    html: emailHtml
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log(`[EmailService] Ethereal test mail sent! Preview URL: ${previewUrl}`);

  return {
    success: true,
    provider: 'EtherealSMTP',
    messageId: info.messageId,
    previewUrl,
    message: `OTP sent via Ethereal test inbox. Preview: ${previewUrl}`
  };
}

module.exports = {
  sendOtpEmail
};
