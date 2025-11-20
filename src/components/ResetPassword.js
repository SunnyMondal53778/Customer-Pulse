import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import Logo from './Logo';
import './ResetPassword.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check if user came from password reset email
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('Invalid or expired reset link. Please request a new one.');
            }
        };
        checkSession();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate passwords
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.password
            });

            if (error) throw error;

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Error resetting password:', error.message);
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="reset-password-content">
                <div className="reset-password-card">
                    {!success ? (
                        <>
                            <div className="reset-password-header">
                                <div className="logo-container">
                                    <Logo size={48} showText={true} />
                                </div>
                                <h2>Create New Password</h2>
                                <p>Enter your new password below</p>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="reset-password-form">
                                <div className="form-group">
                                    <label htmlFor="password">New Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={20} className="input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            placeholder="Enter new password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <span className="password-hint">Must be at least 6 characters</span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={20} className="input-icon" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="reset-button" disabled={loading}>
                                    {loading ? (
                                        <div className="spinner"></div>
                                    ) : (
                                        <span>Reset Password</span>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="success-message-container">
                            <div className="success-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h2>Password Reset Successful!</h2>
                            <p>Your password has been successfully reset.</p>
                            <p className="redirect-note">Redirecting to login page...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
