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
    const properties = props.properties || [];
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
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-center lg:px-8 lg:py-14">
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
                                <button
                                    onClick={() => setViewMode('map')}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Explore on Map
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:gap-4 sm:p-5">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs text-slate-500">Available Listings</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">{properties.length}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs text-slate-500">Map Discovery</p>
                                <p className="mt-1 text-2xl font-bold text-emerald-700">Live</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs text-slate-500">Buyer Access</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">No login required</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
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
                                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
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
                                        <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700">
                                            {property.lot_area_sqm ? `${property.lot_area_sqm} sqm` : 'Lot Property'}
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
                                        icon={blueIcon}
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
                                            icon={greenIcon}
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
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
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
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Address</p>
                                    <p className="mt-1 text-sm text-slate-700">{selectedProperty.location.address}</p>
                                </div>
                            )}
                            {selectedProperty.contact && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Contact</p>
                                    <p className="mt-1 text-sm font-medium text-slate-900">{selectedProperty.contact}</p>
                                </div>
                            )}
                            {selectedProperty.user && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Seller</p>
                                    <p className="mt-1 text-sm font-medium text-slate-900">{selectedProperty.user.name}</p>
                                    <p className="text-xs text-slate-600">{selectedProperty.user.email}</p>
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
