# 📧 Email Server Setup - Complete!

## ✅ What I Created:

I've set up a simple Node.js backend server that will send emails for you!

### Files Created:
- `email-server/server.js` - The email server
- `email-server/package.json` - Dependencies
- `email-server/START_EMAIL_SERVER.bat` - Easy startup script

---

## 🚀 How to Start the Email Server

### Method 1: Double-click the batch file (Easiest!)
1. Go to folder: `email-server`
2. Double-click: `START_EMAIL_SERVER.bat`
3. A terminal window will open showing the server is running

### Method 2: Command line
```bash
cd email-server
npm start
```

---

## 📝 How to Use

### Step 1: Start the Email Server
- Run the batch file or use command line
- You'll see a message: "📧 Email Server Running on Port 3001"
- **Keep this terminal window open!**

### Step 2: Use Password Reset
1. Go to your app: http://10.151.243.167:8081/password-reset
2. Enter your email
3. Click "Send Verification Code"
4. **Check your email inbox!** 📬

### Step 3: Enter Code
- Copy the 6-digit code from your email
- Enter it on the password reset page
- Create your new password

---

## 🔍 How It Works

```
Frontend (React)
    ↓
    → Calls: http://localhost:3001/send-reset-code
    ↓
Backend Server (Node.js)
    ↓
    → Calls: Resend API
    ↓
Resend
    ↓
    → Sends email to user
```

---

## ✅ Advantages of This Method

- ✅ No CORS issues
- ✅ API key is secure (not exposed in frontend)
- ✅ Easy to debug
- ✅ Works immediately
- ✅ Can add rate limiting later
- ✅ Can log all emails sent

---

## 🛠️ Troubleshooting

### Email server won't start?
- Make sure port 3001 is not in use
- Check if npm install completed successfully
- Try: `cd email-server && npm install`

### Emails not sending?
1. Check if email server is running (terminal should be open)
2. Check browser console for errors (F12)
3. Verify Resend API key is correct
4. Check spam/junk folder

### "Failed to connect to email server"?
- Make sure the email server is running
- Check if it's on port 3001
- Look at the email server terminal for errors

---

## 🎯 Quick Test

1. Start email server: Double-click `START_EMAIL_SERVER.bat`
2. Go to: http://10.151.243.167:8081/password-reset
3. Enter your email
4. Check inbox! 📧

---

## 📊 Server Endpoints

- `POST /send-reset-code` - Send password reset email
  - Body: `{ "email": "user@example.com", "code": "123456" }`
  
- `GET /health` - Check if server is running
  - Returns: `{ "status": "OK" }`

---

## 🔒 Security Notes

- API key is in server code (not exposed to frontend)
- CORS is enabled for all origins (change in production)
- Consider adding rate limiting
- Consider adding request validation
- Consider using environment variables for API key

---

## 🚀 For Production

When deploying to production:

1. **Use environment variables:**
   ```javascript
   const RESEND_API_KEY = process.env.RESEND_API_KEY;
   ```

2. **Update CORS:**
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

3. **Add rate limiting:**
   ```bash
   npm install express-rate-limit
   ```

4. **Deploy server to:**
   - Heroku
   - Railway
   - Render
   - Vercel
   - Your own VPS

---

## 💡 Tips

- Keep the email server terminal open while testing
- Check server logs for debugging
- Test with your own email first
- Check spam folder if email doesn't arrive
- Server restarts automatically if you make changes

---

## ✨ You're All Set!

Just start the email server and your password reset will work perfectly! 🎉
