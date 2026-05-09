import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import FavoriteButton from '../../Components/UI/FavoriteButton';
import InquiryModal from '../../Components/UI/InquiryModal';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price ?? 0);
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

export default function BuyerBrowsePage({ properties, favorite_ids: initialFavoriteIds = [], filters }) {
    const list = properties?.data ?? [];
    const pagination = properties ?? {};
    const [filterType, setFilterType] = useState(filters?.type ?? 'all');
    const [viewMode, setViewMode] = useState('grid');
    const [favoriteSet, setFavoriteSet] = useState(() => new Set(initialFavoriteIds));
    const [inquiryProperty, setInquiryProperty] = useState(null);

    const handleFilterChange = (type) => {
        setFilterType(type);
        router.get('/buyer/properties', { type: type === 'all' ? null : type }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFavoriteChange = (propertyId) => (favorited) => {
        setFavoriteSet((prev) => {
            const next = new Set(prev);
            if (favorited) next.add(propertyId);
            else next.delete(propertyId);
            return next;
        });
    };

    return (
        <DashboardLayout title="Browse Properties | Haribon" role="buyer">
            <Head title="Browse Properties | Haribon" />

            <div className="mb-4">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Browse Properties</h1>
                <p className="mt-1 text-sm text-slate-500">All active listings, filtered to your needs.</p>
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {pagination.total || 0} {pagination.total === 1 ? 'Property' : 'Properties'}
                        </h2>
                        <p className="text-xs text-slate-500">
                            {filterType === 'all' ? 'Showing all listings' : `Showing ${filterType} properties`}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                            {['all', 'sale', 'rent', 'lease'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleFilterChange(type)}
                                    className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
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
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 text-sm font-medium ${
                                    viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                Grid
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 text-sm font-medium ${
                                    viewMode === 'list' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {list.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8">
                    <svg className="mb-3 h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-900">No properties found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try selecting a different category.</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-3'}>
                    {list.map((property) => {
                        const img = property.images?.[0]?.image_path;
                        const isFavorited = favoriteSet.has(property.id);
                        return (
                            <div
                                key={property.id}
                                className={`group relative rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md ${
                                    viewMode === 'list' ? 'flex' : ''
                                }`}
                            >
                                <Link
                                    href={`/properties/${property.id}`}
                                    className={`relative block overflow-hidden bg-slate-100 ${
                                        viewMode === 'list' ? 'w-48 flex-shrink-0 rounded-l-2xl' : 'aspect-[4/3] rounded-t-2xl'
                                    }`}
                                >
                                    {img ? (
                                        <img
                                            src={`/storage/${img}`}
                                            alt={property.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8l7-5 7 5v13" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute left-2 top-2">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getTypeColor(property.type)}`}>
                                            {getTypeLabel(property.type)}
                                        </span>
                                    </div>
                                </Link>

                                <div className="absolute right-2 top-2 z-10">
                                    <FavoriteButton
                                        propertyId={property.id}
                                        initialFavorited={isFavorited}
                                        size="sm"
                                        onChange={handleFavoriteChange(property.id)}
                                    />
                                </div>

                                <div className={`flex flex-col p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                    <Link href={`/properties/${property.id}`} className="block">
                                        <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                                            {property.title}
                                        </h3>
                                        <div className="mt-1 flex items-baseline gap-1.5">
                                            <span className="text-base font-bold text-emerald-700">{formatPrice(property.price_total)}</span>
                                            {property.lot_area_sqm ? (
                                                <span className="text-xs text-slate-500">· {property.lot_area_sqm} sqm</span>
                                            ) : null}
                                        </div>
                                        {property.location?.address ? (
                                            <p className="mt-1 line-clamp-2 text-xs text-slate-600">{property.location.address}</p>
                                        ) : null}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setInquiryProperty(property)}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                        </svg>
                                        Message Seller
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {pagination.last_page > 1 ? (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">
                        Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.get('/buyer/properties', { page: pagination.current_page - 1, type: filterType === 'all' ? null : filterType }, { preserveState: true })}
                            disabled={!pagination.prev_page_url}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-medium text-slate-700">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <button
                            type="button"
                            onClick={() => router.get('/buyer/properties', { page: pagination.current_page + 1, type: filterType === 'all' ? null : filterType }, { preserveState: true })}
                            disabled={!pagination.next_page_url}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : null}

            <InquiryModal
                show={!!inquiryProperty}
                onClose={() => setInquiryProperty(null)}
                property={inquiryProperty}
            />
        </DashboardLayout>
    );
}
