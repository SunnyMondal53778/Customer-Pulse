import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Lock, Save, Camera } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company: user?.company || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate passwords if changing
        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Passwords do not match' });
                return;
            }
        }

        // Update user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name: formData.name,
                email: formData.email,
                company: formData.company,
                ...(formData.newPassword && { password: formData.newPassword })
            };

            localStorage.setItem('users', JSON.stringify(users));

            // Update current user in localStorage
            const { password: _, ...userWithoutPassword } = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);

            // Clear password fields
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Reload page to update navbar
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile Settings</h1>
                <p>Manage your account information and preferences</p>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {getInitials(user?.name)}
                        </div>
                        <button className="avatar-upload-btn">
                            <Camera size={16} />
                            Change Photo
                        </button>
                    </div>

                    <div className="profile-info-card">
                        <h3>Account Status</h3>
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric'
                                    })
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Account Type</span>
                            <span className="info-value">Free</span>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    {message.text && (
                        <div className={`profile-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Personal Information</h2>
                            {!isEditing && (
                                <button
                                    className="edit-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>
                                    <User size={18} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Mail size={18} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Building size={18} />
                                    Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Your company name"
                                />
                            </div>

                            {isEditing && (
                                <>
                                    <div className="section-divider">
                                        <h3>Change Password (Optional)</h3>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Lock size={18} />
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Lock size={18} />
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password (min. 6 characters)"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Lock size={18} />
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    name: user?.name || '',
                                                    email: user?.email || '',
                                                    company: user?.company || '',
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                                setMessage({ type: '', text: '' });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="save-btn">
                                            <Save size={18} />
                                            Save Changes
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
