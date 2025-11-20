import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
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

    useEffect(() => {
        if (id && user) {
            fetchContact();
        }
    }, [id, user]);

    const fetchContact = async () => {
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
    };

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
                    <p>Loading contact...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-form">
            <div className="form-header">
                <button onClick={() => navigate('/contacts')} className="btn btn-secondary">
                    <ArrowLeft size={20} />
                    Back to Contacts
                </button>
                <h1>{id ? 'Edit Contact' : 'Add New Contact'}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Job Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Marketing Manager"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g., Sales, Marketing, IT"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthday">Birthday</label>
                        <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="linkedin">LinkedIn Profile</label>
                        <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="notes">Notes</label>
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

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/contacts')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Saving...' : (id ? 'Update Contact' : 'Create Contact')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
