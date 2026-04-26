import React, { useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import SubscriptionPlanCard from '../../Components/Subscription/SubscriptionPlanCard';
import { router } from '@inertiajs/react';

export default function SubscriptionPlansPage({ plans, active_plan_id }) {
    const [loading, setLoading] = useState(false);

    const handleSelectPlan = async (planId) => {
        setLoading(true);
        try {
            const response = await fetch('/api/payment/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ plan_id: planId }),
            });

            const data = await response.json();

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Subscription Plans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900">Choose Your Plan</h1>
                <p className="mt-2 text-slate-600">Select a plan to upgrade your subscription</p>

                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="flex-shrink-0">
                            <img 
                                src="/storage/Hari/opem.png" 
                                alt="Platform Support" 
                                className="h-42 w-42 rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-semibold text-blue-900">Why Subscribe?</p>
                            </div>
                            <p className="mt-2 text-sm text-blue-800 leading-relaxed">
                                Your subscription helps fund the development and maintenance of this platform. Proceeds cover essential costs including web hosting, server infrastructure, domain registration, security services, and ongoing feature development. By subscribing, you're directly supporting the platform's sustainability and enabling us to continue improving the service for all users.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                        <SubscriptionPlanCard
                            key={plan.id}
                            plan={plan}
                            onSelectPlan={handleSelectPlan}
                            disabled={loading}
                            isActive={plan.id === active_plan_id}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
