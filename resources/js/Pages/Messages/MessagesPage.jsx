import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price ?? 0);
};

const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const diff = (now - date) / (1000 * 60 * 60 * 24);
    if (diff < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatBubbleTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getTypeBadgeColor = (type) => {
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

export default function MessagesPage({ conversations: initialConversations, activeConversation: initialActive, currentUserId }) {
    const { props } = usePage();
    const userRoles = props.auth?.user?.roles ?? [];
    const isSeller = userRoles.includes('seller');
    const layoutRole = isSeller ? 'seller' : 'buyer';
    const [conversations, setConversations] = useState(initialConversations ?? []);
    const [active, setActive] = useState(initialActive ?? null);
    const [messages, setMessages] = useState(initialActive?.messages ?? []);
    const [showThreadOnMobile, setShowThreadOnMobile] = useState(!!initialActive);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const threadScrollRef = useRef(null);
    const lastTypingPingRef = useRef(0);

    const { data, setData, post, processing, reset, errors } = useForm({ body: '' });

    useEffect(() => {
        setConversations(initialConversations ?? []);
    }, [initialConversations]);

    useEffect(() => {
        setActive(initialActive ?? null);
        setMessages(initialActive?.messages ?? []);
        setShowThreadOnMobile(!!initialActive);
        setIsOtherTyping(false);
    }, [initialActive?.id]);

    const counterpart = useMemo(() => {
        if (!active) return null;
        return active.buyer_id === currentUserId ? active.seller : active.buyer;
    }, [active, currentUserId]);

    const isSellerInThread = active && active.seller_id === currentUserId;

    useEffect(() => {
        if (threadScrollRef.current) {
            threadScrollRef.current.scrollTop = threadScrollRef.current.scrollHeight;
        }
    }, [messages.length, active?.id, isOtherTyping]);

    useEffect(() => {
        const tick = async () => {
            if (typeof document !== 'undefined' && document.hidden) return;
            try {
                const res = await fetch('/api/messages/poll', {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                });
                if (!res.ok) return;
                const json = await res.json();
                if (Array.isArray(json.conversations)) {
                    setConversations(json.conversations);
                }
            } catch (err) {
                console.warn('[Messages] list poll failed', err);
            }
        };
        const interval = setInterval(tick, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!active?.id) return undefined;

        const tick = async () => {
            if (typeof document !== 'undefined' && document.hidden) return;
            try {
                const res = await fetch(`/api/messages/${active.id}/poll`, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                });
                if (!res.ok) return;
                const json = await res.json();
                if (Array.isArray(json.messages)) {
                    setMessages((prev) => {
                        if (prev.length === json.messages.length) {
                            return prev;
                        }
                        return json.messages;
                    });
                }
                setIsOtherTyping(Boolean(json.is_other_typing));
            } catch (err) {
                console.warn('[Messages] thread poll failed', err);
            }
        };

        const interval = setInterval(tick, 3000);
        tick();
        return () => clearInterval(interval);
    }, [active?.id]);

    // Send typing pings to the server. Rate-limited to one ping per 3s
    // because each ping refreshes a 5s TTL on the cache key.
    const pingTyping = () => {
        if (!active?.id) return;
        const now = Date.now();
        if (now - lastTypingPingRef.current < 3000) return;
        lastTypingPingRef.current = now;

        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
        fetch(`/api/messages/${active.id}/typing`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
        }).catch((err) => console.warn('[Messages] typing ping failed', err));
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!data.body.trim() || !active) return;

        const optimistic = {
            id: `optimistic-${Date.now()}`,
            conversation_id: active.id,
            sender_id: currentUserId,
            body: data.body.trim(),
            read_at: null,
            created_at: new Date().toISOString(),
            sender: { id: currentUserId, name: 'You' },
            optimistic: true,
        };
        setMessages((prev) => [...prev, optimistic]);
        console.log('[Messages] optimistic send', optimistic);

        // After sending, the local user is no longer "typing" — reset the
        // throttle so a fresh ping can be sent immediately when they type again.
        lastTypingPingRef.current = 0;

        post(`/messages/${active.id}/send`, {
            preserveScroll: true,
            preserveState: true,
            only: ['conversations', 'activeConversation', 'auth'],
            onSuccess: () => {
                reset('body');
            },
            onError: () => {
                setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
            },
        });
    };

    const handleSelect = (conversation) => {
        setShowThreadOnMobile(true);
        const base = isSeller ? '/seller/messages' : '/buyer/messages';
        router.visit(`${base}/${conversation.id}`, {
            preserveScroll: false,
            only: ['conversations', 'activeConversation', 'auth'],
        });
    };

    const propertyImage = (conversation) => {
        const img = conversation?.property?.images?.[0]?.image_path;
        return img ? `/storage/${img}` : null;
    };

    return (
        <DashboardLayout title="Messages | Haribon" role={layoutRole}>
            <Head title="Messages | Haribon" />

            <div className="mb-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Messages</h1>
                    <p className="text-sm text-slate-500">Conversations between you and buyers/sellers about properties.</p>
                </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]" style={{ minHeight: '70vh' }}>
                    <aside
                        className={`border-r border-slate-200 bg-white ${
                            showThreadOnMobile && active ? 'hidden lg:block' : 'block'
                        }`}
                    >
                        <div className="border-b border-slate-200 px-4 py-3">
                            <h2 className="text-sm font-semibold text-slate-700">Conversations</h2>
                            <p className="text-[11px] text-slate-500">{conversations.length} total</p>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                                        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">No conversations yet</p>
                                    <p className="mt-1 text-xs text-slate-500">When a buyer messages you about a property, it will appear here.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {conversations.map((c) => {
                                        const other = c.buyer_id === currentUserId ? c.seller : c.buyer;
                                        const isActive = active?.id === c.id;
                                        const lastMsg = c.latest_message?.body ?? 'No messages yet';
                                        const unread = Number(c.unread_count ?? 0);
                                        const img = propertyImage(c);
                                        return (
                                            <li key={c.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelect(c)}
                                                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                                                        isActive ? 'bg-emerald-50' : 'hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                        {img ? (
                                                            <img src={img} alt={c.property?.title ?? 'Property'} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`truncate text-sm ${unread > 0 ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'}`}>
                                                                {other?.name ?? 'Unknown'}
                                                            </p>
                                                            <span className="flex-shrink-0 text-[10px] text-slate-400">
                                                                {formatDateLabel(c.last_message_at ?? c.updated_at)}
                                                            </span>
                                                        </div>
                                                        <p className="line-clamp-1 text-[11px] text-slate-500">
                                                            <span className="font-medium text-slate-600">{c.property?.title ?? 'Property'}</span>
                                                        </p>
                                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                                            <p className={`line-clamp-1 text-xs ${unread > 0 ? 'font-medium text-slate-700' : 'text-slate-500'}`}>
                                                                {lastMsg}
                                                            </p>
                                                            {unread > 0 ? (
                                                                <span className="flex-shrink-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-semibold text-white">
                                                                    {unread > 99 ? '99+' : unread}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </aside>

                    <section className={`flex flex-col ${!showThreadOnMobile && !active ? 'hidden lg:flex' : 'flex'}`}>
                        {!active ? (
                            <div className="flex flex-1 items-center justify-center p-10">
                                <div className="text-center">
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                        <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Select a conversation</p>
                                    <p className="mt-1 text-xs text-slate-500">Pick a thread on the left to view and reply.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowThreadOnMobile(false)}
                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
                                            aria-label="Back to conversations"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <img
                                            src={
                                                counterpart?.profile_picture
                                                    ? `/storage/${counterpart.profile_picture}`
                                                    : '/storage/Hari/haribon-smile.png'
                                            }
                                            alt={counterpart?.name ?? ''}
                                            className="h-9 w-9 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/storage/Hari/haribon-smile.png';
                                            }}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">{counterpart?.name ?? 'Unknown'}</p>
                                            <p className="text-[11px] text-slate-500">
                                                {isSellerInThread ? 'Buyer inquiry' : 'Seller'}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/properties/${active.property?.id}`}
                                        className="text-xs font-medium text-emerald-700 hover:underline"
                                    >
                                        View Property →
                                    </Link>
                                </header>

                                <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getTypeBadgeColor(active.property?.type)}`}>
                                            {getTypeLabel(active.property?.type)}
                                        </span>
                                        <p className="line-clamp-1 text-xs text-slate-700">
                                            <span className="font-medium">{active.property?.title}</span>
                                            <span className="ml-2 font-semibold text-emerald-700">{formatPrice(active.property?.price_total)}</span>
                                        </p>
                                    </div>
                                </div>

                                <div ref={threadScrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 bg-slate-50/50" style={{ maxHeight: '55vh' }}>
                                    {messages.length === 0 ? (
                                        <p className="text-center text-xs text-slate-400">No messages in this thread yet.</p>
                                    ) : (
                                        messages.map((msg) => {
                                            const mine = msg.sender_id === currentUserId;
                                            return (
                                                <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                                    <div
                                                        className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                                                            mine
                                                                ? 'rounded-br-sm bg-emerald-600 text-white'
                                                                : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'
                                                        } ${msg.optimistic ? 'opacity-70' : ''}`}
                                                    >
                                                        <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                                                        <p className={`mt-1 text-[10px] ${mine ? 'text-emerald-100' : 'text-slate-400'}`}>
                                                            {formatBubbleTime(msg.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    {isOtherTyping ? (
                                        <div className="flex justify-start" aria-live="polite">
                                            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 shadow-sm">
                                                <span className="sr-only">{counterpart?.name ?? 'User'} is typing</span>
                                                <span className="flex items-end gap-1" aria-hidden="true">
                                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                                                </span>
                                                <span className="text-[11px] text-slate-500">
                                                    {counterpart?.name ? `${counterpart.name} is typing…` : 'typing…'}
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSend} className="border-t border-slate-200 bg-white p-3">
                                    {errors.body ? (
                                        <p className="mb-2 text-xs text-rose-600">{errors.body}</p>
                                    ) : null}
                                    <div className="flex items-end gap-2">
                                        <textarea
                                            value={data.body}
                                            onChange={(e) => {
                                                setData('body', e.target.value);
                                                if (e.target.value.trim().length > 0) {
                                                    pingTyping();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend(e);
                                                }
                                            }}
                                            rows={1}
                                            maxLength={2000}
                                            placeholder="Type a message…  (Enter to send, Shift+Enter for new line)"
                                            className="block w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing || !data.body.trim()}
                                            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l14-7-7 14-2-5-5-2z" />
                                            </svg>
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            </div>
            </div>
        </DashboardLayout>
    );
}
