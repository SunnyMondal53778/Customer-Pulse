import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, User, Mail, Phone, Building2, Briefcase, FolderOpen, Calendar, Linkedin, MapPin, FileText, UserPlus, Pencil } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './ContactForm.css';

const ContactForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        department: '',
        address: '',
        birthday: '',
        linkedin: '',
        notes: ''
    });

    const fetchContact = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    company: data.company || '',
                    title: data.title || '',
                    department: data.department || '',
                    address: data.address || '',
                    birthday: data.birthday || '',
                    linkedin: data.linkedin || '',
                    notes: data.notes || ''
                });
            }
        } catch (error) {
            console.error('Error fetching contact:', error.message);
            setError('Failed to load contact');
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => {
        if (id && user) {
            fetchContact();
        }
    }, [id, user, fetchContact]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            setError('Name and email are required');
            return;
        }

        try {
            setLoading(true);
            setError('');

            if (id) {
                const { error } = await supabase
                    .from('contacts')
                    .update({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        title: formData.title,
                        department: formData.department,
                        address: formData.address,
                        birthday: formData.birthday,
                        linkedin: formData.linkedin,
                        notes: formData.notes,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('contacts')
                    .insert([{
                        user_id: user.id,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        title: formData.title,
                        department: formData.department,
                        address: formData.address,
                        birthday: formData.birthday,
                        linkedin: formData.linkedin,
                        notes: formData.notes
                    }]);

                if (error) throw error;
            }

            navigate('/contacts');
        } catch (error) {
            console.error('Error saving contact:', error.message);
            setError('Failed to save contact');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return (
            <div className="contact-form">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading contact...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-form">
            {/* Floating Particles Background */}
            <div className="floating-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            {/* Header Section */}
            <div className="form-header">
                <button onClick={() => navigate('/contacts')} className="btn btn-back">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div className="header-content">
                    <div className="header-icon">
                        {id ? <Pencil size={28} /> : <UserPlus size={28} />}
                    </div>
                    <div className="header-text">
                        <h1>{id ? 'Edit Contact' : 'Add New Contact'}</h1>
                        <p className="header-subtitle">
                            {id ? 'Update contact information' : 'Fill in the details to add a new contact'}
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">!</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form">
                {/* Personal Information Section */}
                <div className="form-section">
                    <div className="section-header">
                        <User size={20} />
                        <h2>Personal Information</h2>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">
                                <User size={16} />
                                Full Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={16} />
                                Email <span className="required">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                <Phone size={16} />
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthday">
                                <Calendar size={16} />
                                Birthday
                            </label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information Section */}
                <div className="form-section">
                    <div className="section-header">
                        <Briefcase size={20} />
                        <h2>Professional Information</h2>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="company">
                                <Building2 size={16} />
                                Company
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Acme Inc."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">
                                <Briefcase size={16} />
                                Job Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Marketing Manager"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">
                                <FolderOpen size={16} />
                                Department
                            </label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Sales, Marketing, IT..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="linkedin">
                                <Linkedin size={16} />
                                LinkedIn Profile
                            </label>
                            <input
                                type="url"
                                id="linkedin"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="form-section">
                    <div className="section-header">
                        <FileText size={20} />
                        <h2>Additional Information</h2>
                    </div>
                    <div className="form-grid single-column">
                        <div className="form-group">
                            <label htmlFor="address">
                                <MapPin size={16} />
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Main St, City, Country"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">
                                <FileText size={16} />
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Additional information about this contact..."
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/contacts')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <div className="btn-spinner"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                {id ? 'Update Contact' : 'Create Contact'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
