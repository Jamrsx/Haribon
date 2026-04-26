import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Toast from '../../Components/UI/Toast';
import MapModal from '../../Components/UI/MapModal';

export default function CreatePropertyPage({ limit_reached = false, max_listings = 1 }) {
    const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [showMapModal, setShowMapModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        contact: '',
        lot_area_sqm: '',
        price_total: '',
        price_per_sqm: '',
        location_lat: '',
        location_lng: '',
        address: '',
        images: [],
    });

    const handleLocationSelect = (position) => {
        setData('location_lat', position.lat);
        setData('location_lng', position.lng);
        if (position.address) {
            setData('address', position.address);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('contact', data.contact);
        formData.append('lot_area_sqm', data.lot_area_sqm);
        formData.append('price_total', data.price_total);
        formData.append('price_per_sqm', data.price_per_sqm);
        formData.append('location_lat', data.location_lat);
        formData.append('location_lng', data.location_lng);
        formData.append('address', data.address);

        data.images.forEach((image) => {
            formData.append('images[]', image);
        });

        post('/seller/properties', {
            data: formData,
            onSuccess: () => {
                reset();
                setImagePreviews([]);
                setToast({ show: true, type: 'success', message: 'Property created successfully!' });
            },
            onError: () => {
                const firstError = Object.values(errors)[0] || 'Unable to create property.';
                setToast({ show: true, type: 'error', message: firstError });
            },
        });
    };

    return (
        <DashboardLayout title="Create Property">
            <Head title="Create Property" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <div className="mb-4">
                <Link
                    href="/seller/properties"
                    className="inline-flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                    ← Back to Properties
                </Link>
            </div>

            <h1 className="text-xl font-semibold text-slate-900">Create Property Listing</h1>
            <p className="mt-1 text-xs text-slate-500">Fill in the details below to list your property.</p>

            {limit_reached && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-amber-900">Subscription Limit Reached</p>
                            <p className="mt-1 text-xs text-amber-800">
                                You have reached your maximum of {max_listings} property listing(s). Upgrade your subscription to list more properties.
                            </p>
                            <Link
                                href="/seller/subscription"
                                className="mt-2 inline-block rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <MapModal
                isOpen={showMapModal}
                onClose={() => setShowMapModal(false)}
                onLocationSelect={handleLocationSelect}
                initialPosition={
                    data.location_lat && data.location_lng
                        ? { lat: parseFloat(data.location_lat), lng: parseFloat(data.location_lng) }
                        : null
                }
            />

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Basic Information */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900">Basic Information</h2>
                    <div className="mt-3 space-y-3">
                        <div>
                            <label htmlFor="title" className="mb-1 block text-xs font-medium text-slate-700">
                                Property Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., Modern House in Quezon City"
                                required
                            />
                            {errors.title ? <p className="mt-1 text-[10px] text-rose-600">{errors.title}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="description" className="mb-1 block text-xs font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={limit_reached}
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="Describe your property..."
                            />
                            {errors.description ? <p className="mt-1 text-[10px] text-rose-600">{errors.description}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="contact" className="mb-1 block text-xs font-medium text-slate-700">
                                Contact Number
                            </label>
                            <input
                                id="contact"
                                type="text"
                                value={data.contact}
                                onChange={(e) => setData('contact', e.target.value)}
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 0912312313/0192303123"
                            />
                            {errors.contact ? <p className="mt-1 text-[10px] text-rose-600">{errors.contact}</p> : null}
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900">Property Details</h2>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="lot_area_sqm" className="mb-1 block text-xs font-medium text-slate-700">
                                Lot Area (sqm)
                            </label>
                            <input
                                id="lot_area_sqm"
                                type="number"
                                step="0.01"
                                value={data.lot_area_sqm}
                                onChange={(e) => setData('lot_area_sqm', e.target.value)}
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 150"
                            />
                            {errors.lot_area_sqm ? <p className="mt-1 text-[10px] text-rose-600">{errors.lot_area_sqm}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="price_total" className="mb-1 block text-xs font-medium text-slate-700">
                                Total Price (₱) *
                            </label>
                            <input
                                id="price_total"
                                type="number"
                                step="0.01"
                                value={data.price_total}
                                onChange={(e) => setData('price_total', e.target.value)}
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 5500000"
                                required
                            />
                            {errors.price_total ? <p className="mt-1 text-[10px] text-rose-600">{errors.price_total}</p> : null}
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="price_per_sqm" className="mb-1 block text-xs font-medium text-slate-700">
                                Price per sqm (₱) *
                            </label>
                            <input
                                id="price_per_sqm"
                                type="number"
                                step="0.01"
                                value={data.price_per_sqm}
                                onChange={(e) => setData('price_per_sqm', e.target.value)}
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 36666.67"
                                required
                            />
                            {errors.price_per_sqm ? <p className="mt-1 text-[10px] text-rose-600">{errors.price_per_sqm}</p> : null}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-900">Location</h2>
                        <button
                            type="button"
                            onClick={() => setShowMapModal(true)}
                            disabled={limit_reached}
                            className="rounded-lg border border-emerald-600 bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-300 disabled:opacity-50"
                        >
                            Use Map
                        </button>
                    </div>
                    <div className="mt-3 space-y-3">
                        <div>
                            <label htmlFor="address" className="mb-1 block text-xs font-medium text-slate-700">
                                Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 123 Main St, Quezon City"
                            />
                            {errors.address ? <p className="mt-1 text-[10px] text-rose-600">{errors.address}</p> : null}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label htmlFor="location_lat" className="mb-1 block text-xs font-medium text-slate-700">
                                    Latitude
                                </label>
                                <input
                                    id="location_lat"
                                    type="number"
                                    step="0.0000001"
                                    value={data.location_lat}
                                    onChange={(e) => setData('location_lat', e.target.value)}
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    placeholder="e.g., 14.6760"
                                />
                                {errors.location_lat ? <p className="mt-1 text-[10px] text-rose-600">{errors.location_lat}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="location_lng" className="mb-1 block text-xs font-medium text-slate-700">
                                    Longitude
                                </label>
                                <input
                                    id="location_lng"
                                    type="number"
                                    step="0.0000001"
                                    value={data.location_lng}
                                    onChange={(e) => setData('location_lng', e.target.value)}
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    placeholder="e.g., 121.0437"
                                />
                                {errors.location_lng ? <p className="mt-1 text-[10px] text-rose-600">{errors.location_lng}</p> : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900">Property Images</h2>
                    <p className="mt-1 text-xs text-slate-500">Upload up to 10 images (max 5MB each)</p>
                    <div className="mt-3">
                        <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={limit_reached}
                            className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                        />
                        {errors.images ? <p className="mt-1 text-[10px] text-rose-600">{errors.images}</p> : null}
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href="/seller/properties"
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing || limit_reached}
                        className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-slate-300"
                    >
                        {processing ? 'Creating...' : 'Create Property'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
