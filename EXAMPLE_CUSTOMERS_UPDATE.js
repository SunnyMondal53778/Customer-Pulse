// EXAMPLE: How to update Customers.js to use Supabase
// Replace the localStorage code with Supabase database calls

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { fetchCustomers, deleteCustomer } from '../utils/supabaseHelpers';
import { useAuth } from '../context/AuthContext';
import './Customers.css';

const Customers = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch customers from Supabase on component mount
    useEffect(() => {
        loadCustomers();
    }, [user]);

    // Filter customers based on search term
    useEffect(() => {
        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);

    const loadCustomers = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await fetchCustomers();

        if (error) {
            setError('Failed to load customers. Please try again.');
            console.error('Error loading customers:', error);
        } else {
            setCustomers(data || []);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            const { error } = await deleteCustomer(id);

            if (error) {
                alert('Failed to delete customer. Please try again.');
                console.error('Error deleting customer:', error);
            } else {
                // Remove from local state
                setCustomers(customers.filter(customer => customer.id !== id));
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            active: '#10b981',
            inactive: '#ef4444',
            pending: '#f59e0b'
        };
        return colors[status] || '#6b7280';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Loading customers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={loadCustomers} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="customers">
            <div className="customers-header">
                <div>
                    <h1>Customers</h1>
                    <p>Manage your customer relationships</p>
                </div>
                <Link to="/customers/new" className="add-button">
                    <Plus size={20} />
                    Add Customer
                </Link>
            </div>

            <div className="customers-controls">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredCustomers.length === 0 ? (
                <div className="empty-state">
                    <p>
                        {searchTerm
                            ? 'No customers found matching your search.'
                            : 'No customers yet. Add your first customer to get started!'}
                    </p>
                    {!searchTerm && (
                        <Link to="/customers/new" className="add-button">
                            <Plus size={20} />
                            Add Customer
                        </Link>
                    )}
                </div>
            ) : (
                <div className="customers-grid">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="customer-card">
                            <div className="customer-header">
                                <h3>{customer.name}</h3>
                                <div className="customer-actions">
                                    <Link
                                        to={`/customers/edit/${customer.id}`}
                                        className="icon-button"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        className="icon-button delete"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="customer-info">
                                <p>
                                    <strong>Email:</strong> {customer.email}
                                </p>
                                {customer.phone && (
                                    <p>
                                        <strong>Phone:</strong> {customer.phone}
                                    </p>
                                )}
                                {customer.company && (
                                    <p>
                                        <strong>Company:</strong> {customer.company}
                                    </p>
                                )}
                                <div className="customer-status">
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(customer.status) }}
                                    >
                                        {customer.status || 'active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Customers;

// ============================================
// NOTES FOR CUSTOMERFORM.JS:
// ============================================

// In CustomerForm.js, replace the localStorage save with:

/*
import { useParams, useNavigate } from 'react-router-dom';
import { createCustomer, updateCustomer, fetchCustomerById } from '../utils/supabaseHelpers';

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Load customer data if editing
    useEffect(() => {
        if (id) {
            loadCustomer();
        }
    }, [id]);

    const loadCustomer = async () => {
        const { data, error } = await fetchCustomerById(id);
        if (data) {
            setFormData({
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                company: data.company || '',
                address: data.address || '',
                status: data.status || 'active',
                notes: data.notes || ''
            });
        }
        if (error) {
            console.error('Error loading customer:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let result;
        if (id) {
            result = await updateCustomer(id, formData);
        } else {
            result = await createCustomer(formData);
        }

        if (result.error) {
            alert('Failed to save customer. Please try again.');
            console.error('Error saving customer:', result.error);
        } else {
            navigate('/customers');
        }
        
        setLoading(false);
    };

    // ... rest of the component
};
*/
