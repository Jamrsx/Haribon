import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function PropertyListPage() {
    return (
        <DashboardLayout title="My Properties">
            <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
            <p className="mt-2 text-slate-600">Your created property listings will appear here.</p>
        </DashboardLayout>
    );
}
