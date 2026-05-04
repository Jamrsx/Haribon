import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Header from '../../Components/UI/Header';
import Footer from '../../Components/UI/Footer';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const greenIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div><img src="/storage/icons/sell.png" style="width: 16px; height: 16px; position: absolute; top: 7px; left: 7px; filter: brightness(0) invert(1);">`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const blueIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3b82f6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div><img src="/storage/icons/rent.png" style="width: 16px; height: 16px; position: absolute; top: 7px; left: 7px; filter: brightness(0) invert(1);">`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const yellowIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #eab308; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div><img src="/storage/icons/lease.png" style="width: 16px; height: 16px; position: absolute; top: 7px; left: 7px; filter: brightness(0) invert(1);">`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const userLocationIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><img src="/storage/Hari/haribon-smile.png" alt="Your Location" style="width: 100%; height: 100%; object-fit: cover;"></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

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

const isPremiumSeller = (property) => {
    if (!property.user?.subscription) return false;
    const subscription = property.user.subscription;
    const plan = subscription.plan;
    if (!plan) return false;
    // Premium if they have an active 1-year subscription (365 days) or lifetime plan
    return subscription.status === 'active' && (plan.duration_days >= 365 || plan.duration_days === 0);
};

const isLifetimeSeller = (property) => {
    if (!property.user?.subscription) return false;
    const subscription = property.user.subscription;
    const plan = subscription.plan;
    if (!plan) return false;
    // Lifetime if they have an active lifetime subscription (0 or 9999 days)
    return subscription.status === 'active' && (plan.duration_days === 0 || plan.duration_days >= 9999);
};

const getPropertyIcon = (type, isPremium, isLifetime, rating) => {
    const baseIcon = (() => {
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
    })();

    const ratingBadge = rating && rating > 0
        ? `<div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: #f59e0b; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 100;">${rating.toFixed(1)}</div>`
        : '';

    if (isLifetime) {
        // Same pin shape with gold glow and shimmer for lifetime sellers
        const baseColor = baseIcon.options.html.match(/background-color: ([^;]+)/)?.[1] || '#10b981';
        const iconPath = (() => {
            switch (type) {
                case 'sale': return '/storage/icons/sell.png';
                case 'rent': return '/storage/icons/rent.png';
                case 'lease': return '/storage/icons/lease.png';
                default: return '/storage/icons/sell.png';
            }
        })();
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="position: relative;">${ratingBadge}<div style="background-color: ${baseColor}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 5px 1px rgba(251, 191, 36, 0.3), 0 0 8px 2px rgba(251, 191, 36, 0.2), 0 2px 5px rgba(0,0,0,0.3); animation: lifetime-shimmer 1.5s ease-in-out infinite;"></div><img src="${iconPath}" style="width: 16px; height: 16px; position: absolute; top: 7px; left: 7px; filter: brightness(0) invert(1);">
<style>
@keyframes lifetime-shimmer {
    0% { box-shadow: 0 0 5px 1px rgba(251, 191, 36, 0.3), 0 0 8px 2px rgba(251, 191, 36, 0.2), 0 2px 5px rgba(0,0,0,0.3); }
    50% { box-shadow: 0 0 8px 2px rgba(251, 191, 36, 0.5), 0 0 12px 3px rgba(251, 191, 36, 0.3), 0 2px 5px rgba(0,0,0,0.3); }
    100% { box-shadow: 0 0 5px 1px rgba(251, 191, 36, 0.3), 0 0 8px 2px rgba(251, 191, 36, 0.2), 0 2px 5px rgba(0,0,0,0.3); }
}
</style></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -42],
        });
    }

    if (isPremium) {
        const iconPath = (() => {
            switch (type) {
                case 'sale': return '/storage/icons/sell.png';
                case 'rent': return '/storage/icons/rent.png';
                case 'lease': return '/storage/icons/lease.png';
                default: return '/storage/icons/sell.png';
            }
        })();
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="position: relative;">${ratingBadge}<div style="background-color: ${baseIcon.options.html.match(/background-color: ([^;]+)/)?.[1]}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.3), 0 2px 5px rgba(0,0,0,0.3); animation: premium-glow 2s ease-in-out infinite alternate;"></div><img src="${iconPath}" style="width: 16px; height: 16px; position: absolute; top: 7px; left: 7px; filter: brightness(0) invert(1);">
<style>
@keyframes premium-glow {
    0% { box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.3), 0 2px 5px rgba(0,0,0,0.3); }
    100% { box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.4), 0 2px 5px rgba(0,0,0,0.3); }
}
</style></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -42],
        });
    }

    // Add rating badge to base icon
    const baseHtml = baseIcon.options.html;
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="position: relative;">${ratingBadge}${baseHtml}</div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42],
    });
};

function MapController({ center, zoom, onMapChange }) {
    const map = useMap();
    const mapInitialized = useRef(false);
    
    useEffect(() => {
        // Only set view on initial load or when user location changes
        if (center && !mapInitialized.current) {
            map.setView(center, zoom);
            mapInitialized.current = true;
        }
        
        // Listen for map changes
        const handleMoveEnd = () => {
            if (onMapChange) {
                onMapChange({
                    center: map.getCenter(),
                    zoom: map.getZoom()
                });
            }
        };
        
        map.on('moveend', handleMoveEnd);
        map.on('zoomend', handleMoveEnd);
        
        return () => {
            map.off('moveend', handleMoveEnd);
            map.off('zoomend', handleMoveEnd);
        };
    }, [center, zoom, map, onMapChange]);
    
    return null;
}

export default function MapPage() {
    const { props } = usePage();
    const properties = props.properties || [];
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [userLocation, setUserLocation] = useState(() => {
        // Try to get user location from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const lat = urlParams.get('lat');
        const lng = urlParams.get('lng');
        return lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;
    });
    const [radius, setRadius] = useState(() => {
        // Try to get radius from URL params first, then props, then default
        const urlParams = new URLSearchParams(window.location.search);
        const urlRadius = urlParams.get('radius_km');
        return urlRadius ? parseInt(urlRadius) : (props.radius_km || 2);
    });
    const [loadingNearMe, setLoadingNearMe] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const mapKey = useRef(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const radiusTimeoutRef = useRef(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [legendCollapsed, setLegendCollapsed] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            const stored = localStorage.getItem('sidebarCollapsed');
            return stored ? JSON.parse(stored) : false;
        } catch (error) {
            return false;
        }
    });
    const [mapState, setMapState] = useState(() => {
        try {
            const storedMapState = localStorage.getItem('mapState');
            return storedMapState ? JSON.parse(storedMapState) : { center: null, zoom: null };
        } catch (error) {
            console.error("Error parsing map state from localStorage:", error);
            return { center: null, zoom: null };
        }
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Extract unique locations from properties
    const getUniqueLocations = () => {
        const locationSet = new Set();
        properties.forEach(property => {
            if (property.location?.address) {
                // Extract city/municipality names from addresses
                const addressParts = property.location.address.split(',').map(part => part.trim());
                // Add each part that could be a location (city, municipality, barangay)
                addressParts.forEach(part => {
                    if (part.length > 2 && !part.match(/^\d/)) { // Exclude short parts and postal codes
                        locationSet.add(part);
                    }
                });
            }
        });
        return Array.from(locationSet).sort();
    };

    const uniqueLocations = getUniqueLocations();

    // Handle search input and generate suggestions
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setSelectedLocation('');
        
        if (value.trim().length > 0) {
            const filteredSuggestions = uniqueLocations.filter(location => 
                location.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.slice(0, 8)); // Limit to 8 suggestions
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle location selection
    const handleLocationSelect = (location) => {
        setSearchQuery(location);
        setSelectedLocation(location);
        setShowSuggestions(false);
    };

    // Close suggestions when clicking outside
    const handleSearchBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const handleNearMe = () => {
        setLoadingNearMe(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation({ lat, lng });
                    
                    router.get('/map', { lat, lng, radius_km: radius }, {
                        preserveState: true,
                        onFinish: () => {
                            setLoadingNearMe(false);
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

    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius);
        
        // Clear existing timeout
        if (radiusTimeoutRef.current) {
            clearTimeout(radiusTimeoutRef.current);
        }
        
        // Set new timeout for debounced API call
        radiusTimeoutRef.current = setTimeout(() => {
            if (userLocation) {
                router.get('/map', { lat: userLocation.lat, lng: userLocation.lng, radius_km: newRadius }, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['properties'],
                    onStart: () => setIsUpdating(true),
                    onFinish: () => setIsUpdating(false),
                });
            }
        }, 200); // Shorter delay for responsive dragging
    };

    const handleShowAll = () => {
        setUserLocation(null);
        router.get('/map', {}, { preserveState: true });
    };

    const filteredProperties = properties.filter((property) => {
        // Filter by property type
        if (filterType !== 'all' && property.type !== filterType) {
            return false;
        }

        // Filter by selected location
        if (selectedLocation.trim()) {
            const locationMatch = property.location?.address?.toLowerCase().includes(selectedLocation.toLowerCase());
            if (!locationMatch) {
                return false;
            }
        }

        return true;
    });

    const mapCenter = mapState.center 
        ? [mapState.center.lat, mapState.center.lng]
        : userLocation 
            ? [userLocation.lat, userLocation.lng]
            : filteredProperties.length > 0 && filteredProperties[0].location
                ? [filteredProperties[0].location.location_lat, filteredProperties[0].location.location_lng]
                : [14.5995, 120.9842];

    const mapZoom = mapState.zoom !== null 
        ? mapState.zoom 
        : userLocation 
            ? 12 
            : 10;

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

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (radiusTimeoutRef.current) {
                clearTimeout(radiusTimeoutRef.current);
            }
        };
    }, []);

    // Persist sidebar collapsed state
    useEffect(() => {
        try {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
        } catch (error) {
            console.error("Error saving sidebar state to localStorage:", error);
        }
    }, [sidebarCollapsed]);

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
            <Head title="Property Map | Haribon" />
            <Header />
            <main className="flex-1">
                <div className="h-[calc(100vh-64px)]">
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapController 
            center={mapCenter} 
            zoom={mapZoom} 
            onMapChange={(newState) => {
                setMapState(newState);
                try {
                    localStorage.setItem('mapState', JSON.stringify(newState));
                } catch (error) {
                    console.error("Error saving map state to localStorage:", error);
                }
            }}
        />
                        
                        {/* Control Panel */}
                        <div className={`absolute top-4 left-4 z-[1000] rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-auto p-2' : 'w-72 p-4'}`}>
                            <div className="flex items-center justify-between">
                                {!sidebarCollapsed && (
                                    <div className="mb-4 flex-1">
                                        <Link
                                            href="/"
                                            className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
                                        >
                                            ← Back to Home
                                        </Link>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                    className={`rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors ${sidebarCollapsed ? '' : 'mb-4'}`}
                                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                >
                                    <svg
                                        className={`h-5 w-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>
                            
                            {!sidebarCollapsed && (
                                <>
                                    <h2 className="text-lg font-semibold text-slate-900">Property Map</h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                                    </p>
                                </>
                            )}
                            
                            {sidebarCollapsed && (
                                <div className="text-center">
                                    <p className="text-xs font-semibold text-slate-600">{filteredProperties.length}</p>
                                    <p className="text-[10px] text-slate-400">props</p>
                                </div>
                            )}
                            
                            {!sidebarCollapsed && (
                                <div className="mt-4 space-y-4">
                                {/* Search Bar with Autocomplete */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-2">Search Location</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            onBlur={handleSearchBlur}
                                            onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
                                            placeholder="Type location name (e.g., Opol, Bulao)..."
                                            className="w-full px-3 py-2 pr-9 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <svg className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        
                                        {/* Autocomplete Suggestions */}
                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                                {suggestions.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleLocationSelect(suggestion)}
                                                        className="w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none border-b border-slate-100 last:border-b-0"
                                                    >
                                                        <div className="flex items-center">
                                                            <svg className="mr-2 h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {suggestion}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {selectedLocation && (
                                        <p className="mt-1 text-xs text-emerald-600">
                                            Showing properties in: <span className="font-semibold">{selectedLocation}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Property Type Filter */}
                                <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
                                    {['all', 'sale', 'rent', 'lease'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type)}
                                            className={`flex-1 px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                                                filterType === type
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {type === 'all' ? 'All' : type}
                                        </button>
                                    ))}
                                </div>
                                
                                {userLocation && (
                                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-xs font-medium text-slate-700">Search Radius</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-emerald-600">{radius} km</span>
                                                {isUpdating && (
                                                    <div className="h-3 w-3 animate-spin rounded-full border border-emerald-600 border-t-transparent"></div>
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min="2"
                                            max="100"
                                            step="1"
                                            value={radius}
                                            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                        <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                                            <span>2 km</span>
                                            <span>100 km</span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleNearMe}
                                        disabled={loadingNearMe}
                                        className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {loadingNearMe ? 'Locating...' : 'Near Me'}
                                    </button>
                                    {userLocation && (
                                        <button
                                            onClick={handleShowAll}
                                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Show All
                                        </button>
                                    )}
                                </div>
                            </div>
                            )}
                            
                            {!sidebarCollapsed && (
                            <>
                            {/* Legend */}
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setLegendCollapsed(!legendCollapsed)}
                                    className="flex w-full items-center justify-between text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
                                >
                                    <span>Legend</span>
                                    <svg
                                        className={`h-4 w-4 transition-transform duration-200 ${legendCollapsed ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {!legendCollapsed && (
                                    <div className="mt-2 space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs text-slate-600">For Sale</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-xs text-slate-600">For Rent</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <span className="text-xs text-slate-600">For Lease</span>
                                        </div>
                                        {userLocation && (
                                            <div className="flex items-center gap-2">
                                                <img src="/storage/Hari/haribon-smile.png" alt="Your Location" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                                                <span className="text-xs text-slate-600">Your Location</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            </>
                            )}
                        </div>

                        {userLocation && (
                            <>
                                <Circle
                                    center={[userLocation.lat, userLocation.lng]}
                                    radius={radius * 1000}
                                    pathOptions={{
                                        color: '#3b82f6',
                                        fillColor: '#3b82f6',
                                        fillOpacity: 0.15,
                                        weight: 2,
                                    }}
                                />
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
                            </>
                        )}
                        
                        {filteredProperties.map((property) => {
                            const sellerRating = property.user?.reviews && property.user.reviews.length > 0
                                ? property.user.reviews.reduce((sum, r) => sum + r.rating, 0) / property.user.reviews.length
                                : 0;

                            return (
                                property.location && (
                                    <Marker
                                        key={property.id}
                                        position={[property.location.location_lat, property.location.location_lng]}
                                        icon={getPropertyIcon(property.type, isPremiumSeller(property), isLifetimeSeller(property), sellerRating)}
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
                            );
                        })}
                    </MapContainer>
                </div>
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
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Seller</p>
                                                {isPremiumSeller(selectedProperty) && (
                                                    <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Premium
                                                    </div>
                                                )}
                                                {isPremiumSeller(selectedProperty) && (
                                                    <div className="flex items-center gap-1 rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                        </svg>
                                                        Dev Supporter
                                                    </div>
                                                )}
                                                {isPremiumSeller(selectedProperty) && (
                                                    <div className="flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                        Saviour
                                                    </div>
                                                )}
                                                {isLifetimeSeller(selectedProperty) && (
                                                    <div className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
                                                        Loyal Seller
                                                    </div>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{selectedProperty.user.name}</p>
                                            {selectedProperty.user.reviews && selectedProperty.user.reviews.length > 0 && (
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <span className="text-amber-400 text-xs">
                                                        {'★'.repeat(Math.round(selectedProperty.user.reviews.reduce((sum, r) => sum + r.rating, 0) / selectedProperty.user.reviews.length))}
                                                        {'☆'.repeat(5 - Math.round(selectedProperty.user.reviews.reduce((sum, r) => sum + r.rating, 0) / selectedProperty.user.reviews.length))}
                                                    </span>
                                                    <span className="text-xs text-slate-900">({(selectedProperty.user.reviews.reduce((sum, r) => sum + r.rating, 0) / selectedProperty.user.reviews.length).toFixed(1)})</span>
                                                    <span className="text-[10px] text-slate-500">({selectedProperty.user.reviews.length} reviews)</span>
                                                </div>
                                            )}
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {selectedProperty.user.email}
                                            </div>
                                            {selectedProperty.user.facebook_profile_link && (
                                                <a
                                                    href={selectedProperty.user.facebook_profile_link}
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
        </div>
    );
}
