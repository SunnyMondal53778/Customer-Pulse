import React, { useState } from 'react';
import { Check, X, Star, ArrowRight, Crown } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import './Pricing.css';

const Pricing = () => {
    const { currentPlan, billingCycle, setBillingCycle, upgradePlan, allPlans } = useSubscription();
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleUpgrade = (planId) => {
        upgradePlan(planId);
        setSelectedPlan(planId);
        setTimeout(() => setSelectedPlan(null), 2000);
    };

    const plans = Object.values(allPlans);

    const comparisonFeatures = [
        { name: 'Contacts', free: '50', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Leads', free: '25', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Dashboard Analytics', free: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
        { name: 'Chatbot Assistant', free: true, pro: true, enterprise: true },
        { name: 'Voice Assistant', free: false, pro: true, enterprise: true },
        { name: 'Automation Rules', free: '0', pro: '10', enterprise: 'Unlimited' },
        { name: 'Data Export', free: false, pro: true, enterprise: true },
        { name: 'Custom Fields', free: false, pro: true, enterprise: true },
        { name: 'Team Collaboration', free: false, pro: false, enterprise: true },
        { name: 'API Access', free: false, pro: false, enterprise: true },
        { name: 'SSO / SAML', free: false, pro: false, enterprise: true },
        { name: 'Dedicated Support', free: false, pro: false, enterprise: true },
        { name: 'Audit Logs', free: false, pro: false, enterprise: true },
        { name: 'Support', free: 'Email', pro: 'Priority', enterprise: 'Dedicated Manager' },
    ];

    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <div className="pricing-badge">
                    <Crown size={14} />
                    <span>Pricing Plans</span>
                </div>
                <h1>Choose the right plan for your business</h1>
                <p>Start free, scale as you grow. All plans include a 14-day trial.</p>

                {/* Billing Toggle */}
                <div className="billing-toggle">
                    <span className={billingCycle === 'monthly' ? 'active' : ''} onClick={() => setBillingCycle('monthly')}>
                        Monthly
                    </span>
                    <div className="toggle-switch" onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}>
                        <div className={`toggle-knob ${billingCycle === 'annual' ? 'annual' : ''}`}></div>
                    </div>
                    <span className={billingCycle === 'annual' ? 'active' : ''} onClick={() => setBillingCycle('annual')}>
                        Annual <span className="save-badge">Save 17%</span>
                    </span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="pricing-grid">
                {plans.map(plan => {
                    const price = billingCycle === 'annual' ? plan.annualPrice : plan.price;
                    const monthlyPrice = billingCycle === 'annual' ? Math.round(plan.annualPrice / 12) : plan.price;
                    const isCurrent = currentPlan === plan.id;
                    const justSelected = selectedPlan === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrent ? 'current' : ''} ${justSelected ? 'selected-animation' : ''}`}
                        >
                            {plan.popular && <div className="popular-ribbon"><Star size={12} /> Most Popular</div>}
                            {isCurrent && <div className="current-badge">Current Plan</div>}

                            <h3 className="plan-name">{plan.name}</h3>

                            <div className="plan-price">
                                <span className="currency">$</span>
                                <span className="amount">{monthlyPrice}</span>
                                <span className="period">/mo</span>
                            </div>

                            {billingCycle === 'annual' && plan.price > 0 && (
                                <p className="annual-note">
                                    ${price}/year (save ${plan.price * 12 - plan.annualPrice})
                                </p>
                            )}

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <Check size={16} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`plan-btn ${plan.popular ? 'primary' : ''} ${isCurrent ? 'current-btn' : ''}`}
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isCurrent}
                            >
                                {isCurrent ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                                {!isCurrent && <ArrowRight size={16} />}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Comparison Table */}
            <div className="comparison-section">
                <h2>Feature Comparison</h2>
                <div className="comparison-table-wrapper">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Free</th>
                                <th className="highlight-col">Pro</th>
                                <th>Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonFeatures.map((feature, i) => (
                                <tr key={i}>
                                    <td>{feature.name}</td>
                                    <td>{renderValue(feature.free)}</td>
                                    <td className="highlight-col">{renderValue(feature.pro)}</td>
                                    <td>{renderValue(feature.enterprise)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const renderValue = (value) => {
    if (value === true) return <Check size={18} className="check-icon" />;
    if (value === false) return <X size={18} className="x-icon" />;
    return <span>{value}</span>;
};

export default Pricing;
