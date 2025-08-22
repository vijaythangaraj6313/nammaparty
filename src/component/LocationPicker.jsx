import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };
const libraries = ['places'];

const LocationPicker = ({ onConfirm }) => {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 11.0168, lng: 76.9558 }); // Default: Coimbatore
    const [markerPosition, setMarkerPosition] = useState(center);
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('');

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onLoad = useCallback(mapInstance => setMap(mapInstance), []);
    const onUnmount = useCallback(() => setMap(null), []);

    const geocodePosition = (pos) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results[0]) {
                setSelectedAddress(results[0].formatted_address);
            } else {
                console.error('Geocoder failed due to: ' + status);
                setSelectedAddress('Could not determine address.');
            }
        });
    };

    const handleMapClick = (e) => {
        const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkerPosition(pos);
        geocodePosition(pos);
    };

    // --- THIS FUNCTION HAS BEEN IMPROVED ---
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(pos);
                    setMarkerPosition(pos);
                    map?.panTo(pos); // Smoothly move the map to the new position
                    geocodePosition(pos);
                },
                // Error callback
                (error) => {
                    console.error("Error getting current location:", error);
                    if (error.code === error.PERMISSION_DENIED) {
                        alert("Location access was denied. Please enable it in your browser settings to use this feature.");
                    } else {
                        alert(`Could not get your location: ${error.message}`);
                    }
                }
            );
        } else {
            // This runs if the browser itself doesn't support geolocation
            alert("Geolocation is not supported by your browser.");
        }
    };
    
    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                setCenter(location);
                setMarkerPosition(location);
                map?.panTo(location);
                setSelectedAddress(place.formatted_address);
            }
        }
    };

    const handleConfirm = () => {
        onConfirm({
            lat: markerPosition.lat,
            lng: markerPosition.lng,
            addressString: selectedAddress,
        });
    };

    if (loadError) return <div>Error loading maps. Please check your API key.</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="location-picker">
            <h3 className="location-title">Location Information</h3>
            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                <input type="text" placeholder="Search a new address" className="address-search-input" />
            </Autocomplete>
            <div className="map-container">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}
                >
                    <Marker position={markerPosition} />
                </GoogleMap>
                <div className="map-overlay-text">Move the map to adjust your location</div>
            </div>
            <div className="location-actions">
                 <button className="search-location-btn" onClick={handleGetCurrentLocation}>Use Current Location</button>
            </div>
            {selectedAddress && (
                <div className="selected-address-card">
                    <h4>{selectedAddress.split(',')[0]}</h4>
                    <p>{selectedAddress}</p>
                    <button className="confirm-btn" onClick={handleConfirm}>Confirm & Continue</button>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;