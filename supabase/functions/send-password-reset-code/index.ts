import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { email, code, expiresIn } = await req.json()

    // Validate input
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // If Resend API key is configured, use it
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'CivilConnect <noreply@civilconnect.com>',
          to: [email],
          subject: 'Password Reset Code - CivilConnect',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Code</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
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
                    ⏰ This code will expire in <strong>${expiresIn || '15 minutes'}</strong>
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
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(`Resend API error: ${error}`)
      }

      const data = await res.json()
      
      return new Response(
        JSON.stringify({ success: true, messageId: data.id }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    } else {
      // No email service configured - return success but log warning
      console.log(`📧 Password Reset Code for ${email}: ${code}`)
      console.log('⚠️ RESEND_API_KEY not configured. Email not sent.')
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured',
          code: code // Only for development/testing
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
