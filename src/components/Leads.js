import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, TrendingUp } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './Leads.css';

const Leads = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchLeads();
        }
    }, [user]);

    useEffect(() => {
        const filtered = leads.filter(lead =>
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.source && lead.source.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredLeads(filtered);
    }, [searchTerm, leads]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setLeads(data || []);
            setFilteredLeads(data || []);
        } catch (error) {
            console.error('Error fetching leads:', error.message);
            setError('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    const deleteLead = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                const { error } = await supabase
                    .from('leads')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;

                const updatedLeads = leads.filter(lead => lead.id !== id);
                setLeads(updatedLeads);
                setFilteredLeads(updatedLeads);
            } catch (error) {
                console.error('Error deleting lead:', error.message);
                alert('Failed to delete lead');
            }
        }
    };

    const convertToCustomer = async (lead) => {
        if (window.confirm('Convert this lead to a customer?')) {
            try {
                // Check if customer with same email or phone already exists
                const { data: existingCustomers } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('user_id', user.id)
                    .or(`email.eq.${lead.email}${lead.phone ? `,phone.eq.${lead.phone}` : ''}`);

                if (existingCustomers && existingCustomers.length > 0) {
                    alert('A customer with this email or phone number already exists.');
                    return;
                }

                // Check for existing contact with same email or phone
                let existingContact = null;
                const { data: contacts } = await supabase
                    .from('contacts')
                    .select('*')
                    .eq('user_id', user.id)
                    .or(`email.eq.${lead.email}${lead.phone ? `,phone.eq.${lead.phone}` : ''}`);

                if (contacts && contacts.length > 0) {
                    existingContact = contacts[0];
                }

                // Create the customer in the database
                const { error: customerError } = await supabase
                    .from('customers')
                    .insert([{
                        user_id: user.id,
                        name: lead.name,
                        email: lead.email,
                        phone: lead.phone,
                        company: lead.company,
                        address: lead.address || '',
                        status: 'active',
                        notes: `Converted from lead. Original source: ${lead.source}. ${lead.notes || ''}`
                    }]);

                if (customerError) throw customerError;

                // Create or update contact
                if (existingContact) {
                    await supabase
                        .from('contacts')
                        .update({
                            name: lead.name,
                            email: lead.email,
                            phone: lead.phone,
                            company: lead.company,
                            address: lead.address || '',
                            notes: lead.notes || '',
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingContact.id);
                } else {
                    await supabase
                        .from('contacts')
                        .insert([{
                            user_id: user.id,
                            name: lead.name,
                            email: lead.email,
                            phone: lead.phone,
                            company: lead.company,
                            address: lead.address || '',
                            notes: lead.notes || ''
                        }]);
                }

                // Delete the lead from the database
                const { error: deleteError } = await supabase
                    .from('leads')
                    .delete()
                    .eq('id', lead.id)
                    .eq('user_id', user.id);

                if (deleteError) throw deleteError;

                // Update local state
                const updatedLeads = leads.filter(l => l.id !== lead.id);
                setLeads(updatedLeads);
                setFilteredLeads(updatedLeads);

                alert('Lead successfully converted to customer!');
            } catch (error) {
                console.error('Error converting lead to customer:', error.message);
                alert('Failed to convert lead to customer. Please try again.');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return '#007bff';
            case 'contacted': return '#ffc107';
            case 'qualified': return '#28a745';
            case 'proposal': return '#17a2b8';
            case 'won': return '#28a745';
            case 'lost': return '#dc3545';
            default: return '#6c757d';
        }
    };

    if (loading) {
        return (
            <div className="leads">
                <div className="loading-state">
                    <p>Loading leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="leads">
            <div className="leads-header">
                <h1>Leads</h1>
                <Link to="/leads/new" className="btn btn-primary">
                    <Plus size={20} />
                    Add Lead
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="leads-grid">
                {filteredLeads.length === 0 ? (
                    <div className="empty-state">
                        <p>No leads found.</p>
                        <Link to="/leads/new" className="btn btn-primary">
                            Add Your First Lead
                        </Link>
                    </div>
                ) : (
                    filteredLeads.map(lead => (
                        <div key={lead.id} className="lead-card">
                            <div className="lead-info">
                                <h3>{lead.name}</h3>
                                <p className="company">{lead.company}</p>
                                <p className="email">{lead.email}</p>
                                <p className="phone">{lead.phone}</p>
                                <p className="source">Source: {lead.source}</p>
                                <div className="lead-meta">
                                    <span
                                        className="status"
                                        style={{ backgroundColor: getStatusColor(lead.status), color: 'white' }}
                                    >
                                        {lead.status}
                                    </span>
                                    <span className="score">Score: {lead.score}/100</span>
                                </div>
                            </div>
                            <div className="lead-actions">
                                <button
                                    onClick={() => convertToCustomer(lead)}
                                    className="btn btn-success"
                                    title="Convert to Customer"
                                >
                                    <TrendingUp size={16} />
                                </button>
                                <Link
                                    to={`/leads/edit/${lead.id}`}
                                    className="btn btn-secondary"
                                    title="Edit Lead"
                                >
                                    <Edit size={16} />
                                </Link>
                                <button
                                    onClick={() => deleteLead(lead.id)}
                                    className="btn btn-danger"
                                    title="Delete Lead"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leads;
