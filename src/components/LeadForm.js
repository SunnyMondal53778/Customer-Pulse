import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './LeadForm.css';

const LeadForm = () => {
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
        address: '',
        source: 'website',
        status: 'new',
        score: 50,
        notes: '',
        budget: '',
        timeline: ''
    });

    const fetchLead = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('leads')
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
                    address: data.address || '',
                    source: data.source || 'website',
                    status: data.status || 'new',
                    score: data.score || 50,
                    notes: data.notes || '',
                    budget: data.budget || '',
                    timeline: data.timeline || ''
                });
            }
        } catch (error) {
            console.error('Error fetching lead:', error.message);
            setError('Failed to load lead');
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => {
        if (id && user) {
            fetchLead();
        }
    }, [id, user, fetchLead]);

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

            // Check for existing contact with same email or phone
            let existingContact = null;
            if (formData.email || formData.phone) {
                const { data: contacts } = await supabase
                    .from('contacts')
                    .select('*')
                    .eq('user_id', user.id)
                    .or(`email.eq.${formData.email}${formData.phone ? `,phone.eq.${formData.phone}` : ''}`);

                if (contacts && contacts.length > 0) {
                    existingContact = contacts[0];
                }
            }

            if (id) {
                const { error } = await supabase
                    .from('leads')
                    .update({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        address: formData.address,
                        source: formData.source,
                        status: formData.status,
                        score: parseInt(formData.score),
                        notes: formData.notes,
                        budget: formData.budget,
                        timeline: formData.timeline,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;

                // Update existing contact or create new one
                if (existingContact) {
                    await supabase
                        .from('contacts')
                        .update({
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            company: formData.company,
                            address: formData.address,
                            notes: formData.notes,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingContact.id);
                } else {
                    await supabase
                        .from('contacts')
                        .insert([{
                            user_id: user.id,
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            company: formData.company,
                            address: formData.address,
                            notes: formData.notes
                        }]);
                }
            } else {
                const { error } = await supabase
                    .from('leads')
                    .insert([{
                        user_id: user.id,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        address: formData.address,
                        source: formData.source,
                        status: formData.status,
                        score: parseInt(formData.score),
                        notes: formData.notes,
                        budget: formData.budget,
                        timeline: formData.timeline
                    }]);

                if (error) throw error;

                // Create or update contact
                if (existingContact) {
                    await supabase
                        .from('contacts')
                        .update({
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            company: formData.company,
                            address: formData.address,
                            notes: formData.notes,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingContact.id);
                } else {
                    await supabase
                        .from('contacts')
                        .insert([{
                            user_id: user.id,
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            company: formData.company,
                            address: formData.address,
                            notes: formData.notes
                        }]);
                }
            }

            navigate('/leads');
        } catch (error) {
            console.error('Error saving lead:', error.message);
            setError('Failed to save lead');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return (
            <div className="lead-form">
                <div className="loading-state">
                    <p>Loading lead...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lead-form">
            <div className="form-header">
                <button onClick={() => navigate('/leads')} className="btn btn-secondary">
                    <ArrowLeft size={20} />
                    Back to Leads
                </button>
                <h1>{id ? 'Edit Lead' : 'Add New Lead'}</h1>
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
                        <label htmlFor="source">Lead Source</label>
                        <select
                            id="source"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                        >
                            <option value="website">Website</option>
                            <option value="referral">Referral</option>
                            <option value="social-media">Social Media</option>
                            <option value="email-campaign">Email Campaign</option>
                            <option value="cold-call">Cold Call</option>
                            <option value="trade-show">Trade Show</option>
                            <option value="advertisement">Advertisement</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal">Proposal Sent</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="score">Lead Score (0-100)</label>
                        <input
                            type="range"
                            id="score"
                            name="score"
                            min="0"
                            max="100"
                            value={formData.score}
                            onChange={handleChange}
                        />
                        <span className="score-value">{formData.score}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="budget">Budget</label>
                        <input
                            type="text"
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="e.g., $10,000 - $50,000"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeline">Timeline</label>
                        <select
                            id="timeline"
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                        >
                            <option value="">Select Timeline</option>
                            <option value="immediate">Immediate (&lt; 1 month)</option>
                            <option value="short-term">Short-term (1-3 months)</option>
                            <option value="medium-term">Medium-term (3-6 months)</option>
                            <option value="long-term">Long-term (6+ months)</option>
                        </select>
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
                            placeholder="Additional information about this lead..."
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/leads')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Saving...' : (id ? 'Update Lead' : 'Create Lead')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeadForm;
