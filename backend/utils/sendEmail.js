const nodemailer = require('nodemailer');

/**
 * Send Email Utility
 * Handles all email sending with Nodemailer
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send verification email
 * @param {string} email - Recipient email
 * @param {string} name - User's name
 * @param {string} token - Verification token
 */
exports.sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your SynapseAI account 🔐',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              padding: 40px;
              text-align: center;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 40px;
              margin-top: 20px;
            }
            h1 {
              color: white;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .subtitle {
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
              margin: 0;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
              transition: transform 0.2s;
            }
            .button:hover {
              transform: translateY(-2px);
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 14px;
              color: #666;
            }
            .code {
              background: #f5f5f5;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to SynapseAI! 🚀</h1>
            <p class="subtitle">AI-powered workflows that scale with your ambition</p>
            
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 20px;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p>
                Thank you for signing up! We're excited to have you on board.
                To get started, please verify your email address by clicking the button below:
              </p>
              
              <a href="${verificationUrl}" class="button">
                Verify Email Address
              </a>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Or copy and paste this link into your browser:
              </p>
              <p style="word-break: break-all; font-size: 12px;">
                <span class="code">${verificationUrl}</span>
              </p>
              
              <div class="footer">
                <p>
                  This verification link will expire in <strong>24 hours</strong>.
                </p>
                <p style="margin-top: 20px;">
                  If you didn't create an account, you can safely ignore this email.
                </p>
                <p style="margin-top: 20px; color: #999; font-size: 12px;">
                  © ${new Date().getFullYear()} SynapseAI. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent to ${email}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} name - User's name
 * @param {string} token - Reset token
 */
exports.sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your SynapseAI password 🔑',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              border: 1px solid #e0e0e0;
            }
            h1 {
              color: #667eea;
              margin: 0 0 20px 0;
              font-size: 24px;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset Request</h1>
            
            <p>Hi <strong>${name}</strong>,</p>
            
            <p>
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <a href="${resetUrl}" class="button">
              Reset Password
            </a>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this, please ignore this email.
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Or copy and paste this link:
              <br><br>
              <span style="word-break: break-all; font-size: 12px;">${resetUrl}</span>
            </p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send reset email');
  }
};
