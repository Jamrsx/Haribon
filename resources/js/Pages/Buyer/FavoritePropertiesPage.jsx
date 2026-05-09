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

export default function FavoritePropertiesPage({ favorites, favorite_ids: initialFavoriteIds = [] }) {
    const list = favorites?.data ?? [];
    const pagination = favorites ?? {};
    const [favoriteSet, setFavoriteSet] = useState(() => new Set(initialFavoriteIds));
    const [inquiryProperty, setInquiryProperty] = useState(null);

    const handleFavoriteChange = (propertyId) => (favorited) => {
        setFavoriteSet((prev) => {
            const next = new Set(prev);
            if (favorited) next.add(propertyId);
            else next.delete(propertyId);
            return next;
        });
        if (!favorited) {
            console.log('[Favorites] removed', propertyId, '— refreshing list');
            router.reload({ only: ['favorites', 'favorite_ids'] });
        }
    };

    return (
        <DashboardLayout title="My Favorites | Haribon" role="buyer">
            <Head title="My Favorites | Haribon" />

            <div className="mb-6 flex items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Favorites</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {pagination.total ?? 0} saved {pagination.total === 1 ? 'property' : 'properties'}.
                    </p>
                </div>
                <Link
                    href="/buyer/properties"
                    className="hidden rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 sm:inline-flex"
                >
                    Browse More
                </Link>
            </div>

            {list.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <svg className="mb-3 h-12 w-12 text-rose-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-900">No favorites yet</h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Tap the heart icon on any property to save it here for quick access later.
                    </p>
                    <Link
                        href="/buyer/properties"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Browse Properties
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {list.map((property) => {
                        const img = property.images?.[0]?.image_path;
                        const isFavorited = favoriteSet.has(property.id);
                        return (
                            <div
                                key={property.id}
                                className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <Link
                                    href={`/properties/${property.id}`}
                                    className="relative block aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100"
                                >
                                    {img ? (
                                        <img
                                            src={`/storage/${img}`}
                                            alt={property.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-300">No image</div>
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

                                <div className="flex flex-col p-4">
                                    <Link href={`/properties/${property.id}`}>
                                        <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                                            {property.title}
                                        </h3>
                                        <p className="mt-1 text-base font-bold text-emerald-700">{formatPrice(property.price_total)}</p>
                                        {property.location?.address ? (
                                            <p className="mt-1 line-clamp-2 text-xs text-slate-600">{property.location.address}</p>
                                        ) : null}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setInquiryProperty(property)}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
                                    >
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
                            onClick={() => router.get('/buyer/favorites', { page: pagination.current_page - 1 }, { preserveState: true })}
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
                            onClick={() => router.get('/buyer/favorites', { page: pagination.current_page + 1 }, { preserveState: true })}
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
