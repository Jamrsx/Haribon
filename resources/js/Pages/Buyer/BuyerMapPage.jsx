import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import DashboardLayout from '../../Layouts/DashboardLayout';
import FavoriteButton from '../../Components/UI/FavoriteButton';
import InquiryModal from '../../Components/UI/InquiryModal';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const buildPinIcon = (color) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const greenIcon = buildPinIcon('#10b981');
const blueIcon = buildPinIcon('#3b82f6');
const yellowIcon = buildPinIcon('#eab308');

const userLocationIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); background: #fff;"><img src="/storage/Hari/haribon-smile.png" alt="You" style="width:100%;height:100%;object-fit:cover;"></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const getMarkerIcon = (type) => {
    switch (type) {
        case 'rent':
            return blueIcon;
        case 'lease':
            return yellowIcon;
        default:
            return greenIcon;
    }
};

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

function MapRefresher({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom() ?? 12);
        }
    }, [center, map]);
    return null;
}

export default function BuyerMapPage({ properties: initialProperties = [], favorite_ids: initialFavoriteIds = [] }) {
    const { props } = usePage();
    const [properties, setProperties] = useState(initialProperties);
    const [favoriteSet, setFavoriteSet] = useState(() => new Set(initialFavoriteIds));
    const [filterType, setFilterType] = useState('all');
    const [userLocation, setUserLocation] = useState(null);
    const [radius, setRadius] = useState(2);
    const [loadingNearMe, setLoadingNearMe] = useState(false);
    const [inquiryProperty, setInquiryProperty] = useState(null);
    const radiusTimeout = useRef(null);

    useEffect(() => {
        setProperties(initialProperties);
    }, [initialProperties]);

    useEffect(() => {
        setFavoriteSet(new Set(initialFavoriteIds));
    }, [initialFavoriteIds]);

    const filtered = useMemo(() => {
        return properties.filter((p) => {
            if (filterType !== 'all' && p.type !== filterType) return false;
            if (!p.location?.location_lat || !p.location?.location_lng) return false;
            return true;
        });
    }, [properties, filterType]);

    const mapCenter = useMemo(() => {
        if (userLocation) return [userLocation.lat, userLocation.lng];
        if (filtered.length > 0 && filtered[0].location) {
            return [
                parseFloat(filtered[0].location.location_lat),
                parseFloat(filtered[0].location.location_lng),
            ];
        }
        return [14.5995, 120.9842]; // Manila default
    }, [filtered, userLocation]);

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setLoadingNearMe(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setUserLocation({ lat, lng });
                console.log('[BuyerMap] near me', { lat, lng, radius });
                router.get('/buyer/map', { lat, lng, radius_km: radius }, {
                    preserveState: true,
                    onFinish: () => setLoadingNearMe(false),
                });
            },
            (err) => {
                console.warn('[BuyerMap] geolocation error', err);
                setLoadingNearMe(false);
                alert('Unable to get your location. Please enable location services.');
            }
        );
    };

    const handleRadiusChange = (value) => {
        const num = parseInt(value, 10);
        setRadius(num);
        if (!userLocation) return;
        if (radiusTimeout.current) clearTimeout(radiusTimeout.current);
        radiusTimeout.current = setTimeout(() => {
            router.get('/buyer/map', { lat: userLocation.lat, lng: userLocation.lng, radius_km: num }, {
                preserveState: true,
                preserveScroll: true,
                only: ['properties'],
            });
        }, 250);
    };

    const handleShowAll = () => {
        setUserLocation(null);
        router.get('/buyer/map', {}, { preserveState: true });
    };

    const handleFavoriteChange = (propertyId) => (favorited) => {
        setFavoriteSet((prev) => {
            const next = new Set(prev);
            if (favorited) next.add(propertyId);
            else next.delete(propertyId);
            return next;
        });
    };

    return (
        <DashboardLayout title="Map View | Haribon" role="buyer" fullBleed>
            <Head title="Map View | Haribon" />

            <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Property Map</h1>
                        <p className="text-xs text-slate-500">{filtered.length} {filtered.length === 1 ? 'property' : 'properties'} on the map</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                            {['all', 'sale', 'rent', 'lease'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                                        filterType === type
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {type === 'all' ? 'All' : type}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleNearMe}
                            disabled={loadingNearMe}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="3" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                            </svg>
                            {loadingNearMe ? 'Locating…' : 'Near Me'}
                        </button>
                        {userLocation ? (
                            <button
                                type="button"
                                onClick={handleShowAll}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Show All
                            </button>
                        ) : null}
                    </div>
                </div>
                {userLocation ? (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                        <span className="text-xs font-semibold text-emerald-800">Radius:</span>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={radius}
                            onChange={(e) => handleRadiusChange(e.target.value)}
                            className="flex-1 accent-emerald-600"
                        />
                        <span className="w-16 text-right text-xs font-medium text-emerald-900">{radius} km</span>
                    </div>
                ) : null}
            </div>

            <div className="relative" style={{ height: 'calc(100vh - 175px)', minHeight: 480 }}>
                <MapContainer
                    center={mapCenter}
                    zoom={userLocation ? 13 : 11}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapRefresher center={mapCenter} />

                    {userLocation ? (
                        <>
                            <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                                <Popup>You are here</Popup>
                            </Marker>
                            <Circle
                                center={[userLocation.lat, userLocation.lng]}
                                radius={radius * 1000}
                                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.08 }}
                            />
                        </>
                    ) : null}

                    {filtered.map((property) => {
                        const lat = parseFloat(property.location.location_lat);
                        const lng = parseFloat(property.location.location_lng);
                        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
                        const img = property.images?.[0]?.image_path;
                        const isFavorited = favoriteSet.has(property.id);
                        return (
                            <Marker key={property.id} position={[lat, lng]} icon={getMarkerIcon(property.type)}>
                                <Popup minWidth={260} maxWidth={300}>
                                    <div className="space-y-2">
                                        <div className="overflow-hidden rounded-lg bg-slate-100" style={{ height: 130 }}>
                                            {img ? (
                                                <img src={`/storage/${img}`} alt={property.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-300">No image</div>
                                            )}
                                        </div>

                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getTypeColor(property.type)}`}>
                                                    {getTypeLabel(property.type)}
                                                </span>
                                                <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{property.title}</p>
                                                <p className="text-base font-bold text-emerald-700">{formatPrice(property.price_total)}</p>
                                                {property.location?.address ? (
                                                    <p className="line-clamp-2 text-[11px] text-slate-500">{property.location.address}</p>
                                                ) : null}
                                            </div>
                                            <FavoriteButton
                                                propertyId={property.id}
                                                initialFavorited={isFavorited}
                                                size="sm"
                                                onChange={handleFavoriteChange(property.id)}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/properties/${property.id}`}
                                                className="flex-1 rounded-lg border border-emerald-600 bg-white px-2 py-1.5 text-center text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                                            >
                                                View Details
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setInquiryProperty(property)}
                                                className="flex-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                            >
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>

                <div className="absolute bottom-4 right-4 z-[1000] rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-md">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Legend</p>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> Sale
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Rent
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" /> Lease
                    </div>
                </div>
            </div>

            <InquiryModal
                show={!!inquiryProperty}
                onClose={() => setInquiryProperty(null)}
                property={inquiryProperty}
            />
        </DashboardLayout>
    );
}
