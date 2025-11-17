# CivilConnect - Construction Professional Network Platform

A comprehensive platform connecting construction professionals including engineers, architects, contractors, builders, civil workers, material sellers, land owners, and property buyers.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Supabase account
- Resend account (for email functionality)

### Installation

1. **Clone and Install**
```bash
npm install
```

2. **Environment Setup**
Create `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

3. **Database Setup**
- Go to your Supabase SQL Editor
- Run the SQL from `RUN_THIS_IN_SUPABASE.sql`
- Run the SQL from `supabase/migrations/create_password_reset_codes.sql`

4. **Start Development Server**
```bash
npm run dev
```

5. **Start Email Server** (for password reset)
```bash
cd email-server
npm install
npm start
```

## 📧 Email Setup (Password Reset)

The password reset feature requires an email server. See `EMAIL_SERVER_INSTRUCTIONS.md` for detailed setup.

**Quick Setup:**
1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Get your API key
3. Update `email-server/server.js` with your API key
4. Start the email server: `cd email-server && npm start`

## 🗂️ Project Structure

```
CivilConnectproject-main/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React context providers
│   └── integrations/   # Supabase integration
├── email-server/       # Email service for password reset
├── supabase/          # Database migrations
└── public/            # Static assets
```

## 🔑 Key Features

- **User Authentication** - Login/Signup with email verification
- **Profile Management** - Create and edit professional profiles
- **Connection System** - Connect with other professionals
- **Real-time Chat** - Message connected professionals
- **Rating & Reviews** - Rate and review professionals
- **Land Listings** - Post and browse land properties
- **Admin Dashboard** - Manage users and content
- **Password Reset** - Email-based password recovery

## 📱 User Types

1. **Engineers** - Civil engineering professionals
2. **Architects** - Design and planning experts
3. **Contractors** - Construction contractors
4. **Builders** - Building professionals
5. **Civil Workers** - Skilled construction workers
6. **Material Sellers** - Construction material suppliers
7. **Land Owners** - Property owners
8. **Property Buyers** - Looking to purchase property

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Email:** Resend API
- **Real-time:** Supabase Realtime

## 📚 Important Files

- `RUN_THIS_IN_SUPABASE.sql` - Main database setup
- `SUPABASE_SETUP_GUIDE.md` - Detailed Supabase configuration
- `EMAIL_SERVER_INSTRUCTIONS.md` - Email server setup guide
- `PASSWORD_RESET_SETUP.md` - Password reset configuration
- `LOGO_INSTALLATION.md` - Logo setup instructions

## 🔒 Admin Access

To set yourself as admin:
1. Go to Supabase SQL Editor
2. Run: `UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';`
3. Access admin panel at `/admin/dashboard`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Add environment variables
3. Deploy

### Email Server (Railway/Render)
1. Deploy the `email-server` folder
2. Set `RESEND_API_KEY` environment variable
3. Update frontend to use deployed URL

## 📝 License

MIT License - feel free to use for your projects

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for the construction industry
