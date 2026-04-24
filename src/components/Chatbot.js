import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader, Mic, MicOff, Volume2 } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import useVoiceAssistant from '../utils/useVoiceAssistant';
import './Chatbot.css';

const Chatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your Customer Pulse assistant. I can help you with information about your customers, leads, and contacts. Try typing or using the 🎤 microphone! What would you like to know?",
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
    const { isListening, transcript, isSupported, startListening, stopListening, speak } = useVoiceAssistant();

    // Update input when voice transcript changes
    useEffect(() => {
        if (transcript) {
            setInputMessage(transcript);
        }
    }, [transcript]);

    // Auto-send when voice recognition stops and we have a transcript
    useEffect(() => {
        if (!isListening && transcript && transcript.trim()) {
            // Small delay to let the UI update
            const timer = setTimeout(() => {
                handleSendMessage(transcript);
            }, 500);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening]);

    const fetchUserData = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        if (user && isOpen) {
            fetchUserData();
        }
    }, [user, isOpen, fetchUserData]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const analyzeQuery = (query) => {
        const lowerQuery = query.toLowerCase();

        // Navigation commands
        if (lowerQuery.includes('navigate') || lowerQuery.includes('go to') || lowerQuery.includes('open')) {
            if (lowerQuery.includes('dashboard') || lowerQuery.includes('home')) {
                window.location.href = '/';
                return { type: 'navigate', response: 'Navigating to Dashboard...' };
            }
            if (lowerQuery.includes('customer')) {
                window.location.href = '/customers';
                return { type: 'navigate', response: 'Navigating to Customers...' };
            }
            if (lowerQuery.includes('lead')) {
                window.location.href = '/leads';
                return { type: 'navigate', response: 'Navigating to Leads...' };
            }
            if (lowerQuery.includes('contact')) {
                window.location.href = '/contacts';
                return { type: 'navigate', response: 'Navigating to Contacts...' };
            }
            if (lowerQuery.includes('automation')) {
                window.location.href = '/automation';
                return { type: 'navigate', response: 'Navigating to Automation...' };
            }
            if (lowerQuery.includes('pricing') || lowerQuery.includes('plan') || lowerQuery.includes('billing')) {
                window.location.href = '/pricing';
                return { type: 'navigate', response: 'Navigating to Pricing...' };
            }
            if (lowerQuery.includes('profile') || lowerQuery.includes('settings')) {
                window.location.href = '/profile';
                return { type: 'navigate', response: 'Navigating to Profile...' };
            }
        }

        // Add new commands
        if (lowerQuery.includes('add new') || lowerQuery.includes('create new')) {
            if (lowerQuery.includes('customer')) {
                window.location.href = '/customers/new';
                return { type: 'navigate', response: 'Opening new customer form...' };
            }
            if (lowerQuery.includes('lead')) {
                window.location.href = '/leads/new';
                return { type: 'navigate', response: 'Opening new lead form...' };
            }
            if (lowerQuery.includes('contact')) {
                window.location.href = '/contacts/new';
                return { type: 'navigate', response: 'Opening new contact form...' };
            }
        }

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
            response: `I can help you with:\n\n📊 Counts: "How many customers do I have?"\n📈 Status: "What's the status of my leads?"\n🔍 Search: "Find John Smith"\n⏰ Recent: "Show me recent customers"\n🏢 Companies: "What companies do I work with?"\n⭐ Top leads: "Show me high score leads"\n📋 Overview: "Give me a summary"\n🧭 Navigate: "Go to customers"\n➕ Create: "Add new lead"\n\nYou can also use the 🎤 microphone button for voice commands!`
        };
    };

    const handleSendMessage = async (messageText) => {
        const text = messageText || inputMessage;
        if (!text.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate typing delay for better UX
        setTimeout(() => {
            const analysis = analyzeQuery(text);
            const botMessage = {
                id: messages.length + 2,
                text: analysis.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);

            // Speak the response if voice was used
            if (messageText && isSupported) {
                speak(analysis.response.replace(/[•\n📊📈🔍⏰🏢⭐📋🧭➕🎤]/g, '').substring(0, 200));
            }
        }, 800);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleVoice = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
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
                        {/* Voice button */}
                        {isSupported && (
                            <button
                                onClick={toggleVoice}
                                className={`voice-btn ${isListening ? 'listening' : ''}`}
                                title={isListening ? 'Stop listening' : 'Start voice input'}
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                {isListening && <span className="voice-pulse"></span>}
                            </button>
                        )}
                        <input
                            type="text"
                            placeholder={isListening ? "Listening..." : "Ask me anything about your CRM data..."}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className={isListening ? 'listening-input' : ''}
                        />
                        <button
                            onClick={() => handleSendMessage()}
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
