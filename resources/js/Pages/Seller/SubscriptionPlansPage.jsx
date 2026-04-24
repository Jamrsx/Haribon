import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function SubscriptionPlansPage() {
    return (
        <DashboardLayout title="Subscription Plans">
            <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
            <p className="mt-2 text-slate-600">Available 6-month and 1-year plans will be listed here.</p>
        </DashboardLayout>
    );
}
