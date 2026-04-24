import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function SubscriptionSuccessPage() {
    return (
        <DashboardLayout title="Subscription Success">
            <h1 className="text-2xl font-bold text-slate-900">Subscription Success</h1>
            <p className="mt-2 text-slate-600">Payment confirmation and next steps will appear here.</p>
        </DashboardLayout>
    );
}
