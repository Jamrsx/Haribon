import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Toast from '../../Components/UI/Toast';
import MapModal from '../../Components/UI/MapModal';

export default function EditPropertyPage() {
    const { props } = usePage();
    const property = props.property;
    const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState(property.images || []);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [showMapModal, setShowMapModal] = useState(false);

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        title: property.title || '',
        description: property.description || '',
        contact: property.contact || '',
        type: property.type || 'sale',
        lot_area_sqm: property.lot_area_sqm || '',
        price_total: property.price_total || '',
        price_per_sqm: property.price_per_sqm || '',
        rental_period: property.rental_period || '',
        lease_duration_months: property.lease_duration_months || '',
        location_lat: property.location?.location_lat || '',
        location_lng: property.location?.location_lng || '',
        address: property.location?.address || '',
        is_active: property.is_active ?? true,
        images: [],
        delete_images: [],
    });

    useEffect(() => {
        if (props.flash?.success) {
            setToast({ show: true, type: 'success', message: props.flash.success });
        }
    }, [props.flash]);

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

    const handleDeleteImage = (imageId) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setImagesToDelete((prev) => [...prev, imageId]);
        setData('delete_images', [...imagesToDelete, imageId]);
    };

    const handleRestoreImage = (image) => {
        setExistingImages((prev) => [...prev, image]);
        setImagesToDelete((prev) => prev.filter((id) => id !== image.id));
        setData('delete_images', imagesToDelete.filter((id) => id !== image.id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((currentData) => ({
            ...currentData,
            _method: 'put',
            is_active: currentData.is_active ? '1' : '0',
        }));

        post(`/seller/properties/${property.id}`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setImagePreviews([]);
                setImagesToDelete([]);
                setToast({ show: true, type: 'success', message: 'Property updated successfully!' });
            },
            onError: (formErrors) => {
                const firstError = Object.values(formErrors)[0] || 'Unable to update property.';
                setToast({ show: true, type: 'error', message: firstError });
            },
            onFinish: () => {
                transform((currentData) => currentData);
            },
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <DashboardLayout title="Edit Property">
            <Head title="Edit Property" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <div className="mb-6">
                <Link
                    href="/seller/properties"
                    className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                    ← Back to Properties
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Edit Property</h1>
            <p className="mt-2 text-slate-600">Update your property information below.</p>

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

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Basic Information */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Property Type *
                            </label>
                            <div className="flex rounded-lg border border-slate-300 p-1">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'sale')}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        data.type === 'sale'
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    For Sale
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'rent')}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        data.type === 'rent'
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    For Rent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'lease')}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        data.type === 'lease'
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    For Lease
                                </button>
                            </div>
                            {errors.type ? <p className="mt-1 text-xs text-rose-600">{errors.type}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
                                Property Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                placeholder="e.g., Modern House in Quezon City"
                                required
                            />
                            {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                placeholder="Describe your property..."
                            />
                            {errors.description ? <p className="mt-1 text-xs text-rose-600">{errors.description}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="contact" className="mb-1 block text-sm font-medium text-slate-700">
                                Contact Number
                            </label>
                            <input
                                id="contact"
                                type="text"
                                value={data.contact}
                                onChange={(e) => setData('contact', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                placeholder="e.g., 0912312313/0192303123"
                            />
                            {errors.contact ? <p className="mt-1 text-xs text-rose-600">{errors.contact}</p> : null}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-slate-700">
                                Property is active (visible to buyers)
                            </label>
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Property Details</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {data.type === 'sale' && (
                            <div>
                                <label htmlFor="lot_area_sqm" className="mb-1 block text-sm font-medium text-slate-700">
                                    Lot Area (sqm)
                                </label>
                                <input
                                    id="lot_area_sqm"
                                    type="number"
                                    step="0.01"
                                    value={data.lot_area_sqm}
                                    onChange={(e) => setData('lot_area_sqm', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    placeholder="e.g., 150"
                                />
                                {errors.lot_area_sqm ? <p className="mt-1 text-xs text-rose-600">{errors.lot_area_sqm}</p> : null}
                            </div>
                        )}

                        <div>
                            <label htmlFor="price_total" className="mb-1 block text-sm font-medium text-slate-700">
                                {data.type === 'sale' ? 'Total Price (₱) *' : data.type === 'rent' ? 'Rent Price (₱) *' : 'Lease Price (₱) *'}
                            </label>
                            <input
                                id="price_total"
                                type="number"
                                step="0.01"
                                value={data.price_total}
                                onChange={(e) => setData('price_total', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                placeholder="e.g., 5500000"
                                required
                            />
                            {errors.price_total ? <p className="mt-1 text-xs text-rose-600">{errors.price_total}</p> : null}
                        </div>

                        {data.type === 'sale' && (
                            <div className="sm:col-span-2">
                                <label htmlFor="price_per_sqm" className="mb-1 block text-sm font-medium text-slate-700">
                                    Price per sqm (₱) *
                                </label>
                                <input
                                    id="price_per_sqm"
                                    type="number"
                                    step="0.01"
                                    value={data.price_per_sqm}
                                    onChange={(e) => setData('price_per_sqm', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    placeholder="e.g., 36666.67"
                                    required
                                />
                                {errors.price_per_sqm ? <p className="mt-1 text-xs text-rose-600">{errors.price_per_sqm}</p> : null}
                            </div>
                        )}

                        {(data.type === 'rent' || data.type === 'lease') && (
                            <div>
                                <label htmlFor="rental_period" className="mb-1 block text-sm font-medium text-slate-700">
                                    Rental Period *
                                </label>
                                <select
                                    id="rental_period"
                                    value={data.rental_period}
                                    onChange={(e) => setData('rental_period', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    required
                                >
                                    <option value="">Select period</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                {errors.rental_period ? <p className="mt-1 text-xs text-rose-600">{errors.rental_period}</p> : null}
                            </div>
                        )}

                        {data.type === 'lease' && (
                            <div>
                                <label htmlFor="lease_duration_months" className="mb-1 block text-sm font-medium text-slate-700">
                                    Lease Duration (months) *
                                </label>
                                <input
                                    id="lease_duration_months"
                                    type="number"
                                    min="1"
                                    value={data.lease_duration_months}
                                    onChange={(e) => setData('lease_duration_months', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    placeholder="e.g., 12"
                                    required
                                />
                                {errors.lease_duration_months ? <p className="mt-1 text-xs text-rose-600">{errors.lease_duration_months}</p> : null}
                                {data.lease_duration_months && data.rental_period && data.price_total && (
                                    <div className="mt-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
                                        <p className="font-medium">
                                            Pay ₱{Number(data.price_total).toLocaleString()} per {data.rental_period} for {data.lease_duration_months} months = {(parseInt(data.lease_duration_months) / 12).toFixed(1)} years
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Location</h2>
                        <button
                            type="button"
                            onClick={() => setShowMapModal(true)}
                            className="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Use Map
                        </button>
                    </div>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
                                Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                placeholder="e.g., 123 Main St, Quezon City"
                            />
                            {errors.address ? <p className="mt-1 text-xs text-rose-600">{errors.address}</p> : null}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="location_lat" className="mb-1 block text-sm font-medium text-slate-700">
                                    Latitude
                                </label>
                                <input
                                    id="location_lat"
                                    type="number"
                                    step="0.0000001"
                                    value={data.location_lat}
                                    onChange={(e) => setData('location_lat', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    placeholder="e.g., 14.6760"
                                />
                                {errors.location_lat ? <p className="mt-1 text-xs text-rose-600">{errors.location_lat}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="location_lng" className="mb-1 block text-sm font-medium text-slate-700">
                                    Longitude
                                </label>
                                <input
                                    id="location_lng"
                                    type="number"
                                    step="0.0000001"
                                    value={data.location_lng}
                                    onChange={(e) => setData('location_lng', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    placeholder="e.g., 121.0437"
                                />
                                {errors.location_lng ? <p className="mt-1 text-xs text-rose-600">{errors.location_lng}</p> : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Property Images</h2>
                    <p className="mt-1 text-sm text-slate-600">Upload up to 10 images (max 5MB each)</p>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium text-slate-700">Current Images</p>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {existingImages.map((image) => (
                                    <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt="Property image"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(image.id)}
                                            className="absolute right-2 top-2 rounded-full bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images */}
                    <div className="mt-4">
                        <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                        />
                        {errors.images ? <p className="mt-1 text-xs text-rose-600">{errors.images}</p> : null}
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <Link
                        href="/seller/properties"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing ? 'Updating...' : 'Update Property'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
