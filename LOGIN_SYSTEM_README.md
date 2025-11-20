# Customer Pulse - Login System Documentation

## Overview

A complete authentication system with beautiful UI for login, sign up, and protected routes.

## Features

### 🔐 Authentication

- **Sign In**: Existing users can log in with email and password
- **Sign Up**: New users can create accounts with:
  - Full name (required)
  - Email address (required)
  - Company name (optional)
  - Password with strength indicator (required)
  - Confirm password (required)
- **Protected Routes**: All CRM features require authentication
- **Persistent Sessions**: Users stay logged in across browser sessions
- **Logout**: Users can safely log out from the profile dropdown

### 🎨 Beautiful UI Design

- **Gradient Backgrounds**: Animated gradient orbs for visual appeal
- **Modern Forms**: Clean input fields with icons
- **Password Visibility Toggle**: Show/hide password functionality
- **Password Strength Indicator**: Visual feedback on password strength
- **Social Login Buttons**: Ready-to-integrate Google & GitHub login UI
- **Responsive Design**: Works perfectly on all device sizes
- **Smooth Animations**: Subtle transitions and hover effects
- **User Profile Dropdown**: Avatar with user information

### 🛡️ Security Features

- Email validation
- Password length requirements (minimum 6 characters)
- Password confirmation matching
- Terms and conditions acceptance
- Secure password storage (client-side demo)
- Protected route system

## Demo Credentials

For testing, use these pre-configured accounts:

**Account 1:**

- Email: `demo@customerpulse.com`
- Password: `demo123`

**Account 2:**

- Email: `jane@example.com`
- Password: `password123`

## File Structure

```
src/
├── components/
│   ├── Login.js              # Sign in page component
│   ├── Login.css             # Login page styles
│   ├── SignUp.js             # Sign up page component
│   ├── SignUp.css            # Sign up page styles
│   ├── ProtectedRoute.js     # Route protection wrapper
│   ├── Navbar.js             # Updated with user profile
│   └── Navbar.css            # Updated navbar styles
├── context/
│   └── AuthContext.js        # Authentication state management
├── utils/
│   └── demoUsers.js          # Demo user initialization
└── App.js                    # Updated with auth routes
```

## How It Works

### 1. Authentication Flow

```
User visits app → Check if logged in
  ↓ No
Login/SignUp page → Enter credentials → Validate
  ↓ Valid
Create session → Redirect to Dashboard
  ↓
Access protected routes → User can navigate CRM
  ↓
Click Logout → Clear session → Redirect to Login
```

### 2. State Management

The `AuthContext` provides:

- `user`: Current user object or null
- `login(email, password)`: Authenticate user
- `signup(name, email, password, company)`: Create new account
- `logout()`: Clear session
- `loading`: Initial auth state check

### 3. Protected Routes

All CRM routes (Dashboard, Customers, Leads, Contacts) are wrapped in `ProtectedRoute` component which:

- Checks if user is authenticated
- Shows loading spinner during auth check
- Redirects to login if not authenticated
- Renders protected content if authenticated

## Usage

### Starting the Application

```bash
npm start
```

The app will open at `http://localhost:3000` and redirect to the login page if not authenticated.

### Creating a New Account

1. Click "Sign up for free" on the login page
2. Fill in your details:
   - Full name (required)
   - Email address (required)
   - Company name (optional)
   - Password (min 6 characters)
   - Confirm password
3. Accept terms and conditions
4. Click "Create Account"

### Logging In

1. Enter your email and password
2. Optionally check "Remember me"
3. Click "Sign In"

### Accessing the Dashboard

Once logged in, you'll be redirected to the dashboard where you can:

- View analytics and statistics
- Manage customers, leads, and contacts
- View your profile in the top-right corner
- Logout from the dropdown menu

## Customization

### Changing Colors

The color scheme is defined using CSS gradients. Main colors are:

**Login Page:**

- Primary: `#667eea` to `#764ba2` (purple gradient)
- Accent: Various shades for orbs

**Sign Up Page:**

- Primary: `#f093fb` to `#f5576c` (pink gradient)
- Accent: Various shades for orbs

To change colors, update the gradients in:

- `Login.css` - `.login-container` and related classes
- `SignUp.css` - `.signup-container` and related classes
- `Navbar.css` - `.navbar` gradient

### Adding Real Authentication

To integrate with a backend API:

1. Update `AuthContext.js`:

```javascript
const login = async (email, password) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.success) {
    setUser(data.user);
    localStorage.setItem("token", data.token);
    return true;
  }
  return false;
};
```

2. Add token-based authentication
3. Implement refresh token logic
4. Add password reset functionality

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance

- Lazy loading of protected routes
- Optimized animations using CSS transforms
- Minimal re-renders with Context API
- LocalStorage for session persistence

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Password reset via email
- [ ] Social login integration (Google, GitHub)
- [ ] Remember device option
- [ ] Login history tracking
- [ ] Session timeout warnings
- [ ] Account verification
- [ ] Role-based access control

## Troubleshooting

**Issue: Can't log in**

- Check if demo users are initialized (check browser console)
- Clear localStorage and refresh: `localStorage.clear()`
- Verify email and password are correct

**Issue: Stuck on loading**

- Check browser console for errors
- Refresh the page
- Clear cache and cookies

**Issue: Styles not loading**

- Ensure all CSS files are imported correctly
- Check for conflicting global styles
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Support

For issues or questions:

1. Check the browser console for error messages
2. Verify all files are in correct locations
3. Ensure all dependencies are installed: `npm install`

---

**Built with React, React Router, and Lucide Icons**
