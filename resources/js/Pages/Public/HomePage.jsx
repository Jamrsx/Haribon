import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Header from '../../Components/UI/Header';
import Footer from '../../Components/UI/Footer';

export default function HomePage() {
    const { props } = usePage();
    const properties = props.properties?.data || [];
    const pagination = props.properties || {};
    const [viewMode, setViewMode] = useState('list');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [radius, setRadius] = useState(10);
    const [loadingNearMe, setLoadingNearMe] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const isPremiumSeller = (property) => {
        if (!property.user?.subscription) return false;
        const subscription = property.user.subscription;
        const plan = subscription.plan;
        if (!plan) return false;
        // Premium if they have an active 1-year subscription (365 days) or lifetime plan
        return subscription.status === 'active' && plan.duration_days >= 365;
    };

    const handleNearMe = () => {
        setLoadingNearMe(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation({ lat, lng });
                    
                    router.get('/', { lat, lng, radius_km: radius }, {
                        preserveState: true,
                        onFinish: () => {
                            setLoadingNearMe(false);
                            setViewMode('map');
                        },
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLoadingNearMe(false);
                    alert('Unable to get your location. Please enable location services.');
                }
            );
        } else {
            setLoadingNearMe(false);
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleShowAll = () => {
        setUserLocation(null);
        router.get('/', {}, { preserveState: true });
    };

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        if (selectedProperty && selectedProperty.images && selectedProperty.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedProperty]);

    // Reset image index when property changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedProperty]);

    const handlePrevImage = () => {
        if (selectedProperty && selectedProperty.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
        }
    };

    const handleNextImage = () => {
        if (selectedProperty && selectedProperty.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Head title="Haribon | Find Your Next Property" />
            <Header />
            <main className="flex-1">
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/30 via-transparent to-transparent" />
                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="text-center">
                            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 backdrop-blur-sm">
                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Haribon Real Estate Marketplace
                            </div>
                            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Find your next property with
                                <span className="block text-emerald-600">clarity and confidence</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                                Explore verified listings, compare prices quickly, and use map-based discovery to find the best property for your needs.
                            </p>
                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                <button
                                    onClick={handleNearMe}
                                    disabled={loadingNearMe}
                                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingNearMe ? (
                                        <>
                                            <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Locating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Find Near Me
                                        </>
                                    )}
                                </button>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href="/map"
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
                                    >
                                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        Explore on Map
                                    </Link>
                                    <Link
                                        href="/listings"
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
                                    >
                                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        View All Listings
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center backdrop-blur-sm shadow-sm">
                                <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <p className="mt-3 text-3xl font-bold text-slate-900">{pagination.total || 0}</p>
                                <p className="mt-1 text-sm text-slate-600">Available Listings</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center backdrop-blur-sm shadow-sm">
                                <div className="mx-auto h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <p className="mt-3 text-3xl font-bold text-slate-900">Live</p>
                                <p className="mt-1 text-sm text-slate-600">Map Discovery</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center backdrop-blur-sm shadow-sm">
                                <div className="mx-auto h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="mt-3 text-3xl font-bold text-slate-900">Free</p>
                                <p className="mt-1 text-sm text-slate-600">Buyer Access</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center backdrop-blur-sm shadow-sm">
                                <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="mt-3 text-3xl font-bold text-slate-900">Fast</p>
                                <p className="mt-1 text-sm text-slate-600">Seller Publishing</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {pagination.total || 0} {pagination.total === 1 ? 'Property' : 'Properties'}
                                </h2>
                                {userLocation && (
                                    <p className="mt-1 text-sm text-slate-600 flex items-center gap-1.5">
                                        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Showing within {radius} km of your location
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {userLocation && (
                                    <button
                                        onClick={handleShowAll}
                                        className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                        Show All
                                    </button>
                                )}
                                <button
                                    onClick={handleNearMe}
                                    disabled={loadingNearMe}
                                    className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingNearMe ? (
                                        <>
                                            <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Locating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Near Me
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all ${
                                            viewMode === 'list'
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                        List
                                    </button>
                                    <button
                                        onClick={() => setViewMode('map')}
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all ${
                                            viewMode === 'map'
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        Map
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {viewMode === 'list' ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {properties.map((property) => (
                                <div
                                    key={property.id}
                                    onClick={() => setSelectedProperty(property)}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100/20"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                        {property.images && property.images.length > 0 ? (
                                            <img
                                                src={`/storage/${property.images[0].image_path}`}
                                                alt={property.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                                <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute left-3 top-3 flex gap-2">
                                            <div className="rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                                                {property.lot_area_sqm ? `${property.lot_area_sqm} sqm` : 'Lot Property'}
                                            </div>
                                            {isPremiumSeller(property) && (
                                                <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                                                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Premium
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-emerald-700">
                                            {property.title}
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-emerald-600">
                                                {formatPrice(property.price_total)}
                                            </span>
                                            {property.lot_area_sqm && (
                                                <span className="text-sm text-slate-500">· {property.lot_area_sqm} sqm</span>
                                            )}
                                        </div>
                                        {property.reviews_count > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center">
                                                    <span className="text-amber-400 text-sm">
                                                        {'★'.repeat(Math.round(Number(property.average_rating) || 0))}
                                                        <span className="text-slate-300">{'★'.repeat(5 - Math.round(Number(property.average_rating) || 0))}</span>
                                                    </span>
                                                    <span className="ml-1.5 text-sm font-medium text-slate-900">{Number(property.average_rating || 0).toFixed(1)}</span>
                                                </div>
                                                <span className="text-xs text-slate-500">({property.reviews_count} reviews)</span>
                                            </div>
                                        )}
                                        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                            {property.location?.address ? (
                                                <div className="flex items-start gap-2">
                                                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <p className="line-clamp-2 text-sm text-slate-600">
                                                        {property.location.address}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 italic">
                                                    Location details available on property view
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                                <p className="text-xs text-slate-500">
                                    Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} results
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => router.get('/', { page: pagination.current_page - 1 }, { preserveState: true })}
                                        disabled={!pagination.prev_page_url}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-xs font-medium text-slate-700">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <button
                                        onClick={() => router.get('/', { page: pagination.current_page + 1 }, { preserveState: true })}
                                        disabled={!pagination.next_page_url}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-4 py-3">
                                <p className="text-sm font-semibold text-slate-900">Property Map View</p>
                                <p className="text-xs text-slate-500">Click below to view properties on an interactive map.</p>
                            </div>
                            <div className="flex h-[560px] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5-5V7l5-5 5 5v12l-5 5zm0 0V8.5M15 12l5-5V2l-5 5-5-5v12l5 5zm0 0V8.5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Interactive Map View</h3>
                                    <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
                                        View all properties on an interactive map with advanced filtering and search capabilities.
                                    </p>
                                    <Link
                                        href="/map"
                                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
                                    >
                                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5-5V7l5-5 5 5v12l-5 5zm0 0V8.5M15 12l5-5V2l-5 5-5-5v12l5 5zm0 0V8.5" />
                                        </svg>
                                        Open Map View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {selectedProperty && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedProperty(null)}>
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 py-4">
                            <h3 className="text-xl font-bold text-slate-900">{selectedProperty.title}</h3>
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-6 p-6">
                            {selectedProperty.images && selectedProperty.images.length > 0 && (
                                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100">
                                    <img
                                        src={`/storage/${selectedProperty.images[currentImageIndex].image_path}`}
                                        alt={selectedProperty.title}
                                        className="h-full w-full object-cover"
                                    />
                                    {selectedProperty.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition-all hover:bg-black/80 hover:scale-110"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition-all hover:bg-black/80 hover:scale-110"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                                                {currentImageIndex + 1} / {selectedProperty.images.length}
                                            </div>
                                            <div className="absolute bottom-4 right-4 flex gap-2">
                                                {selectedProperty.images.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`h-2 w-2 rounded-full transition-all ${
                                                            index === currentImageIndex
                                                                ? 'bg-white w-8'
                                                                : 'bg-white/50 hover:bg-white/75'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {formatPrice(selectedProperty.price_total)}
                                    </p>
                                    {selectedProperty.lot_area_sqm && (
                                        <p className="mt-2 text-lg text-slate-600">{selectedProperty.lot_area_sqm} sqm</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end">
                                    <Link
                                        href={`/properties/${selectedProperty.id}`}
                                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
                                    >
                                        View Full Details
                                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            {selectedProperty.description && (
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Description</h4>
                                    <p className="text-base leading-relaxed text-slate-700">{selectedProperty.description}</p>
                                </div>
                            )}
                            {selectedProperty.location?.address && (
                                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                                            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Address</p>
                                            <p className="mt-2 text-base text-slate-700">{selectedProperty.location.address}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedProperty.contact && (
                                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</p>
                                            <p className="mt-2 text-base font-medium text-slate-900">{selectedProperty.contact}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedProperty.user && (
                                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={selectedProperty.user.profile_picture ? `/storage/${selectedProperty.user.profile_picture}` : '/storage/Hari/haribon-smile.png'}
                                            alt="Seller"
                                            className="h-20 w-20 rounded-2xl border-2 border-white object-cover shadow-lg"
                                            onError={(e) => {
                                                e.target.src = '/storage/Hari/haribon-smile.png';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Seller</p>
                                                {isPremiumSeller(selectedProperty) && (
                                                    <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Premium
                                                    </div>
                                                )}
                                            </div>
                                            <p className="mt-2 text-lg font-medium text-slate-900">{selectedProperty.user.name}</p>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {selectedProperty.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
