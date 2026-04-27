import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Header from '../../Components/UI/Header';
import Footer from '../../Components/UI/Footer';

export default function AllListingsPage() {
    const { props } = usePage();
    const properties = props.properties || [];
    const [filterType, setFilterType] = useState('all');
    const [viewMode, setViewMode] = useState('list');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const filteredProperties = filterType === 'all'
        ? properties
        : properties.filter((property) => property.type === filterType);

    const getTypeLabel = (type) => {
        switch (type) {
            case 'sale':
                return 'For Sale';
            case 'rent':
                return 'For Rent';
            case 'lease':
                return 'For Lease';
            default:
                return type;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'sale':
                return 'bg-emerald-100 text-emerald-700';
            case 'rent':
                return 'bg-blue-100 text-blue-700';
            case 'lease':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const isPremiumSeller = (property) => {
        if (!property.user?.subscription) return false;
        const subscription = property.user.subscription;
        const plan = subscription.plan;
        if (!plan) return false;
        // Premium if they have an active 1-year subscription (365 days) or lifetime plan
        return subscription.status === 'active' && plan.duration_days >= 365;
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
        router.get('/listings', { type: type === 'all' ? null : type }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Head title="All Listings | Haribon" />
            <Header />
            <main className="flex-1">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <Link
                                href="/"
                                className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">All Property Listings</h1>
                        <p className="mt-2 text-slate-600">
                            Browse all available properties for sale, rent, and lease
                        </p>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                                    {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'}
                                </h2>
                                <p className="text-xs text-slate-500 sm:text-sm">
                                    {filterType === 'all' ? 'Showing all listings' : `Showing ${filterType} properties`}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                                    {['all', 'sale', 'rent', 'lease'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleFilterChange(type)}
                                            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                                                filterType === type
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {type === 'all' ? 'All' : type}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            viewMode === 'list'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        List
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            viewMode === 'grid'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        Grid
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredProperties.length === 0 ? (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8">
                            <svg className="mb-4 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-lg font-medium text-slate-900">
                                {filterType === 'all' ? 'No properties found' : `No ${filterType} properties found`}
                            </h3>
                            <p className="mt-2 text-slate-500">
                                {filterType === 'all' ? 'Check back later for new listings' : 'Try selecting a different category'}
                            </p>
                        </div>
                    ) : (
                        <div className={viewMode === 'list' ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
                            {filteredProperties.map((property) => (
                                <Link
                                    key={property.id}
                                    href={`/properties/${property.id}`}
                                    className={`group block rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md ${
                                        viewMode === 'list' ? 'flex' : ''
                                    }`}
                                >
                                    <div className={`relative overflow-hidden bg-slate-100 ${
                                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                                    }`}>
                                        {property.images && property.images.length > 0 ? (
                                            <img
                                                src={`/storage/${property.images[0].image_path}`}
                                                alt={property.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute left-2 top-2 flex gap-1">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${getTypeColor(property.type)}`}
                                            >
                                                {getTypeLabel(property.type)}
                                            </span>
                                            {isPremiumSeller(property) && (
                                                <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                                                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Premium
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                        <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                                            {property.title}
                                        </h3>
                                        <div className="mt-2 flex items-baseline gap-1.5">
                                            <span className="text-base font-bold text-emerald-700">
                                                {formatPrice(property.price_total)}
                                            </span>
                                            {property.lot_area_sqm && (
                                                <span className="text-xs text-slate-500">
                                                    · {property.lot_area_sqm} sqm
                                                </span>
                                            )}
                                        </div>
                                        {property.location?.address && (
                                            <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                                                {property.location.address}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
