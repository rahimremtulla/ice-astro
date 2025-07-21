// src/components/events/map/CustomRoutePanel.tsx

/**
 * CustomRoutePanel
 * ------------------------------------------------
 * Displays step-by-step navigation with map fly-to
 * Uses route data from Leaflet Routing Machine
 */

import React from "react";
import * as L from "leaflet";
import type { RouteData, RouteStep } from "../../../hooks/useRouteData";
import { useMap } from "react-leaflet";

interface Props {
    routeData: RouteData | null;
}

export default function CustomRoutePanel({ routeData }: Props) {
    const map = useMap();

    if (!routeData) return null;

    const iconClassMap: Record<string, string> = {
        Arrive: "directions-icon-arrive",
        Depart: "directions-icon-depart",
        Continue: "directions-icon-continue",
        DestinationReached: "directions-icon-arrive",
        EndOfRoad: "directions-icon-waypoint",
        Fork: "directions-icon-continue",
        Head: "directions-icon-head",
        Left: "directions-icon-left",
        Merge: "directions-icon-continue",
        OffRamp: "directions-icon-slight-left",
        Right: "directions-icon-right",
        Roundabout: "directions-icon-roundabout",
        SharpLeft: "directions-icon-sharp-left",
        SharpRight: "directions-icon-sharp-right",
        SlightLeft: "directions-icon-slight-left",
        SlightRight: "directions-icon-slight-right",
        Straight: "directions-icon-continue",
        Turn: "directions-icon-turn",
        Uturn: "directions-icon-uturn"
    };

    const handleStepClick = (step: RouteStep) => {
        const { lat, lng, index } = step;

        if (
            typeof lat !== "number" ||
            typeof lng !== "number" ||
            typeof index !== "number" ||
            !Array.isArray(routeData?.geometry)
        ) {
            return;
        }

        map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });

        // Highlight route segment from step.index to step.index + 1
        const segmentCoords = routeData.geometry.slice(index, index + 2);
        const latlngs: [number, number][] = segmentCoords.map(coord => [coord.lat, coord.lng]);

        if (latlngs.length < 2) return;

        const highlightLine = L.polyline(latlngs, {
            color: "#00ffff",
            weight: 6,
            opacity: 0.9,
            dashArray: "8,6",
        }).addTo(map);

        setTimeout(() => {
            map.removeLayer(highlightLine);
        }, 4000);
    };

    return (
        <div
        className="directions-route-control absolute top-[75px] right-[20px] font-sans text-white w-80 rounded-lg shadow-lg z-[1000]"
        >
            {/* Header */}
            <div className="directions-route-summary rounded-t-lg">
                <h1>{routeData.duration}</h1>
                <span>{routeData.distance}</span>
            </div>

            {/* Directions List */}
            <div className="directions-instructions">
                <div className="directions-instructions-wrapper">
                    <ol className="directions-steps">
                        {routeData.steps.map((step, index) => {
                            const validCoords =
                            typeof step.lat === "number" && typeof step.lng === "number";

                            //console.log("step.type =", step.type);

                            return (
                                <li
                                key={index}
                                className={`directions-step transition ${
                                    validCoords ? "hover:text-white/40" : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={() => handleStepClick(step)}
                                title={validCoords ? "Fly to step" : "Location unavailable"}
                                >
                                    <span className={`directions-icon ${iconClassMap[step.type] || "directions-icon-default"}`} />
                                    <div className="directions-step-maneuver">{step.instruction}</div>
                                    <div className="directions-step-distance">
                                        {step.distance}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </div>
    );
}