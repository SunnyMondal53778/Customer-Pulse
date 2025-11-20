# Supabase Integration Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click **"New Project"**
3. Fill in the project details:
   - **Project Name**: `customer-pulse-crm`
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Select Free tier to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for your project to be set up

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (this is safe to use in your frontend)
     - `service_role` `secret` key (keep this secret, never expose in frontend!)

## Step 3: Configure Your Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key-here
```

3. **Important**: Never commit the `.env` file to Git!
   - It should already be in `.gitignore`
   - Only commit `.env.example` with placeholder values

## Step 4: Set Up the Database

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click **"New Query"**
3. Copy the entire contents of the `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see "Success. No rows returned" - this is good!

### What This SQL Does:

- Creates `profiles` table for user information
- Creates `customers` table for customer data
- Creates `leads` table for lead management
- Creates `contacts` table for contact information
- Sets up Row Level Security (RLS) policies to protect user data
- Creates triggers for automatic profile creation and timestamp updates
- Adds database indexes for better performance

## Step 5: Configure Authentication Settings

1. In Supabase dashboard, go to **Authentication** in the sidebar
2. Click on **Settings**
3. Configure the following:

### Email Auth Settings:

- **Enable Email Signup**: ON
- **Enable Email Confirmations**: ON (recommended for production)
- **Disable Email Confirmations**: OFF in development if you want faster testing

### Site URL:

- Development: `http://localhost:3000`
- Production: Your actual domain

### Redirect URLs:

Add these URLs (one per line):

```
http://localhost:3000/**
http://localhost:3000/reset-password
```

## Step 6: Customize Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. You can customize:
   - **Confirm signup** - Email sent when user signs up
   - **Magic Link** - For passwordless login
   - **Change Email Address** - When user updates email
   - **Reset Password** - Password reset email

## Step 7: Enable Social Authentication (Optional)

### For Google OAuth:

1. Go to **Authentication** → **Providers**
2. Find **Google** and toggle it ON
3. You'll need to create OAuth credentials in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Copy the Client ID and Client Secret
4. Paste them into Supabase Google provider settings
5. Save

### For GitHub OAuth:

1. Go to **Authentication** → **Providers**
2. Find **GitHub** and toggle it ON
3. Create OAuth app in GitHub:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Application name: Customer Pulse CRM
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Copy the Client ID and Client Secret
4. Paste them into Supabase GitHub provider settings
5. Save

## Step 8: Test Your Setup

1. Make sure your `.env` file has the correct credentials
2. Restart your React app (stop and run `npm start` again)
3. Try signing up with a new email
4. Check your Supabase dashboard:
   - Go to **Authentication** → **Users** - you should see your new user
   - Go to **Table Editor** → **profiles** - you should see the profile created
5. Try logging out and logging back in

## Step 9: Verify Database Connection

In your Supabase dashboard:

1. Go to **Table Editor**
2. You should see these tables:
   - `profiles`
   - `customers`
   - `leads`
   - `contacts`
3. Click on each table to verify the structure

## Step 10: Update Your Application Code

The following files have been updated to use Supabase:

✅ `src/config/supabase.js` - Supabase client configuration
✅ `src/context/AuthContext.js` - Authentication using Supabase Auth

### Next: Update Data Components

You'll need to update these components to use Supabase instead of localStorage:

- `src/components/Customers.js`
- `src/components/CustomerForm.js`
- `src/components/Leads.js`
- `src/components/LeadForm.js`
- `src/components/Contacts.js`
- `src/components/ContactForm.js`
- `src/components/Dashboard.js`

## Common Issues & Solutions

### Issue: "Invalid API key"

**Solution**: Double-check your `.env` file has the correct `REACT_APP_SUPABASE_ANON_KEY`

### Issue: "Cross-origin request blocked"

**Solution**: Add your localhost URL to **Redirect URLs** in Authentication settings

### Issue: Tables not created

**Solution**: Run the SQL script again in SQL Editor. Make sure there are no syntax errors.

### Issue: Can't insert data - RLS policy error

**Solution**: The Row Level Security policies require authentication. Make sure you're logged in.

### Issue: Email confirmation not working in development

**Solution**: In Authentication → Settings, you can temporarily disable email confirmation during development.

## Security Best Practices

1. ✅ **Never commit `.env`** - Already in `.gitignore`
2. ✅ **Row Level Security enabled** - Users can only access their own data
3. ✅ **Use anon key in frontend** - Never use service_role key in React
4. ✅ **Enable email confirmation** - Prevents fake signups
5. ✅ **Use HTTPS in production** - Required for secure authentication
6. ✅ **Validate user input** - Always validate on client and server

## Next Steps

After basic authentication works:

1. **Update Customers component** to fetch from Supabase
2. **Update Leads component** to fetch from Supabase
3. **Update Contacts component** to fetch from Supabase
4. **Update Dashboard** to show real statistics
5. **Add profile page** where users can update their info
6. **Implement file upload** for profile pictures using Supabase Storage
7. **Add real-time subscriptions** to sync data across tabs
8. **Set up database backups** in Supabase settings

## Useful Supabase Documentation

- [JavaScript Client Docs](https://supabase.com/docs/reference/javascript)
- [Authentication Docs](https://supabase.com/docs/guides/auth)
- [Database Docs](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase Logs (in dashboard sidebar)
3. Review the [Supabase Discord](https://discord.supabase.com)
4. Check [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

**Your CRM now has enterprise-grade authentication and database! 🎉**
