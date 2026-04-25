import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import Toast from '../../Components/UI/Toast';

export default function FavoritePropertiesPage() {
    const { props } = usePage();
    const [toast, setToast] = useState({
        show: false,
        type: 'success',
        message: '',
    });

    useEffect(() => {
        console.log('FavoritePropertiesPage loaded');
        if (props.flash?.loginSuccess) {
            setToast({
                show: true,
                type: 'success',
                message: `Login Success, Hello ${props.flash.loginSuccess}`,
            });
        }
    }, [props.flash]);

    return (
        <MainLayout>
            <Head title="Buyer Favorites" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
            <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h1 className="text-2xl font-bold text-slate-900">Buyer Page</h1>
                    <p className="mt-2 text-slate-600">
                        This is the buyer area. Saved properties and recommendation tools will appear here.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/properties"
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Browse Properties
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
