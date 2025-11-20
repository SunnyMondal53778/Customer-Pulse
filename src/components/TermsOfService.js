import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Logo from './Logo';
import './TermsOfService.css';

const TermsOfService = () => {
    return (
        <div className="terms-container">
            <div className="terms-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="terms-content">
                <div className="terms-header">
                    <Link to="/signup" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Sign Up
                    </Link>
                    <div className="logo-container">
                        <Logo size={48} showText={true} />
                    </div>
                    <div className="header-title">
                        <Shield size={32} />
                        <h1>Terms of Service</h1>
                    </div>
                    <p className="last-updated">Last Updated: November 20, 2025</p>
                </div>

                <div className="terms-body">
                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Customer Pulse ("the Service"), you accept and agree to be bound by the terms
                            and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2>2. Description of Service</h2>
                        <p>
                            Customer Pulse is a Customer Relationship Management (CRM) platform that enables users to manage
                            customers, leads, and contacts. The Service includes features such as dashboard analytics, contact
                            management, lead tracking, and AI-powered chatbot assistance.
                        </p>
                    </section>

                    <section>
                        <h2>3. User Account</h2>
                        <h3>3.1 Account Creation</h3>
                        <p>
                            To use certain features of the Service, you must register for an account. You agree to provide
                            accurate, current, and complete information during the registration process.
                        </p>
                        <h3>3.2 Account Security</h3>
                        <p>
                            You are responsible for maintaining the confidentiality of your account password and for all
                            activities that occur under your account. You agree to notify us immediately of any unauthorized
                            use of your account.
                        </p>
                    </section>

                    <section>
                        <h2>4. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not upload or transmit any malicious code, viruses, or harmful data</li>
                            <li>Not attempt to gain unauthorized access to any portion of the Service</li>
                            <li>Not use the Service to spam, harass, or send unsolicited communications</li>
                            <li>Not reverse engineer, decompile, or disassemble any aspect of the Service</li>
                            <li>Respect the intellectual property rights of others</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Data and Privacy</h2>
                        <p>
                            Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent
                            to the collection, use, and disclosure of your information as described in our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2>6. Intellectual Property</h2>
                        <p>
                            The Service and its original content, features, and functionality are owned by Customer Pulse and
                            are protected by international copyright, trademark, patent, trade secret, and other intellectual
                            property laws.
                        </p>
                    </section>

                    <section>
                        <h2>7. Third-Party Services</h2>
                        <p>
                            The Service may integrate with third-party services (such as Supabase for database management).
                            Your use of such third-party services is subject to their respective terms and conditions.
                        </p>
                    </section>

                    <section>
                        <h2>8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, Customer Pulse shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                            whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section>
                        <h2>9. Service Availability</h2>
                        <p>
                            We strive to provide continuous access to the Service, but we do not guarantee that the Service
                            will be available at all times. We may suspend or terminate the Service for maintenance, updates,
                            or other reasons without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2>10. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account and access to the Service at our sole
                            discretion, without notice, for conduct that we believe violates these Terms of Service or is
                            harmful to other users, us, or third parties, or for any other reason.
                        </p>
                    </section>

                    <section>
                        <h2>11. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify or replace these Terms of Service at any time. We will provide
                            notice of any changes by updating the "Last Updated" date at the top of this page. Your continued
                            use of the Service after such changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2>12. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
                            in which Customer Pulse operates, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2>13. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="contact-info">
                            Email: support@customerpulse.com<br />
                            Website: www.customerpulse.com
                        </p>
                    </section>
                </div>

                <div className="terms-footer">
                    <Link to="/signup" className="back-button">
                        Back to Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
