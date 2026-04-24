import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Leads from './components/Leads';
import Contacts from './components/Contacts';
import CustomerForm from './components/CustomerForm';
import LeadForm from './components/LeadForm';
import ContactForm from './components/ContactForm';
import Profile from './components/Profile';
import Automation from './components/Automation';
import Pricing from './components/Pricing';
import Chatbot from './components/Chatbot';
import { initializeSampleData } from './data/sampleData';
import PageTransition from './components/PageTransition';

function App() {
  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <ToastProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/welcome" element={<LandingPage />} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
                <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
                <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />

                {/* Protected Routes */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div className="App">
                      <Navbar />
                      <div className="main-content">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/customers/new" element={<CustomerForm />} />
                          <Route path="/customers/edit/:id" element={<CustomerForm />} />
                          <Route path="/leads" element={<Leads />} />
                          <Route path="/leads/new" element={<LeadForm />} />
                          <Route path="/leads/edit/:id" element={<LeadForm />} />
                          <Route path="/contacts" element={<Contacts />} />
                          <Route path="/contacts/new" element={<ContactForm />} />
                          <Route path="/contacts/edit/:id" element={<ContactForm />} />
                          <Route path="/automation" element={<Automation />} />
                          <Route path="/pricing" element={<Pricing />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </div>
                      <Chatbot />
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </ToastProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
