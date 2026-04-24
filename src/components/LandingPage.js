import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, BarChart3, Zap, Shield, Globe, Mic, CreditCard, CheckCircle, Star, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import './LandingPage.css';

const LandingPage = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        { icon: <Users size={24} />, title: 'Customer Management', desc: 'Centralize all your customer data. Track interactions, manage relationships, and never miss a follow-up.' },
        { icon: <Target size={24} />, title: 'Lead Tracking', desc: 'Score leads automatically, track pipeline stages, and convert more prospects into loyal customers.' },
        { icon: <BarChart3 size={24} />, title: 'Smart Analytics', desc: 'Real-time dashboards with revenue trends, conversion rates, and performance metrics at a glance.' },
        { icon: <Zap size={24} />, title: 'Workflow Automation', desc: 'Set up rules to auto-qualify leads, send notifications, and streamline your entire sales process.' },
        { icon: <Mic size={24} />, title: 'Voice Assistant', desc: 'Talk to your CRM. Use voice commands to search contacts, get stats, and navigate hands-free.' },
        { icon: <Shield size={24} />, title: 'Enterprise Security', desc: 'Bank-grade encryption, SSO support, audit logs, and role-based access control for your team.' },
    ];

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '2.5M', label: 'Contacts Managed' },
        { value: '99.9%', label: 'Uptime SLA' },
        { value: '4.9★', label: 'User Rating' },
    ];

    const testimonials = [
        { name: 'Sarah Chen', role: 'VP of Sales, TechCorp', text: 'Customer Pulse transformed how we manage leads. Our conversion rate increased by 40% in just 3 months.', rating: 5 },
        { name: 'Marcus Johnson', role: 'Founder, GrowthLab', text: 'The automation features alone saved us 15 hours per week. The voice assistant is a game-changer.', rating: 5 },
        { name: 'Emily Rodriguez', role: 'Sales Director, Nexus', text: 'Best CRM we\'ve used. The dark mode is gorgeous, and the analytics dashboards are incredibly insightful.', rating: 5 },
    ];

    return (
        <div className="landing-page">
            {/* Background Effects */}
            <div className="landing-bg">
                <div className="bg-orb bg-orb-1"></div>
                <div className="bg-orb bg-orb-2"></div>
                <div className="bg-orb bg-orb-3"></div>
                <div className="bg-grid"></div>
            </div>

            {/* Navbar */}
            <nav className="landing-nav">
                <Logo size={36} showText={true} />
                <div className="landing-nav-links">
                    <a href="#features">Features</a>
                    <a href="#testimonials">Testimonials</a>
                    <a href="#pricing">Pricing</a>
                </div>
                <div className="landing-nav-actions">
                    <Link to="/login" className="nav-btn-secondary">Sign In</Link>
                    <Link to="/signup" className="nav-btn-primary">
                        Get Started Free
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-badge">
                    <Zap size={14} />
                    <span>Now with AI-Powered Voice Assistant</span>
                </div>
                <h1 className="hero-title">
                    The CRM that <span className="gradient-text">actually helps</span> you close deals
                </h1>
                <p className="hero-subtitle">
                    Manage customers, track leads, automate workflows, and grow your business — 
                    all from one beautiful, intelligent platform.
                </p>
                <div className="hero-actions">
                    <Link to="/signup" className="hero-btn-primary">
                        Start Free Trial
                        <ArrowRight size={18} />
                    </Link>
                    <a href="#features" className="hero-btn-secondary">
                        See Features
                        <ChevronDown size={18} />
                    </a>
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-item">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section" data-animate>
                <div className="section-header">
                    <span className="section-badge">Features</span>
                    <h2>Everything you need to <span className="gradient-text">grow</span></h2>
                    <p>Powerful tools designed to streamline your sales process from start to finish.</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`feature-card ${isVisible['features'] ? 'visible' : ''}`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="testimonials-section" data-animate>
                <div className="section-header">
                    <span className="section-badge">Testimonials</span>
                    <h2>Loved by <span className="gradient-text">thousands</span></h2>
                    <p>See what our customers have to say about Customer Pulse.</p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
                                ))}
                            </div>
                            <p className="testimonial-text">"{t.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="author-name">{t.name}</div>
                                    <div className="author-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Preview */}
            <section id="pricing" className="pricing-preview" data-animate>
                <div className="section-header">
                    <span className="section-badge">Pricing</span>
                    <h2>Simple, transparent <span className="gradient-text">pricing</span></h2>
                    <p>Start free, upgrade when you're ready.</p>
                </div>

                <div className="pricing-cards">
                    <div className="price-card">
                        <h3>Free</h3>
                        <div className="price">$0<span>/mo</span></div>
                        <ul>
                            <li><CheckCircle size={16} /> 50 contacts</li>
                            <li><CheckCircle size={16} /> Basic dashboard</li>
                            <li><CheckCircle size={16} /> Chat assistant</li>
                        </ul>
                        <Link to="/signup" className="price-btn">Get Started</Link>
                    </div>
                    <div className="price-card popular">
                        <div className="popular-badge">Most Popular</div>
                        <h3>Pro</h3>
                        <div className="price">$29<span>/mo</span></div>
                        <ul>
                            <li><CheckCircle size={16} /> Unlimited contacts</li>
                            <li><CheckCircle size={16} /> Advanced analytics</li>
                            <li><CheckCircle size={16} /> Voice assistant</li>
                            <li><CheckCircle size={16} /> 10 automation rules</li>
                        </ul>
                        <Link to="/signup" className="price-btn primary">Start Free Trial</Link>
                    </div>
                    <div className="price-card">
                        <h3>Enterprise</h3>
                        <div className="price">$99<span>/mo</span></div>
                        <ul>
                            <li><CheckCircle size={16} /> Everything in Pro</li>
                            <li><CheckCircle size={16} /> Unlimited automations</li>
                            <li><CheckCircle size={16} /> Team collaboration</li>
                            <li><CheckCircle size={16} /> API access & SSO</li>
                        </ul>
                        <Link to="/signup" className="price-btn">Contact Sales</Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to supercharge your sales?</h2>
                <p>Join 10,000+ businesses already growing with Customer Pulse.</p>
                <Link to="/signup" className="cta-btn">
                    Get Started Free
                    <ArrowRight size={18} />
                </Link>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Logo size={28} showText={true} />
                        <p>The intelligent CRM for modern businesses.</p>
                    </div>
                    <div className="footer-links">
                        <div>
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <Link to="/login">Sign In</Link>
                        </div>
                        <div>
                            <h4>Legal</h4>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/privacy">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Customer Pulse. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
