import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '../../Components/UI/Header';
import Footer from '../../Components/UI/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertyDetailsPage({ property, reviews, averageRating, totalReviews }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
        rating: 0,
        comment: '',
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price ?? 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/properties/${property.id}/reviews`);
    };

    const images = property?.images ?? [];
    const selectedImage = images[selectedImageIndex]?.image_path;

    const handlePreviousImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

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
                            <div className="bg-slate-100">
                                <div className="relative aspect-[4/3]">
                                    {selectedImage ? (
                                        <>
                                            <img
                                                src={`/storage/${selectedImage}`}
                                                alt={property?.title ?? 'Property image'}
                                                className="h-full w-full object-cover"
                                            />
                                            {images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={handlePreviousImage}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition-colors hover:bg-white"
                                                    >
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={handleNextImage}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition-colors hover:bg-white"
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                                                        {selectedImageIndex + 1} / {images.length}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                {images.length > 1 && (
                                    <div className="flex gap-2 p-3 overflow-x-auto">
                                        {images.map((image, index) => (
                                            <button
                                                key={image.id}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                    index === selectedImageIndex
                                                        ? 'border-emerald-600 ring-2 ring-emerald-200'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
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
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={property.user.profile_picture ? `/storage/${property.user.profile_picture}` : '/storage/Hari/haribon-smile.png'}
                                                alt="Seller"
                                                className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                                                onError={(e) => {
                                                    e.target.src = '/storage/Hari/haribon-smile.png';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Seller</p>
                                                <p className="mt-1 text-sm font-medium text-slate-900">{property.user.name}</p>
                                                {property.user.reviews && property.user.reviews.length > 0 && (
                                                    <div className="mt-1 flex items-center gap-1.5">
                                                        <span className="text-amber-400 text-xs">
                                                            {'★'.repeat(Math.round(property.user.reviews.reduce((sum, r) => sum + r.rating, 0) / property.user.reviews.length))}
                                                            {'☆'.repeat(5 - Math.round(property.user.reviews.reduce((sum, r) => sum + r.rating, 0) / property.user.reviews.length))}
                                                        </span>
                                                        <span className="text-xs text-slate-900">({(property.user.reviews.reduce((sum, r) => sum + r.rating, 0) / property.user.reviews.length).toFixed(1)})</span>
                                                        <span className="text-[10px] text-slate-500">({property.user.reviews.length} reviews)</span>
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-600">{property.user.email}</p>
                                                {property.user.facebook_profile_link && (
                                                    <a
                                                        href={property.user.facebook_profile_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                                    >
                                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                        </svg>
                                                        Facebook Profile
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {reviews && reviews.data && reviews.data.length > 0 && (
                        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
                                        <p className="mt-1 text-sm text-slate-600">What buyers are saying about this seller.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 text-lg">
                                            {'★'.repeat(Math.round(averageRating))}
                                            {'☆'.repeat(5 - Math.round(averageRating))}
                                        </span>
                                        <span className="text-xs text-slate-900">({averageRating})</span>
                                        <span className="text-sm text-slate-600">({totalReviews} reviews)</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-4">
                                    {reviews.data.map((review) => (
                                        <div key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-amber-400">
                                                        {'★'.repeat(review.rating)}
                                                        {'☆'.repeat(5 - review.rating)}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-900">{review.rating}/5</span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="mt-2 text-sm text-slate-700">{review.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {reviews.links && reviews.links.length > 3 && (
                                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                                        <div className="text-sm text-slate-600">
                                            Showing {reviews.from} to {reviews.to} of {reviews.total} reviews
                                        </div>
                                        <div className="flex gap-2">
                                            {reviews.links.map((link, index) => {
                                                if (link.url === null) {
                                                    return (
                                                        <span
                                                            key={index}
                                                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-400"
                                                        >
                                                            {link.label === '&laquo; Previous' ? (
                                                                <ChevronLeft className="h-4 w-4" />
                                                            ) : link.label === 'Next &raquo;' ? (
                                                                <ChevronRight className="h-4 w-4" />
                                                            ) : (
                                                                link.label
                                                            )}
                                                        </span>
                                                    );
                                                }

                                                const isActive = link.active;
                                                const isPrev = link.label === '&laquo; Previous';
                                                const isNext = link.label === 'Next &raquo;';

                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                                            isActive
                                                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {isPrev ? (
                                                            <ChevronLeft className="h-4 w-4" />
                                                        ) : isNext ? (
                                                            <ChevronRight className="h-4 w-4" />
                                                        ) : (
                                                            link.label
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="p-5 sm:p-6">
                            <h2 className="text-xl font-bold text-slate-900">Leave a Review</h2>
                            <p className="mt-1 text-sm text-slate-600">Share your experience with this property and seller.</p>

                            {recentlySuccessful && (
                                <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                                    Review submitted! Please check your email to verify.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="your@email.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Rating
                                    </label>
                                    <div className="mt-1 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => {
                                                    setRating(star);
                                                    setData('rating', star);
                                                }}
                                                className="text-2xl transition-colors"
                                            >
                                                <span
                                                    className={
                                                        star <= (hoverRating || rating)
                                                            ? 'text-amber-400'
                                                            : 'text-slate-300'
                                                    }
                                                >
                                                    ★
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.rating && (
                                        <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-slate-700">
                                        Comment (Optional)
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Share your experience..."
                                        maxLength={1000}
                                    />
                                    {errors.comment && (
                                        <p className="mt-1 text-xs text-red-600">{errors.comment}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || rating === 0}
                                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
