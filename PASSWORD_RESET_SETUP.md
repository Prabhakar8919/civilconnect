# Password Reset Setup Instructions

## Database Setup

You need to run the SQL migration to create the `password_reset_codes` table in your Supabase database.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the contents of `supabase/migrations/create_password_reset_codes.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Table Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see a new table called `password_reset_codes`

## How the Password Reset Works

### User Flow:

1. **Request Reset Code**
   - User clicks "Forgot Password?" on login page
   - Redirected to `/password-reset` page
   - Enters their email address
   - System generates a 6-digit code and stores it in database
   - Code expires in 15 minutes

2. **Verify Code**
   - User receives email with 6-digit code
   - Enters the code on the password reset page
   - System verifies the code is valid and not expired

3. **Set New Password**
   - User enters new password (twice for confirmation)
   - System updates the password
   - Marks the code as "used" to prevent reuse
   - User is redirected to login page

## Email Integration (Important!)

**Currently, the verification code is only logged to the console.** You need to integrate an email service to send the codes to users.

### Recommended Email Services:

1. **Resend** (Easiest with Supabase)
   - Sign up at https://resend.com
   - Get API key
   - Use Supabase Edge Functions to send emails

2. **SendGrid**
   - Sign up at https://sendgrid.com
   - Get API key
   - Integrate with your backend

3. **Supabase Email (Built-in)**
   - Configure SMTP settings in Supabase
   - Use Supabase's email templates

### Example Email Integration:

In `PasswordReset.tsx`, replace this line:
```typescript
console.log(`Password Reset Code for ${email}: ${verificationCode}`);
```

With actual email sending code:
```typescript
// Example using Supabase Edge Function
await supabase.functions.invoke('send-reset-code', {
  body: { email, code: verificationCode }
});
```

## Security Features

✅ Codes expire after 15 minutes
✅ Codes can only be used once
✅ Email verification required
✅ Passwords must be at least 6 characters
✅ Password confirmation required
✅ Row Level Security (RLS) enabled on database table

## Testing

For testing purposes, check the browser console to see the generated verification code when you request a password reset.

## Maintenance

The database includes a cleanup function to remove expired codes:
```sql
SELECT cleanup_expired_reset_codes();
```

You can set up a cron job to run this periodically.
