# Quick Start: Supabase Integration

## 🚀 You're Almost Ready!

Your CRM app now has all the Supabase integration code in place. Follow these steps to complete the setup:

## Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click **"New Project"**
4. Fill in:
   - Project Name: `customer-pulse-crm`
   - Database Password: (create a strong password - save it!)
   - Region: Choose closest to you
5. Wait 2-3 minutes for setup to complete

## Step 2: Get Your API Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Update Your .env File

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key-here
```

3. Save the file

## Step 4: Set Up Database Tables

1. In Supabase Dashboard, click **SQL Editor**
2. Click **"New Query"**
3. Open the `supabase-setup.sql` file in your project
4. Copy ALL the SQL code
5. Paste it into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned" ✅

## Step 5: Configure Authentication

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/**
   ```
4. Click **Save**

## Step 6: Restart Your App

```bash
npm start
```

## Step 7: Test It Out!

1. Go to `http://localhost:3000/signup`
2. Create a new account with your email
3. Check your email for confirmation (if enabled)
4. Log in with your credentials
5. Check Supabase Dashboard:
   - **Authentication** → **Users** (should see your user)
   - **Table Editor** → **profiles** (should see your profile)

## ✅ What's Been Done

- ✅ Supabase client installed and configured
- ✅ Database schema created (SQL file)
- ✅ Authentication system updated
- ✅ Row Level Security (RLS) policies set up
- ✅ Helper functions for database operations
- ✅ OAuth placeholders (Google & GitHub)

## 📁 New Files Created

- `src/config/supabase.js` - Supabase client configuration
- `src/utils/supabaseHelpers.js` - Database helper functions
- `supabase-setup.sql` - Complete database schema
- `.env` - Environment variables (don't commit!)
- `.env.example` - Template for environment variables
- `SUPABASE_SETUP.md` - Detailed setup guide

## 🔄 Updated Files

- `src/context/AuthContext.js` - Now uses Supabase Auth
- `src/components/Login.js` - OAuth button placeholders
- `src/components/SignUp.js` - OAuth button placeholders
- `.gitignore` - Added `.env` to ignore list

## 🎯 Next Steps

After authentication works, update these components to use Supabase:

1. **Customers Component** - Use `fetchCustomers()`, `deleteCustomer()`
2. **CustomerForm** - Use `createCustomer()`, `updateCustomer()`
3. **Leads Component** - Use `fetchLeads()`, `deleteLead()`
4. **LeadForm** - Use `createLead()`, `updateLead()`
5. **Contacts Component** - Use `fetchContacts()`, `deleteContact()`
6. **ContactForm** - Use `createContact()`, `updateContact()`
7. **Dashboard** - Use `fetchDashboardStats()`

Example usage in Customers.js:

```javascript
import { fetchCustomers, deleteCustomer } from "../utils/supabaseHelpers";

useEffect(() => {
  const loadCustomers = async () => {
    const { data, error } = await fetchCustomers();
    if (data) setCustomers(data);
    if (error) console.error(error);
  };
  loadCustomers();
}, []);
```

## 🔐 Security Features

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Password hashing** - Handled automatically by Supabase
- ✅ **JWT authentication** - Secure session management
- ✅ **SQL injection protection** - Built into Supabase client
- ✅ **Environment variables** - API keys not in code

## 🐛 Troubleshooting

### "Invalid API key" error

- Check your `.env` file has correct credentials
- Restart the dev server after changing `.env`

### "Cross-origin request blocked"

- Add `http://localhost:3000/**` to Redirect URLs in Supabase

### Can't login after signup

- Email confirmation might be enabled
- Check your email for confirmation link
- Or disable email confirmation in Authentication settings

### Tables not found

- Make sure you ran the entire `supabase-setup.sql` script
- Check Table Editor in Supabase Dashboard

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- Full setup guide: `SUPABASE_SETUP.md`

## 🎉 You're Ready!

Once you complete Steps 1-6 above, your CRM will have:

- Real user authentication
- PostgreSQL database
- Secure data storage
- Multi-user support
- Production-ready backend

Happy coding! 🚀
