// src/hooks/useRouteData.ts

/**
 * useRouteData
 * --------------------------------------
 * Custom React hook to listen for routes from Leaflet Routing Machine.
 * Converts the route into structured metadata: steps, distance, and duration.
 */

import { useEffect, useState } from "react";
import * as L from "leaflet";

// Extract control type to match Routing Machine instance
type RoutingControl = ReturnType<typeof L.Routing.control>;

export interface RouteStep {
    lat: number;
    lng: number;
    instruction: string;
    distance: string;
    type: string; // E.g. "depart", "turn", etc.
    index: number; // For segment identification
}

export interface RouteData {
    distance: string;
    duration: string;
    steps: RouteStep[];
    geometry: { lat: number; lng: number }[]; // Full route line
}

export default function useRouteData(routingControl: RoutingControl | null) {
    const [routeData, setRouteData] = useState<RouteData | null>(null);

    useEffect(() => {

        if (!routingControl?.on) return; // Safeguard against undefined method

        const handleRoutesFound = (e: any) => {
            const route = e.routes?.[0];

            if (!route?.summary || !Array.isArray(route.instructions)) return;

            const { totalDistance, totalTime } = route.summary;

            const distance = `${(totalDistance / 1609.34).toFixed(2)} mi`; // Convert meters to miles
            const duration = `${Math.round(totalTime / 60)} min`; // Convert seconds to minutes

            // Format route steps into our desired structure
            const geometry = route.coordinates;

            const steps = route.instructions.map((step: any) => {
                let lat = step.lat;
                let lng = step.lng;

                const coord = geometry?.[step.index];

                if (typeof lat !== "number" || typeof lng !== "number") {
                    if (coord) {
                        lat =
                        typeof coord.lat === "number"
                        ? coord.lat
                        : typeof coord.latitude === "number"
                        ? coord.latitude
                        : null;
                        lng =
                        typeof coord.lng === "number"
                        ? coord.lng
                        : typeof coord.longitude === "number"
                        ? coord.longitude
                        : null;
                    }

                    // Special fallback for index 0
                    if (
                        (lat === null || lng === null) &&
                        step.index === 0 &&
                        Array.isArray(route.waypoints)
                    ) {
                        const origin = route.waypoints[0]?.latLng;
                        lat = origin?.lat ?? null;
                        lng = origin?.lng ?? null;
                    }
                }

                return {
                    lat,
                    lng,
                    instruction: step.text,
                    distance: step.distance ? `${(step.distance / 1609.34).toFixed(2)} mi` : "",
                    type: step.type || "turn",
                    index: step.index
                };
            });

            setRouteData({ distance, duration, steps, geometry: route.coordinates });
        };

        routingControl.on("routesfound", handleRoutesFound);

        return () => {
            routingControl.off("routesfound", handleRoutesFound);
        };
    }, [routingControl]);

    return routeData;
}