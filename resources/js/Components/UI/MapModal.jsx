import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ onLocationSelect, onAddressFetch }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
            onAddressFetch(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function MapController({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView([position.lat, position.lng], 13);
        }
    }, [position, map]);
    return null;
}

export default function MapModal({ isOpen, onClose, onLocationSelect, initialPosition }) {
    const [position, setPosition] = useState(initialPosition || { lat: 14.5995, lng: 120.9842 }); // Default: Manila
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [searching, setSearching] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [address, setAddress] = useState('');
    const mapKey = useRef(0);

    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
            );
            const data = await response.json();
            console.log('Search results:', data);
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectResult = (result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setPosition({ lat, lng });
        setSearchResults([]);
        setSearchQuery(result.display_name);
        setAddress(result.display_name);
        mapKey.current += 1; // Force map re-render
    };

    const fetchAddress = async (lat, lng) => {
        setLoadingAddress(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data.display_name) {
                setAddress(data.display_name);
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
        } finally {
            setLoadingAddress(false);
        }
    };

    const handleGetCurrentLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPos = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    setPosition(newPos);
                    setLoadingLocation(false);
                    mapKey.current += 1; // Force map re-render
                    fetchAddress(newPos.lat, newPos.lng);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLoadingLocation(false);
                    alert('Unable to get your current location. Please enable location services.');
                }
            );
        } else {
            setLoadingLocation(false);
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleConfirm = () => {
        onLocationSelect({ ...position, address });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Select Location</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a location..."
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                    />
                    <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        disabled={loadingLocation}
                        className="rounded-xl border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                        {loadingLocation ? 'Locating...' : 'Use Current Location'}
                    </button>
                    <button
                        type="submit"
                        disabled={searching}
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Loading indicator */}
                {searching && (
                    <div className="mb-4 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-3">
                        <svg className="mr-2 h-4 w-4 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-slate-600">Searching for location...</span>
                    </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mb-4 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50">
                        {searchResults.map((result) => (
                            <button
                                key={result.place_id}
                                type="button"
                                onClick={() => handleSelectResult(result)}
                                className="w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100 last:border-0"
                            >
                                {result.display_name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Map */}
                <div className="mb-4 h-96 rounded-xl border border-slate-200">
                    <MapContainer 
                        key={mapKey.current}
                        center={[position.lat, position.lng]} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[position.lat, position.lng]} />
                        <MapClickHandler 
                            onLocationSelect={(latlng) => setPosition({ lat: latlng.lat, lng: latlng.lng })} 
                            onAddressFetch={fetchAddress}
                        />
                        <MapController position={position} />
                    </MapContainer>
                </div>

                {/* Selected Location Info */}
                <div className="mb-4 rounded-lg bg-slate-50 p-3">
                    {loadingAddress ? (
                        <div className="flex items-center">
                            <svg className="mr-2 h-4 w-4 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm text-slate-600">Fetching address...</span>
                        </div>
                    ) : address ? (
                        <div>
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold">Address:</span> {address}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600">
                            <span className="font-semibold">Selected:</span> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
}
