// src/components/events/map/MapModal.tsx

/** 
 * MapModal
 * --------
 * Modal showing clustered event markers and routing UI.
 * Connects user location to selected event and displays custom instructions.
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";

import SmartMarkerClusterGroup from "./SmartMarkerClusterGroup";
import CustomRoutePanel from "./CustomRoutePanel";
import type { RouteData, RouteStep } from "../../../hooks/useRouteData";
import type { Event } from "../../../types/event";
import { USER_COORDS } from "../../../utils/mapUtils";
import { LoadingPanel } from "./LoadingPanel";
import { SkeletonPanel } from "./SkeletonPanel";
import { EventDetailOverlay } from "./EventDetailOverlay";
import { isUKEvent } from "../../../utils/mapUtils";

// Patch Leaflet marker icons to avoid broken visuals
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

interface MapModalProps {
    events: Event[];
    onClose: () => void;
}

export default function MapModal({ events, onClose }: MapModalProps) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const routingControlRef = useRef<L.Routing.Control | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [routeData, setRouteData] = useState<RouteData | null>(null);
    const center: LatLngExpression = [USER_COORDS.lat, USER_COORDS.lng];
    const [isPanelLoading, setIsPanelLoading] = useState(false);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
    const [isEventCardClosed, setIsEventCardClosed] = useState(false);

    // Lock scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        const previouslyFocused = document.activeElement as HTMLElement;
        modalRef.current?.focus();

        return () => {
            document.body.style.overflow = "";
            previouslyFocused?.focus();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md pointer-events-none" />
            <AnimatePresence>
                <motion.div
                ref={modalRef}
                tabIndex={-1}
                className="relative w-full h-full lg:w-4/5 lg:h-[90%] bg-white rounded-lg shadow-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                >
                    <button
                    onClick={onClose}
                    aria-label="Close map modal"
                    className="absolute top-4 right-4 z-[1000] bg-gray-800 text-white px-4 py-2 rounded-full shadow-md text-sm font-semibold hover:bg-gray-700 transition flex items-center gap-x-2 cursor-pointer"
                    >
                    Close map <X className="w-4 h-4" />
                    </button>

                    <div className="w-full h-full relative">
                        <MapContainer center={center} zoom={8} scrollWheelZoom className="w-full h-full z-0">

                            <TileLayer
                            attribution="&copy; OpenStreetMap"
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />

                            <SmartMarkerClusterGroup
                            events={events}
                            selectedEventId={selectedEvent?.objectID}
                            onSelectEvent={setSelectedEvent}
                            setIsPanelLoading={setIsPanelLoading}
                            routeData={routeData}
                            isEventCardClosed={isEventCardClosed}
                            setIsEventCardClosed={setIsEventCardClosed}
                            />

                            <RouteControlHandler
                            selectedEvent={selectedEvent}
                            routingControlRef={routingControlRef}
                            onRouteReady={setRouteData}
                            setHasLoadedOnce={setHasLoadedOnce}
                            setIsPanelLoading={setIsPanelLoading}
                            setIsEventCardClosed={setIsEventCardClosed}
                            />

                            <EventDetailOverlay
                            event={selectedEvent}
                            isPanelLoading={isPanelLoading}
                            hasLoadedOnce={hasLoadedOnce}
                            isEventCardClosed={isEventCardClosed}
                            onClose={() => setIsEventCardClosed(true)}
                            />

                            {isPanelLoading && !hasLoadedOnce && <LoadingPanel />}  
                            {isPanelLoading && hasLoadedOnce && <SkeletonPanel />}  
                            {!isPanelLoading && routeData && selectedEvent && isUKEvent(selectedEvent) && (
                            <CustomRoutePanel routeData={routeData} />
                            )}
                        </MapContainer>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/**
* RouteControlHandler
* ----------------------------------------------------------
* Creates a routing instance when an event is selected
* and extracts route instructions for external display.
*/
function RouteControlHandler({
    selectedEvent,
    routingControlRef,
    onRouteReady,
    setHasLoadedOnce,
    setIsPanelLoading,
    setIsEventCardClosed
}: {
    selectedEvent: Event | null;
    routingControlRef: React.MutableRefObject<L.Routing.Control | null>;
    onRouteReady: (data: RouteData | null) => void;
    setHasLoadedOnce: (loading: boolean) => void;
    setIsPanelLoading: (loading: boolean) => void;
    setIsEventCardClosed: (loading: boolean) => void;
}) {
    const map = useMap();

    useEffect(() => {
        if (!selectedEvent || typeof selectedEvent._geoloc?.lat !== "number") return;

        // Load Mapbox credentials from environment
        const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_API_KEY;

        // If event is international, remove any old route and exit early
        // Check early for international event
        const isUK = isUKEvent(selectedEvent);

        if (!isUK) {
            // Remove old routing if present
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }

            // Clear route data too, if needed
            setHasLoadedOnce(false);
            setIsPanelLoading(false);
            onRouteReady(null); // Empty route for non-UK events

            return; // Do not proceed with routing
        }


        // Clean up old route if present
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
        }

        setIsEventCardClosed(false);

        // Create new route for UK event
        const control = L.Routing.control({
            waypoints: [
                L.latLng(USER_COORDS.lat, USER_COORDS.lng),
                L.latLng(selectedEvent._geoloc.lat, selectedEvent._geoloc.lng)
            ],
            //router: L.Routing.osrmv1({ serviceUrl: "https://router.project-osrm.org/route/v1" }),
            router: L.Routing.mapbox(MAPBOX_TOKEN, {
                profile: "mapbox/driving", // or "mapbox/walking", "mapbox/cycling"
                language: "en"
            }),
            show: false,
            containerClassName: "lrm-hidden-panel",
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            routeWhileDragging: false,
            createMarker: () => null
        }).addTo(map);

        routingControlRef.current = control;

        const handleRouteFound = (e: any) => {
            const route = e.routes?.[0];
            if (!route) return;

            const { totalDistance, totalTime } = route.summary;
            const distance = `${(totalDistance / 1609.34).toFixed(2)} mi`;
            const duration = `${Math.round(totalTime / 60)} min`;
            const geometry = route.coordinates;

            setHasLoadedOnce(true);
            setIsPanelLoading(false);

            const steps = route.instructions.map((step: any) => {
                let lat = step.lat;
                let lng = step.lng;
                const coord = geometry?.[step.index];

                if (typeof lat !== "number" || typeof lng !== "number") {
                    if (coord) {
                        lat = typeof coord.lat === "number" ? coord.lat
                        : typeof coord.latitude === "number" ? coord.latitude
                        : Array.isArray(coord) && typeof coord[1] === "number" ? coord[1]
                        : null;
                        lng = typeof coord.lng === "number" ? coord.lng
                        : typeof coord.longitude === "number" ? coord.longitude
                        : Array.isArray(coord) && typeof coord[0] === "number" ? coord[0]
                        : null;
                    }

                    if ((lat == null || lng == null) && step.index === 0) {
                        const origin = route.waypoints?.[0]?.latLng;
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

            onRouteReady({ distance, duration, steps, geometry });
        };

        control.on("routesfound", handleRouteFound);

        return () => {
            control.off("routesfound", handleRouteFound);
        };
    }, [selectedEvent, map]);

    return null;
}