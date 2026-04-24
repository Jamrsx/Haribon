import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function SellerDashboardPage() {
    useEffect(() => {
        console.log('SellerDashboardPage loaded');
    }, []);

    return (
        <DashboardLayout title="Seller Dashboard">
            <Head title="Seller Dashboard" />
            <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome back. Manage your listings and subscription here.</p>
            <div className="mt-6">
                <Link
                    href="/seller/properties/create"
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    Add Property
                </Link>
            </div>
        </DashboardLayout>
    );
}
