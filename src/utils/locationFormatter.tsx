// src/utils/locationFormatter.tsx

/**
 * formatEventLocation
 * -------------------
 * Returns a formatted location display element for an event,
 * based on its `eventFormat` and optional `location` string.
 * Uses Lucide icons to visually distinguish:
 * - Online: "Online"
 * - In-person: location
 * - Hybrid: location & Online
 *
 * If no format matches, falls back to raw location if available.
 */

import React from "react";
import { MapPin } from "lucide-react";
import type { Event } from "../types/event";

export function formatEventLocation(event: Event): React.ReactNode {
    const type = event.eventFormat?.toLowerCase();  // Normalise format string
    const loc = event.location?.trim();             // Clean up location input

    // Online-only: Show icon + label
    if (type === "online") {
        return (
            <span className="inline-flex items-center gap-1 font-bold text-sm text-gray-600">
                <MapPin size={16} className="text-gray-500" />
                <span>Online</span>
            </span>
        );
    }

    // In-person only: Show location if present
    if (type === "in-person") {
        return loc ? (
            <span className="inline-flex items-center gap-1 font-bold text-sm text-gray-600">
                <MapPin size={16} className="text-gray-500" />
                <span>{loc}</span>
            </span>
        ) : null;
    }

    // Hybrid: Show location + Online, or fallback to Online only
    if (type === "hybrid") {
        return loc ? (
            <span className="inline-flex items-center gap-1 font-bold text-sm text-gray-600">
                <MapPin size={16} className="text-gray-500" />
                <span>{loc} &amp; Online</span>
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 font-bold text-sm text-gray-600">
                <MapPin size={16} className="text-gray-500" />
                <span>Online</span>
            </span>
        );
    }

    // Fallback: Unknown format
    return loc ? <span className="text-sm text-gray-600">{loc}</span> : null;
}