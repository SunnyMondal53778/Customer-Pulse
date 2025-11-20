import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import './Chatbot.css';

const Chatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your Customer Pulse assistant. I can help you with information about your customers, leads, and contacts. What would you like to know?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [userData, setUserData] = useState({
        customers: [],
        leads: [],
        contacts: []
    });
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user && isOpen) {
            fetchUserData();
        }
    }, [user, isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchUserData = async () => {
        try {
            const [customersRes, leadsRes, contactsRes] = await Promise.all([
                supabase.from('customers').select('*').eq('user_id', user.id),
                supabase.from('leads').select('*').eq('user_id', user.id),
                supabase.from('contacts').select('*').eq('user_id', user.id)
            ]);

            setUserData({
                customers: customersRes.data || [],
                leads: leadsRes.data || [],
                contacts: contactsRes.data || []
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const analyzeQuery = (query) => {
        const lowerQuery = query.toLowerCase();

        // Count queries
        if (lowerQuery.includes('how many') || lowerQuery.includes('total') || lowerQuery.includes('count')) {
            if (lowerQuery.includes('customer')) {
                return {
                    type: 'count',
                    entity: 'customers',
                    response: `You have ${userData.customers.length} customers in total.`
                };
            }
            if (lowerQuery.includes('lead')) {
                return {
                    type: 'count',
                    entity: 'leads',
                    response: `You have ${userData.leads.length} leads in total.`
                };
            }
            if (lowerQuery.includes('contact')) {
                return {
                    type: 'count',
                    entity: 'contacts',
                    response: `You have ${userData.contacts.length} contacts in total.`
                };
            }
        }

        // Status queries for customers
        if (lowerQuery.includes('customer') && lowerQuery.includes('status')) {
            const statusCounts = userData.customers.reduce((acc, customer) => {
                acc[customer.status] = (acc[customer.status] || 0) + 1;
                return acc;
            }, {});

            const statusBreakdown = Object.entries(statusCounts)
                .map(([status, count]) => `${status}: ${count}`)
                .join(', ');

            return {
                type: 'status',
                entity: 'customers',
                response: `Customer status breakdown: ${statusBreakdown}`
            };
        }

        // Status queries for leads
        if (lowerQuery.includes('lead') && lowerQuery.includes('status')) {
            const statusCounts = userData.leads.reduce((acc, lead) => {
                acc[lead.status] = (acc[lead.status] || 0) + 1;
                return acc;
            }, {});

            const statusBreakdown = Object.entries(statusCounts)
                .map(([status, count]) => `${status}: ${count}`)
                .join(', ');

            return {
                type: 'status',
                entity: 'leads',
                response: `Lead status breakdown: ${statusBreakdown}`
            };
        }

        // Search by name
        if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('show me')) {
            const nameMatch = lowerQuery.match(/(?:find|search|show me)\s+(.+?)(?:\s+in|\s+from|$)/i);
            if (nameMatch) {
                const searchName = nameMatch[1].trim();

                const foundCustomers = userData.customers.filter(c =>
                    c.name.toLowerCase().includes(searchName)
                );
                const foundLeads = userData.leads.filter(l =>
                    l.name.toLowerCase().includes(searchName)
                );
                const foundContacts = userData.contacts.filter(c =>
                    c.name.toLowerCase().includes(searchName)
                );

                let response = '';
                if (foundCustomers.length > 0) {
                    response += `Found ${foundCustomers.length} customer(s): ${foundCustomers.map(c => `${c.name} (${c.company || 'No company'})`).join(', ')}. `;
                }
                if (foundLeads.length > 0) {
                    response += `Found ${foundLeads.length} lead(s): ${foundLeads.map(l => `${l.name} - ${l.status} (${l.company || 'No company'})`).join(', ')}. `;
                }
                if (foundContacts.length > 0) {
                    response += `Found ${foundContacts.length} contact(s): ${foundContacts.map(c => `${c.name} (${c.company || 'No company'})`).join(', ')}.`;
                }

                return {
                    type: 'search',
                    response: response || `No results found for "${searchName}".`
                };
            }
        }

        // Recent additions
        if (lowerQuery.includes('recent') || lowerQuery.includes('latest') || lowerQuery.includes('last')) {
            if (lowerQuery.includes('customer')) {
                const recent = userData.customers.slice(0, 5);
                return {
                    type: 'recent',
                    entity: 'customers',
                    response: recent.length > 0
                        ? `Your most recent customers are: ${recent.map(c => `${c.name} (${c.company || 'No company'})`).join(', ')}`
                        : 'You have no customers yet.'
                };
            }
            if (lowerQuery.includes('lead')) {
                const recent = userData.leads.slice(0, 5);
                return {
                    type: 'recent',
                    entity: 'leads',
                    response: recent.length > 0
                        ? `Your most recent leads are: ${recent.map(l => `${l.name} - ${l.status}`).join(', ')}`
                        : 'You have no leads yet.'
                };
            }
            if (lowerQuery.includes('contact')) {
                const recent = userData.contacts.slice(0, 5);
                return {
                    type: 'recent',
                    entity: 'contacts',
                    response: recent.length > 0
                        ? `Your most recent contacts are: ${recent.map(c => `${c.name} (${c.company || 'No company'})`).join(', ')}`
                        : 'You have no contacts yet.'
                };
            }
        }

        // Company queries
        if (lowerQuery.includes('company') || lowerQuery.includes('companies')) {
            const companies = [...new Set([
                ...userData.customers.map(c => c.company),
                ...userData.leads.map(l => l.company),
                ...userData.contacts.map(c => c.company)
            ].filter(Boolean))];

            return {
                type: 'companies',
                response: companies.length > 0
                    ? `You have contacts from ${companies.length} different companies: ${companies.slice(0, 10).join(', ')}${companies.length > 10 ? '...' : ''}`
                    : 'No company information available yet.'
            };
        }

        // Email queries
        if (lowerQuery.includes('email')) {
            const emailMatch = lowerQuery.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
            if (emailMatch) {
                const email = emailMatch[1];
                const customer = userData.customers.find(c => c.email === email);
                const lead = userData.leads.find(l => l.email === email);
                const contact = userData.contacts.find(c => c.email === email);

                if (customer) {
                    return {
                        type: 'email',
                        response: `${customer.name} (Customer) - Company: ${customer.company || 'N/A'}, Phone: ${customer.phone || 'N/A'}, Status: ${customer.status}`
                    };
                }
                if (lead) {
                    return {
                        type: 'email',
                        response: `${lead.name} (Lead) - Company: ${lead.company || 'N/A'}, Status: ${lead.status}, Phone: ${lead.phone || 'N/A'}, Score: ${lead.score}`
                    };
                }
                if (contact) {
                    return {
                        type: 'email',
                        response: `${contact.name} (Contact) - Company: ${contact.company || 'N/A'}, Title: ${contact.title || 'N/A'}, Phone: ${contact.phone || 'N/A'}`
                    };
                }
                return {
                    type: 'email',
                    response: `No records found for ${email}`
                };
            }
        }

        // Phone queries
        if (lowerQuery.includes('phone') || lowerQuery.includes('number')) {
            const phoneMatch = lowerQuery.match(/(\+?\d[\d\s\-\(\)]+)/);
            if (phoneMatch) {
                const phone = phoneMatch[1].replace(/[\s\-\(\)]/g, '');
                const customer = userData.customers.find(c => c.phone && c.phone.replace(/[\s\-\(\)]/g, '').includes(phone));
                const lead = userData.leads.find(l => l.phone && l.phone.replace(/[\s\-\(\)]/g, '').includes(phone));
                const contact = userData.contacts.find(c => c.phone && c.phone.replace(/[\s\-\(\)]/g, '').includes(phone));

                if (customer) {
                    return {
                        type: 'phone',
                        response: `${customer.name} (Customer) - Company: ${customer.company || 'N/A'}, Email: ${customer.email}`
                    };
                }
                if (lead) {
                    return {
                        type: 'phone',
                        response: `${lead.name} (Lead) - Company: ${lead.company || 'N/A'}, Email: ${lead.email}, Status: ${lead.status}`
                    };
                }
                if (contact) {
                    return {
                        type: 'phone',
                        response: `${contact.name} (Contact) - Company: ${contact.company || 'N/A'}, Email: ${contact.email}`
                    };
                }
                return {
                    type: 'phone',
                    response: `No records found for ${phoneMatch[1]}`
                };
            }
        }

        // High score leads
        if (lowerQuery.includes('high score') || lowerQuery.includes('top lead') || lowerQuery.includes('best lead')) {
            const topLeads = userData.leads
                .filter(l => l.score)
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            return {
                type: 'top_leads',
                response: topLeads.length > 0
                    ? `Your top scoring leads are: ${topLeads.map(l => `${l.name} (Score: ${l.score}, Status: ${l.status})`).join(', ')}`
                    : 'No leads with scores available.'
            };
        }

        // Active customers
        if (lowerQuery.includes('active') && lowerQuery.includes('customer')) {
            const activeCustomers = userData.customers.filter(c => c.status === 'active');
            return {
                type: 'active_customers',
                response: `You have ${activeCustomers.length} active customers: ${activeCustomers.slice(0, 10).map(c => c.name).join(', ')}${activeCustomers.length > 10 ? '...' : ''}`
            };
        }

        // Summary/Overview
        if (lowerQuery.includes('summary') || lowerQuery.includes('overview') || lowerQuery.includes('stats') || lowerQuery.includes('statistics')) {
            const activeCustomers = userData.customers.filter(c => c.status === 'active').length;
            const newLeads = userData.leads.filter(l => l.status === 'new').length;
            const qualifiedLeads = userData.leads.filter(l => l.status === 'qualified').length;
            const topCompanies = [...new Set([...userData.customers, ...userData.leads].map(c => c.company).filter(Boolean))];

            return {
                type: 'summary',
                response: `Here's your CRM summary:\n• Total Customers: ${userData.customers.length} (${activeCustomers} active)\n• Total Leads: ${userData.leads.length} (${newLeads} new, ${qualifiedLeads} qualified)\n• Total Contacts: ${userData.contacts.length}\n• Companies: ${topCompanies.length} unique companies`
            };
        }

        // Default response with suggestions
        return {
            type: 'unknown',
            response: `I can help you with:\n\n📊 Counts: "How many customers do I have?"\n📈 Status: "What's the status of my leads?"\n🔍 Search: "Find John Smith"\n⏰ Recent: "Show me recent customers"\n🏢 Companies: "What companies do I work with?"\n📧 Email lookup: "Who has email john@example.com?"\n📞 Phone lookup: "Find phone number 555-1234"\n⭐ Top leads: "Show me high score leads"\n📋 Overview: "Give me a summary"\n\nWhat would you like to know?`
        };
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate typing delay for better UX
        setTimeout(() => {
            const analysis = analyzeQuery(inputMessage);
            const botMessage = {
                id: messages.length + 2,
                text: analysis.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 800);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Chat Assistant"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <MessageCircle size={20} />
                            <div>
                                <h3>Customer Pulse Assistant</h3>
                                <span className="status-indicator">Online</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`message ${message.sender}`}
                            >
                                <div className="message-content">
                                    <p>{message.text}</p>
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <div className="message-content typing">
                                    <Loader size={16} className="typing-indicator" />
                                    <span>Typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Ask me anything about your CRM data..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className="send-btn"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
