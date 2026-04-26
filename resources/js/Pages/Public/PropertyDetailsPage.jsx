import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/UI/Header';
import Footer from '../../Components/UI/Footer';

export default function PropertyDetailsPage({ property }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price ?? 0);
    };

    const primaryImage = property?.images?.[0]?.image_path;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Head title={`${property?.title ?? 'Property'} | Haribon`} />
            <Header />

            <main className="flex-1">
                <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        >
                            <span aria-hidden="true">←</span>
                            Back to Listings
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid gap-0 lg:grid-cols-2">
                            <div className="aspect-[4/3] bg-slate-100">
                                {primaryImage ? (
                                    <img
                                        src={`/storage/${primaryImage}`}
                                        alt={property?.title ?? 'Property image'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        No image available
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 p-5 sm:p-6">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {property?.title ?? 'Property'}
                                </h1>

                                <p className="text-2xl font-bold text-emerald-700">
                                    {formatPrice(property?.price_total)}
                                </p>

                                {property?.description && (
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        {property.description}
                                    </p>
                                )}

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Lot Area</p>
                                        <p className="mt-1 text-sm font-medium text-slate-900">
                                            {property?.lot_area_sqm ? `${property.lot_area_sqm} sqm` : 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Contact</p>
                                        <p className="mt-1 text-sm font-medium text-slate-900">
                                            {property?.contact || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {property?.location?.address && (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Address</p>
                                        <p className="mt-1 text-sm text-slate-700">{property.location.address}</p>
                                    </div>
                                )}

                                {property?.user && (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Seller</p>
                                        <p className="mt-1 text-sm font-medium text-slate-900">{property.user.name}</p>
                                        <p className="text-xs text-slate-600">{property.user.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
