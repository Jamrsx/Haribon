import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Toast from '../../Components/UI/Toast';
import MapModal from '../../Components/UI/MapModal';

const COMPRESS_THRESHOLD = 5 * 1024 * 1024; // 5MB - compress anything above this

const compressImage = (file, targetSize = 5 * 1024 * 1024) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                // Start with original dimensions
                let width = img.width;
                let height = img.height;
                
                // Calculate scale based on file size to target ~5MB
                // Larger files need more aggressive scaling
                const scaleFactor = Math.min(1, Math.sqrt(targetSize / file.size));
                
                // Apply additional scaling for very large images
                if (file.size > 20 * 1024 * 1024) {
                    width *= 0.5;
                    height *= 0.5;
                } else if (file.size > 10 * 1024 * 1024) {
                    width *= 0.7;
                    height *= 0.7;
                } else {
                    width *= scaleFactor;
                    height *= scaleFactor;
                }
                
                // Cap maximum dimensions
                const maxDim = 1600;
                if (width > maxDim || height > maxDim) {
                    const ratio = Math.min(maxDim / width, maxDim / height);
                    width *= ratio;
                    height *= ratio;
                }
                
                width = Math.round(width);
                height = Math.round(height);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // Try multiple quality levels to hit target size
                const tryQuality = (quality) => {
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                reject(new Error('Compression failed'));
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                };
                
                // Use lower quality for very large files
                const initialQuality = file.size > 30 * 1024 * 1024 ? 0.6 : 
                                      file.size > 15 * 1024 * 1024 ? 0.7 : 0.8;
                tryQuality(initialQuality);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
    });
};

export default function CreatePropertyPage({ limit_reached = false, max_listings = 1 }) {
    const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [showMapModal, setShowMapModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        contact: '',
        type: 'sale',
        lot_area_sqm: '',
        price_total: '',
        price_per_sqm: '',
        rental_period: '',
        lease_duration_months: '',
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

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);

        setToast({
            show: true,
            type: 'info',
            message: 'Processing images...'
        });

        // Compress images over 5MB
        const processedFiles = await Promise.all(
            files.map(async (file) => {
                if (file.size > COMPRESS_THRESHOLD) {
                    try {
                        const compressed = await compressImage(file);
                        console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressed.size / 1024 / 1024).toFixed(2)}MB`);
                        return compressed;
                    } catch (err) {
                        console.error('Compression failed for', file.name, err);
                        setToast({
                            show: true,
                            type: 'error',
                            message: `Failed to compress ${file.name}`
                        });
                        return null;
                    }
                }
                return file;
            })
        );

        // Filter out failed compressions
        const validFiles = processedFiles.filter(f => f !== null);
        
        if (validFiles.length > 0) {
            setData('images', validFiles);
            const previews = validFiles.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews);
            
            const totalOriginal = files.reduce((sum, f) => sum + f.size, 0);
            const totalCompressed = validFiles.reduce((sum, f) => sum + f.size, 0);
            setToast({
                show: true,
                type: 'success',
                message: `Processed ${validFiles.length} image(s). Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalCompressed / 1024 / 1024).toFixed(1)}MB`
            });
        }
    };

    const sanitizeCurrencyInput = (value) => {
        let cleaned = value.replace(/,/g, '').replace(/[^\d.]/g, '');
        const parts = cleaned.split('.');

        if (parts.length > 2) {
            cleaned = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        if (cleaned.startsWith('.')) {
            cleaned = `0${cleaned}`;
        }

        const [whole, decimal] = cleaned.split('.');
        return decimal !== undefined ? `${whole}.${decimal.slice(0, 2)}` : whole;
    };

    const formatCurrencyInput = (value) => {
        if (!value) {
            return '';
        }

        const [whole, decimal] = value.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        if (value.endsWith('.')) {
            return `${formattedWhole}.`;
        }

        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const handleCurrencyChange = (field, value) => {
        setData(field, sanitizeCurrencyInput(value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('contact', data.contact);
        formData.append('type', data.type);
        formData.append('lot_area_sqm', data.lot_area_sqm);
        formData.append('price_total', data.price_total);
        formData.append('price_per_sqm', data.price_per_sqm);
        formData.append('rental_period', data.rental_period);
        formData.append('lease_duration_months', data.lease_duration_months);
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

            <div className="mx-auto w-full max-w-5xl">
            <div className="mb-4">
                <Link
                    href="/seller/properties"
                    className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                    ← Back to Properties
                </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h1 className="text-2xl font-bold text-slate-900">Create Property Listing</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Add complete property details so buyers can evaluate your listing quickly and clearly.
                </p>
            </div>

            {limit_reached && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-amber-900">Subscription Limit Reached</p>
                            <p className="mt-1 text-sm text-amber-800">
                                You have reached your maximum of {max_listings} property listing(s). Upgrade your subscription to list more properties.
                            </p>
                            <Link
                                href="/seller/subscription"
                                className="mt-3 inline-block rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Basic Information */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Basic Information</h2>
                    <p className="mt-1 text-xs text-slate-500">Set the listing title, short overview, and contact details.</p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Property Type *
                            </label>
                            <div className="flex rounded-lg border border-slate-300 p-1">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'sale')}
                                    disabled={limit_reached}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        data.type === 'sale'
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    For Sale
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'rent')}
                                    disabled={limit_reached}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        data.type === 'rent'
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    For Rent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'lease')}
                                    disabled={limit_reached}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        data.type === 'lease'
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    For Lease
                                </button>
                            </div>
                            {errors.type ? <p className="mt-1 text-[10px] text-rose-600">{errors.type}</p> : null}
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
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., Modern House in Quezon City"
                                required
                            />
                            {errors.title ? <p className="mt-1 text-[10px] text-rose-600">{errors.title}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={limit_reached}
                                rows={4}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="Describe your property..."
                            />
                            {errors.description ? <p className="mt-1 text-[10px] text-rose-600">{errors.description}</p> : null}
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
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 0912312313/0192303123"
                            />
                            {errors.contact ? <p className="mt-1 text-[10px] text-rose-600">{errors.contact}</p> : null}
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Property Details</h2>
                    <p className="mt-1 text-xs text-slate-500">Provide size and pricing information to help buyers compare listings.</p>
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
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    placeholder="e.g., 150"
                                />
                                {errors.lot_area_sqm ? <p className="mt-1 text-[10px] text-rose-600">{errors.lot_area_sqm}</p> : null}
                            </div>
                        )}

                        <div>
                            <label htmlFor="price_total" className="mb-1 block text-sm font-medium text-slate-700">
                                {data.type === 'sale' ? 'Total Price (₱) *' : data.type === 'rent' ? 'Rent Price (₱) *' : 'Lease Price (₱) *'}
                            </label>
                            <input
                                id="price_total"
                                type="text"
                                inputMode="decimal"
                                value={formatCurrencyInput(data.price_total)}
                                onChange={(e) => handleCurrencyChange('price_total', e.target.value)}
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 100,000"
                                required
                            />
                            {errors.price_total ? <p className="mt-1 text-[10px] text-rose-600">{errors.price_total}</p> : null}
                        </div>

                        {data.type === 'sale' && (
                            <div className="sm:col-span-2">
                                <label htmlFor="price_per_sqm" className="mb-1 block text-sm font-medium text-slate-700">
                                    Price per sqm (₱) *
                                </label>
                                <input
                                    id="price_per_sqm"
                                    type="text"
                                    inputMode="decimal"
                                    value={formatCurrencyInput(data.price_per_sqm)}
                                    onChange={(e) => handleCurrencyChange('price_per_sqm', e.target.value)}
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    placeholder="e.g., 3,500.00"
                                    required
                                />
                                {errors.price_per_sqm ? <p className="mt-1 text-[10px] text-rose-600">{errors.price_per_sqm}</p> : null}
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
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    required
                                >
                                    <option value="">Select period</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                {errors.rental_period ? <p className="mt-1 text-[10px] text-rose-600">{errors.rental_period}</p> : null}
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
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    placeholder="e.g., 12"
                                    required
                                />
                                {errors.lease_duration_months ? <p className="mt-1 text-[10px] text-rose-600">{errors.lease_duration_months}</p> : null}
                                {data.lease_duration_months && data.rental_period && data.price_total && (
                                    <div className="mt-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
                                        <p className="font-medium">
                                            Pay {formatCurrencyInput(data.price_total)} per {data.rental_period} for {data.lease_duration_months} months = {(parseInt(data.lease_duration_months) / 12).toFixed(1)} years
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Location</h2>
                            <p className="mt-1 text-xs text-slate-500">Use map pinning or enter coordinates manually.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowMapModal(true)}
                            disabled={limit_reached}
                            className="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:opacity-50"
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
                                disabled={limit_reached}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g., 123 Main St, Quezon City"
                            />
                            {errors.address ? <p className="mt-1 text-[10px] text-rose-600">{errors.address}</p> : null}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
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
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    placeholder="e.g., 14.6760"
                                />
                                {errors.location_lat ? <p className="mt-1 text-[10px] text-rose-600">{errors.location_lat}</p> : null}
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
                                    disabled={limit_reached}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                                    placeholder="e.g., 121.0437"
                                />
                                {errors.location_lng ? <p className="mt-1 text-[10px] text-rose-600">{errors.location_lng}</p> : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Property Images</h2>
                    <p className="mt-1 text-xs text-slate-500">Upload images (auto-compressed to ~5MB if larger). No file size limit.</p>
                    <div className="mt-4">
                        <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={limit_reached}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50"
                        />
                        {errors.images ? <p className="mt-1 text-[10px] text-rose-600">{errors.images}</p> : null}
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        href="/seller/properties"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing || limit_reached}
                        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:opacity-70"
                    >
                        {processing ? 'Creating...' : 'Create Property'}
                    </button>
                </div>
                </div>
                </div>
            </form>
            </div>
        </DashboardLayout>
    );
}
