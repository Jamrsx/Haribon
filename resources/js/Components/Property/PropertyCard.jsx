import React from 'react';
import { Link } from '@inertiajs/react';

export default function PropertyCard({ property }) {
    const detailsHref = `/properties/${property.id}`;

    return (
        <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="h-44 w-full bg-gradient-to-br from-emerald-100 to-green-200" />
            <div className="space-y-3 p-4">
                <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{property.title}</h3>
                <p className="line-clamp-2 text-sm text-slate-600">{property.description}</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="text-base font-bold text-emerald-700">
                            PHP {Number(property.price_total).toLocaleString()}
                        </p>
                    </div>
                    <Link
                        href={detailsHref}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        View
                    </Link>
                </div>
            </div>
        </article>
    );
}
