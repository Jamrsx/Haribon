import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

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

const formatRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
};

function StatCard({ title, value, accent, icon, href }) {
    const card = (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${accent}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
    return href ? <Link href={href}>{card}</Link> : card;
}

export default function BuyerDashboardPage({ stats: initialStats, recent_favorites: recentFavorites = [], recent_conversations: initialConversations = [] }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name ?? 'Buyer';

    const [stats, setStats] = useState(initialStats ?? {});
    const [recentConversations, setRecentConversations] = useState(initialConversations ?? []);

    useEffect(() => {
        setRecentConversations(initialConversations ?? []);
    }, [initialConversations]);

    useEffect(() => {
        setStats(initialStats ?? {});
    }, [initialStats]);

    useEffect(() => {
        let timerId;

        const tick = async () => {
            if (typeof document !== 'undefined' && document.hidden) return;
            try {
                const res = await fetch('/api/messages/poll', {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                });
                if (!res.ok) return;
                const data = await res.json();

                if (Array.isArray(data.conversations)) {
                    // Mirror the controller's selection: most-recent 3 where the user is the buyer.
                    const buyerConvos = data.conversations
                        .filter((c) => c.buyer_id === auth?.user?.id)
                        .slice(0, 3);
                    setRecentConversations(buyerConvos);
                }
                if (typeof data.unread_count === 'number') {
                    setStats((prev) => ({ ...prev, unread_count: data.unread_count }));
                }
                console.log('[BuyerDashboard] poll → unread:', data.unread_count);
            } catch (err) {
                console.warn('[BuyerDashboard] poll failed', err);
            }
        };

        tick();
        timerId = setInterval(tick, 10000);
        return () => clearInterval(timerId);
    }, [auth?.user?.id]);

    return (
        <DashboardLayout title="Buyer Dashboard | Haribon" role="buyer">
            <Head title="Buyer Dashboard | Haribon" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back, {userName.split(' ')[0]}.</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Browse listings, save your favorites, and manage your conversations with sellers.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                    title="Saved Properties"
                    value={stats?.favorites_count ?? 0}
                    accent="bg-rose-50"
                    href="/buyer/favorites"
                    icon={
                        <svg className="h-6 w-6 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Conversations"
                    value={stats?.conversations_count ?? 0}
                    accent="bg-emerald-50"
                    href="/messages"
                    icon={
                        <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Unread Messages"
                    value={stats?.unread_count ?? 0}
                    accent="bg-amber-50"
                    href="/messages"
                    icon={
                        <svg className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    }
                />
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                <Link
                    href="/buyer/properties"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3" />
                    </svg>
                    Browse Properties
                </Link>
                <Link
                    href="/buyer/map"
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 20l-6-3V5l6 3 6-3 6 3v12l-6-3-6 3z" />
                    </svg>
                    Map View
                </Link>
                <Link
                    href="/buyer/favorites"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <svg className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    My Favorites
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Recently Saved</h2>
                            <p className="text-xs text-slate-500">Your latest favorited properties.</p>
                        </div>
                        <Link href="/buyer/favorites" className="text-xs font-medium text-emerald-700 hover:underline">
                            View all →
                        </Link>
                    </header>
                    <div className="divide-y divide-slate-100">
                        {recentFavorites.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm text-slate-500">You haven't saved any properties yet.</p>
                                <Link href="/buyer/properties" className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline">
                                    Browse listings →
                                </Link>
                            </div>
                        ) : (
                            recentFavorites.map((property) => {
                                const img = property.images?.[0]?.image_path;
                                return (
                                    <Link
                                        key={property.id}
                                        href={`/properties/${property.id}`}
                                        className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                                    >
                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                            {img ? (
                                                <img src={`/storage/${img}`} alt={property.title} className="h-full w-full object-cover" />
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-1 text-sm font-medium text-slate-900">{property.title}</p>
                                            <p className="text-xs font-semibold text-emerald-700">{formatPrice(property.price_total)}</p>
                                            {property.location?.address ? (
                                                <p className="line-clamp-1 text-[11px] text-slate-500">{property.location.address}</p>
                                            ) : null}
                                        </div>
                                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${getTypeColor(property.type)}`}>
                                            {getTypeLabel(property.type)}
                                        </span>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Recent Conversations</h2>
                            <p className="text-xs text-slate-500">Latest messages with sellers.</p>
                        </div>
                        <Link href="/messages" className="text-xs font-medium text-emerald-700 hover:underline">
                            View all →
                        </Link>
                    </header>
                    <div className="divide-y divide-slate-100">
                        {recentConversations.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm text-slate-500">No conversations yet.</p>
                                <Link href="/buyer/properties" className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline">
                                    Find a property to inquire →
                                </Link>
                            </div>
                        ) : (
                            recentConversations.map((c) => {
                                const img = c.property?.images?.[0]?.image_path;
                                const lastMsg = c.latest_message?.body ?? 'No messages yet';
                                const unread = Number(c.unread_count ?? 0);
                                const hasUnread = unread > 0;
                                return (
                                    <Link
                                        key={c.id}
                                        href={`/messages/${c.id}`}
                                        className={`flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50 ${
                                            hasUnread ? 'bg-rose-50/40' : ''
                                        }`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={c.seller?.profile_picture ? `/storage/${c.seller.profile_picture}` : '/storage/Hari/haribon-smile.png'}
                                                alt={c.seller?.name ?? ''}
                                                className="h-10 w-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/storage/Hari/haribon-smile.png';
                                                }}
                                            />
                                            {hasUnread ? (
                                                <span className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-rose-500" aria-label={`${unread} unread`} />
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`truncate text-sm ${hasUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-900'}`}>
                                                    {c.seller?.name ?? 'Seller'}
                                                </p>
                                                <div className="flex flex-shrink-0 items-center gap-1.5">
                                                    {hasUnread ? (
                                                        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                                                            {unread > 9 ? '9+' : unread}
                                                        </span>
                                                    ) : null}
                                                    <span className={`text-[10px] ${hasUnread ? 'font-semibold text-rose-600' : 'text-slate-400'}`}>
                                                        {formatRelativeDate(c.last_message_at ?? c.updated_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="line-clamp-1 text-[11px] text-slate-500">
                                                <span className="font-medium text-slate-600">{c.property?.title}</span>
                                            </p>
                                            <p className={`line-clamp-1 text-xs ${hasUnread ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                                                {lastMsg}
                                            </p>
                                        </div>
                                        {img ? (
                                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                <img src={`/storage/${img}`} alt={c.property?.title} className="h-full w-full object-cover" />
                                            </div>
                                        ) : null}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
