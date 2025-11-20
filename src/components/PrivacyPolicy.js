import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import Logo from './Logo';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <div className="privacy-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="privacy-content">
                <div className="privacy-header">
                    <Link to="/signup" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Sign Up
                    </Link>
                    <div className="logo-container">
                        <Logo size={48} showText={true} />
                    </div>
                    <div className="header-title">
                        <Lock size={32} />
                        <h1>Privacy Policy</h1>
                    </div>
                    <p className="last-updated">Last Updated: November 20, 2025</p>
                </div>

                <div className="privacy-body">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Customer Pulse. We respect your privacy and are committed to protecting your personal
                            data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                            when you use our Customer Relationship Management (CRM) platform.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <h3>2.1 Personal Information</h3>
                        <p>We collect information that you provide directly to us, including:</p>
                        <ul>
                            <li>Name and email address</li>
                            <li>Company name and business information</li>
                            <li>Account credentials (password is encrypted)</li>
                            <li>Profile information and preferences</li>
                        </ul>

                        <h3>2.2 Customer Data</h3>
                        <p>When using our Service, you may input data about your customers, leads, and contacts, including:</p>
                        <ul>
                            <li>Contact information (names, emails, phone numbers)</li>
                            <li>Company and business details</li>
                            <li>Communication history and notes</li>
                            <li>Custom fields and metadata</li>
                        </ul>

                        <h3>2.3 Usage Data</h3>
                        <p>We automatically collect certain information about your device and usage:</p>
                        <ul>
                            <li>Log data (IP address, browser type, operating system)</li>
                            <li>Device information</li>
                            <li>Usage patterns and feature interactions</li>
                            <li>Performance and error data</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the collected information for the following purposes:</p>
                        <ul>
                            <li><strong>Service Delivery:</strong> To provide, maintain, and improve our CRM platform</li>
                            <li><strong>Account Management:</strong> To create and manage your account</li>
                            <li><strong>Communication:</strong> To send important updates, security alerts, and support messages</li>
                            <li><strong>Analytics:</strong> To analyze usage patterns and improve user experience</li>
                            <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
                            <li><strong>Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Data Storage and Security</h2>
                        <h3>4.1 Data Storage</h3>
                        <p>
                            Your data is stored securely using Supabase, a trusted cloud database provider. Data is encrypted
                            in transit and at rest using industry-standard encryption protocols.
                        </p>

                        <h3>4.2 Security Measures</h3>
                        <p>We implement appropriate technical and organizational measures to protect your data:</p>
                        <ul>
                            <li>Encryption of data in transit (HTTPS/TLS)</li>
                            <li>Encryption of data at rest</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and authentication mechanisms</li>
                            <li>Row-level security policies in our database</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Data Sharing and Disclosure</h2>
                        <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> With trusted third-party service providers (e.g., Supabase, Vercel) who help us operate the Service</li>
                            <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                            <li><strong>Your Consent:</strong> When you explicitly consent to sharing</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Your Data Rights</h2>
                        <p>You have the following rights regarding your personal data:</p>
                        <ul>
                            <li><strong>Access:</strong> Request access to your personal data</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                            <li><strong>Deletion:</strong> Request deletion of your data</li>
                            <li><strong>Export:</strong> Request a copy of your data in a portable format</li>
                            <li><strong>Objection:</strong> Object to certain processing of your data</li>
                            <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                        </ul>
                        <p>To exercise these rights, please contact us at privacy@customerpulse.com</p>
                    </section>

                    <section>
                        <h2>7. Data Retention</h2>
                        <p>
                            We retain your personal data for as long as necessary to provide the Service and fulfill the purposes
                            described in this Privacy Policy. When you delete your account, we will delete or anonymize your
                            personal data, unless we are required to retain it for legal or compliance purposes.
                        </p>
                    </section>

                    <section>
                        <h2>8. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar tracking technologies to enhance your experience. Cookies are small text
                            files stored on your device. You can control cookies through your browser settings, though disabling
                            cookies may affect Service functionality.
                        </p>
                    </section>

                    <section>
                        <h2>9. Third-Party Services</h2>
                        <p>
                            Our Service integrates with third-party services (Supabase, Vercel). These services have their own
                            privacy policies, and we encourage you to review them:
                        </p>
                        <ul>
                            <li>Supabase Privacy Policy: https://supabase.com/privacy</li>
                            <li>Vercel Privacy Policy: https://vercel.com/legal/privacy-policy</li>
                        </ul>
                    </section>

                    <section>
                        <h2>10. Children's Privacy</h2>
                        <p>
                            Our Service is not intended for users under the age of 18. We do not knowingly collect personal
                            information from children. If you believe we have collected data from a child, please contact us
                            immediately.
                        </p>
                    </section>

                    <section>
                        <h2>11. International Data Transfers</h2>
                        <p>
                            Your data may be transferred to and processed in countries other than your own. We ensure that
                            appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2>12. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by updating
                            the "Last Updated" date at the top of this page. We encourage you to review this Privacy Policy
                            periodically.
                        </p>
                    </section>

                    <section>
                        <h2>13. Contact Us</h2>
                        <p>
                            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data,
                            please contact us:
                        </p>
                        <p className="contact-info">
                            Email: privacy@customerpulse.com<br />
                            Support: support@customerpulse.com<br />
                            Website: www.customerpulse.com
                        </p>
                    </section>
                </div>

                <div className="privacy-footer">
                    <Link to="/signup" className="back-button">
                        Back to Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
