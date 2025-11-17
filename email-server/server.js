const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: '*', // In production, replace with your actual domain
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Resend API Key
const RESEND_API_KEY = 're_KmntFUx2_EoUfmTsL3bFJ4efMWn5GUrcH';

// Email sending endpoint
app.post('/send-reset-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CivilConnect <onboarding@resend.dev>',
        to: [email],
        subject: 'Password Reset Code - CivilConnect',
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">CivilConnect</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset Request</p>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
                <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
                <p style="font-size: 16px; color: #666;">
                  You requested to reset your password. Use the verification code below to continue:
                </p>
                
                <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                  <div style="font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                    ${code}
                  </div>
                </div>
                
                <p style="font-size: 14px; color: #666; margin: 20px 0;">
                  ⏰ This code will expire in <strong>15 minutes</strong>
                </p>
                
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #856404;">
                    <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support if you're concerned about your account security.
                  </p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                  © ${new Date().getFullYear()} CivilConnect. All rights reserved.<br>
                  This is an automated message, please do not reply to this email.
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API Error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: errorData 
      });
    }

    const data = await response.json();
    console.log(`✅ Email sent successfully to ${email}`);
    
    res.json({ 
      success: true, 
      messageId: data.id,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   📧 Email Server Running              ║
║                                        ║
║   Port: ${PORT}                        
║   Endpoint: /send-reset-code           ║
║                                        ║
║   ✅ Ready to send emails!             ║
╚════════════════════════════════════════╝
  `);
});
