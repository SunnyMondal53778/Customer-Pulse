import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Mail, Phone as PhoneIcon } from 'lucide-react';
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

    if (loading) {
        return (
            <div className="contacts">
                <div className="loading-state">
                    <p>Loading contacts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="contacts">
            <div className="contacts-header">
                <h1>Contacts</h1>
                <Link to="/contacts/new" className="btn btn-primary">
                    <Plus size={20} />
                    Add Contact
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="contacts-grid">
                {filteredContacts.length === 0 ? (
                    <div className="empty-state">
                        <p>No contacts found.</p>
                        <Link to="/contacts/new" className="btn btn-primary">
                            Add Your First Contact
                        </Link>
                    </div>
                ) : (
                    filteredContacts.map(contact => (
                        <div key={contact.id} className="contact-card">
                            <div className="contact-avatar">
                                {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div className="contact-info">
                                <h3>{contact.name}</h3>
                                <p className="title">{contact.title}</p>
                                <p className="company">{contact.company}</p>
                                <p className="department">{contact.department}</p>
                                <div className="contact-details">
                                    <p className="email">{contact.email}</p>
                                    <p className="phone">{contact.phone}</p>
                                </div>
                            </div>
                            <div className="contact-actions">
                                <button
                                    onClick={() => sendEmail(contact.email)}
                                    className="btn btn-info"
                                    title="Send Email"
                                    disabled={!contact.email}
                                >
                                    <Mail size={16} />
                                </button>
                                <button
                                    onClick={() => makeCall(contact.phone)}
                                    className="btn btn-success"
                                    title="Make Call"
                                    disabled={!contact.phone}
                                >
                                    <PhoneIcon size={16} />
                                </button>
                                <Link
                                    to={`/contacts/edit/${contact.id}`}
                                    className="btn btn-secondary"
                                    title="Edit Contact"
                                >
                                    <Edit size={16} />
                                </Link>
                                <button
                                    onClick={() => deleteContact(contact.id)}
                                    className="btn btn-danger"
                                    title="Delete Contact"
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

export default Contacts;
