import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};

const PLANS = {
    free: {
        id: 'free',
        name: 'Free',
        price: 0,
        annualPrice: 0,
        features: [
            'Up to 50 contacts',
            'Up to 25 leads',
            'Basic dashboard',
            'Email support',
            'Chatbot assistant',
        ],
        limits: {
            contacts: 50,
            leads: 25,
            customers: 25,
            automations: 0,
        }
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 29,
        annualPrice: 290,
        popular: true,
        features: [
            'Unlimited contacts',
            'Unlimited leads',
            'Advanced analytics',
            'Priority support',
            'Voice assistant',
            'Up to 10 automation rules',
            'Export data (CSV/PDF)',
            'Custom fields',
        ],
        limits: {
            contacts: Infinity,
            leads: Infinity,
            customers: Infinity,
            automations: 10,
        }
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        annualPrice: 990,
        features: [
            'Everything in Pro',
            'Unlimited automations',
            'Team collaboration',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
            'White-label options',
            'SSO / SAML',
            'Audit logs',
        ],
        limits: {
            contacts: Infinity,
            leads: Infinity,
            customers: Infinity,
            automations: Infinity,
        }
    }
};

export const SubscriptionProvider = ({ children }) => {
    const { user } = useAuth();
    const [currentPlan, setCurrentPlan] = useState('free');
    const [billingCycle, setBillingCycle] = useState('monthly');

    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`cp-plan-${user.id}`);
            if (saved) setCurrentPlan(saved);
        }
    }, [user]);

    const upgradePlan = (planId) => {
        setCurrentPlan(planId);
        if (user) {
            localStorage.setItem(`cp-plan-${user.id}`, planId);
        }
    };

    const getPlanDetails = (planId) => PLANS[planId] || PLANS.free;
    const currentPlanDetails = getPlanDetails(currentPlan);

    const canAccess = (feature) => {
        const limits = currentPlanDetails.limits;
        switch (feature) {
            case 'automation': return limits.automations > 0;
            case 'voice': return currentPlan !== 'free';
            case 'export': return currentPlan !== 'free';
            case 'teams': return currentPlan === 'enterprise';
            case 'api': return currentPlan === 'enterprise';
            default: return true;
        }
    };

    const isWithinLimit = (type, count) => {
        const limit = currentPlanDetails.limits[type];
        return limit === Infinity || count < limit;
    };

    return (
        <SubscriptionContext.Provider value={{
            currentPlan,
            currentPlanDetails,
            billingCycle,
            setBillingCycle,
            upgradePlan,
            getPlanDetails,
            canAccess,
            isWithinLimit,
            allPlans: PLANS,
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};
