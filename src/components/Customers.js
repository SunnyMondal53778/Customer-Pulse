import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './Customers.css';

const Customers = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setCustomers(data || []);
            setFilteredCustomers(data || []);
        } catch (error) {
            console.error('Error fetching customers:', error.message);
            setError('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const deleteCustomer = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                const { error } = await supabase
                    .from('customers')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;

                const updatedCustomers = customers.filter(customer => customer.id !== id);
                setCustomers(updatedCustomers);
                setFilteredCustomers(updatedCustomers);
            } catch (error) {
                console.error('Error deleting customer:', error.message);
                alert('Failed to delete customer');
            }
        }
    };

    if (loading) {
        return (
            <div className="customers">
                <div className="loading-state">
                    <p>Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="customers">
            <div className="customers-header">
                <h1>Customers</h1>
                <Link to="/customers/new" className="btn btn-primary">
                    <Plus size={20} />
                    Add Customer
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="customers-grid">
                {filteredCustomers.length === 0 ? (
                    <div className="empty-state">
                        <p>No customers found.</p>
                        <Link to="/customers/new" className="btn btn-primary">
                            Add Your First Customer
                        </Link>
                    </div>
                ) : (
                    filteredCustomers.map(customer => (
                        <div key={customer.id} className="customer-card">
                            <div className="customer-info">
                                <h3>{customer.name}</h3>
                                <p className="company">{customer.company || 'No company'}</p>
                                <p className="email">{customer.email}</p>
                                <p className="phone">{customer.phone || 'No phone'}</p>
                                <span className={`status ${customer.status || 'active'}`}>
                                    {customer.status || 'active'}
                                </span>
                            </div>
                            <div className="customer-actions">
                                <Link
                                    to={`/customers/edit/${customer.id}`}
                                    className="btn btn-secondary"
                                    title="Edit Customer"
                                >
                                    <Edit size={16} />
                                </Link>
                                <button
                                    onClick={() => deleteCustomer(customer.id)}
                                    className="btn btn-danger"
                                    title="Delete Customer"
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

export default Customers;
