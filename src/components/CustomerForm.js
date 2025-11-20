import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './CustomerForm.css';

const CustomerForm = () => {
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
        status: 'active',
        notes: ''
    });

    useEffect(() => {
        if (id && user) {
            fetchCustomer();
        }
    }, [id, user]);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('customers')
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
                    status: data.status || 'active',
                    notes: data.notes || ''
                });
            }
        } catch (error) {
            console.error('Error fetching customer:', error.message);
            setError('Failed to load customer');
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
                    .from('customers')
                    .update({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        address: formData.address,
                        status: formData.status,
                        notes: formData.notes,
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
                    .from('customers')
                    .insert([{
                        user_id: user.id,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        address: formData.address,
                        status: formData.status,
                        notes: formData.notes
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

            navigate('/customers');
        } catch (error) {
            console.error('Error saving customer:', error.message);
            setError('Failed to save customer');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return (
            <div className="customer-form">
                <div className="loading-state">
                    <p>Loading customer...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="customer-form">
            <div className="form-header">
                <button onClick={() => navigate('/customers')} className="btn btn-secondary">
                    <ArrowLeft size={20} />
                    Back to Customers
                </button>
                <h1>{id ? 'Edit Customer' : 'Add New Customer'}</h1>
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
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
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
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/customers')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Saving...' : (id ? 'Update Customer' : 'Create Customer')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
