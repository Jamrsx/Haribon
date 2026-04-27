import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Toast from '../../Components/UI/Toast';

export default function PropertyListPage() {
    const { props } = usePage();
    const properties = props.properties || [];
    const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        if (props.flash?.success) {
            setToast({ show: true, type: 'success', message: props.flash.success });
        }
    }, [props.flash]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleDelete = (propertyId, e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            router.delete(`/seller/properties/${propertyId}`, {
                onSuccess: () => {
                    setToast({ show: true, type: 'success', message: 'Property deleted successfully' });
                },
                onError: () => {
                    setToast({ show: true, type: 'error', message: 'Failed to delete property' });
                },
            });
        }
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

    return (
        <DashboardLayout title="My Properties">
            <Head title="My Properties" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">My Properties</h1>
                    <p className="text-xs text-slate-500">{filteredProperties.length} of {properties.length} listing{properties.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                        {['all', 'sale', 'rent', 'lease'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                                    filterType === type
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {type === 'all' ? 'All' : type}
                            </button>
                        ))}
                    </div>
                    <Link
                        href="/seller/properties/create"
                        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Property
                    </Link>
                </div>
            </div>

            {filteredProperties.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8">
                    <svg className="mb-3 h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-sm font-medium text-slate-900">
                        {filterType === 'all' ? 'No properties listed yet' : `No ${filterType} properties`}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        {filterType === 'all' ? 'Create your first property listing to get started' : 'Try selecting a different filter'}
                    </p>
                    {filterType === 'all' && (
                        <Link
                            href="/seller/properties/create"
                            className="mt-3 inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                        >
                            Create Property
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProperties.map((property) => (
                        <Link
                            key={property.id}
                            href={`/seller/properties/${property.id}/edit`}
                            className="group block rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-slate-100">
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
                                </div>
                                <div className="absolute right-2 top-2">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
                                            property.is_active
                                                ? 'bg-white/90 text-emerald-700'
                                                : 'bg-white/90 text-slate-600'
                                        }`}
                                    >
                                        {property.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="line-clamp-1 text-sm font-medium text-slate-900 group-hover:text-emerald-700">
                                    {property.title}
                                </h3>
                                <div className="mt-1.5 flex items-baseline gap-1.5">
                                    <span className="text-sm font-semibold text-slate-900">
                                        {formatPrice(property.price_total)}
                                    </span>
                                    {property.lot_area_sqm && (
                                        <span className="text-[11px] text-slate-500">
                                            · {property.lot_area_sqm} sqm
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(property.created_at).toLocaleDateString('en-PH', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <button
                                        onClick={(e) => handleDelete(property.id, e)}
                                        className="text-[10px] font-medium text-rose-600 hover:text-rose-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
