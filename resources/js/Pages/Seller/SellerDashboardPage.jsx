import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Toast from '../../Components/UI/Toast';

export default function SellerDashboardPage() {
    const { props } = usePage();
    const [toast, setToast] = useState({
        show: false,
        type: 'success',
        message: '',
    });

    useEffect(() => {
        console.log('SellerDashboardPage loaded');
        if (props.flash?.loginSuccess) {
            setToast({
                show: true,
                type: 'success',
                message: `Login Success, Hello ${props.flash.loginSuccess}`,
            });
        }
    }, [props.flash]);

    return (
        <DashboardLayout title="Seller Dashboard">
            <Head title="Seller Dashboard" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
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
