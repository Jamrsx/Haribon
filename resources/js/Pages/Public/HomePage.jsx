import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import PropertyCard from '../../Components/Property/PropertyCard';

const featuredProperties = [
    {
        id: 1,
        title: 'Prime Lot in Cagayan de Oro',
        description: 'Clean title, near highway access, suitable for residential development.',
        price_total: 3500000,
    },
    {
        id: 2,
        title: 'Commercial Corner Lot',
        description: 'High foot traffic area with strong business potential.',
        price_total: 8200000,
    },
    {
        id: 3,
        title: 'Farm Lot with Mountain View',
        description: 'Peaceful location ideal for rest house or agri-business.',
        price_total: 2400000,
    },
];

export default function HomePage() {
    useEffect(() => {
        console.log('HomePage loaded');
    }, []);

    return (
        <MainLayout>
            <Head title="Haribon | Find Your Next Property" />

            <section className="bg-gradient-to-b from-emerald-50 to-slate-50">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                    <div className="max-w-3xl">
                        <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Real Estate Marketplace
                        </p>
                        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Discover lots and properties with confidence
                        </h1>
                        <p className="mt-4 text-base text-slate-600 sm:text-lg">
                            Browse listings as a buyer without login, or sign up as a seller and publish your property
                            with map location and lot boundary support.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link
                                href="/properties"
                                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Browse Properties
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                Become a Seller
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Featured Properties</h2>
                    <Link href="/properties" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                        See all
                    </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
