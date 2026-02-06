import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import {
    Users, TrendingUp, TrendingDown, Calendar, Target, Award,
    BarChart2, Headphones, Sparkles, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalLeads: 0,
        totalContacts: 0,
        conversionRate: 0,
        customersTrend: { value: 0, isPositive: true },
        leadsTrend: { value: 0, isPositive: true },
        contactsTrend: { value: 0, isPositive: true },
        conversionTrend: { value: 0, isPositive: true }
    });

    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [chartPeriod, setChartPeriod] = useState('6M'); // '6M' or '1Y'
    const [customersDataCache, setCustomersDataCache] = useState([]);
    const [leadsDataCache, setLeadsDataCache] = useState([]);

    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            const [customersRes, leadsRes, contactsRes] = await Promise.all([
                supabase.from('customers').select('*').eq('user_id', user.id),
                supabase.from('leads').select('*').eq('user_id', user.id),
                supabase.from('contacts').select('*').eq('user_id', user.id)
            ]);

            const customers = customersRes.data || [];
            const leads = leadsRes.data || [];
            const contacts = contactsRes.data || [];

            setCustomersDataCache(customers);
            setLeadsDataCache(leads);

            const trends = calculateTrends(customers, leads, contacts);
            const totalCustomers = customers.length;
            const totalLeads = leads.length;
            const conversionRate = totalCustomers + totalLeads > 0
                ? Math.round((totalCustomers / (totalCustomers + totalLeads)) * 100)
                : 0;

            setStats({
                totalCustomers,
                totalLeads,
                totalContacts: contacts.length,
                conversionRate,
                ...trends
            });

            generateMonthlyPerformanceData(customers, leads, chartPeriod);
            generateLeadStatusData(leads, totalCustomers, chartPeriod);
            generateRevenueTrendData(customers, chartPeriod);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    }, [user, chartPeriod]);

    useEffect(() => {
        if (user) {
            fetchDashboardStats();
        }
    }, [user, fetchDashboardStats]);

    useEffect(() => {
        if (customersDataCache.length > 0 || leadsDataCache.length > 0) {
            generateMonthlyPerformanceData(customersDataCache, leadsDataCache, chartPeriod);
            generateLeadStatusData(leadsDataCache, customersDataCache.length, chartPeriod);
            generateRevenueTrendData(customersDataCache, chartPeriod);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartPeriod]);

    const calculateTrends = (customers, leads, contacts) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate this month vs last month
        const thisMonthStart = new Date(currentYear, currentMonth, 1);
        const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
        const lastMonthEnd = new Date(currentYear, currentMonth, 0);

        // Count for this month
        const customersThisMonth = customers?.filter(c => new Date(c.created_at) >= thisMonthStart).length || 0;
        const leadsThisMonth = leads?.filter(l => new Date(l.created_at) >= thisMonthStart).length || 0;
        const contactsThisMonth = contacts?.filter(c => new Date(c.created_at) >= thisMonthStart).length || 0;

        // Count for last month
        const customersLastMonth = customers?.filter(c => {
            const date = new Date(c.created_at);
            return date >= lastMonthStart && date <= lastMonthEnd;
        }).length || 0;
        const leadsLastMonth = leads?.filter(l => {
            const date = new Date(l.created_at);
            return date >= lastMonthStart && date <= lastMonthEnd;
        }).length || 0;
        const contactsLastMonth = contacts?.filter(c => {
            const date = new Date(c.created_at);
            return date >= lastMonthStart && date <= lastMonthEnd;
        }).length || 0;

        // Calculate conversion rate for this month
        const totalThisMonth = customersThisMonth + leadsThisMonth;
        const conversionThisMonth = totalThisMonth > 0
            ? Math.round((customersThisMonth / totalThisMonth) * 100)
            : 0;

        // Calculate conversion rate for last month
        const totalLastMonth = customersLastMonth + leadsLastMonth;
        const conversionLastMonth = totalLastMonth > 0
            ? Math.round((customersLastMonth / totalLastMonth) * 100)
            : 0;

        // Helper function to calculate percentage change
        const calcChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return {
            customersTrend: {
                value: Math.abs(calcChange(customersThisMonth, customersLastMonth)),
                isPositive: customersThisMonth >= customersLastMonth
            },
            leadsTrend: {
                value: Math.abs(calcChange(leadsThisMonth, leadsLastMonth)),
                isPositive: leadsThisMonth >= leadsLastMonth
            },
            contactsTrend: {
                value: Math.abs(calcChange(contactsThisMonth, contactsLastMonth)),
                isPositive: contactsThisMonth >= contactsLastMonth
            },
            conversionTrend: {
                value: Math.abs(conversionThisMonth - conversionLastMonth),
                isPositive: conversionThisMonth >= conversionLastMonth
            }
        };
    };

    const generateMonthlyPerformanceData = (customers, leads, period = '6M') => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Determine number of months based on period
        const monthsToShow = period === '1Y' ? 12 : 6;

        // Get data for the specified period
        const monthlyData = [];
        for (let i = monthsToShow - 1; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const yearOffset = Math.floor((currentMonth - i) / 12);
            const year = currentYear + yearOffset;

            // Count customers and leads created in this month
            const customersInMonth = customers?.filter(c => {
                const date = new Date(c.created_at);
                return date.getMonth() === monthIndex && date.getFullYear() === year;
            }).length || 0;

            const leadsInMonth = leads?.filter(l => {
                const date = new Date(l.created_at);
                return date.getMonth() === monthIndex && date.getFullYear() === year;
            }).length || 0;

            monthlyData.push({
                month: monthNames[monthIndex],
                customers: customersInMonth,
                leads: leadsInMonth
            });
        }

        setChartData(monthlyData);
    };

    const generateLeadStatusData = (leads, customersCount, period = '6M') => {
        const currentDate = new Date();
        const monthsToShow = period === '1Y' ? 12 : 6;
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToShow + 1, 1);

        // Filter leads and customers by period
        const leadsInPeriod = leads?.filter(l => new Date(l.created_at) >= startDate) || [];

        // Count leads by status within the period
        const newLeads = leadsInPeriod.filter(l => l.status?.toLowerCase() === 'new').length || 0;
        const qualified = leadsInPeriod.filter(l => l.status?.toLowerCase() === 'qualified').length || 0;
        const contacted = leadsInPeriod.filter(l => l.status?.toLowerCase() === 'contacted').length || 0;
        const lost = leadsInPeriod.filter(l => l.status?.toLowerCase() === 'lost').length || 0;

        const statusData = [
            { name: 'New Leads', value: newLeads, color: '#667eea' },
            { name: 'Qualified', value: qualified, color: '#43e97b' },
            { name: 'Contacted', value: contacted, color: '#4facfe' },
            { name: 'Lost', value: lost, color: '#ff6b6b' }
        ].filter(item => item.value > 0); // Only show non-zero values

        // If no data, show placeholder
        if (statusData.length === 0) {
            setPieData([{ name: 'No Data', value: 1, color: '#e0e0e0' }]);
        } else {
            setPieData(statusData);
        }
    };

    const generateRevenueTrendData = (customers, period = '6M') => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Determine number of months based on period
        const monthsToShow = period === '1Y' ? 12 : 6;

        // Get data for the specified period
        const revenueMonthlyData = [];
        let total = 0;

        for (let i = monthsToShow - 1; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const yearOffset = Math.floor((currentMonth - i) / 12);
            const year = currentYear + yearOffset;

            // Count customers created in this month and estimate revenue
            const customersInMonth = customers?.filter(c => {
                const date = new Date(c.created_at);
                return date.getMonth() === monthIndex && date.getFullYear() === year;
            }).length || 0;

            // Estimate revenue: $2500 per customer (average deal size)
            const revenue = customersInMonth * 2500;
            total += revenue;

            revenueMonthlyData.push({
                month: monthNames[monthIndex],
                revenue: revenue
            });
        }

        setRevenueData(revenueMonthlyData);
        setTotalRevenue(total);
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading-state">
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>Welcome back! 👋</h1>
                        <p>Here's what's happening with your business today</p>
                    </div>
                    <div className="header-actions">
                        <div className="date-info">
                            <Calendar size={16} />
                            <span>{new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="customers-card">
                    <div className="stat-icon customer-icon">
                        <Users size={26} strokeWidth={2} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalCustomers}</h3>
                        <p>Total Customers</p>
                        <div className={`stat-trend ${stats.customersTrend.isPositive ? 'positive' : 'negative'}`}>
                            {stats.customersTrend.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            <span>
                                {stats.customersTrend.isPositive ? '+' : '-'}{stats.customersTrend.value}% this month
                            </span>
                        </div>
                    </div>
                    <div className="card-corner-icon">
                        <Sparkles size={20} />
                    </div>
                </div>

                <div className="leads-card">
                    <div className="stat-icon leads">
                        <Target size={26} strokeWidth={2} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalLeads}</h3>
                        <p>Active Leads</p>
                        <div className={`stat-trend ${stats.leadsTrend.isPositive ? 'positive' : 'negative'}`}>
                            {stats.leadsTrend.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            <span>
                                {stats.leadsTrend.isPositive ? '+' : '-'}{stats.leadsTrend.value}% this month
                            </span>
                        </div>
                    </div>
                    <div className="card-corner-icon">
                        <Sparkles size={20} />
                    </div>
                </div>

                <div className="contacts-card">
                    <div className="stat-icon contacts">
                        <Headphones size={26} strokeWidth={2} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalContacts}</h3>
                        <p>Total Contacts</p>
                        <div className={`stat-trend ${stats.contactsTrend.isPositive ? 'positive' : 'negative'}`}>
                            {stats.contactsTrend.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            <span>
                                {stats.contactsTrend.isPositive ? '+' : '-'}{stats.contactsTrend.value}% this month
                            </span>
                        </div>
                    </div>
                    <div className="card-corner-icon">
                        <Sparkles size={20} />
                    </div>
                </div>

                <div className="stat-card conversion-card">
                    <div className="stat-icon conversion">
                        <Award size={24} strokeWidth={2} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.conversionRate}%</h3>
                        <p>Conversion Rate</p>
                        <div className={`stat-trend ${stats.conversionTrend.isPositive ? 'positive' : 'negative'}`}>
                            {stats.conversionTrend.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            <span>
                                {stats.conversionTrend.isPositive ? '+' : '-'}{stats.conversionTrend.value}% vs last month
                            </span>
                        </div>
                    </div>
                    <div className="card-corner-icon">
                        <Sparkles size={20} />
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Monthly Performance</h3>
                        <div className="chart-period">
                            <span
                                className={chartPeriod === '6M' ? 'period-active' : ''}
                                onClick={() => setChartPeriod('6M')}
                            >
                                6M
                            </span>
                            <span
                                className={chartPeriod === '1Y' ? 'period-active' : ''}
                                onClick={() => setChartPeriod('1Y')}
                            >
                                1Y
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    backdropFilter: 'blur(10px)'
                                }}
                                labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="customers" fill="#667eea" name="Customers" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="leads" fill="#43e97b" name="Leads" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Lead Status Overview ({chartPeriod === '6M' ? 'Last 6 Months' : 'Last 12 Months'})</h3>
                        <div className="chart-legend">
                            {pieData.map((entry, index) => (
                                <div key={index} className="legend-item">
                                    <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={55}
                                dataKey="value"
                                strokeWidth={2}
                                stroke="#fff"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    backdropFilter: 'blur(10px)'
                                }}
                                labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card revenue-card">
                    <div className="chart-header">
                        <h3>Revenue Trend</h3>
                        <div className="revenue-total">
                            <span className="revenue-amount">
                                ${totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue}
                            </span>
                            <span className="revenue-change">{chartPeriod === '6M' ? 'Last 6 months' : 'Last 12 months'}</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    backdropFilter: 'blur(10px)'
                                }}
                                labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => [`$${value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value}`, 'Revenue']}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#f093fb"
                                strokeWidth={3}
                                dot={{ fill: '#f093fb', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#f093fb', strokeWidth: 2, fill: 'white' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
