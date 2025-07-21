// src/components/events/map/SmartMarkerClusterGroup.tsx

/**
 * SmartMarkerClusterGroup
 * -------------------------------------
 * Displays clustered event markers and a user origin marker.
 * Handles click-to-select logic for events and draws routes on selection.
 */

import React, { useEffect, useState } from "react";
import { useMap, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import type { LatLngExpression } from "leaflet";
import type { MarkerCluster } from "leaflet";
import L from "leaflet";

import type { Event } from "../../../types/event";
import { USER_COORDS } from "../../../utils/mapUtils";
import type { RouteData } from "../../../hooks/useRouteData";
import { isUKEvent } from "../../../utils/mapUtils";

import "leaflet.markercluster";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "../../../styles/leaflet-custom.css";

interface Props {
    events: Event[];
    selectedEventId?: string;
    onSelectEvent?: (event: Event | null) => void;
    setIsPanelLoading?: (loading: boolean) => void;
    routeData: RouteData | null;
    isEventCardClosed?: boolean;
    setIsEventCardClosed: (loading: boolean) => void;
}

export default function SmartMarkerClusterGroup({
    events,
    selectedEventId,
    onSelectEvent,
    setIsPanelLoading,
    routeData,
    isEventCardClosed,
    setIsEventCardClosed
}: Props) {
    const map = useMap();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Draw route when an event is selected
    useEffect(() => {
        if (
            !selectedEvent ||
            typeof selectedEvent._geoloc?.lat !== "number" ||
            typeof selectedEvent._geoloc?.lng !== "number"
        )
        return;

        if (!isUKEvent(selectedEvent)) return; // Skip route creation for international events

        // Load Mapbox credentials from environment
        const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_API_KEY;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(USER_COORDS.lat, USER_COORDS.lng),
                L.latLng(selectedEvent._geoloc.lat, selectedEvent._geoloc.lng)
            ],
            router: L.Routing.mapbox(MAPBOX_TOKEN, {
            profile: "mapbox/driving", // or "mapbox/walking", "mapbox/cycling"
            language: "en"
            }),
            units: "imperial",
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            routeWhileDragging: false,
            createMarker: () => null
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [selectedEvent, map]);


    // Handle user clicking a marker
    const handleMarkerClick = (event: Event) => {
        const isSameEvent = selectedEvent?.objectID === event.objectID;
        const isUK = isUKEvent(event);

        if (isSameEvent && routeData && !isEventCardClosed) {
            return;
        }

        // Case 1: Same marker re-clicked, route exists, but card was closed → reopen card
        if (isSameEvent && routeData && isEventCardClosed) {
            setIsEventCardClosed(false);
            return;
        }

        // Case 2: Same marker re-clicked, route exists, card already open → no action
            if (isSameEvent && routeData) {
            return;
        }

        // Case 3: New marker selected → reset everything
        const next = isSameEvent ? null : event;
        setSelectedEvent(next);
        setIsPanelLoading?.(true);
        setIsEventCardClosed?.(false);
        onSelectEvent?.(next);

        if (isUK) {
            setIsPanelLoading?.(true); // 🇬🇧 Show route + panel
            onSelectEvent?.(next);
        } else {
            setIsPanelLoading?.(false); // No route, just the card
            onSelectEvent?.(next); // Skip this if it triggers routing logic upstream
        }
    };

    return (
        <MarkerClusterGroup
            iconCreateFunction={(cluster: MarkerCluster) => {
                const count = cluster.getChildCount();
                return L.divIcon({
                    html: `
                    <div class="custom-cluster-pin">
                    <div class="custom-cluster-badge">${count}</div>
                    </div>
                    `,
                    className: "custom-cluster-wrapper",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                });
            }}
        >
            {/* User location marker */}
            <Marker position={[USER_COORDS.lat, USER_COORDS.lng]} icon={userIcon} />

            {/* Event markers */}
            {events.map((event) => {
            const lat = event._geoloc?.lat;
            const lng = event._geoloc?.lng;

            if (typeof lat !== "number" || typeof lng !== "number") return null;

            const coords: LatLngExpression = [lat, lng];
            const isSelected = selectedEventId === event.objectID;

            return (
                <Marker
                    key={event.objectID}
                    position={coords}
                    icon={isSelected ? selectedIcon : defaultIcon}
                    eventHandlers={{ click: () => handleMarkerClick(event) }}
                />
            );
        })}
        </MarkerClusterGroup>
    );
}

// Marker icons
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const selectedIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const userIcon = L.divIcon({
    html: `
        <img
        class="custom-user-pin"
        src="/images/icon-map-marker.svg"
        width="25"
        height="41"
        alt="User location"
        tabindex="0"
        role="button"
        />
    `,
    className: "",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});