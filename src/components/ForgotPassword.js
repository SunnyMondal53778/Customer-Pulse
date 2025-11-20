import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import Logo from './Logo';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (error) {
            console.error('Error sending reset email:', error.message);
            setError('Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="forgot-password-content">
                <div className="forgot-password-card">
                    {!success ? (
                        <>
                            <div className="forgot-password-header">
                                <div className="logo-container">
                                    <Logo size={48} showText={true} />
                                </div>
                                <h2>Reset Password</h2>
                                <p>Enter your email address and we'll send you a link to reset your password</p>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="forgot-password-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="reset-button" disabled={loading}>
                                    {loading ? (
                                        <div className="spinner"></div>
                                    ) : (
                                        <span>Send Reset Link</span>
                                    )}
                                </button>
                            </form>

                            <div className="back-to-login">
                                <Link to="/login" className="back-link">
                                    <ArrowLeft size={16} />
                                    Back to Sign In
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="success-message-container">
                            <div className="success-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h2>Check Your Email</h2>
                            <p>We've sent a password reset link to <strong>{email}</strong></p>
                            <p className="email-note">Please check your inbox and click the link to reset your password.</p>

                            <div className="success-actions">
                                <Link to="/login" className="back-to-login-btn">
                                    Back to Sign In
                                </Link>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="resend-btn"
                                >
                                    Resend Email
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
