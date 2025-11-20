import { supabase } from '../config/supabase';

// ============================================
// CUSTOMERS
// ============================================

export const fetchCustomers = async () => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching customers:', error.message);
        return { data: null, error };
    }
};

export const fetchCustomerById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching customer:', error.message);
        return { data: null, error };
    }
};

export const createCustomer = async (customerData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('customers')
            .insert([{
                ...customerData,
                user_id: user.id
            }])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating customer:', error.message);
        return { data: null, error };
    }
};

export const updateCustomer = async (id, customerData) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .update(customerData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating customer:', error.message);
        return { data: null, error };
    }
};

export const deleteCustomer = async (id) => {
    try {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error deleting customer:', error.message);
        return { error };
    }
};

// ============================================
// LEADS
// ============================================

export const fetchLeads = async () => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching leads:', error.message);
        return { data: null, error };
    }
};

export const fetchLeadById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching lead:', error.message);
        return { data: null, error };
    }
};

export const createLead = async (leadData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('leads')
            .insert([{
                ...leadData,
                user_id: user.id
            }])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating lead:', error.message);
        return { data: null, error };
    }
};

export const updateLead = async (id, leadData) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .update(leadData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating lead:', error.message);
        return { data: null, error };
    }
};

export const deleteLead = async (id) => {
    try {
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error deleting lead:', error.message);
        return { error };
    }
};

// ============================================
// CONTACTS
// ============================================

export const fetchContacts = async () => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        return { data: null, error };
    }
};

export const fetchContactById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching contact:', error.message);
        return { data: null, error };
    }
};

export const createContact = async (contactData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('contacts')
            .insert([{
                ...contactData,
                user_id: user.id
            }])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating contact:', error.message);
        return { data: null, error };
    }
};

export const updateContact = async (id, contactData) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .update(contactData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating contact:', error.message);
        return { data: null, error };
    }
};

export const deleteContact = async (id) => {
    try {
        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error deleting contact:', error.message);
        return { error };
    }
};

// ============================================
// DASHBOARD STATISTICS
// ============================================

export const fetchDashboardStats = async () => {
    try {
        // Fetch counts in parallel
        const [customersResult, leadsResult, contactsResult] = await Promise.all([
            supabase.from('customers').select('*', { count: 'exact', head: true }),
            supabase.from('leads').select('*', { count: 'exact', head: true }),
            supabase.from('contacts').select('*', { count: 'exact', head: true })
        ]);

        // Fetch recent leads
        const { data: recentLeads, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (leadsError) throw leadsError;

        return {
            data: {
                customersCount: customersResult.count || 0,
                leadsCount: leadsResult.count || 0,
                contactsCount: contactsResult.count || 0,
                recentLeads: recentLeads || []
            },
            error: null
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
        return { data: null, error };
    }
};

// ============================================
// PROFILE
// ============================================

export const fetchProfile = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        return { data: null, error };
    }
};

export const updateProfile = async (profileData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating profile:', error.message);
        return { data: null, error };
    }
};
