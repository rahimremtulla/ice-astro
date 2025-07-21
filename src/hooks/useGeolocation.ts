// src/hooks/useGeolocation.ts

/**
 * Custom React hook to retrieve user's current geographic co-ordinates and
 * resolve them to a human-readable location name using reverseGeocode().
 * Provides loading/error states and a trigger method.
 */

import { useState } from "react";
import { reverseGeocode } from "../libs/geocode";

export function useGeolocation() {
    const [locationName, setLocationName] = useState<string>("");
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const placeName = await reverseGeocode(latitude, longitude);
                    setLocationName(placeName);
                    setLatLng({ lat: latitude, lng: longitude });
                } catch {
                    setError("Failed to reverse geocode.");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("Permission denied or location unavailable.");
                setLoading(false);
            }
        );
    };

    return {
        locationName,
        latLng,
        loading,
        error,
        fetchCurrentLocation
    };
}