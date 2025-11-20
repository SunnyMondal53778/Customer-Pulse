# Customer Pulse - Modern CRM Application

A comprehensive, full-featured Customer Relationship Management (CRM) application built with React and Supabase. Customer Pulse provides businesses with powerful tools to manage customers, leads, and contacts with an intuitive, modern interface.

## ✨ Key Features

### 🔐 Complete Authentication System

- **User Registration & Login**: Secure email/password authentication
- **Social Authentication**: Sign in with Google and GitHub
- **Password Recovery**: Email-based password reset flow
- **Remember Me**: Optional session persistence
- **Profile Management**: Update user information and preferences
- **Protected Routes**: Secure access to authenticated features

### 📊 Dynamic Dashboard

- **Real-time Metrics**: Total customers, leads, contacts, and conversion rate
- **Interactive Charts**: Toggle between 6-month and 1-year views
- **Lead Distribution**: Visual pie chart showing lead status breakdown
- **Monthly Trends**: Line and bar charts tracking growth over time
- **Quick Stats**: At-a-glance performance indicators
- **Responsive Design**: Optimized for all screen sizes

### 👥 Customer Management

- **Complete CRUD Operations**: Add, view, edit, and delete customers
- **Advanced Search**: Real-time filtering by name, email, or company
- **Status Tracking**: Active, Inactive, and Pending status indicators
- **Detailed Profiles**: Contact information, address, notes, and more
- **Automatic Contacts**: Creates contact records from customer data
- **Data Validation**: Form validation for data integrity

### 🎯 Lead Management

- **Lead Scoring System**: 0-100 scoring for prioritization
- **Source Tracking**: Monitor lead origin and channels
- **Status Pipeline**: New → Contacted → Qualified → Proposal → Won/Lost
- **Lead Conversion**: One-click conversion to customers with duplicate checking
- **Budget & Timeline**: Track deal value and expected close dates
- **Automatic Contact Creation**: Generates contacts from converted leads

### 📞 Contact Management

- **Centralized Database**: Unified view of all contacts
- **Rich Profiles**: Job titles, departments, and organizational details
- **Communication Tools**: Direct email and phone integration
- **Social Links**: LinkedIn profile connections
- **Relationship Building**: Birthday tracking and notes
- **Smart Search**: Fast filtering across all contact fields

### 🤖 AI-Powered Chatbot

- **Natural Language Queries**: Ask questions in plain English
- **Data Insights**: Get instant statistics and metrics
- **Smart Responses**: Context-aware answers about your CRM data
- **Multi-topic Support**: Customers, leads, contacts, and general help
- **Conversation History**: Track chat interactions
- **Minimizable Interface**: Unobtrusive floating widget

### 🎨 Modern UI/UX

- **Custom Branding**: "Customer Pulse" logo with gradient design
- **Smooth Animations**: Page transitions and interactions
- **Responsive Layout**: Perfect on desktop, tablet, and mobile
- **Color-coded Status**: Visual indicators for quick recognition
- **Form Validation**: Real-time error feedback
- **Loading States**: Spinner animations during operations
- **Gradient Backgrounds**: Beautiful gradient orb animations on auth pages

### 📄 Legal Pages

- **Terms of Service**: Comprehensive user agreement
- **Privacy Policy**: Detailed data protection information
- **Easy Access**: Linked from sign-up page and footer

## 🛠 Technology Stack

- **Frontend Framework**: React 19.1.1 with Hooks
- **Backend/Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth with OAuth support
- **Routing**: React Router DOM 7.8.0
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **Styling**: Modern CSS3 with animations and gradients
- **Deployment**: Vercel-ready configuration
- **State Management**: React Context API for authentication

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Supabase Account** (free tier available)

### Quick Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/customer-pulse-crm.git
   cd customer-pulse-crm
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Supabase**

   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL setup scripts from `supabase-setup.sql`
   - Copy your project URL and anon key

4. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**

   ```bash
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Database Setup

The application requires the following Supabase tables:

- `users` - User profiles and authentication
- `customers` - Customer records
- `leads` - Lead tracking
- `contacts` - Contact management

See `supabase-setup.sql` for complete schema and Row Level Security policies.

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 📁 Project Structure

```
customer-pulse-crm/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Login.js & Login.css
│   │   ├── SignUp.js & SignUp.css
│   │   ├── ForgotPassword.js & ForgotPassword.css
│   │   ├── ResetPassword.js & ResetPassword.css
│   │   ├── TermsOfService.js & TermsOfService.css
│   │   ├── PrivacyPolicy.js & PrivacyPolicy.css
│   │   ├── Navbar.js & Navbar.css
│   │   ├── Dashboard.js & Dashboard.css
│   │   ├── Customers.js & Customers.css
│   │   ├── CustomerForm.js & CustomerForm.css
│   │   ├── Leads.js & Leads.css
│   │   ├── LeadForm.js & LeadForm.css
│   │   ├── Contacts.js & Contacts.css
│   │   ├── ContactForm.js & ContactForm.css
│   │   ├── Profile.js & Profile.css
│   │   ├── Chatbot.js & Chatbot.css
│   │   ├── Logo.js
│   │   ├── PageTransition.js & PageTransition.css
│   │   └── ProtectedRoute.js
│   ├── config/
│   │   └── supabase.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── data/
│   │   └── sampleData.js
│   ├── utils/
│   │   ├── demoUsers.js
│   │   └── supabaseHelpers.js
│   ├── App.js & App.css
│   └── index.js & index.css
├── build/ (generated)
├── supabase-setup.sql
├── vercel.json
├── package.json
└── README.md
```

## 💡 Usage Guide

### First Time Setup

1. **Sign Up**: Create your account using email or social login (Google/GitHub)
2. **Accept Terms**: Review and accept Terms of Service and Privacy Policy
3. **Complete Profile**: Add your name and company information
4. **Start Adding Data**: Begin with customers, leads, or contacts

### Managing Customers

1. **Add Customer**: Click "Add Customer" button
2. **Fill Details**: Name, email, company, phone, address, status
3. **Save**: Customer is added and automatically creates a contact
4. **Edit/Delete**: Use action buttons on customer cards
5. **Search**: Real-time search across all customer fields

### Managing Leads

1. **Add Lead**: Click "Add Lead" button
2. **Enter Information**: Include lead score (0-100), source, budget
3. **Track Status**: Update status as lead progresses through pipeline
4. **Convert to Customer**: Click convert button - includes duplicate checking
5. **Automatic Contact**: Contact record created upon conversion

### Managing Contacts

1. **Add Contact**: Click "Add Contact" button or auto-created from customers/leads
2. **Complete Profile**: Job title, department, birthday, LinkedIn
3. **Communication**: Direct email/phone links for quick outreach
4. **Search & Filter**: Find contacts instantly

### Using the Chatbot

1. **Open Chat**: Click the chat icon in bottom-right corner
2. **Ask Questions**:
   - "How many customers do I have?"
   - "What's my conversion rate?"
   - "Show me lead statistics"
   - "How do I add a customer?"
3. **Get Insights**: Receive instant answers about your CRM data
4. **Minimize**: Close chat when not needed

### Dashboard Analytics

- **Toggle Time Range**: Switch between 6 months and 1 year views
- **View Trends**: Monitor growth and patterns
- **Track Conversion**: See lead-to-customer conversion rate
- **Status Distribution**: Visual breakdown of lead pipeline

### Profile Management

1. **Access Profile**: Click profile icon in navbar
2. **Update Info**: Change name, email, company
3. **Security**: Update password through forgot password flow
4. **Settings**: Manage account preferences

## 🎯 Key Features Explained

### Authentication Flow

1. **Sign Up**: Email validation, password strength indicator, terms acceptance
2. **Sign In**: Email/password or OAuth, remember me functionality
3. **Password Reset**: Email-based recovery with secure token
4. **Session Management**: Automatic token refresh and logout

### Lead Scoring System

- Leads are scored 0-100 based on engagement and potential
- Higher scores indicate better conversion probability
- Visual indicators (badges) show score at a glance
- Use scoring to prioritize follow-up efforts

### Status Management

- **Customer Status**:

  - 🟢 Active: Current active customers
  - 🟡 Pending: Onboarding or verification
  - 🔴 Inactive: Past or dormant customers

- **Lead Status**:
  - 🆕 New: Just entered the system
  - 📞 Contacted: Initial outreach made
  - ✅ Qualified: Meets criteria
  - 📋 Proposal: Offer submitted
  - 🎉 Won: Converted to customer
  - ❌ Lost: Did not convert

### Smart Features

- **Duplicate Prevention**: Warns when converting lead if customer already exists
- **Auto Contact Creation**: Automatically creates contacts from customers and leads
- **Data Validation**: Real-time form validation with error messages
- **Search Optimization**: Instant search across multiple fields
- **Responsive Design**: Works perfectly on all devices

## 🗄️ Database & Security

### Supabase Integration

- **PostgreSQL Database**: Reliable, scalable data storage
- **Row Level Security (RLS)**: User-specific data isolation
- **Real-time Capabilities**: Live updates (can be enabled)
- **Built-in Authentication**: Secure user management
- **Email Services**: Password reset and verification emails

### Security Features

- Passwords hashed with bcrypt
- JWT-based authentication
- Secure session management
- Protected API routes
- Input sanitization
- XSS protection

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
   - Deploy!

3. **Configure Supabase**
   - Update Site URL in Supabase dashboard
   - Add Vercel URL to allowed redirect URLs

### Environment Variables

Required variables for deployment:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Recharts Documentation](https://recharts.org/)
- [Vercel Documentation](https://vercel.com/docs)

## 🔮 Future Enhancements

- [ ] Email campaign integration
- [ ] Calendar sync for appointments
- [ ] Task and reminder management
- [ ] Advanced reporting and analytics
- [ ] CSV import/export functionality
- [ ] Team collaboration features
- [ ] API webhooks
- [ ] Mobile app (React Native)
- [ ] Advanced chatbot with AI/ML
- [ ] Custom fields and workflows
- [ ] Integration marketplace (Zapier, Slack, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Create React App](https://github.com/facebook/create-react-app)
- Icons by [Lucide](https://lucide.dev/)
- Backend by [Supabase](https://supabase.com/)
- Charts by [Recharts](https://recharts.org/)
- Deployed on [Vercel](https://vercel.com/)

## 📧 Support

For support, email support@customerpulse.com or open an issue in the repository.

---

**Customer Pulse** - Powering modern customer relationships 🚀
