import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Header from '../../Components/UI/Header';
import Footer from '../../Components/UI/Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const greenIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; position: absolute; top: 8px; left: 8px;"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const blueIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3b82f6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; position: absolute; top: 8px; left: 8px;"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const yellowIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #eab308; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; position: absolute; top: 8px; left: 8px;"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const userLocationIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; position: absolute; top: 8px; left: 8px;"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const getPropertyIcon = (type) => {
    switch (type) {
        case 'sale':
            return greenIcon;
        case 'rent':
            return blueIcon;
        case 'lease':
            return yellowIcon;
        default:
            return greenIcon;
    }
};

function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

export default function HomePage() {
    const { props } = usePage();
    const properties = props.properties?.data || [];
    const pagination = props.properties || {};
    const [viewMode, setViewMode] = useState('list');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [radius, setRadius] = useState(10);
    const [loadingNearMe, setLoadingNearMe] = useState(false);
    const mapKey = useRef(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const isPremiumSeller = (property) => {
        if (!property.user?.subscription) return false;
        const subscription = property.user.subscription;
        const plan = subscription.plan;
        if (!plan) return false;
        // Premium if they have an active 1-year subscription (365 days) or lifetime plan
        return subscription.status === 'active' && plan.duration_days >= 365;
    };

    const handleNearMe = () => {
        setLoadingNearMe(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation({ lat, lng });
                    
                    router.get('/', { lat, lng, radius_km: radius }, {
                        preserveState: true,
                        onFinish: () => {
                            setLoadingNearMe(false);
                            setViewMode('map');
                        },
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLoadingNearMe(false);
                    alert('Unable to get your location. Please enable location services.');
                }
            );
        } else {
            setLoadingNearMe(false);
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleShowAll = () => {
        setUserLocation(null);
        router.get('/', {}, { preserveState: true });
    };

    const mapCenter = userLocation 
        ? [userLocation.lat, userLocation.lng]
        : properties.length > 0 && properties[0].location
            ? [properties[0].location.location_lat, properties[0].location.location_lng]
            : [14.5995, 120.9842];

    const mapZoom = userLocation ? 12 : 10;

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        if (selectedProperty && selectedProperty.images && selectedProperty.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedProperty]);

    // Reset image index when property changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedProperty]);

    const handlePrevImage = () => {
        if (selectedProperty && selectedProperty.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
        }
    };

    const handleNextImage = () => {
        if (selectedProperty && selectedProperty.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Head title="Haribon | Find Your Next Property" />
            <Header />
            <main className="flex-1">
                <section className="relative overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white" />
                    <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#10b981" fillOpacity="0.1"/>
                    </svg>
                    <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 80L48 70C96 60 192 40 288 35C384 30 480 40 576 45C672 50 768 50 864 42.5C960 35 1056 20 1152 20C1248 20 1344 35 1392 42.5L1440 50V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#10b981" fillOpacity="0.15"/>
                    </svg>
                    <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-center lg:px-8 lg:py-14">
                        <div>
                            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                Haribon Real Estate Marketplace
                            </p>
                            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                Find your next property with clarity and confidence
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                                Explore verified listings, compare prices quickly, and use map-based discovery to find the best property for your needs.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    onClick={handleNearMe}
                                    disabled={loadingNearMe}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {loadingNearMe ? 'Locating...' : 'Find Near Me'}
                                </button>
                                <Link
                                    href="/map"
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Explore on Map
                                </Link>
                                <Link
                                    href="/listings"
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    View All Listings
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-4 shadow-lg sm:gap-4 sm:p-5">
                            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                                <p className="text-xs text-slate-500">Available Listings</p>
                                <p className="mt-1 text-2xl font-bold text-emerald-700">{pagination.total || 0}</p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                                <p className="text-xs text-slate-500">Map Discovery</p>
                                <p className="mt-1 text-2xl font-bold text-emerald-700">Live</p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                                <p className="text-xs text-slate-500">Buyer Access</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">No login required</p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                                <p className="text-xs text-slate-500">Seller Publishing</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">Fast and simple</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                                {pagination.total || 0} {pagination.total === 1 ? 'Property' : 'Properties'}
                            </h2>
                            {userLocation && (
                                <p className="text-xs text-slate-500 sm:text-sm">Showing within {radius} km of your location</p>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {userLocation && (
                                <button
                                    onClick={handleShowAll}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Show All
                                </button>
                            )}
                            <button
                                onClick={handleNearMe}
                                disabled={loadingNearMe}
                                className="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {loadingNearMe ? 'Locating...' : 'Near Me'}
                            </button>
                            <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1.5 text-xs font-medium ${
                                        viewMode === 'list'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    List
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-3 py-1.5 text-xs font-medium ${
                                        viewMode === 'map'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    Map
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>

                    {viewMode === 'list' ? (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {properties.map((property) => (
                                <div
                                    key={property.id}
                                    onClick={() => setSelectedProperty(property)}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                        {property.images && property.images.length > 0 ? (
                                            <img
                                                src={`/storage/${property.images[0].image_path}`}
                                                alt={property.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute left-2 top-2 flex gap-1">
                                            <div className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700">
                                                {property.lot_area_sqm ? `${property.lot_area_sqm} sqm` : 'Lot Property'}
                                            </div>
                                            {isPremiumSeller(property) && (
                                                <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-semibold text-white">
                                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Premium
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2 p-4">
                                        <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                                            {property.title}
                                        </h3>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-base font-bold text-emerald-700">
                                                {formatPrice(property.price_total)}
                                            </span>
                                            {property.lot_area_sqm && (
                                                <span className="text-[11px] text-slate-500">· lot area</span>
                                            )}
                                        </div>
                                        <div className="rounded-lg bg-slate-50 px-2.5 py-2">
                                            {property.location?.address ? (
                                                <p className="line-clamp-2 text-[11px] text-slate-600">
                                                    {property.location.address}
                                                </p>
                                            ) : (
                                                <p className="text-[11px] text-slate-500">
                                                    Location details available on property view
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                                <p className="text-xs text-slate-500">
                                    Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} results
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => router.get('/', { page: pagination.current_page - 1 }, { preserveState: true })}
                                        disabled={!pagination.prev_page_url}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-xs font-medium text-slate-700">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <button
                                        onClick={() => router.get('/', { page: pagination.current_page + 1 }, { preserveState: true })}
                                        disabled={!pagination.next_page_url}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-4 py-3">
                                <p className="text-sm font-semibold text-slate-900">Property Map View</p>
                                <p className="text-xs text-slate-500">Click any marker to preview listing details.</p>
                            </div>
                            <div className="h-[560px]">
                            <MapContainer
                                key={mapKey.current}
                                center={mapCenter}
                                zoom={mapZoom}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapController center={mapCenter} zoom={mapZoom} />
                                {userLocation && (
                                    <Marker
                                        position={[userLocation.lat, userLocation.lng]}
                                        icon={userLocationIcon}
                                    >
                                        <Popup>
                                            <div className="min-w-[150px]">
                                                <p className="text-xs font-medium text-slate-900">Your Location</p>
                                                <p className="mt-1 text-[10px] text-slate-600">
                                                    Properties within {radius} km
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                                {properties.map((property) => (
                                    property.location && (
                                        <Marker
                                            key={property.id}
                                            position={[property.location.location_lat, property.location.location_lng]}
                                            icon={getPropertyIcon(property.type)}
                                            eventHandlers={{
                                                click: (e) => {
                                                    e.originalEvent.stopPropagation();
                                                    setSelectedProperty(property);
                                                },
                                            }}
                                        >
                                            <Popup>
                                                <div className="min-w-[200px]">
                                                    <h3 className="text-sm font-semibold text-slate-900">{property.title}</h3>
                                                    <p className="mt-1 text-sm font-medium text-emerald-600">
                                                        {formatPrice(property.price_total)}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            setSelectedProperty(property);
                                                        }}
                                                        className="mt-2 rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )
                                ))}
                            </MapContainer>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {selectedProperty && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedProperty(null)}>
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                            <h3 className="text-base font-semibold text-slate-900">{selectedProperty.title}</h3>
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3 p-4">
                            {selectedProperty.images && selectedProperty.images.length > 0 && (
                                <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                        src={`/storage/${selectedProperty.images[currentImageIndex].image_path}`}
                                        alt={selectedProperty.title}
                                        className="h-full w-full object-cover"
                                    />
                                    {selectedProperty.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevImage}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium text-white">
                                                {currentImageIndex + 1}/{selectedProperty.images.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                            <div>
                                <p className="text-lg font-bold text-emerald-600">
                                    {formatPrice(selectedProperty.price_total)}
                                </p>
                                {selectedProperty.lot_area_sqm && (
                                    <p className="mt-0.5 text-xs text-slate-600">{selectedProperty.lot_area_sqm} sqm</p>
                                )}
                            </div>
                            {selectedProperty.description && (
                                <p className="text-sm leading-relaxed text-slate-700">{selectedProperty.description}</p>
                            )}
                            {selectedProperty.location?.address && (
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <div className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Address</p>
                                            <p className="mt-1 text-sm text-slate-700">{selectedProperty.location.address}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedProperty.contact && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <div className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Contact</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{selectedProperty.contact}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedProperty.user && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={selectedProperty.user.profile_picture ? `/storage/${selectedProperty.user.profile_picture}` : '/storage/Hari/haribon-smile.png'}
                                            alt="Seller"
                                            className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
                                            onError={(e) => {
                                                e.target.src = '/storage/Hari/haribon-smile.png';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Seller</p>
                                                {isPremiumSeller(selectedProperty) && (
                                                    <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Premium
                                                    </div>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{selectedProperty.user.name}</p>
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {selectedProperty.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="pt-1">
                                <Link
                                    href={`/properties/${selectedProperty.id}`}
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    Open Full Property Page
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
