import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Mail, Phone as PhoneIcon, Users, Building2, Briefcase, MapPin, Sparkles } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './Contacts.css';

const Contacts = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setContacts(data || []);
            setFilteredContacts(data || []);
        } catch (error) {
            console.error('Error fetching contacts:', error.message);
            setError('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchContacts();
        }
    }, [user, fetchContacts]);

    useEffect(() => {
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (contact.department && contact.department.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredContacts(filtered);
    }, [searchTerm, contacts]);

    const deleteContact = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                const { error } = await supabase
                    .from('contacts')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;

                const updatedContacts = contacts.filter(contact => contact.id !== id);
                setContacts(updatedContacts);
                setFilteredContacts(updatedContacts);
            } catch (error) {
                console.error('Error deleting contact:', error.message);
                alert('Failed to delete contact');
            }
        }
    };

    const sendEmail = (email) => {
        window.open(`mailto:${email}`, '_blank');
    };

    const makeCall = (phone) => {
        window.open(`tel:${phone}`, '_blank');
    };

    // Get unique companies count
    const uniqueCompanies = [...new Set(contacts.filter(c => c.company).map(c => c.company))].length;

    if (loading) {
        return (
            <div className="contacts">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading contacts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="contacts">
            {/* Floating Particles Background */}
            <div className="floating-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            {/* Header Section */}
            <div className="contacts-header">
                <div className="header-content">
                    <div className="header-icon">
                        <Users size={28} />
                    </div>
                    <div className="header-text">
                        <h1>Contacts</h1>
                        <p className="header-subtitle">Manage your professional network</p>
                    </div>
                </div>
                <Link to="/contacts/new" className="btn btn-primary">
                    <Plus size={20} />
                    <span>Add Contact</span>
                </Link>
            </div>

            {/* Stats Section */}
            <div className="contacts-stats">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <Users size={22} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{contacts.length}</span>
                        <span className="stat-label">Total Contacts</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon companies">
                        <Building2 size={22} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{uniqueCompanies}</span>
                        <span className="stat-label">Companies</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon recent">
                        <Sparkles size={22} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{filteredContacts.length}</span>
                        <span className="stat-label">Showing</span>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Contacts Grid */}
            <div className="contacts-grid">
                {filteredContacts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Users size={64} />
                        </div>
                        <h3>No contacts found</h3>
                        <p>Start building your network by adding your first contact</p>
                        <Link to="/contacts/new" className="btn btn-primary">
                            <Plus size={20} />
                            Add Your First Contact
                        </Link>
                    </div>
                ) : (
                    filteredContacts.map((contact, index) => (
                        <div
                            key={contact.id}
                            className="contact-card"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="card-glow"></div>
                            <div className="contact-header">
                                <div className="contact-avatar">
                                    <span>{contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                                    <div className="avatar-ring"></div>
                                </div>
                                <div className="contact-primary">
                                    <h3>{contact.name}</h3>
                                    {contact.title && (
                                        <p className="title">
                                            <Briefcase size={14} />
                                            {contact.title}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="contact-body">
                                {contact.company && (
                                    <div className="info-row company">
                                        <Building2 size={15} />
                                        <span>{contact.company}</span>
                                    </div>
                                )}
                                {contact.department && (
                                    <span className="department-badge">{contact.department}</span>
                                )}

                                <div className="contact-details">
                                    {contact.email && (
                                        <div className="info-row email">
                                            <Mail size={14} />
                                            <span>{contact.email}</span>
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="info-row phone">
                                            <PhoneIcon size={14} />
                                            <span>{contact.phone}</span>
                                        </div>
                                    )}
                                    {contact.address && (
                                        <div className="info-row address">
                                            <MapPin size={14} />
                                            <span>{contact.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="contact-actions">
                                <button
                                    onClick={() => sendEmail(contact.email)}
                                    className="action-btn email"
                                    title="Send Email"
                                    disabled={!contact.email}
                                >
                                    <Mail size={18} />
                                </button>
                                <button
                                    onClick={() => makeCall(contact.phone)}
                                    className="action-btn call"
                                    title="Make Call"
                                    disabled={!contact.phone}
                                >
                                    <PhoneIcon size={18} />
                                </button>
                                <Link
                                    to={`/contacts/edit/${contact.id}`}
                                    className="action-btn edit"
                                    title="Edit Contact"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => deleteContact(contact.id)}
                                    className="action-btn delete"
                                    title="Delete Contact"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Contacts;
