import React, { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price ?? 0);
};

export default function InquiryModal({ show, onClose, property }) {
    const { auth } = usePage().props;
    const [body, setBody] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (show) {
            setBody('');
            setErrors({});
            setTimeout(() => textareaRef.current?.focus(), 50);
            console.log('[InquiryModal] opened for property:', property?.id);
        }
    }, [show, property?.id]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && show) {
                onClose?.();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [show, onClose]);

    if (!show || !property) return null;

    const isOwnProperty = auth?.user?.id && property?.user?.id && auth.user.id === property.user.id;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!auth?.user) {
            console.warn('[InquiryModal] guest tried to inquire, redirecting to register');
            window.location.href = `/register?role=buyer&redirect=/properties/${property.id}`;
            return;
        }

        if (isOwnProperty) {
            setErrors({ body: 'You cannot send an inquiry to yourself.' });
            return;
        }

        if (!body.trim()) {
            setErrors({ body: 'Please enter a message before sending.' });
            return;
        }

        setSubmitting(true);
        console.log('[InquiryModal] sending inquiry');

        router.post(
            `/properties/${property.id}/inquire`,
            { body: body.trim() },
            {
                preserveScroll: true,
                onError: (serverErrors) => {
                    setErrors(serverErrors);
                    setSubmitting(false);
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <div
            className="fixed inset-0 bg-clear bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl m-4">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Message Seller</h3>
                        <p className="text-xs text-slate-500">Send an inquiry about this property</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-5 py-4">
                    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                            {property.images && property.images.length > 0 ? (
                                <img
                                    src={`/storage/${property.images[0].image_path}`}
                                    alt={property.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-slate-900">{property.title}</p>
                            <p className="text-sm font-semibold text-emerald-700">{formatPrice(property.price_total)}</p>
                            {property.user?.name ? (
                                <p className="mt-0.5 text-[11px] text-slate-500">
                                    Seller: <span className="font-medium text-slate-700">{property.user.name}</span>
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {!auth?.user ? (
                        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                            <p className="font-medium">Create a free buyer account to send your inquiry.</p>
                            <p className="mt-1 text-xs text-emerald-800">
                                Sign up takes less than a minute and lets you track all your conversations with sellers.
                            </p>
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <a
                                    href={`/register?role=buyer&redirect=/properties/${property.id}`}
                                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    Sign Up as Buyer
                                </a>
                                <a
                                    href={`/login?redirect=/properties/${property.id}`}
                                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                >
                                    Already have an account? Sign In
                                </a>
                            </div>
                        </div>
                    ) : isOwnProperty ? (
                        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                            This is your own property listing.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                            <div>
                                <label htmlFor="inquiry-body" className="block text-sm font-medium text-slate-700">
                                    Your message
                                </label>
                                <textarea
                                    id="inquiry-body"
                                    ref={textareaRef}
                                    rows={4}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Hi! Is this property still available? I'm interested in viewing it."
                                    maxLength={2000}
                                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <div className="mt-1 flex items-center justify-between">
                                    {errors.body ? (
                                        <p className="text-xs text-rose-600">{errors.body}</p>
                                    ) : (
                                        <span className="text-[11px] text-slate-400">Be polite and clear about what you're asking.</span>
                                    )}
                                    <span className="text-[11px] text-slate-400">{body.length}/2000</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !body.trim()}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting ? 'Sending…' : 'Send Inquiry'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
