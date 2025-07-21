// src/libs/geocode.ts

/**
 * Geocoding utilities using Mapbox API
 * ------------------------------------
 * Provides functions to:
 * - Geocode a city name to coordinates
 * - Suggest cities based on partial input
 * - Reverse geocode coordinates to a place name
 */

const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_API_KEY;

// Interface for location suggestion objects returned by Mapbox
export interface LocationSuggestion {
    name: string;
    context: string;
    placeName: string;
    lat: number;
    lng: number;
}

/**
 * geocodeCity
 * -----------
 * Converts a city name into geographic coordinates (lat/lng).
 *
 * @param city - full city name
 * @returns coordinates or null if not found
 */
export async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=place`
        );
        const data = await res.json();

        if (data.features?.length > 0) {
            const [lng, lat] = data.features[0].center;
            return { lat, lng };
        }

        return null;
    } catch (err) {
        console.error("Mapbox geocode error:", err);
        return null;
    }
}

/**
 * suggestCities
 * -------------
 * Returns a list of city suggestions based on partial input.
 * Each suggestion includes name, context, full place name, and coordinates.
 *
 * @param partial - partial city name typed by user
 * @returns array of LocationSuggestion objects
 */
export async function suggestCities(partial: string): Promise<LocationSuggestion[]> {
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(partial)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&types=place`
        );
        const data = await res.json();

        if (!data.features) return [];

        return data.features.map((feature: any) => {
            const name = feature.text;
            const context =
            feature.context?.map((c: any) => c.text).join(", ") || feature.place_name;
            const placeName = feature.place_name;
            const [lng, lat] = feature.center;

            return { name, context, placeName, lat, lng };
        });
    } catch (err) {
        console.error("Mapbox suggest error:", err);
        return [];
    }
}

/**
 * reverseGeocode
 * --------------
 * Converts geographic coordinates into a human-readable place name.
 *
 * @param lat - latitude
 * @param lng - longitude
 * @returns place name string or fallback label
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place&limit=1`;

    const response = await fetch(url);
    const data = await response.json();

    return data.features?.[0]?.place_name || "Current location";
}